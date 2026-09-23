import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Bot, 
  FileText, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  ArrowRight,
  Layers,
  Wrench,
  Award,
  Briefcase
} from 'lucide-react';
import { DATA } from '../data';
import { sound } from './SoundEffects';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI: () => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onOpenAI,
  onOpenResume,
  onOpenContact,
  onSelectProject
}) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playOpenModal();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DATA.email);
    sound.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navActions = [
    { icon: <Bot size={16} className="text-amber-400" />, title: "Open AI Resume Copilot", shortcut: "AI", action: () => { onClose(); onOpenAI(); } },
    { icon: <FileText size={16} className="text-emerald-400" />, title: "View ATS Resume / Print PDF", shortcut: "PDF", action: () => { onClose(); onOpenResume(); } },
    { icon: <Mail size={16} className="text-cyan-400" />, title: "Contact Majid (Direct / Form)", shortcut: "MSG", action: () => { onClose(); onOpenContact(); } },
    { icon: <Copy size={16} className="text-neutral-400" />, title: copied ? "Copied majidullask04@gmail.com!" : "Copy Email to Clipboard", shortcut: "COPY", action: handleCopyEmail },
    { icon: <Github size={16} className="text-white" />, title: "Visit GitHub (@Majidullask04)", shortcut: "GIT", action: () => window.open(DATA.links.github, "_blank") },
    { icon: <Linkedin size={16} className="text-blue-400" />, title: "Connect on LinkedIn", shortcut: "IN", action: () => window.open(DATA.links.linkedin, "_blank") },
  ];

  const sectionLinks = [
    { name: "About Me", href: "#about", desc: "Background, trajectory & core philosophy" },
    { name: "Core Capabilities", href: "#services", desc: "Full-Stack, DevSecOps, K8s, AWS, SRE" },
    { name: "Experience Timeline", href: "#experience", desc: "B.Tech, CNCF Open Source, DevSecOps projects" },
    { name: "Featured Projects", href: "#work", desc: "11+ microservice pipelines, career-ops, Istio" },
    { name: "Tech Stack & Skills", href: "#skills", desc: "Categorized technologies & tools" },
    { name: "Contact & Status", href: "#contact", desc: "Availability & get in touch" },
  ];

  const filteredProjects = DATA.projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.tools.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const allSkills = Array.from(new Set(DATA.categorizedTechStack.flatMap(c => c.skills)));
  const filteredSkills = allSkills.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-2xl bg-neutral-900/95 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 z-10 glass-panel"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-neutral-800 bg-neutral-950/70">
              <Search size={18} className="text-amber-500 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, project, or skill (e.g., 'k8s', 'copilot', 'jenkins')..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-neutral-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 ml-2 bg-neutral-800 text-[10px] font-mono text-neutral-400 rounded border border-neutral-700">
                ESC
              </kbd>
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs font-sans">
              
              {/* Quick Actions */}
              <div>
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  Quick Triggers
                </div>
                <div className="space-y-1">
                  {navActions
                    .filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || query === '')
                    .map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          sound.playClick();
                          act.action();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950/40 hover:bg-neutral-800/80 border border-neutral-800/50 hover:border-amber-500/30 text-neutral-300 hover:text-white transition-all group cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-amber-500/40">
                            {act.icon}
                          </div>
                          <span className="text-xs font-medium">{act.title}</span>
                        </div>
                        <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 group-hover:text-amber-400">
                          {act.shortcut}
                        </kbd>
                      </button>
                    ))}
                </div>
              </div>

              {/* Sections Navigation */}
              {query === '' && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                    Page Navigation
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {sectionLinks.map((sec, i) => (
                      <a
                        key={i}
                        href={sec.href}
                        onClick={() => {
                          sound.playClick();
                          onClose();
                        }}
                        className="flex flex-col px-3 py-2 rounded-xl bg-neutral-950/30 hover:bg-neutral-800/70 border border-neutral-800/40 hover:border-amber-500/30 text-neutral-300 hover:text-white transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white group-hover:text-amber-300">{sec.name}</span>
                          <ArrowRight size={12} className="text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <span className="text-[10px] text-neutral-500 leading-snug">{sec.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Projects */}
              {query !== '' && filteredProjects.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                    Projects ({filteredProjects.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          sound.playClick();
                          onClose();
                          if (onSelectProject) onSelectProject(p.id);
                        }}
                        className="p-3 rounded-xl bg-neutral-950/50 hover:bg-neutral-800/80 border border-neutral-800/60 hover:border-amber-500/40 cursor-pointer transition-all flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{p.title}</span>
                          <span className="text-[10px] font-mono text-amber-400">{p.category}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-1">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Skills */}
              {query !== '' && filteredSkills.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                    Skills & Technologies ({filteredSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-3">
                    {filteredSkills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-amber-300 font-mono text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Use <kbd className="text-neutral-400 font-semibold">↑</kbd> <kbd className="text-neutral-400 font-semibold">↓</kbd> to navigate</span>
              <span className="text-amber-500/80">Majidulla SK • Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
