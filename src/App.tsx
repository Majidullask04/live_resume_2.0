import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Twitter, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Copy, 
  Check, 
  Filter,
  Bot,
  Terminal,
  FileText,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Send,
  Zap,
  Phone,
  PhoneCall,
  Activity
} from 'lucide-react';
import { DATA, Project } from './data';
import { AICopilotModal } from './components/AICopilotModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ContactModal } from './components/ContactModal';
import { ResumePreviewModal } from './components/ResumePreviewModal';
import { LiveGitHubTracker } from './components/LiveGitHubTracker';
import { sound } from './components/SoundEffects';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="hidden md:flex fixed top-0 left-0 w-4 h-4 rounded-full bg-amber-500 pointer-events-none z-[100] shadow-[0_0_20px_rgba(245,158,11,0.8)]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12 md:mb-16 overflow-hidden">
    {subtitle && (
      <div className="flex items-center gap-4 mb-3">
        <div className="w-8 h-[1px] bg-amber-500" />
        <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase">{subtitle}</span>
      </div>
    )}
    <motion.h2
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white"
    >
      {title}
    </motion.h2>
  </div>
);

const getTechIcon = (tech: string) => {
  const t = tech.toLowerCase();
  if (t.includes("aws") || t.includes("s3") || t.includes("cloudfront") || t.includes("eks") || t.includes("ec2") || t.includes("iam") || t.includes("vpc") || t.includes("amplify")) return "devicon-amazonwebservices-plain text-[#FF9900]";
  if (t.includes("linux") || t.includes("ubuntu")) return "devicon-linux-plain text-white";
  if (t.includes("bash") || t.includes("shell")) return "devicon-bash-plain text-white";
  if (t.includes("terraform")) return "devicon-terraform-plain text-[#844FBA]";
  if (t.includes("docker")) return "devicon-docker-plain text-[#2496ED]";
  if (t.includes("kubernetes") || t.includes("k3s") || t.includes("helm")) return "devicon-kubernetes-plain text-[#326CE5]";
  if (t.includes("argocd") || t.includes("argo cd")) return "devicon-argocd-plain text-[#EF6C00]";
  if (t.includes("jenkins")) return "devicon-jenkins-plain text-[#D33833]";
  if (t.includes("github") || t.includes("git")) return "devicon-github-original text-white";
  if (t.includes("sonarqube")) return "devicon-sonarqube-plain text-[#4E9BCD]";
  if (t.includes("prometheus")) return "devicon-prometheus-original text-[#E6522C]";
  if (t.includes("grafana")) return "devicon-grafana-original text-[#F46800]";
  if (t.includes("python")) return "devicon-python-plain text-[#3776AB]";
  if (t.includes("java") && !t.includes("javascript")) return "devicon-java-plain text-[#ED8B00]";
  if (t.includes("javascript")) return "devicon-javascript-plain text-[#F7DF1E]";
  if (t.includes("typescript")) return "devicon-typescript-plain text-[#3178C6]";
  if (t.includes("react")) return "devicon-react-original text-[#61DAFB]";
  if (t.includes("node")) return "devicon-nodejs-plain text-[#339933]";
  if (t.includes("fastapi")) return "devicon-fastapi-plain text-[#009688]";
  if (t.includes("go") && !t.includes("gitleaks") && !t.includes("mongo")) return "devicon-go-original-wordmark text-[#00ADD8]";
  if (t.includes("mongo")) return "devicon-mongodb-plain text-[#47A248]";
  if (t.includes("mysql")) return "devicon-mysql-plain text-[#4479A1]";
  if (t.includes("nginx")) return "devicon-nginx-original text-[#009639]";
  if (t.includes("vercel")) return "devicon-vercel-original text-white";
  return null;
};

