import { motion } from "motion/react";
import { Image as ImageIcon, FileText, Download, ShieldCheck } from "lucide-react";

export default function Tutorials() {
  const steps = [
    { title: "Select Asset", desc: "Choose image or PDF" },
    { title: "Drop Files", desc: "Drag into the dropzone" },
    { title: "Download", desc: "Get optimized version" },
  ];

  return (
    <div className="p-6 md:p-8 bg-surface border border-border-theme rounded-[var(--radius-theme)] shadow-sm">
      <div className="text-[10px] uppercase font-bold tracking-widest text-text-sub mb-6">How it works</div>
      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-6 h-6 rounded-full bg-bg-theme flex items-center justify-center text-[10px] font-bold text-text-main">
              {idx + 1}
            </span>
            <div>
              <div className="text-sm font-bold text-primary-theme leading-none mb-1">{step.title}</div>
              <div className="text-xs text-text-sub">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
