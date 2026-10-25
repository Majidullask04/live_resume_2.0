import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Sparkles, 
  Bot, 
  Layers, 
  Network, 
  Briefcase, 
  HelpCircle, 
  FileText, 
  Github, 
  ExternalLink, 
  ArrowUpRight, 
  Check, 
  CornerDownLeft, 
  SlidersHorizontal, 
  Radio, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Zap,
  FolderGit2
} from 'lucide-react';
import { 
  executeResumeSearch, 
  SearchResultSummary, 
  SearchMatch 
} from '../services/resumeSearchEngine';
import { ResumeCrawlerVisualizer } from './ResumeCrawlerVisualizer';
import { ResumeSkillGraph } from './ResumeSkillGraph';
import { ResumeJobMatchModal } from './ResumeJobMatchModal';
import { DATA } from '../data';
import { sound } from './SoundEffects';

interface ResumeIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionId: string, title?: string) => void;
  onOpenProjectDetail?: (projectId: string) => void;
  initialTab?: 'crawler' | 'analysis' | 'job-match' | 'recruiter';
  initialQuery?: string;
}

const PRESET_QUERIES = [
  "Find my AI projects",
  "What backend technologies do I use?",
  "Show projects involving Python and FastAPI",
  "Find my DevOps and Kubernetes work",
  "Do I have experience with PostgreSQL?",
  "Find my GitHub repositories",
  "Show evidence of my API development skills",
  "Which projects demonstrate production deployment?"
];

const RECRUITER_FAQS = [
  {
    question: "What are his strongest AI engineering projects?",
    answer: "Majid's primary AI projects are **career-ops** (an open-source AI job agent built in TypeScript that parses portals, calculates fit scores, and tailors resumes with LLM APIs) and **student-os** (intelligent academic workspace with automated schedule intelligence, deployed on AWS Amplify). He also engineered the **AI Copilot and Resume Intelligence Engine** with local inverted index search.",
    evidenceProjects: ["career-ops", "student-os"],
    repoLink: "https://github.com/Majidullask04/career-ops"
  },
  {
    question: "Which projects demonstrate backend API development?",
    answer: "Demonstrated across **student-os** (RESTful endpoints, CloudFront edge caching), **EASYCAFE** (sub-100ms client-side cart orchestration & menu APIs), **Three-Tier-Applications** (Node/Express backend container with MongoDB), and **Google Microservices DevOps Platform** (gRPC inter-service communication across 10 polyglot microservices).",
    evidenceProjects: ["Three-Tier-Applications", "EASYCAFE", "Google Microservices DevOps Platform"],
    repoLink: "https://github.com/Majidullask04/Three-Tier-Applications"
  },
  {
    question: "What evidence shows experience with DevOps and CI/CD?",
    answer: "In **3-Tier-DevSecOps-Mega-Project**, Majid built a multi-stage Jenkins declarative pipeline with automated discovery of 11+ microservices, Gitleaks secret scanning, SonarQube quality gates, Trivy container CVE scans, dynamic commit-SHA Docker tagging, and Argo CD GitOps synchronization on K3s Kubernetes. He cut deployment release friction by 90%.",
    evidenceProjects: ["3-Tier-DevSecOps-Mega-Project", "ci-cd-automation"],
    repoLink: "https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project"
  },
  {
    question: "Which projects are most relevant to an AI backend internship?",
    answer: "**career-ops** (TypeScript/Node.js + LLM prompt chains + JSON schema validation), **student-os** (AWS Amplify + TypeScript + reactive cloud backend state), and the **Google Microservices Platform** (gRPC, Python/Go backend components, Istio mTLS).",
    evidenceProjects: ["career-ops", "student-os"],
    repoLink: "https://github.com/Majidullask04/career-ops"
  },
  {
    question: "Does the resume demonstrate experience with RAG, LLMs, or AI agents?",
    answer: "Yes. In **career-ops**, he built an autonomous terminal agent orchestrating prompt chains with Gemini APIs and schema guards to prevent hallucination. In **live_resume_2.0**, he implemented a local tokenized knowledge retrieval engine and inverted index for instant sub-5ms evidence retrieval.",
    evidenceProjects: ["career-ops", "live_resume_2.0"],
    repoLink: "https://github.com/Majidullask04/career-ops"
  }
];

