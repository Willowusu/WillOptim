import { motion } from "motion/react";
import { ArrowDown, Maximize2, FileText } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col h-full bg-bg-theme p-6 md:p-10 justify-between">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-primary-theme leading-[0.9] mb-4">
          Fast.<br />Small.<br />
          <span className="text-accent-theme">Perfect.</span>
        </h1>
        <p className="text-lg text-text-sub leading-relaxed mb-8">
          Professional-grade asset optimization in seconds. Resize PDFs and Images without losing clarity.
        </p>
      </div>

      <div className="hidden lg:flex flex-col gap-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-sub">Engine Active</label>
        <div className="flex items-center gap-3 p-4 geometric-card bg-surface/50 border-dashed">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-text-main">V8 WebAssembly Powered</span>
        </div>
      </div>
    </div>
  );
}
