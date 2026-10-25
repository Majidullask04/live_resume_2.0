import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Search, 
  Radio, 
  Cpu, 
  Layers, 
  Eye, 
  Zap, 
  SlidersHorizontal 
} from 'lucide-react';
import { sound } from './SoundEffects';

export interface CrawlerNode {
  id: string;
  sectionId: string;
  name: string;
  label: string;
  iconName: string;
  x: number;
  y: number;
  matchesCount: number;
  isMatched: boolean;
  isScanning: boolean;
  isTraversed: boolean;
}

interface ResumeCrawlerVisualizerProps {
  traversedSections: string[];
  matchedSections: string[];
  resultsCountBySection: Record<string, number>;
  isSearching: boolean;
  query: string;
  totalMatches: number;
  executionTimeMs: number;
  onSelectSection: (sectionId: string, sectionName: string) => void;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
}

const SECTION_NODES: { id: string; sectionId: string; name: string; label: string; x: number; y: number }[] = [
  { id: 'sec-overview', sectionId: '#landing', name: 'Overview', label: 'Summary & Bio', x: 120, y: 70 },
  { id: 'sec-about', sectionId: '#about', name: 'About', label: 'Architecture & Focus', x: 360, y: 55 },
  { id: 'sec-capabilities', sectionId: '#services', name: 'Capabilities', label: 'DevSecOps & FullStack', x: 600, y: 70 },
  { id: 'sec-tech', sectionId: '#skills', name: 'Tech Stack', label: 'Verified Skills', x: 120, y: 220 },
  { id: 'sec-projects', sectionId: '#work', name: 'Projects', label: '11+ Repositories', x: 360, y: 190 },
  { id: 'sec-experience', sectionId: '#experience', name: 'Experience', label: 'B.Tech & CNCF', x: 600, y: 220 },
  { id: 'sec-certs', sectionId: '#experience', name: 'Certifications', label: 'CKA / AWS / IaC', x: 360, y: 310 }
];

const CONNECTIONS = [
  { from: 0, to: 1 }, // Overview -> About
  { from: 1, to: 2 }, // About -> Capabilities
  { from: 0, to: 3 }, // Overview -> Tech Stack
  { from: 3, to: 4 }, // Tech Stack -> Projects
  { from: 4, to: 2 }, // Projects -> Capabilities
  { from: 4, to: 5 }, // Projects -> Experience
  { from: 4, to: 6 }, // Projects -> Certs
  { from: 3, to: 6 }, // Tech Stack -> Certs
  { from: 2, to: 5 }  // Capabilities -> Experience
];

