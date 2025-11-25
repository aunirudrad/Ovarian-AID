import React from "react";

/**
 * Footer component
 * - Responsive three-column layout
 * - Uses uploaded image path as a small logo: "/mnt/data/UI-overian.jpg"
 * - Accessible links and semantic markup
 */

export default function Footer() {
    const logoUrl = "/mnt/data/UI-overian.jpg"; // developer-provided local path (will be transformed by toolchain)

    return (
        <footer className="mt-12 bg-amber-100 rounded-lg text-gray-900">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                    {/* Logo & description */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3">
                            <div>
                                <h4 className="text-lg font-semibold">OvarianAID</h4>
                                <p className="text-sm text-gray-700 mt-1">
                                    Research-grade diagnostic assist — in-browser AI for histology image classification.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h5 className="text-sm font-semibold mb-3">Quick Links</h5>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li><a className="hover:underline" href="#">Home</a></li>
                            <li><a className="hover:underline" href="#">How It Works</a></li>
                            <li><a className="hover:underline" href="#">Privacy Policy</a></li>
                            <li><a className="hover:underline" href="#">Terms of Service</a></li>
                            <li><a className="hover:underline" href="#">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h5 className="text-sm font-semibold mb-3">Resources</h5>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li><a className="hover:underline" href="#">About Ovarian Cancer</a></li>
                            <li><a className="hover:underline" href="#">Research & Methodology</a></li>
                            <li><a className="hover:underline" href="#">Dataset & Papers</a></li>
                            <li><a className="hover:underline" href="#">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h5 className="text-sm font-semibold mb-3">Connect With Us</h5>
                        <p className="text-sm text-gray-700 mb-3">Follow for updates and research news.</p>

                        <div className="flex items-center gap-3 mb-4">
                            <a aria-label="Facebook" href="#" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.98 3.66 9.12 8.44 9.95v-7.05H8.08v-2.9h2.36V9.41c0-2.34 1.4-3.63 3.54-3.63. 1.03 0 2.1.18 2.1.18v2.31h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.59l-.41 2.9h-2.18v7.05C18.34 21.19 22 17.05 22 12.07z" />
                                </svg>
                            </a>

                            <a aria-label="Twitter" href="#" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.26-1.12 1.52-1.94-.68.4-1.43.69-2.23.85A3.49 3.49 0 0 0 11 8.7c0 .27.03.54.09.8C7.72 9.35 5 7.4 3.14 4.6c-.3.53-.47 1.15-.47 1.8 0 1.25.64 2.36 1.63 3.01-.6-.02-1.16-.18-1.66-.45v.05c0 1.72 1.22 3.15 2.84 3.48-.3.08-.62.12-.95.12-.23 0-.46-.02-.68-.06.46 1.44 1.8 2.48 3.39 2.51A6.99 6.99 0 0 1 2 19.54 9.85 9.85 0 0 0 7.29 21c6.75 0 10.45-5.6 10.45-10.45v-.48c.72-.52 1.34-1.16 1.83-1.9-.66.3-1.36.51-2.09.6z" />
                                </svg>
                            </a>

                            <a aria-label="LinkedIn" href="#" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4zM8.5 8.5h3.82v2.06h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.66 4.77 6.12V24H19v-8.67c0-2.06-.04-4.71-2.87-4.71-2.87 0-3.31 2.24-3.31 4.56V24H8.5z" />
                                </svg>
                            </a>
                        </div>

                        <address className="not-italic text-sm text-gray-700">
                            <div>OvarianAID Research Lab</div>
                            <div>research@example.org</div>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-700">
                    © 2025 OvarianAID. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