export const ResumeIntelligenceModal: React.FC<ResumeIntelligenceModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSection,
  onOpenProjectDetail,
  initialTab = 'crawler',
  initialQuery = ''
}) => {
  const [activeTab, setActiveTab] = useState<'crawler' | 'analysis' | 'job-match' | 'recruiter'>(initialTab);
  const [query, setQuery] = useState<string>(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [searchSummary, setSearchSummary] = useState<SearchResultSummary>(() =>
    executeResumeSearch(initialQuery, 'All')
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playOpenModal();
      if (initialTab) setActiveTab(initialTab);
      if (initialQuery) {
        setQuery(initialQuery);
        handleSearch(initialQuery, categoryFilter);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, initialTab, initialQuery]);

  const handleSearch = (newQuery: string, filter: string = categoryFilter) => {
    setQuery(newQuery);
    setIsSearching(true);
    const summary = executeResumeSearch(newQuery, filter);
    setSearchSummary(summary);
    setIsSearching(false);
  };

  const handleSelectPreset = (preset: string) => {
    sound.playClick();
    setQuery(preset);
    handleSearch(preset, categoryFilter);
  };

  const handleCategoryChange = (cat: string) => {
    sound.playClick();
    setCategoryFilter(cat);
    handleSearch(query, cat);
  };

  const handleResultClick = (match: SearchMatch) => {
    sound.playClick();
    onClose();
    // Scroll and flash-highlight
    onNavigateToSection(match.matchedSectionId, match.item.title);
  };

  // Convert results by section to match count map for visualizer
  const resultsCountMap: Record<string, number> = {};
  searchSummary.resultsBySection.forEach(group => {
    resultsCountMap[group.sectionName] = group.matches.length;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[140] flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-6 overflow-y-auto pb-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", damping: 28, stiffness: 380 }}
          className="relative w-full max-w-5xl bg-neutral-900/95 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 z-10 glass-panel"
        >
          {/* Top Modal Navigation Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-neutral-800 bg-neutral-950/90">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-amber-500 flex items-center justify-center text-neutral-950 shadow-md">
                <Radio size={18} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-white tracking-tight text-base sm:text-lg">
                    Resume Intelligence
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    AI Crawler & Engine
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">
                  Interactive real-time crawler, evidence verification, and job description analyzer
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs overflow-x-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('crawler');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'crawler'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Search size={13} />
                <span>Search & Crawler</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('analysis');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'analysis'
                    ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Network size={13} />
                <span>Analyze My Resume</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('job-match');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'job-match'
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Briefcase size={13} />
                <span>Analyze Job Match</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('recruiter');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'recruiter'
                    ? 'bg-purple-500 text-white font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Bot size={13} />
                <span>Recruiter Q&A</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Main Content Container */}
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto flex flex-col gap-6">
            
            {/* TAB 1: INTERACTIVE RESUME CRAWLER & SEARCH */}
            {activeTab === 'crawler' && (
              <div className="flex flex-col gap-5">
                {/* Search Bar Input */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-amber-500">
                    <Search size={18} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search technical skills, projects, DevOps pipelines, or keywords (e.g. 'Kubernetes', 'FastAPI', 'AWS')..."
                    className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/70 font-sans shadow-inner"
                  />
                  {query && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-12 p-1 text-neutral-500 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <kbd className="absolute right-4 hidden sm:inline-block px-2 py-0.5 bg-neutral-800 text-[10px] font-mono text-neutral-400 rounded border border-neutral-700">
                    ESC
                  </kbd>
                </div>

                {/* Example Query Presets Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[11px]">
                  <span className="text-neutral-500 uppercase text-[10px] shrink-0 mr-1">
                    Try Asking:
                  </span>
                  {PRESET_QUERIES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                  <span className="text-neutral-500 text-[11px] uppercase mr-1">Filter:</span>
                  {['All', 'Projects', 'Skills', 'Capabilities', 'Experience', 'Certifications'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer border ${
                        categoryFilter === cat
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Animated Crawler Visualizer Component */}
                <ResumeCrawlerVisualizer
                  traversedSections={searchSummary.traversedSections}
                  matchedSections={searchSummary.matchedSections}
                  resultsCountBySection={resultsCountMap}
                  isSearching={isSearching}
                  query={query}
                  totalMatches={searchSummary.totalMatches}
                  executionTimeMs={searchSummary.executionTimeMs}
                  reducedMotion={reducedMotion}
                  onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
                  onSelectSection={(secId) => {
                    onClose();
                    onNavigateToSection(secId);
                  }}
                />

                {/* Search Results Grouped by Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                    <span>
                      {query
                        ? `Discovered Results (${searchSummary.totalMatches} matches in ${searchSummary.executionTimeMs}ms)`
                        : 'Featured Index Highlights (Enter a query to crawl)'}
                    </span>
                    {searchSummary.expandedTerms.length > 0 && (
                      <span className="text-[10px] text-cyan-400 hidden sm:inline">
                        Matched technical aliases: {searchSummary.expandedTerms.join(', ')}
                      </span>
                    )}
                  </div>

                  {searchSummary.resultsBySection.length > 0 ? (
                    searchSummary.resultsBySection.map((group) => (
                      <div key={group.sectionName} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            {group.sectionName} ({group.matches.length})
                          </span>
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToSection(group.sectionId);
                            }}
                            className="text-[10px] text-neutral-400 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Jump to section</span>
                            <ArrowUpRight size={11} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {group.matches.map((match) => (
                            <div
                              key={match.item.id}
                              onClick={() => handleResultClick(match)}
                              className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900/60 transition-all cursor-pointer group flex flex-col justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 font-mono">
                                    {match.item.title}
                                  </h4>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 font-mono">
                                    {match.item.type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 line-clamp-2 font-sans">
                                  {match.matchHighlights.snippet}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-neutral-900 font-mono text-[10px]">
                                <span className="text-neutral-500">
                                  Matched: {match.matchedTerms.slice(0, 3).join(', ')}
                                </span>
                                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                                  <span>View</span>
                                  <ChevronRight size={12} />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    query && (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-dashed border-neutral-800 text-center flex flex-col items-center gap-2">
                        <HelpCircle size={24} className="text-neutral-500" />
                        <h4 className="text-xs font-mono font-bold text-neutral-300">
                          No matching evidence discovered for "{query}"
                        </h4>
                        <p className="text-xs text-neutral-500 max-w-sm">
                          Try searching for verified core technologies like Docker, Kubernetes, Jenkins, React, Python, or FastAPI.
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ANALYZE MY RESUME (SKILL & PROJECT GRAPH) */}
            {activeTab === 'analysis' && (
              <ResumeSkillGraph
                onSelectProject={onOpenProjectDetail}
                onNavigateToSection={(secId) => {
                  onClose();
                  onNavigateToSection(secId);
                }}
              />
            )}

            {/* TAB 3: ANALYZE JOB MATCH (JD ANALYZER) */}
            {activeTab === 'job-match' && (
              <ResumeJobMatchModal onSelectProject={onOpenProjectDetail} />
            )}

            {/* TAB 4: RECRUITER Q&A HUB */}
            {activeTab === 'recruiter' && (
              <div className="flex flex-col gap-5">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-purple-950/20 border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block mb-1">
                    Recruiter Quick Intelligence Hub
                  </span>
                  <p className="text-xs text-neutral-300 font-sans">
                    Get instant, verified answers to top recruiter questions without reading through the full document. Every response is grounded strictly in live project repositories.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Preset Questions */}
                  <div className="lg:col-span-5 flex flex-col gap-2">
                    {RECRUITER_FAQS.map((faq, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          setSelectedFaq(idx);
                        }}
                        className={`p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                          selectedFaq === idx
                            ? 'bg-neutral-800/90 border-purple-500/80 text-white shadow-md'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-2">{faq.question}</span>
                        <ChevronRight
                          size={14}
                          className={selectedFaq === idx ? 'text-purple-400 shrink-0' : 'text-neutral-600 shrink-0'}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Detailed Evidence Answer Card */}
                  <div className="lg:col-span-7">
                    {selectedFaq !== null && (
                      <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-4 shadow-xl">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                            Verified Recruiter Answer
                          </span>
                          <h3 className="text-sm font-bold text-white font-mono mt-1">
                            {RECRUITER_FAQS[selectedFaq].question}
                          </h3>
                        </div>

                        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans">
                          {RECRUITER_FAQS[selectedFaq].answer}
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-2">
                            Key Supporting Projects:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {RECRUITER_FAQS[selectedFaq].evidenceProjects.map((pName) => (
                              <span
                                key={pName}
                                className="px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/30 text-xs font-mono font-medium"
                              >
                                {pName}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                          <a
                            href={RECRUITER_FAQS[selectedFaq].repoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <Github size={13} className="text-amber-400" />
                            <span>Inspect Code Repository</span>
                          </a>

                          <a
                            href={`mailto:${DATA.email}?subject=Hiring Inquiry for Majidulla SK`}
                            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>Schedule Interview</span>
                            <ArrowUpRight size={13} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-neutral-800/80 bg-neutral-950/80 font-mono text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ground Truth Index: 11 Projects • 35+ Skills • 0 Fabricated Metrics</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">Press ESC to dismiss</span>
              <a
                href={DATA.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <Github size={12} />
                <span>@Majidullask04</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
