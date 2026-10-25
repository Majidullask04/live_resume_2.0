import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Layers, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Code2, 
  FolderGit2, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  VERIFIED_SKILL_CATEGORIES, 
  buildRelationshipGraph, 
  RECRUITER_PROFILE_SUMMARY, 
  VerifiedSkillItem 
} from '../services/resumeAnalysisData';
import { DATA, Project } from '../data';
import { sound } from './SoundEffects';

interface ResumeSkillGraphProps {
  onSelectProject?: (projectId: string) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const ResumeSkillGraph: React.FC<ResumeSkillGraphProps> = ({
  onSelectProject,
  onNavigateToSection
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'graph' | 'summary'>('skills');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<VerifiedSkillItem | null>(
    VERIFIED_SKILL_CATEGORIES[0].skills[0]
  );
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>('p-03'); // default 3-Tier-DevSecOps

  const graphData = buildRelationshipGraph();

  // Find supporting project objects for the selected skill
  const supportingProjects = selectedSkill
    ? DATA.projects.filter(p =>
        selectedSkill.verifiedIn.some(
          v => p.title.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(p.title.toLowerCase())
        ) || p.tools.some(t => t.toLowerCase() === selectedSkill.name.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800 font-mono text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('skills');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>9-Category Skill Map</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('graph');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Network size={13} />
            <span>Project-to-Skill Graph</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('summary');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={13} />
            <span>Evidence Summary</span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-500 font-mono hidden sm:block">
          Evidence Grounded: 100% verified from 11+ repositories
        </div>
      </div>

      {/* TAB 1: 9-CATEGORY VERIFIED SKILL MAP */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Category Pills & Skills Matrix */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  selectedCategory === 'all'
                    ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                All Categories ({VERIFIED_SKILL_CATEGORIES.length})
              </button>
              {VERIFIED_SKILL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? `${cat.badgeColor} font-bold shadow-sm`
                      : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {cat.title.split('&')[0].trim()}
                </button>
              ))}
            </div>

            {/* Category Accordion / Skill Lists */}
            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {VERIFIED_SKILL_CATEGORIES.filter(
                c => selectedCategory === 'all' || selectedCategory === c.id
              ).map(category => (
                <div
                  key={category.id}
                  className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="text-sm font-semibold text-white font-mono">
                        {category.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {category.skills.length} skills
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">
                    {category.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.skills.map(skill => {
                      const isSelected = selectedSkill?.name === skill.name;
                      return (
                        <div
                          key={skill.name}
                          onClick={() => {
                            sound.playClick();
                            setSelectedSkill(skill);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-neutral-800/90 border-amber-500/80 text-amber-200 shadow-md'
                              : 'bg-neutral-950/60 border-neutral-800/90 text-neutral-300 hover:border-neutral-700 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle2
                              size={13}
                              className={isSelected ? 'text-amber-400 shrink-0' : 'text-emerald-500 shrink-0'}
                            />
                            <span className="truncate font-medium">{skill.name}</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 shrink-0 border border-neutral-800">
                            {skill.level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Skill Evidence & Supporting Projects */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {selectedSkill ? (
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-4 sticky top-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      Skill Evidence Inspector
                    </span>
                    <h3 className="text-lg font-bold text-white font-mono mt-1">
                      {selectedSkill.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    {selectedSkill.level}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed font-sans">
                  {selectedSkill.evidenceDescription}
                </div>

                {/* Supporting Projects */}
                <div>
                  <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-semibold">
                    Supporting Project Evidence ({supportingProjects.length})
                  </h5>
                  <div className="space-y-2.5">
                    {supportingProjects.map(proj => (
                      <div
                        key={proj.id}
                        className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-amber-500/40 transition-all group flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 font-mono">
                            {proj.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 font-mono">
                            {proj.category}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 line-clamp-2">
                          {proj.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1 border-t border-neutral-900">
                          {proj.linkUrl && (
                            <a
                              href={proj.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                              <Github size={11} />
                              <span>GitHub Code</span>
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <ArrowUpRight size={11} />
                              <span>Live App</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSkill.repos.length > 0 && (
                  <div className="pt-2">
                    <a
                      href={selectedSkill.repos[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FolderGit2 size={13} className="text-amber-400" />
                      <span>Inspect Repository Implementation</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800 text-center text-xs text-neutral-500 font-mono">
                Click any skill on the left to inspect its supporting projects and repository evidence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE RELATIONSHIP GRAPH */}
      {activeTab === 'graph' && (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center justify-between">
            <span className="text-[11px]">
              Click any project or technology node below to inspect verified connections.
            </span>
            <span className="text-[10px] text-cyan-400 font-bold hidden sm:inline">
              11 Projects • 35+ Verified Tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DATA.projects.map(p => {
              const isSelected = selectedGraphNode === `p-${p.id}`;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedGraphNode(`p-${p.id}`);
                  }}
                  className={`p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-neutral-900 border-cyan-500 text-white shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{p.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tools.slice(0, 4).map(t => (
                      <span
                        key={t}
                        className={`text-[9px] px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold'
                            : 'bg-neutral-900 text-neutral-500'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                    {p.tools.length > 4 && (
                      <span className="text-[9px] text-neutral-500">
                        +{p.tools.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connected Details Panel for Selected Project */}
          {selectedGraphNode && (
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 mt-2">
              {(() => {
                const projId = selectedGraphNode.replace('p-', '');
                const proj = DATA.projects.find(p => p.id === projId);
                if (!proj) return null;

                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                          Selected Node Connection
                        </span>
                        <h4 className="text-base font-bold text-white font-mono">
                          {proj.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {proj.linkUrl && (
                          <a
                            href={proj.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono flex items-center gap-1.5"
                          >
                            <Github size={12} />
                            <span>GitHub</span>
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5"
                          >
                            <ArrowUpRight size={12} />
                            <span>Live App</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {proj.description}
                    </p>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block mb-1.5">
                        Verified Technology Connections ({proj.tools.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tools.map(tool => (
                          <span
                            key={tool}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1"
                          >
                            <Code2 size={11} className="text-cyan-400" />
                            <span>{tool}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {proj.securityControls && proj.securityControls.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-[11px] font-mono text-neutral-400">
                        <span className="text-emerald-400 font-bold">Security Controls: </span>
                        {proj.securityControls.join(' • ')}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EVIDENCE-BASED RECRUITER SUMMARY */}
      {activeTab === 'summary' && (
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/20 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
              Recruiter-Friendly Profile Synthesis
            </span>
            <h3 className="text-lg font-bold text-white font-mono">
              {RECRUITER_PROFILE_SUMMARY.headline}
            </h3>
          </div>

          {/* 4 Strongest Areas */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3">
              Strongest Technical Pillars
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {RECRUITER_PROFILE_SUMMARY.strongestAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex flex-col gap-2"
                >
                  <h5 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>{area.area}</span>
                  </h5>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {area.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 pt-2 border-t border-neutral-800/60 font-mono text-[10px]">
                    <span className="text-neutral-500">Best Evidence:</span>
                    {area.bestProjects.map(bp => (
                      <span
                        key={bp}
                        className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-semibold"
                      >
                        {bp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tri-Column: Demonstrated vs Claimed vs Inferred */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Demonstrated */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                <CheckCircle2 size={14} />
                <span>Demonstrated Experience</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Supported by live code, public repos & deployments.
              </p>
              <ul className="space-y-2 mt-1 font-sans text-xs text-neutral-300">
                {RECRUITER_PROFILE_SUMMARY.demonstratedCapabilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Claimed */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
                <Cpu size={14} />
                <span>Claimed Knowledge</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Coursework, cert prep & self-directed study.
              </p>
              <ul className="space-y-2 mt-1 font-sans text-xs text-neutral-300">
                {RECRUITER_PROFILE_SUMMARY.claimedKnowledge.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inferred & Growth Areas */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs">
                <HelpCircle size={14} />
                <span>Transparent Growth Areas</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Where further evidence strengthens profile.
              </p>
              <ul className="space-y-2 mt-1 font-sans text-xs text-neutral-300">
                {RECRUITER_PROFILE_SUMMARY.growthAreas.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
