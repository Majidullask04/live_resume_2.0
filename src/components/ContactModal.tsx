import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  X, 
  Send, 
  Copy, 
  Check, 
  Briefcase, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  Github, 
  Linkedin,
  MessageSquareCode
} from 'lucide-react';
import { DATA } from '../data';
import { sound } from './SoundEffects';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose
}) => {
  const [roleType, setRoleType] = useState<string>("Full-Time AI / Full-Stack Role");
  const [senderName, setSenderName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      sound.playOpenModal();
    }
  }, [isOpen]);

  const roleOptions = [
    "Full-Time AI / Full-Stack Role",
    "DevSecOps / Cloud Engineering Role",
    "High-Impact Internship",
    "System Architecture / Consulting",
    "Open Source & CNCF Collaboration"
  ];

  const constructedSubject = `[Opportunity / Inquiry] ${roleType} - from ${senderName || 'Hiring Team'}${company ? ` (${company})` : ''}`;
  const constructedBody = `Hi Majidulla,\n\nI came across your live interactive resume and would love to connect regarding a ${roleType}.\n\nName: ${senderName || '[Your Name]'}\nCompany / Organization: ${company || '[Company Name]'}\nContact Email: ${senderEmail || '[Your Email]'}\n\nProject / Role Details:\n${notes || 'We are interested in discussing opportunities that align with your AI Full-Stack, DevSecOps, and Kubernetes expertise.'}\n\nBest regards,\n${senderName || 'Hiring Team'}`;

  const mailtoLink = `mailto:${DATA.email}?subject=${encodeURIComponent(constructedSubject)}&body=${encodeURIComponent(constructedBody)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(`Subject: ${constructedSubject}\n\n${constructedBody}`);
    sound.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-neutral-900/95 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-neutral-200 z-10 glass-panel my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-800 bg-neutral-950/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Start a Conversation
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Direct communication with Majidulla SK
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form & Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
              
              {/* Quick Status Pill */}
              <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white font-medium text-xs">{DATA.status}</span>
                </div>
                <span className="text-neutral-500 text-[11px] font-mono">Hyderabad, IST</span>
              </div>

              {/* Inquiry Type Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Inquiry Purpose
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roleOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setRoleType(opt);
                      }}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-mono transition-all border ${
                        roleType === opt
                          ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm shadow-amber-500/10"
                          : "bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Cloud Corp"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                  Brief Note / Opportunity Scope
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share a brief overview of the role, project, or schedule preference..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/60 resize-none font-sans"
                />
              </div>

              {/* Generated Message Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    Live Email Draft Preview
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copied ? "Copied to Clipboard!" : "Copy Draft"}</span>
                  </button>
                </div>
                <pre className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-[11px] font-mono text-neutral-400 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                  {constructedBody}
                </pre>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                <a href={DATA.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Linkedin size={13} /> LinkedIn
                </a>
                <a href={DATA.links.github} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Github size={13} /> GitHub
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-mono transition-all"
                >
                  {copied ? "Copied!" : "Copy Text"}
                </button>

                <a
                  href={mailtoLink}
                  onClick={() => sound.playPop()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Send size={14} />
                  <span>Send via Email</span>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
