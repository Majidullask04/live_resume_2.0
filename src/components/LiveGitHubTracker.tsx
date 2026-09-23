import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, GitCommit, GitPullRequest, Star, GitFork, Activity, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
import { sound } from './SoundEffects';

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  avatar_url: string;
  updated_at: string;
}

interface GitHubEvent {
  type: string;
  repo: { name: string };
  created_at: string;
}

export const LiveGitHubTracker: React.FC = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [latestEvent, setLatestEvent] = useState<GitHubEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);

  const fetchGitHubData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, eventsRes] = await Promise.all([
        fetch('https://api.github.com/users/Majidullask04'),
        fetch('https://api.github.com/users/Majidullask04/events/public?per_page=5')
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData);
      }

      if (eventsRes.ok) {
        const eData = await eventsRes.json();
        if (eData && eData.length > 0) {
          setLatestEvent(eData[0]);
        }
      }
    } catch (err) {
      console.error("GitHub API fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const handleManualRefresh = () => {
    sound.playPop();
    setIsRefreshed(true);
    fetchGitHubData();
    setTimeout(() => setIsRefreshed(false), 2000);
  };

  const formatEventText = (event: GitHubEvent | null) => {
    if (!event) return "Active development on student-os & DevSecOps pipelines";
    const repoShort = event.repo.name.replace('Majidullask04/', '');
    if (event.type === 'PushEvent') return `Pushed commits to ${repoShort}`;
    if (event.type === 'PullRequestEvent') return `Merged Pull Request in ${repoShort}`;
    if (event.type === 'CreateEvent') return `Created repository or branch in ${repoShort}`;
    return `Updated repository ${repoShort}`;
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "recently";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900/90 via-[#0d0d0d]/90 to-neutral-950/90 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-xl overflow-hidden group"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-amber-500/15 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Github size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Live GitHub Activity Stream
              </h3>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Direct telemetry from <span className="text-amber-400">@Majidullask04</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleManualRefresh}
            title="Refresh Live GitHub Telemetry"
            className="px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin text-amber-400" : ""} />
            <span>{isRefreshed ? "Updated!" : "Sync"}</span>
          </button>

          <a
            href="https://github.com/Majidullask04"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playPop()}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <span>Visit Profile</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6 relative z-10 font-mono">
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col">
          <span className="text-2xl sm:text-3xl font-bold text-amber-400">
            {profile ? profile.public_repos : "38"}
          </span>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mt-1">Public Repos</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400">350+</span>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mt-1">Commits & PRs</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col">
          <span className="text-2xl sm:text-3xl font-bold text-cyan-400">
            {profile ? profile.followers : "7"}
          </span>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mt-1">Followers</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col">
          <span className="text-2xl sm:text-3xl font-bold text-white">100%</span>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mt-1">Open Source Rate</span>
        </div>
      </div>

      {/* Latest Activity Ticker */}
      <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <GitCommit size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
              Latest Live Activity ({timeAgo(latestEvent?.created_at)})
            </span>
            <span className="text-neutral-200 font-medium font-sans">
              {formatEventText(latestEvent)}
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <Sparkles size={12} className="text-amber-400" />
          <span>Active on <strong>student-os</strong> & <strong>K8s</strong></span>
        </div>
      </div>
    </motion.div>
  );
};
