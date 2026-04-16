import { Layers, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border-theme bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent-theme" />
          <span className="font-bold text-lg tracking-tight text-primary-theme">WlllOptim</span>
        </div>
        
        <p className="text-xs text-text-sub font-medium">
          © {new Date().getFullYear()} WlllOptim. Secure Client-Side Engine.
        </p>

        <div className="flex gap-4">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Privacy First</span>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No Logs</span>
        </div>
      </div>
    </footer>
  );
}
