/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ImageResizer from "./components/ImageResizer";
import PdfResizer from "./components/PdfResizer";
import Tutorials from "./components/Tutorials";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-theme">
      <Navbar />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <aside className="hero-panel flex flex-col justify-between gap-8 h-full">
          <Hero />
          <Tutorials />
        </aside>
        
        <div className="tool-panel flex flex-col gap-6">
          <ImageResizer />
          <PdfResizer />
        </div>
      </main>
      <Footer />
    </div>
  );
}