export const ResumeCrawlerVisualizer: React.FC<ResumeCrawlerVisualizerProps> = ({
  traversedSections,
  matchedSections,
  resultsCountBySection,
  isSearching,
  query,
  totalMatches,
  executionTimeMs,
  onSelectSection,
  reducedMotion = false,
  onToggleReducedMotion
}) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [crawlerPos, setCrawlerPos] = useState<{ x: number; y: number }>({ x: SECTION_NODES[0].x, y: SECTION_NODES[0].y });
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set([0]));
  const [scanStatus, setScanStatus] = useState<string>('Ready for search telemetry');
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animate crawler across sections whenever a new query executes
  useEffect(() => {
    if (!query) {
      setActiveNodeIndex(0);
      setCrawlerPos({ x: SECTION_NODES[0].x, y: SECTION_NODES[0].y });
      setVisitedNodes(new Set());
      setScanStatus('Idle. Awaiting search query...');
      return;
    }

    if (reducedMotion) {
      // Instant traversal for accessibility
      const allIdx = new Set(SECTION_NODES.map((_, i) => i));
      setVisitedNodes(allIdx);
      setActiveNodeIndex(4); // Park at Projects
      setCrawlerPos({ x: SECTION_NODES[4].x, y: SECTION_NODES[4].y });
      setScanStatus(`Scanned ${SECTION_NODES.length} resume sections in ${executionTimeMs}ms • ${totalMatches} evidence nodes found`);
      return;
    }

    // Dynamic sequential traversal
    let step = 0;
    const visited = new Set<number>();
    setScanStatus(`Crawler initialized • Scanning "${query}" across resume sections...`);

    const intervalTime = 160; // Smooth 160ms per node jump

    const crawlStep = () => {
      if (step < SECTION_NODES.length) {
        const currNode = SECTION_NODES[step];
        setActiveNodeIndex(step);
        setCrawlerPos({ x: currNode.x, y: currNode.y });
        visited.add(step);
        setVisitedNodes(new Set(visited));

        const matchCount = resultsCountBySection[currNode.name] || 0;
        setScanStatus(`Scanning ${currNode.name}... ${matchCount > 0 ? `[${matchCount} MATCH${matchCount > 1 ? 'ES' : ''} DISCOVERED]` : 'Traversing...'}`);

        step++;
        animationTimeoutRef.current = setTimeout(crawlStep, intervalTime);
      } else {
        // Finished crawl
        setScanStatus(`Scan complete in ${executionTimeMs}ms • Discovered ${totalMatches} verified matches across ${matchedSections.length} sections`);
        sound.playSuccess();
      }
    };

    crawlStep();

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [query, reducedMotion, executionTimeMs, totalMatches]);

  return (
    <div className="relative w-full rounded-2xl bg-neutral-950/90 border border-neutral-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* HUD Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-neutral-800/70 bg-neutral-900/40 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-[11px]">
            <Radio size={12} className={query ? "animate-pulse text-cyan-400" : "text-neutral-500"} />
            <span className="font-bold uppercase tracking-wider">Crawler Node 2.0</span>
          </div>

          <span className="text-neutral-400 text-[11px] truncate max-w-[200px] sm:max-w-xs">
            {scanStatus}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {totalMatches > 0 && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 font-bold">
                {totalMatches} match{totalMatches > 1 ? 'es' : ''}
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                {executionTimeMs} ms
              </span>
            </div>
          )}

          {onToggleReducedMotion && (
            <button
              onClick={onToggleReducedMotion}
              title={reducedMotion ? "Enable crawler animations" : "Disable animations for reduced motion"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer border ${
                reducedMotion 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-neutral-800/80 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={11} />
              <span>{reducedMotion ? 'Motion: Off' : 'Motion: Smooth'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Radar Visualizer SVG Canvas */}
      <div className="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center p-2 select-none overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <svg viewBox="0 0 720 360" className="w-full h-full max-h-[300px]">
          <defs>
            {/* Gradients */}
            <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="glowGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="crawlerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Connections */}
          {CONNECTIONS.map((conn, idx) => {
            const fromNode = SECTION_NODES[conn.from];
            const toNode = SECTION_NODES[conn.to];
            const isTraversed = visitedNodes.has(conn.from) && visitedNodes.has(conn.to);
            const hasMatchOnBoth = (resultsCountBySection[fromNode.name] || 0) > 0 || (resultsCountBySection[toNode.name] || 0) > 0;

            return (
              <g key={`conn-${idx}`}>
                {/* Background base wire */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#262626"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Animated active pulse wire */}
                {isTraversed && (
                  <motion.line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={hasMatchOnBoth ? "url(#activeLineGrad)" : "#06b6d440"}
                    strokeWidth={hasMatchOnBoth ? "2.5" : "1.5"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </g>
            );
          })}

          {/* Render Section Nodes */}
          {SECTION_NODES.map((node, idx) => {
            const matchCount = resultsCountBySection[node.name] || 0;
            const hasMatch = matchCount > 0;
            const isVisited = visitedNodes.has(idx);
            const isCurrent = activeNodeIndex === idx && isSearching;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => {
                  sound.playClick();
                  onSelectSection(node.sectionId, node.name);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo when active or match found */}
                {hasMatch && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Node Body Circle */}
                <circle
                  r={hasMatch ? "18" : "15"}
                  fill={hasMatch ? "#06283d" : isVisited ? "#171717" : "#0d0d0d"}
                  stroke={
                    hasMatch 
                      ? "#06b6d4" 
                      : isCurrent 
                      ? "#f59e0b" 
                      : isVisited 
                      ? "#404040" 
                      : "#262626"
                  }
                  strokeWidth={hasMatch || isCurrent ? "2.5" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-amber-400 group-hover:scale-110"
                />

                {/* Inner status dot */}
                <circle
                  r="4"
                  fill={hasMatch ? "#22d3ee" : isVisited ? "#a3a3a3" : "#525252"}
                />

                {/* Node Title Label */}
                <text
                  y="-22"
                  textAnchor="middle"
                  className="text-[11px] font-mono font-bold fill-neutral-300 group-hover:fill-amber-400 transition-colors"
                >
                  {node.name}
                </text>

                {/* Subtitle / Match Badge */}
                {hasMatch ? (
                  <g transform="translate(14, -14)">
                    <circle r="9" fill="#10b981" />
                    <text
                      y="3"
                      textAnchor="middle"
                      className="text-[9px] font-mono font-extrabold fill-neutral-950"
                    >
                      {matchCount}
                    </text>
                  </g>
                ) : (
                  <text
                    y="28"
                    textAnchor="middle"
                    className="text-[8px] font-mono fill-neutral-500"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Animated Crawler Spider Indicator */}
          {query && (
            <motion.g
              animate={{ x: crawlerPos.x, y: crawlerPos.y }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 }}
              filter="url(#crawlerGlow)"
              className="pointer-events-none"
            >
              {/* Radar scanner sweep ring */}
              <circle
                r="30"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-spin"
                style={{ animationDuration: '6s' }}
              />

              {/* Central Crawler Spider Body */}
              <g transform="translate(-12, -12)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {/* Cyber spider legs */}
                  <path d="M4 6L8 9M4 12L8 12M4 18L8 15" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M20 6L16 9M20 12L16 12M20 18L16 15" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Spider thorax & abdomen */}
                  <circle cx="12" cy="12" r="5" fill="#083344" stroke="#06b6d4" strokeWidth="1.8" />
                  {/* Luminous scanning eye */}
                  <circle cx="12" cy="12" r="2.5" fill="#f59e0b" className="animate-pulse" />
                </svg>
              </g>

              {/* Dynamic status pill above crawler */}
              <g transform="translate(0, -36)">
                <rect
                  x="-35"
                  y="-10"
                  width="70"
                  height="16"
                  rx="8"
                  fill="#030712"
                  stroke="#06b6d4"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  textAnchor="middle"
                  y="2"
                  className="text-[8px] font-mono font-bold fill-cyan-300 uppercase tracking-wider"
                >
                  CRAWLING
                </text>
              </g>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Discovered Section Nodes Strip (Interactive Quick-Jump Pills) */}
      <div className="flex items-center gap-1.5 p-2.5 overflow-x-auto border-t border-neutral-800/80 bg-neutral-950/60 font-mono text-[11px] scrollbar-none">
        <span className="text-[10px] text-neutral-500 uppercase px-2 shrink-0">Resume Map:</span>
        {SECTION_NODES.map((node) => {
          const matchCount = resultsCountBySection[node.name] || 0;
          const hasMatch = matchCount > 0;

          return (
            <button
              key={`pill-${node.id}`}
              onClick={() => {
                sound.playClick();
                onSelectSection(node.sectionId, node.name);
              }}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                hasMatch 
                  ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                  : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <span>{node.name}</span>
              {hasMatch && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {matchCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