export default function App() {
  const [expandedService, setExpandedService] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTechCategory, setActiveTechCategory] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Modal Dialog States
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playOpenModal();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsAICopilotOpen(false);
        setIsCommandPaletteOpen(false);
        setIsContactOpen(false);
        setIsResumeOpen(false);
        setSelectedProjectForDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const experienceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: expScrollY } = useScroll({
    target: experienceRef,
    offset: ["start center", "end center"]
  });
  const expLineHeight = useTransform(expScrollY, [0, 1], ["0%", "100%"]);
  
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 500);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 1 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 1 });

  const nameParallaxX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [30, -30]);
  const nameParallaxY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [30, -30]);
  
  const imgParallaxX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-15, 15]);
  const imgParallaxY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-15, 15]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DATA.email);
    sound.playSuccess();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(DATA.phoneRaw);
    sound.playSuccess();
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsSoundMuted(!sound.enabled);
    if (sound.enabled) sound.playClick();
  };

  const projectCategories = ["All", "Full-Stack & AI", "DevSecOps & Cloud", "Microservices & K8s", "Open Source & CNCF"];

  const filteredProjects = DATA.projects.filter(project => {
    if (selectedCategory === "All") return true;
    return project.category === selectedCategory;
  });

  const handleOpenProjectModal = (projectId: string) => {
    const proj = DATA.projects.find(p => p.id === projectId);
    if (proj) {
      setSelectedProjectForDetail(proj);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-400 selection:bg-amber-500/30 selection:text-amber-200 cursor-default relative overflow-hidden">
      {/* Background Glow Effects & Subtle Cyber Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="absolute top-[40%] right-[-15%] w-[45%] h-[45%] rounded-full bg-cyan-500/8 blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>
      </div>
      
      <CustomCursor />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {copiedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[110] flex items-center gap-2.5 px-4 py-3 bg-amber-500 text-neutral-950 font-medium text-xs rounded-2xl shadow-xl shadow-amber-500/20 border border-amber-400 font-mono"
          >
            <Check size={16} />
            <span>Email copied to clipboard ({DATA.email})</span>
          </motion.div>
        )}
        {copiedPhone && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[110] flex items-center gap-2.5 px-4 py-3 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-2xl shadow-xl shadow-emerald-500/20 border border-emerald-400 font-mono"
          >
            <Check size={16} />
            <span>Phone copied ({DATA.phone})</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action HUD (Bottom-Right & Bottom-Left) */}
      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3">
        {/* Floating AI Resume Copilot Button */}
        <motion.button 
          onClick={() => {
            sound.playOpenModal();
            setIsAICopilotOpen(true);
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-2.5 px-4 sm:px-5 py-3.5 bg-neutral-900/90 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 backdrop-blur-md border border-amber-500/40 hover:border-amber-400 rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all group cursor-pointer active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 group-hover:bg-neutral-950"></span>
          </span>
          <Bot size={16} className="text-amber-400 group-hover:text-neutral-950" />
          <span className="text-xs font-mono font-bold tracking-wide uppercase">AI Resume Copilot</span>
        </motion.button>
      </div>

      {/* Bottom Left Utility HUD */}
      <div className="fixed bottom-6 left-6 z-[100] hidden sm:flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            setIsCommandPaletteOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-400 hover:text-white text-xs font-mono backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          <Terminal size={13} className="text-amber-500" />
          <span>Cmd + K</span>
        </button>

        <a
          href={`tel:${DATA.phoneRaw}`}
          onClick={handleCopyPhone}
          title={`Call or Copy Phone: ${DATA.phone}`}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900/80 hover:bg-emerald-500/20 border border-neutral-800 hover:border-emerald-500/50 text-neutral-400 hover:text-emerald-300 text-xs font-mono backdrop-blur-md transition-all cursor-pointer"
        >
          <Phone size={13} className="text-emerald-400" />
          <span>{DATA.phone}</span>
        </a>

        <button
          onClick={toggleSound}
          title={isSoundMuted ? "Unmute sound effects" : "Mute sound effects"}
          className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-400 backdrop-blur-md transition-all cursor-pointer"
        >
          {isSoundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
      
      {/* Header Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 flex justify-between items-center backdrop-blur-md bg-neutral-950/70 border-b border-neutral-800/50"
      >
        <div className="flex items-center gap-3">
          <a href="#landing" className="font-display font-bold text-white tracking-tight text-lg hover:text-amber-400 transition-colors flex items-center gap-2">
            <span>{DATA.name.toUpperCase()}</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hidden sm:inline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE GITHUB 2.0
            </span>
          </a>
        </div>

        <div className="hidden lg:flex space-x-7 text-xs uppercase tracking-widest font-semibold font-mono text-neutral-400">
          <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
          <a href="#github-live" className="hover:text-amber-400 transition-colors">GitHub Live</a>
          <a href="#services" className="hover:text-amber-400 transition-colors">Capabilities</a>
          <a href="#experience" className="hover:text-amber-400 transition-colors">Experience</a>
          <a href="#work" className="hover:text-amber-400 transition-colors">Projects</a>
          <a href="#skills" className="hover:text-amber-400 transition-colors">Tech Stack</a>
          <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Phone Call Trigger */}
          <a 
            href={`tel:${DATA.phoneRaw}`}
            onClick={handleCopyPhone}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 px-3 py-1.5 rounded-xl transition-all bg-emerald-950/30 cursor-pointer"
          >
            <Phone size={13} />
            <span>{DATA.phone}</span>
          </a>

          {/* ATS Resume View Trigger */}
          <button 
            onClick={() => {
              sound.playClick();
              setIsResumeOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white border border-neutral-800 hover:border-amber-500/50 px-3 py-1.5 rounded-xl transition-all bg-neutral-900/60 hover:bg-neutral-800 cursor-pointer"
          >
            <FileText size={13} className="text-amber-400" />
            <span className="hidden sm:inline">Resume</span>
          </button>

          {/* Contact Dialogue Trigger */}
          <button 
            onClick={() => {
              sound.playClick();
              setIsContactOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-950 font-bold bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
          >
            <Send size={12} />
            <span>Connect</span>
          </button>
        </div>
      </motion.nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col gap-28 md:gap-40">
        
        {/* Landing Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[85vh] pt-6 overflow-visible z-10 w-full" id="landing">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none flex flex-col items-center justify-center overflow-visible">
            <motion.h1 
              style={{ x: nameParallaxX, y: nameParallaxY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14vw] md:text-[11vw] font-display font-bold tracking-tighter leading-none text-neutral-800/70 whitespace-nowrap select-none uppercase"
            >
              {DATA.name}
            </motion.h1>
          </div>
          
          <motion.div 
            style={{ x: imgParallaxX, y: imgParallaxY }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg md:max-w-2xl flex justify-center items-end mt-8 md:mt-0"
          >
            <motion.img 
              src="/profile.png" 
              alt="Profile" 
              className="w-full h-auto max-h-[68vh] object-contain object-bottom drop-shadow-[0_0_60px_rgba(245,158,11,0.2)] relative z-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Majidulla+SK&background=0a0a0a&color=fbbf24&size=512";
              }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/20 blur-[110px] rounded-full z-0 pointer-events-none"></div>
            <div className="absolute bottom-[-2px] left-0 w-full h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent z-20 pointer-events-none"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 mt-[-3.5rem] md:mt-[-4.5rem] text-center flex flex-col items-center gap-2"
          >
             <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-lg">
                <Sparkles size={12} />
                <span>AI Full-Stack • Cloud Infrastructure • DevSecOps</span>
             </div>
             
             <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-none mt-2">
                {DATA.title}
             </h2>

             {/* Hero Action Buttons & Direct Channels */}
             <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    sound.playOpenModal();
                    setIsAICopilotOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Bot size={15} />
                  <span>Interview AI Copilot</span>
                </button>

                <a
                  href={`tel:${DATA.phoneRaw}`}
                  onClick={() => sound.playPop()}
                  className="px-5 py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-mono text-xs uppercase tracking-wider border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Phone size={15} />
                  <span>Direct: {DATA.phone}</span>
                </a>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsResumeOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider border border-neutral-800 hover:border-amber-500/50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText size={15} className="text-amber-400" />
                  <span>Resume PDF</span>
                </button>
             </div>
          </motion.div>
        </section>

        {/* Live GitHub Telemetry Section */}
        <section id="github-live" className="py-2">
          <LiveGitHubTracker />
        </section>

        {/* About Section */}
        <section id="about" className="py-12 md:py-20 border-b border-neutral-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-amber-500" />
                <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase">Engineering Trajectory</span>
              </div>
              <h2 className="text-[3rem] md:text-5xl lg:text-[4.5rem] font-bold text-white tracking-tight leading-[1.08]">
                I don't just deploy <br />
                <span className="font-serif italic text-amber-500 font-medium tracking-normal">infrastructure</span>—I engineer <br />
                <span className="font-serif italic text-amber-500 font-medium tracking-normal">resilient delivery platforms</span> <br />
                and intelligent software.
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 flex flex-col justify-center lg:mt-8"
            >
              <div className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8 whitespace-pre-line">
                {DATA.about}
              </div>

              <div className="w-full h-px bg-neutral-800/60 mb-8" />

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
                }}
                className="grid grid-cols-2 gap-4 md:gap-6"
              >
                {DATA.stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    className="flex flex-col p-4 bg-neutral-900/40 border border-neutral-800/70 rounded-2xl hover:border-amber-500/40 transition-colors"
                  >
                    <span className="text-2xl md:text-3xl font-bold font-mono text-amber-400 mb-1">{stat.value}</span>
                    <span className="text-white text-xs font-semibold leading-snug">{stat.label}</span>
                    <span className="text-neutral-500 text-[10px] font-mono mt-0.5">{stat.change}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities / Services */}
        <section id="services" className="py-12 md:py-20 border-b border-neutral-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
            <div className="lg:col-span-5 h-fit lg:sticky lg:top-36">
              <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase block mb-4">Core Capabilities</span>
              <h2 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-black italic tracking-tighter leading-[0.88]">
                <span className="text-white">WHAT</span>
                <br />
                <span className="text-amber-500">I BUILD</span>
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-6 max-w-sm leading-relaxed">
                Click or hover each capability to inspect full engineering stack and tools.
              </p>
            </div>
            
            <div className="lg:col-span-7 flex flex-col gap-6">
              {DATA.services.map((service, idx) => {
                const isExpanded = expandedService === idx;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    onMouseEnter={() => setExpandedService(idx)}
                    onClick={() => {
                      sound.playClick();
                      setExpandedService(isExpanded ? null : idx);
                    }}
                    className="group relative flex flex-col p-8 md:p-10 border border-dashed border-neutral-700/60 bg-[#0a0a0a]/60 transition-all hover:border-amber-500/50 cursor-pointer rounded-2xl"
                  >
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] -translate-y-[2px]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] -translate-y-[2px]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] translate-y-[2px]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] translate-y-[2px]" />
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight group-hover:text-amber-300 transition-colors">{service.title}</h3>
                    <p className="text-neutral-500 text-xs font-mono tracking-widest uppercase mb-4">{service.subtitle}</p>
                    
                    <div className="relative">
                      <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? "auto" : "50px" }}
                        className="overflow-hidden"
                      >
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-[90%] md:max-w-[85%]">
                          {service.description}
                        </p>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-6 pt-4 border-t border-neutral-800/80"
                            >
                              <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">Key Technologies</p>
                              <div className="flex flex-wrap gap-2">
                                {service.skills.map((skill, i) => (
                                  <span key={i} className="px-3 py-1 bg-neutral-900 text-neutral-300 rounded-lg text-xs font-mono border border-neutral-800">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
                      )}
                    </div>

                    <div className="absolute bottom-8 right-8 w-8 h-8 flex items-center justify-center border border-neutral-700/50 rounded-xl transition-colors group-hover:border-amber-500 text-neutral-500 group-hover:text-white bg-[#0a0a0a]">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="experience" ref={experienceRef} className="py-12 md:py-20 border-b border-neutral-900">
          <div className="text-center mb-16">
            <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase block mb-3">Career Path</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight">
              My journey & <br />
              <span className="text-amber-500">experience</span>
            </h2>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 md:px-0">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800/50 -translate-x-1/2" />
            
            <motion.div 
              style={{ height: expLineHeight }}
              className="hidden md:block absolute left-1/2 top-0 w-px bg-gradient-to-b from-transparent via-amber-500 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-20 -translate-x-1/2"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,1)]" />
            </motion.div>

            <div className="flex flex-col gap-16 md:gap-24 relative z-10">
              {DATA.experience.map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col md:flex-row items-start md:items-center w-full relative"
                >
                  <div className="w-full md:w-1/2 flex flex-col md:flex-row md:items-center justify-between pr-0 md:pr-12 gap-3 md:gap-6 mb-4 md:mb-0">
                    <div className="flex flex-col gap-1 md:max-w-[70%]">
                      <h3 className="text-xl font-bold text-white leading-snug">{exp.role}</h3>
                      <p className="text-amber-500 font-mono text-xs uppercase tracking-widest">{exp.company}</p>
                    </div>
                    <div className="text-2xl md:text-3xl font-mono font-semibold text-neutral-300 shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] z-10" />

                  <div className="w-full md:w-1/2 pl-0 md:pl-12">
                    <div className="text-neutral-400 text-sm md:text-base leading-relaxed bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800/60 flex flex-col gap-3">
                      <p>{exp.description}</p>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1 pt-2 border-t border-neutral-800/70 text-xs font-mono text-neutral-300">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500">▹</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition / Certifications */}
        <section className="py-12 md:py-20 border-b border-neutral-900">
          <SectionHeader title="Recognition & Certifications" subtitle="Credentials" />
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {DATA.recognition.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                whileHover={{ scale: 1.01 }}
                className="p-6 md:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-display font-medium text-neutral-700 group-hover:text-amber-500/40 transition-colors">
                      {item.id}
                    </span>
                    <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {item.award}
                    </span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">{item.title}</h4>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-mono mb-4">{item.event}</p>
                  <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-amber-500/40 pl-3 py-0.5">
                    "{item.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center justify-between">
                  <span>Category: {item.meta}</span>
                  <span className="text-amber-500/80">Verified</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Portfolio / Projects */}
        <section id="work" className="py-12 md:py-20 border-b border-neutral-900">
          <div className="flex flex-col items-start mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-amber-500" />
              <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase">Architecture & Systems</span>
            </div>
            
            <div className="flex w-full flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-[3.2rem] md:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05]">
                Featured <span className="font-serif italic text-amber-500 font-medium tracking-normal">Projects</span> & <br />
                <span className="font-serif italic text-amber-500 font-medium tracking-normal">Implementations.</span>
              </h2>
              <a href={DATA.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-neutral-400 hover:text-amber-400 transition-colors pb-2 border-b border-neutral-800 hover:border-amber-500 w-fit">
                GitHub Repositories ({DATA.stats[0].value}) <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-neutral-800/60">
            {projectCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20"
                    : "bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <motion.div 
            layout
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                key={project.id + project.title}
                variants={{
                  hidden: { opacity: 0, scale: 0.95, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="group relative flex flex-col p-8 border border-dashed border-neutral-700/60 bg-[#0a0a0a]/60 hover:border-amber-500/50 transition-colors duration-500 overflow-hidden rounded-3xl justify-between"
              >
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] -translate-y-[2px]" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] -translate-y-[2px]" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] translate-y-[2px]" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] translate-y-[2px]" />

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-sm font-mono text-amber-500 font-bold">#{project.id}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-3 group-hover:text-amber-200 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Highlights if available */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div className="mb-6 p-3.5 bg-neutral-950/70 rounded-2xl border border-neutral-800/60 text-xs font-mono text-neutral-300 space-y-1.5">
                      {project.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-400">▹</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-neutral-800/60">
                    {project.tools.map((tool, i) => (
                      <span key={i} className="px-2.5 py-1 bg-neutral-900 text-neutral-300 rounded-lg text-[11px] font-mono border border-neutral-800">
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                    {/* Deep-Dive Inspection Dialogue Trigger */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedProjectForDetail(project);
                      }}
                      className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs font-mono uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Layers size={13} />
                      <span>Inspect Architecture</span>
                    </button>

                    <a
                      href={project.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sound.playPop()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-mono uppercase tracking-wider border border-neutral-800 hover:border-amber-500/40 transition-all"
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
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
                      >
                        <ExternalLink size={14} />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Tech Stack & Expertise */}
        <section id="skills" className="py-12 md:py-20">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-amber-500" />
              <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase">Core Tech Stack</span>
              <div className="w-8 h-px bg-amber-500" />
            </div>
            
            <h2 className="text-[3.2rem] md:text-[5rem] font-bold tracking-tight text-white leading-[1.05]">
              Tools of the <span className="font-serif italic text-amber-500 font-medium tracking-normal">trade.</span>
            </h2>
          </div>

          {/* Categorized Tech Stack Tabs */}
          <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {DATA.categorizedTechStack.map((group, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setActiveTechCategory(idx);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                  activeTechCategory === idx
                    ? "bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {group.category}
              </button>
            ))}
          </div>

          <motion.div 
            key={activeTechCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto"
          >
            {DATA.categorizedTechStack[activeTechCategory].skills.map((tech, i) => (
              <motion.span 
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2.5 px-4 py-3 bg-neutral-900/90 border border-neutral-800 rounded-xl text-sm font-mono font-medium text-neutral-200 hover:text-white hover:border-amber-500/50 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-default"
              >
                {getTechIcon(tech) ? (
                  <i className={`text-lg ${getTechIcon(tech)}`}></i>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-500 opacity-80"></span>
                )}
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </section>

      </main>

      {/* Footer & Contact Section */}
      <footer 
        id="contact" 
        className="relative pt-24 pb-16 px-6 overflow-hidden border-t border-neutral-900 bg-neutral-950"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        {/* Large Ambient Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-full text-center z-0 pointer-events-none select-none">
           <h1 className="text-[13vw] font-display font-bold tracking-tighter leading-[0.85] text-[#0d0d0d] uppercase">
             {DATA.name.split(' ').map((part, i) => <React.Fragment key={i}>{part}<br/></React.Fragment>)}
           </h1>
           <h1 
             className="absolute inset-0 text-[13vw] font-display font-bold tracking-tighter leading-[0.85] text-[#1a1a1a] uppercase opacity-40"
             style={{
                WebkitMaskImage: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
                maskImage: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)'
             }}
           >
             {DATA.name.split(' ').map((part, i) => <React.Fragment key={i}>{part}<br/></React.Fragment>)}
           </h1>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col relative z-10">
          
          {/* Main CTA Heading */}
          <div className="flex flex-col items-start mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-amber-500" />
              <span className="text-amber-500 text-xs font-mono font-bold tracking-[0.3em] uppercase">Initiate Contact</span>
            </div>
            
            <h2 className="text-[3.5rem] md:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05] mb-8">
              Let's build <span className="font-serif italic text-amber-500 font-medium tracking-normal">intelligent software</span><br />
              worth shipping.
            </h2>

            {/* Direct Connect Pills */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <button 
                onClick={() => {
                  sound.playOpenModal();
                  setIsContactOpen(true);
                }}
                className="inline-flex items-center gap-4 px-8 py-5 rounded-full border border-amber-500/40 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all bg-neutral-900/80 backdrop-blur-sm group cursor-pointer"
              >
                <span className="text-xl md:text-3xl text-white font-medium">{DATA.email}</span>
                <ArrowUpRight className="text-neutral-500 group-hover:text-amber-500 transition-colors" size={24} />
              </button>

              <a 
                href={`tel:${DATA.phoneRaw}`}
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-3 px-6 py-5 rounded-full border border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all bg-emerald-950/40 backdrop-blur-sm text-emerald-300 group cursor-pointer"
                title="Direct Phone Line / WhatsApp"
              >
                <Phone size={22} className="text-emerald-400" />
                <span className="text-lg md:text-xl font-mono font-bold text-white">{DATA.phone}</span>
              </a>

              <button 
                onClick={handleCopyEmail}
                className="p-5 rounded-full border border-neutral-800 hover:border-amber-500/50 bg-neutral-900/80 text-neutral-400 hover:text-amber-400 transition-all shadow-md cursor-pointer"
                title="Copy Email"
              >
                <Copy size={24} />
              </button>
            </div>
          </div>

          {/* Grid Metadata Row */}
          <div className="border-y border-neutral-800/60 py-8 mb-12 bg-neutral-900/30 backdrop-blur-md rounded-2xl px-6 md:px-8 border border-neutral-800/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-mono font-bold">Status</span>
                <p className="flex items-center gap-2 text-white text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {DATA.status}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-mono font-bold">Location</span>
                <p className="text-white text-xs font-medium">{DATA.location}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-mono font-bold">Direct Phone</span>
                <p className="text-emerald-400 text-xs font-mono font-bold">{DATA.phone}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-mono font-bold">Open To</span>
                <p className="text-white text-xs font-medium">{DATA.availability}</p>
              </div>
            </div>
          </div>

          {/* Navigation & Statement Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/60">
            {/* Mission Statement */}
            <div className="md:col-span-6 flex flex-col gap-3 pr-4">
              <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold">Mission & Trajectory</span>
              <p className="text-neutral-400 text-sm md:text-base italic font-serif leading-relaxed">
                Building full-stack web applications with <span className="font-sans font-medium text-white not-italic">React, Node.js, Express & MongoDB</span>, while expanding into <span className="font-sans font-medium text-amber-400 not-italic">Machine Learning & AI</span> and production cloud infrastructure — quiet, focused, and deeply technical.
              </p>
            </div>
            
            {/* Quick Links Column */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">Navigation</span>
              <a href="#about" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-32 py-1 border-b border-neutral-900 hover:border-neutral-700">
                About <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href="#github-live" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-32 py-1 border-b border-neutral-900 hover:border-neutral-700">
                GitHub Live <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href="#services" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-32 py-1 border-b border-neutral-900 hover:border-neutral-700">
                Capabilities <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href="#experience" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-32 py-1 border-b border-neutral-900 hover:border-neutral-700">
                Experience <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href="#work" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-32 py-1 border-b border-neutral-900 hover:border-neutral-700">
                Projects <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
            </div>

            {/* Socials & Connect Column */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">Connect</span>
              <a href={DATA.links.github} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-36 py-1 border-b border-neutral-900 hover:border-neutral-700">
                <span className="flex items-center gap-1.5"><Github size={12} /> GitHub ({DATA.stats[0].value})</span> <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href={DATA.links.linkedin} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-amber-400 transition-colors text-xs font-mono flex items-center justify-between w-36 py-1 border-b border-neutral-900 hover:border-neutral-700">
                <span className="flex items-center gap-1.5"><Linkedin size={12} /> LinkedIn</span> <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href={`tel:${DATA.phoneRaw}`} className="text-neutral-400 hover:text-emerald-400 transition-colors text-xs font-mono flex items-center justify-between w-36 py-1 border-b border-neutral-900 hover:border-neutral-700">
                <span className="flex items-center gap-1.5"><Phone size={12} className="text-emerald-400" /> {DATA.phoneRaw}</span> <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
            </div>
          </div>

          {/* Copyright & Scroll to Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 text-[10px] tracking-[0.2em] font-mono text-neutral-500 uppercase">
            <div>
              &copy; {new Date().getFullYear()} {DATA.name} • LIVE RESUME 2.0 • {DATA.phone}
            </div>
            <div className="flex items-center gap-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer"
              >
                BACK TO TOP &uarr;
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Modals */}
      <AICopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        onOpenContact={() => {
          setIsAICopilotOpen(false);
          setIsContactOpen(true);
        }}
        onOpenProject={handleOpenProjectModal}
      />

      <ProjectDetailModal
        project={selectedProjectForDetail}
        isOpen={!!selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAI={() => setIsAICopilotOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onSelectProject={handleOpenProjectModal}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ResumePreviewModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
