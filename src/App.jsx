import React from "react";
import ImageClassifier from "./components/ImageClassifier";
import Footer from "./components/Footer";

/**
 * Use the uploaded hero image path (developer-provided).
 * The environment will transform this path into a served URL.
 */
export default function App() {
  const heroImageUrl = "UI-overian.png";

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md border">
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-700"><rect x="3" y="6" width="18" height="2" /><rect x="3" y="11" width="18" height="2" /><rect x="3" y="16" width="18" height="2" /></svg>
            </div>
            <h1 className="text-xl font-semibold">OvarianAID</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted">Fast, accurate screening</div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
            </div>
          </div>
        </header>

        <section className="hero mb-6 card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Enhance Diagnostic Workflow with <span className="text-primary">AI-Driven Classification</span></h2>
            <p className="muted">Upload histology images and get model predictions instantly — all in your browser. This is a decision-support tool and does not replace clinical judgement.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img src={heroImageUrl} alt="UI preview" className="w-48 h-36 rounded-md object-cover shadow-sm" />
          </div>
        </section>

        <main className="card p-6">
          <ImageClassifier
            cloudModelUrl="https://teachablemachine.withgoogle.com/models/K0H9JrtTe/model.json"
            metadataUrl="https://teachablemachine.withgoogle.com/models/K0H9JrtTe/metadata.json"
          />
        </main>

        {/* <footer className="mt-6 text-center text-sm text-muted">
          © 2025 OvarianAID — For research & diagnostic-assist only.
        </footer> */}
        <Footer></Footer>
      </div>
    </div>
  );
}
