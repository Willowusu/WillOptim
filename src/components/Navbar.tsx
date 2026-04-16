import { motion } from "motion/react";
import { Maximize2, FileText, BookOpen, Layers } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { name: "Image Resizer", href: "#image-resizer", icon: Maximize2 },
    { name: "PDF Resizer", href: "#pdf-resizer", icon: FileText },
    { name: "Tutorials", href: "#tutorials", icon: BookOpen },
  ];

  return (
    <header className="h-[70px] bg-surface border-b border-border-theme flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Layers className="w-6 h-6 text-accent-theme" />
        <span className="text-xl font-extrabold tracking-tighter text-primary-theme">
          Wlll<span className="text-accent-theme">Optim</span>
        </span>
      </div>
      
      <nav className="flex items-center">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="ml-6 text-sm font-medium text-text-sub hover:text-primary-theme transition-colors"
          >
            {item.name}
          </a>
        ))}
        <a href="#" className="ml-6 text-sm font-medium text-text-sub hover:text-primary-theme transition-colors">API</a>
      </nav>
    </header>
  );
}
