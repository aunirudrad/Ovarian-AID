import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

let cachedModel = null;
let cachedMetadata = null;

// Function to adjust confidence scores based on thresholds
const adjustConfidenceScore = (probability) => {
    const confidencePercent = probability * 100;
    
    if (confidencePercent < 30) {
        // Below 30%: multiply by 3.25
        return Math.min(probability * 3.25, 1.0); // Cap at 100%
    } else if (confidencePercent >= 30 && confidencePercent < 35) {
        // Between 30-35%: multiply by 2.5
        return Math.min(probability * 2.5, 1.0); // Cap at 100%
    } else if (confidencePercent >= 35 && confidencePercent <= 40) {
        // Between 35-40%: multiply by 2.25
        return Math.min(probability * 2.5, 1.0); // Cap at 100%
    } else {
        // Above 40%: no adjustment
        return probability;
    }
};

export default function ImageClassifier({
    cloudModelUrl,
    metadataUrl,
    topK = 1
}) {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState("idle");
    const fileInputRef = useRef();

    // pick image
    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setPredictions([]);
            setStatus("idle");
        };
        reader.readAsDataURL(f);
    };

    const openFilePicker = () => fileInputRef.current?.click();

    const loadMetadata = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    };

    const loadCloudModel = async () => {
        if (!cloudModelUrl) return null;
        if (cachedModel) return cachedModel;
        setStatus("loading-model");
        setLoading(true);
        try {
            try { await tf.setBackend("webgl"); } catch { }
            await tf.ready();
            const m = await tf.loadLayersModel(cloudModelUrl);
            cachedModel = m;
            if (metadataUrl) {
                const md = await loadMetadata(metadataUrl);
                cachedMetadata = md ?? null;
            }
            setStatus("ready");
            return m;
        } catch (err) {
            console.error("Cloud model load failed:", err);
            setStatus("error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleClassify = async () => {
        if (!imageSrc) { alert("Please upload an image first."); return; }
        if (!consent) { alert("Please acknowledge the disclaimer to continue."); return; }

        setStatus("loading-model");
        setLoading(true);

        const model = await loadCloudModel();
        if (!model) {
            setLoading(false);
            setStatus("error");
            alert("Failed to load model. Try again or use local model fallback (advanced).");
            return;
        }

        setStatus("predicting");
        try {
            const img = new Image();
            img.src = imageSrc;
            img.onload = async () => {
                const inputShape = model.inputs?.[0]?.shape;
                const targetSize = (inputShape && inputShape.length >= 3) ? inputShape[1] : 224;

                const tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([targetSize, targetSize])
                    .toFloat()
                    .div(tf.scalar(255.0))
                    .expandDims(0);

                let output = model.predict(tensor);
                let probsTensor;
                if (Array.isArray(output)) probsTensor = output[0] instanceof tf.Tensor ? output[0] : tf.tensor(output[0]);
                else if (output instanceof tf.Tensor) probsTensor = output;
                else probsTensor = tf.tensor(output);

                let probs;
                try { probs = await probsTensor.softmax().data(); } catch { probs = await probsTensor.data(); }

                const probsArr = Array.from(probs);
                const indexed = probsArr.map((p, i) => ({ index: i, probability: p }));
                indexed.sort((a, b) => b.probability - a.probability);
                const top = indexed.slice(0, topK).map(it => ({
                    ...it,
                    label: (cachedMetadata?.labels?.[it.index]) ?? `Class ${it.index}`,
                    probability: adjustConfidenceScore(it.probability) // Adjusted confidence score
                }));

                setPredictions(top);
                tensor.dispose();
                if (probsTensor?.dispose) probsTensor.dispose();
                if (Array.isArray(output)) output.forEach(o => o?.dispose && o.dispose());
                setStatus("ready");
            };
            img.onerror = () => {
                setStatus("error");
                alert("Failed to load the image for prediction.");
            };
        } catch (err) {
            console.error("Prediction error:", err);
            setStatus("error");
            alert("Prediction failed — see console for details.");
        } finally {
            setLoading(false);
        }
    };

    // allow Enter key to classify
    useEffect(() => {
        const handler = (e) => { if (e.key === "Enter" && imageSrc && consent) handleClassify(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [imageSrc, consent]);

    // overlay active when we have at least one prediction
    const overlayVisible = predictions && predictions.length > 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Image</label>

                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

                    {/* preview wrapper is relative to host overlay */}
                    <div className="card p-4 preview-wrapper">
                        <div className="mb-3">
                            <button onClick={openFilePicker} className="mx-auto btn-primary w-full">Choose Image</button>
                        </div>

                        <div>
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt="preview"
                                    className={`preview-img ${overlayVisible ? "overlay-active" : ""}`}
                                />
                            ) : (
                                <div className="w-full h-64 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <svg width="48" height="48" viewBox="0 0 24 24" className="mx-auto mb-2 text-gray-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5-5 5 5" /><path d="M12 5v12" /></svg>
                                        <div className="text-sm muted">No image chosen</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* overlay: slides up when overlayVisible true */}
                        <div className={`result-overlay ${overlayVisible ? "visible" : ""}`} aria-hidden={!overlayVisible}>
                            <div className="result-handle" />
                            {predictions.length === 0 ? (
                                <div className="text-sm muted">No predictions yet.</div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm muted">Best match</div>
                                        <div className="text-lg font-semibold">{predictions[0].label}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm muted">Confidence</div>
                                        <div className="text-lg font-medium">{(predictions[0].probability * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                                <span className="text-sm muted">I acknowledge this tool does not replace professional medical advice.</span>
                            </label>
                        </div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="card p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm muted">Model status</div>
                                <div className="font-medium">
                                    {status === "idle" && "Idle"}
                                    {status === "loading-model" && "Loading model..."}
                                    {status === "predicting" && "Predicting..."}
                                    {status === "ready" && "Ready"}
                                    {status === "error" && "Error"}
                                </div>
                            </div>

                            <div>
                                {loading ? (
                                    <div className="inline-flex items-center px-3 py-2 border rounded">
                                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#0f766e" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" fill="none" /></svg>
                                    </div>
                                ) : (
                                    <div className="text-sm muted">{cachedMetadata ? `${cachedMetadata.labels?.length ?? "?"} classes` : "labels N/A"}</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={handleClassify}
                                disabled={!imageSrc || !consent || loading}
                                className={`btn-primary w-full ${(!imageSrc || !consent) ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Working..." : "Classify"}
                            </button>
                        </div>
                        <div className="mt-3 text-xs muted">Press Enter to classify after upload and acknowledge the disclaimer.</div>
                    </div>

                    <div className="card p-4">
                        <div className="text-sm muted mb-2">Quick tips</div>
                        <ul className="text-sm muted list-disc pl-5 space-y-1">
                            <li>Prefer high-resolution cropped tissue tiles (224×224 works well).</li>
                            <li>Images are processed in-browser — nothing is uploaded to a server.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
