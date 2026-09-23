import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Github, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Workflow, 
  Zap, 
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Project } from '../data';
import { sound } from './SoundEffects';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playOpenModal();
    }
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 25 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-3xl my-auto bg-neutral-900/95 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-neutral-200 z-10 glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/70">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                  {project.id}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                    {project.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {project.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* Description */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2 flex items-center gap-2">
                  <Layers size={14} className="text-amber-500" /> System Overview
                </h4>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/60">
                  {project.description}
                </p>
              </div>

              {/* Metrics Grid */}
              {project.metrics && project.metrics.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Measured Performance & Impact
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl flex flex-col">
                        <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono mb-0.5">{m.value}</span>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Architecture Flow */}
              {project.architectureFlow && project.architectureFlow.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3 flex items-center gap-2">
                    <Workflow size={14} className="text-amber-500" /> System Architecture & Execution Pipeline
                  </h4>
                  <div className="space-y-2 bg-neutral-950/60 p-4 sm:p-5 rounded-xl border border-neutral-800/70 font-mono text-xs">
                    {project.architectureFlow.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-neutral-300 py-1">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Controls */}
              {project.securityControls && project.securityControls.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-amber-500" /> Security Controls & Zero-Trust Governance
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.securityControls.map((sec, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-1.5">
                        <ShieldCheck size={12} />
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engineering Challenges Solved */}
              {project.challenges && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-500" /> Engineering Challenge & Solution
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 italic bg-neutral-950/40 border-l-2 border-amber-500 p-4 rounded-r-xl">
                    "{project.challenges}"
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2.5 flex items-center gap-2">
                  <Cpu size={14} className="text-amber-500" /> Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-neutral-900 text-neutral-200 rounded-lg text-xs font-mono border border-neutral-800">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-neutral-400">
                Project Ref: <span className="text-amber-400">#{project.id}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={project.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playPop()}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-mono uppercase tracking-wider border border-neutral-800 hover:border-amber-500/50 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Github size={14} />
                  <span>{project.linkText}</span>
                </a>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound.playPop()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 active:scale-95"
                  >
                    <ExternalLink size={14} />
                    <span>Launch App</span>
                  </a>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
