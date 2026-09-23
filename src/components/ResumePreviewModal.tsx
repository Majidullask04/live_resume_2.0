import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  X, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Eye,
  ExternalLink,
  Award,
  CheckCircle2
} from 'lucide-react';
import { DATA } from '../data';
import { sound } from './SoundEffects';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');
  const [copiedMd, setCopiedMd] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playOpenModal();
    }
  }, [isOpen]);

  const resumeMarkdown = `# ${DATA.name}
**${DATA.title}**
- **Email:** ${DATA.email} | **Phone:** ${DATA.phone} | **Location:** ${DATA.location}
- **GitHub:** ${DATA.links.github} | **LinkedIn:** ${DATA.links.linkedin} | **Status:** ${DATA.status}

---

## PROFESSIONAL SUMMARY
${DATA.about}

---

## TECHNICAL EXPERTISE
${DATA.categorizedTechStack.map(c => `- **${c.category}:** ${c.skills.join(', ')}`).join('\n')}

---

## FEATURED PROJECTS & IMPLEMENTATIONS

${DATA.projects.map(p => `### ${p.title} (${p.category})
- **Tools:** ${p.tools.join(', ')}
- **Overview:** ${p.description}
${p.highlights ? p.highlights.map(h => `- ${h}`).join('\n') : ''}
- **Link:** ${p.linkUrl}${p.liveUrl ? ` | Live: ${p.liveUrl}` : ''}
`).join('\n')}

---

## EXPERIENCE & EDUCATION

${DATA.experience.map(e => `### ${e.role} — ${e.company}
*${e.period} | ${e.location || 'India'}*
- ${e.description}
${e.highlights ? e.highlights.map(h => `- ${h}`).join('\n') : ''}
`).join('\n')}

---

## CERTIFICATIONS & RECOGNITION
${DATA.recognition.map(r => `- **${r.title}** (${r.award}) — ${r.event}: ${r.quote}`).join('\n')}
`;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(resumeMarkdown);
    sound.playSuccess();
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-4xl bg-neutral-900/95 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-neutral-200 z-10 glass-panel my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    ATS Resume Viewer & Export
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Formatted for technical recruiters, ATS screeners & engineering leads
                  </p>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('preview');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Eye size={13} />
                    <span>Clean ATS</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('markdown');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      activeTab === 'markdown'
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Code size={13} />
                    <span>Markdown</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Resume Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-neutral-950/90 font-sans text-neutral-300 print:bg-white print:text-black">
              {activeTab === 'preview' ? (
                <div className="max-w-3xl mx-auto space-y-8 bg-neutral-900/40 p-6 sm:p-8 rounded-2xl border border-neutral-800/80 shadow-lg">
                  {/* Header */}
                  <div className="border-b border-neutral-800 pb-6">
                    <h1 className="text-3xl font-bold text-white font-display mb-1">{DATA.name}</h1>
                    <p className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">{DATA.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                      <span>{DATA.email}</span>
                      <span>•</span>
                      <span>{DATA.phone}</span>
                      <span>•</span>
                      <span>{DATA.location}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-2">Professional Profile</h2>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                      {DATA.about}
                    </p>
                  </div>

                  {/* Core Technical Stack */}
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-3">Technical Skills</h2>
                    <div className="space-y-2 text-xs">
                      {DATA.categorizedTechStack.map((cat, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                          <span className="font-mono text-neutral-400 sm:w-48 shrink-0 font-medium">• {cat.category}:</span>
                          <span className="text-neutral-200">{cat.skills.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Projects */}
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-4">Key Projects & Systems</h2>
                    <div className="space-y-5">
                      {DATA.projects.slice(0, 4).map((proj) => (
                        <div key={proj.id} className="border-l-2 border-neutral-800 pl-4 space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-white text-sm">{proj.title}</span>
                            <span className="text-[11px] font-mono text-amber-400">{proj.category}</span>
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.tools.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-4">Experience & Education</h2>
                    <div className="space-y-4">
                      {DATA.experience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-neutral-800 pl-4 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-white text-sm">{exp.role}</span>
                            <span className="text-xs font-mono text-neutral-400">{exp.period}</span>
                          </div>
                          <p className="text-xs text-amber-400 font-mono">{exp.company}</p>
                          <p className="text-xs text-neutral-400 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-3">Certifications & Credentials</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {DATA.recognition.map((cert, idx) => (
                        <div key={idx} className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white text-xs">{cert.title}</span>
                            <span className="text-[10px] font-mono text-amber-400">{cert.award}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-mono">{cert.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <pre className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {resumeMarkdown}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/90 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-neutral-500">
                Format: Clean ATS-Standard • Single Column Compatible
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedMd ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedMd ? "Copied Markdown!" : "Copy Markdown"}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
