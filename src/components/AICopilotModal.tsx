import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  CornerDownLeft,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { DATA } from '../data';
import { sound } from './SoundEffects';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  category?: string;
}

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
  onOpenProject?: (projectId: string) => void;
}

const PRESET_PROMPTS = [
  { label: "💡 Elevator Pitch", query: "Give me a quick 30-second summary of who Majidulla is." },
  { label: "💼 Why Hire Majid?", query: "Why should we hire Majidulla for AI Full-Stack or DevSecOps roles?" },
  { label: "🚀 DevSecOps Pipeline", query: "How does Majid build automated DevSecOps pipelines with SonarQube and Trivy?" },
  { label: "🤖 AI & Full-Stack", query: "What are his core full-stack and machine learning capabilities?" },
  { label: "🛠️ Kubernetes & Cloud", query: "What is his hands-on experience with Kubernetes, AWS, and Istio?" },
  { label: "📞 Contact & Availability", query: "What is his current availability and how do I contact him?" }
];

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  onOpenContact,
  onOpenProject
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm Majid's **AI Resume Copilot**.\n\nI can answer questions about his **AI Full-Stack projects**, **DevSecOps architectures**, **Kubernetes infrastructure**, and **hiring availability**.\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'System'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playOpenModal();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const findBestAnswer = (query: string): string => {
    const q = query.toLowerCase();

    // Check specific project questions
    if (q.includes('3-tier') || q.includes('jenkins') || q.includes('mega project') || q.includes('pipeline')) {
      return `### 🚀 3-Tier-DevSecOps-Mega-Project\n\nMajid built a production-grade Jenkins declarative pipeline auto-building **11+ microservices** with dynamic Docker discovery.\n\n**Security Controls:**\n- **Gitleaks:** Secret detection blocking leaked keys\n- **SonarQube:** Static code quality gates\n- **Trivy:** Container CVE filesystem scanning\n- **GitOps:** Auto sync with Argo CD on Kubernetes (K3s)\n\n*Would you like to inspect the architecture flow diagram for this project?*`;
    }

    if (q.includes('career-ops') || q.includes('job search') || q.includes('ats')) {
      return `### 🤖 career-ops (AI Job Agent)\n\nAn open-source AI job search tool & terminal agent in **TypeScript/Node.js** that parses job portals, calculates an A-F match score, and automatically tailors ATS-compliant resumes with LLM APIs.\n\nLive at [career-ops.org](https://career-ops.org) with over 100+ applications generated!`;
    }

    if (q.includes('google') || q.includes('istio') || q.includes('cymbal') || q.includes('grpc')) {
      return `### 🌐 Google Microservices Platform\n\nDevOps implementation of Google's 10-microservice architecture on **Kubernetes (EKS/K3s)** with **Istio Service Mesh**, gRPC inter-service communication, mTLS security, and Prometheus/Grafana distributed telemetry.`;
    }

    if (q.includes('student-os') || q.includes('student') || q.includes('academic')) {
      return `### 🎓 student-os (Flagship Project)\n\nMajid's latest active project is an academic operating system and intelligent student workspace built with **TypeScript, React, and AWS Amplify**.\n\n- **Live App:** [majid-1.d1kytdzlw5ibag.amplifyapp.com](https://majid-1.d1kytdzlw5ibag.amplifyapp.com)\n- **GitHub:** [github.com/Majidullask04/student-os](https://github.com/Majidullask04/student-os)\n- **Key Features:** Automated scheduling, assignment intelligence, edge CDN distribution on AWS CloudFront.`;
    }

    if (q.includes('easycafe') || q.includes('cafe') || q.includes('coffee') || q.includes('menu') || q.includes('ordering')) {
      return `### ☕ EASYCAFE (Smart Cafe Platform)\n\nA smart digital cafe ordering and table reservation web application built with **TypeScript, React, and Vite**, deployed on **Vercel**.\n\n- **Live App:** [easycafe-nu.vercel.app](https://easycafe-nu.vercel.app)\n- **GitHub:** [github.com/Majidullask04/EASYCAFE](https://github.com/Majidullask04/EASYCAFE)\n- **Key Features:** Interactive digital menu, real-time cart computation, table booking, and sub-100ms response latency.`;
    }

    if (q.includes('phone') || q.includes('whatsapp') || q.includes('call') || q.includes('number') || q.includes('mobile')) {
      return `### 📞 Direct Contact & Phone\n\nYou can call or WhatsApp Majidulla directly at:\n- **Phone:** **${DATA.phone}** (${DATA.phoneRaw})\n- **Email:** **${DATA.email}**\n- **Location:** Hyderabad, Telangana, India\n\nHe is actively available for Full-Time AI Full-Stack, Backend, DevSecOps, and Cloud Engineering roles.`;
    }

    // Check Knowledge base
    let bestMatch = DATA.aiKnowledgeBase[0];
    let maxScore = 0;

    for (const item of DATA.aiKnowledgeBase) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) score += 2;
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (maxScore > 0) {
      return bestMatch.answer;
    }

    // Default intelligent synthesis
    return `Majidulla SK is an **AI Full-Stack Engineer & DevSecOps Specialist** proficient in **React, TypeScript, Node.js, Express, MongoDB, Python, AWS, Kubernetes, Docker, Jenkins, SonarQube, and Istio**.\n\nHe is currently open to full-time roles and high-impact internships. You can reach him at **${DATA.phone}** or **${DATA.email}**!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    sound.playPop();

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate realistic AI thought process & streaming
    const answer = findBestAnswer(text);
    setTimeout(() => {
      setIsTyping(false);
      sound.playClick();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sound.playSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    sound.playClick();
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Conversation cleared. What else would you like to know about Majid's work or skills?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl h-[90vh] max-h-[700px] bg-neutral-900/95 border border-neutral-800/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 z-10 glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/70">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Bot size={19} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">Majid's AI Resume Copilot</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Live Q&A
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">Real-time candidate intelligence & system telemetry</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClear}
                  title="Clear conversation"
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 relative group ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                      : 'bg-neutral-950/80 border border-neutral-800/80 text-neutral-200 rounded-tl-none leading-relaxed'
                  }`}>
                    <div className="whitespace-pre-line text-xs sm:text-sm">
                      {msg.text}
                    </div>

                    <div className={`flex items-center justify-between gap-4 mt-2 pt-1 text-[10px] font-mono ${
                      msg.sender === 'user' ? 'text-neutral-900/70' : 'text-neutral-500'
                    }`}>
                      <span>{msg.timestamp}</span>

                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-amber-400"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-center"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles size={14} className="animate-spin" />
                  </div>
                  <div className="bg-neutral-950/80 border border-neutral-800 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Suggested Questions */}
            <div className="px-4 py-2.5 border-t border-neutral-800/80 bg-neutral-950/40">
              <div className="flex items-center gap-1.5 mb-2">
                <Terminal size={12} className="text-amber-500" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">Suggested Questions</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {PRESET_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt.query)}
                    className="whitespace-nowrap px-3 py-1.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-[11px] font-mono text-neutral-300 hover:text-white rounded-lg transition-all shrink-0 active:scale-95"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3.5 sm:p-4 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about Majid's projects, tech stack, or experience..."
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs font-mono shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <CornerDownLeft size={14} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
