import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sliders, 
  Github, 
  ExternalLink, 
  ArrowUpRight, 
  Lightbulb, 
  RefreshCw, 
  Briefcase, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { 
  analyzeJobDescription, 
  DEFAULT_WEIGHTS, 
  SAMPLE_JOB_DESCRIPTIONS, 
  JobMatchAnalysisResult, 
  ScoringWeights 
} from '../services/jobMatchEngine';
import { sound } from './SoundEffects';

interface ResumeJobMatchModalProps {
  onSelectProject?: (projectId: string) => void;
}

export const ResumeJobMatchModal: React.FC<ResumeJobMatchModalProps> = ({
  onSelectProject
}) => {
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_JOB_DESCRIPTIONS[0].text);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<JobMatchAnalysisResult | null>(() => {
    try {
      return analyzeJobDescription(SAMPLE_JOB_DESCRIPTIONS[0].text, DEFAULT_WEIGHTS);
    } catch {
      return null;
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [requirementTab, setRequirementTab] = useState<'matched' | 'missing' | 'weak'>('matched');

  const handleRunAnalysis = (textToAnalyze?: string) => {
    const text = textToAnalyze || jobDescription;
    if (!text.trim()) return;

    sound.playPop();
    setIsAnalyzing(true);

    setTimeout(() => {
      try {
        const result = analyzeJobDescription(text, weights);
        setAnalysisResult(result);
        sound.playSuccess();
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 350);
  };

  const handleLoadPreset = (index: number) => {
    const preset = SAMPLE_JOB_DESCRIPTIONS[index];
    setJobDescription(preset.text);
    handleRunAnalysis(preset.text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner / Explainer */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-cyan-950/20 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
            Job Description Analyzer & Truthful Match Engine
          </span>
          <p className="text-xs text-neutral-300 font-sans">
            Paste any job description to calculate an evidence-grounded match score, discover supported requirements, identify gaps, and inspect tailored recommendations.
          </p>
        </div>

        <button
          onClick={() => setShowWeightSliders(!showWeightSliders)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 transition-all cursor-pointer border border-neutral-700"
        >
          <SlidersHorizontal size={13} className="text-amber-400" />
          <span>{showWeightSliders ? 'Hide Weights' : 'Configure Weights'}</span>
        </button>
      </div>

      {/* Configurable Weights Drawer (Expandable) */}
      <AnimatePresence>
        {showWeightSliders && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden font-mono text-xs flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">
                Transparent Scoring Weight Allocations
              </span>
              <button
                onClick={() => {
                  setWeights(DEFAULT_WEIGHTS);
                  sound.playClick();
                }}
                className="text-[10px] text-amber-400 hover:underline"
              >
                Reset to Default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Core Skills</span>
                  <span className="text-white font-bold">{weights.coreSkills}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.coreSkills}
                  onChange={(e) => setWeights({ ...weights, coreSkills: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Projects Evidence</span>
                  <span className="text-white font-bold">{weights.projectEvidence}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.projectEvidence}
                  onChange={(e) => setWeights({ ...weights, projectEvidence: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Backend & APIs</span>
                  <span className="text-white font-bold">{weights.backendApi}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.backendApi}
                  onChange={(e) => setWeights({ ...weights, backendApi: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Cloud & DevOps</span>
                  <span className="text-white font-bold">{weights.infrastructure}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.infrastructure}
                  onChange={(e) => setWeights({ ...weights, infrastructure: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Preferred Skills</span>
                  <span className="text-white font-bold">{weights.preferredSkills}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.preferredSkills}
                  onChange={(e) => setWeights({ ...weights, preferredSkills: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section: Presets & Textarea */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
            Paste Job Posting or Try a 1-Click Preset:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_JOB_DESCRIPTIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadPreset(idx)}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-[11px] font-mono border border-neutral-800 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                {preset.title.split('/')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description, qualifications, and requirements here..."
            rows={5}
            className="w-full p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-sans focus:outline-none focus:border-cyan-500/60 leading-relaxed resize-y"
          />

          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Analyzing Match Criteria...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Analyze Match & Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Report Display */}
      {analysisResult && (
        <div className="flex flex-col gap-6 pt-4 border-t border-neutral-800">
          {/* Section A: Overall Match Gauge & Score Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Overall Score Card */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center justify-center text-center gap-2 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                Overall Resume Match Score
              </span>

              <div
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center my-1 transition-all ${getScoreColor(
                  analysisResult.overallScore
                )}`}
              >
                <span className="text-3xl font-extrabold font-mono">
                  {analysisResult.overallScore}
                </span>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                  / 100
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-white">
                {analysisResult.overallScore >= 85
                  ? 'Strong Match • Deeply Evidenced'
                  : analysisResult.overallScore >= 70
                  ? 'Moderate Match • Key Skills Aligned'
                  : 'Partial Match • Growth Alignment'}
              </div>

              <p className="text-[10px] text-neutral-500 font-mono mt-1">
                Transparent weighted calculation. Not an official ATS hiring endorsement.
              </p>
            </div>

            {/* Right: Weighted Category Breakdown */}
            <div className="lg:col-span-8 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
                Category-by-Category Weighted Breakdown
              </h4>

              <div className="space-y-3">
                {analysisResult.scoreBreakdown.map((item, idx) => {
                  const pct = Math.round((item.earned / item.weight) * 100);
                  return (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-neutral-300 font-medium">{item.category}</span>
                        <span className="text-neutral-400">
                          <strong className="text-amber-400">{item.earned}</strong> / {item.weight} pts ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${
                            pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-cyan-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono truncate">
                        {item.details}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section B: Matched vs Missing Requirements Navigation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 font-mono text-xs">
              <button
                onClick={() => setRequirementTab('matched')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  requirementTab === 'matched'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>
                  Supported Requirements (
                  {analysisResult.matchedRequirements.filter(r => r.status === 'matched').length}
                  )
                </span>
              </button>

              <button
                onClick={() => setRequirementTab('weak')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  requirementTab === 'weak'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <HelpCircle size={13} className="text-amber-400" />
                <span>
                  Weakly Evidenced ({analysisResult.weaklyEvidencedSkills.length})
                </span>
              </button>

              <button
                onClick={() => setRequirementTab('missing')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  requirementTab === 'missing'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <XCircle size={13} className="text-rose-400" />
                <span>
                  Missing from Resume ({analysisResult.missingSkills.length})
                </span>
              </button>
            </div>

            {/* List of Requirements by Active Tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[45vh] overflow-y-auto pr-1">
              {requirementTab === 'matched' &&
                analysisResult.matchedRequirements
                  .filter(r => r.status === 'matched')
                  .map((req, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-2 hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span className="text-xs font-bold text-white font-mono">
                            {req.skill}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                          {req.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                        {req.evidenceText}
                      </p>

                      {req.repoUrl && (
                        <div className="pt-1 border-t border-neutral-900">
                          <a
                            href={req.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Github size={11} />
                            <span>Verify Code Repository</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}

              {requirementTab === 'weak' && (
                analysisResult.weaklyEvidencedSkills.length > 0 ? (
                  analysisResult.weaklyEvidencedSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle size={14} className="text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-white font-mono">
                          {skill}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        Identified in general technical capabilities, but lacks a dedicated standalone featured repository.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 col-span-2 text-center text-xs text-neutral-500 font-mono">
                    No weakly evidenced skills detected for this job posting.
                  </div>
                )
              )}

              {requirementTab === 'missing' && (
                analysisResult.missingSkills.length > 0 ? (
                  analysisResult.missingSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-rose-400 shrink-0" />
                        <span className="text-xs font-bold text-rose-200 font-mono">
                          {skill}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-sans">
                        Genuinely missing from resume and active public GitHub repositories. Not fabricated to inflate scores.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 col-span-2 text-center text-xs text-neutral-500 font-mono">
                    No critical missing skills detected. Excellent coverage!
                  </div>
                )
              )}
            </div>
          </div>

          {/* Section D: Recommended Projects */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3">
              Top Recommended Projects for this Role
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {analysisResult.recommendedProjects.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white font-mono">
                        {rec.project.title}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        Rank #{idx + 1}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2 font-sans">
                      {rec.project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rec.matchedKeywords.map(kw => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 text-[9px] font-mono border border-cyan-500/30 font-semibold"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                    {rec.project.linkUrl && (
                      <a
                        href={rec.project.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-white hover:text-cyan-400 flex items-center gap-1"
                      >
                        <Github size={11} />
                        <span>GitHub Repo</span>
                      </a>
                    )}
                    {rec.project.liveUrl && (
                      <a
                        href={rec.project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <ArrowUpRight size={11} />
                        <span>Live Preview</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section E: Truthful Resume Improvement Suggestions */}
          {analysisResult.suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-3 flex items-center gap-2">
                <Lightbulb size={14} className="text-amber-400" />
                <span>Truthful Resume Bullet Improvement Suggestions</span>
              </h4>

              <div className="space-y-3">
                {analysisResult.suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        {sug.targetSection}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Targeted Polish
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans">
                      <strong>Observation:</strong> {sug.observation}
                    </p>

                    <p className="text-xs text-neutral-400 font-sans">
                      <strong>Action:</strong> {sug.actionableTip}
                    </p>

                    <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs font-mono text-emerald-300">
                      <span className="text-neutral-500 block text-[10px] mb-1">
                        Recommended Truthful Bullet:
                      </span>
                      "{sug.exampleBullet}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
