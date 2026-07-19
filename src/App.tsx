import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Twitter, ChevronDown, ChevronUp } from 'lucide-react';
import { DATA } from './data';

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

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-12 md:mb-16 overflow-hidden">
    <motion.h2
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white"
    >
      {title}
    </motion.h2>
  </div>
);

const getTechIcon = (tech: string) => {
  const t = tech.toLowerCase();
  if (t.includes("aws") || t.includes("s3") || t.includes("cloudfront") || t.includes("eks")) return "devicon-amazonwebservices-plain text-[#FF9900]";
  if (t.includes("linux")) return "devicon-linux-plain text-white";
  if (t.includes("bash")) return "devicon-bash-plain text-white";
  if (t.includes("terraform")) return "devicon-terraform-plain text-[#844FBA]";
  if (t.includes("docker")) return "devicon-docker-plain text-[#2496ED]";
  if (t.includes("kubernetes") || t.includes("k3s") || t.includes("helm") || t.includes("argocd")) return "devicon-kubernetes-plain text-[#326CE5]";
  if (t.includes("jenkins")) return "devicon-jenkins-plain text-[#D33833]";
  if (t.includes("github") || t.includes("git")) return "devicon-github-original text-white";
  if (t.includes("sonarqube")) return "devicon-sonarqube-plain text-[#4E9BCD]";
  if (t.includes("prometheus")) return "devicon-prometheus-original text-[#E6522C]";
  if (t.includes("grafana")) return "devicon-grafana-original text-[#F46800]";
  if (t.includes("python")) return "devicon-python-plain text-[#3776AB]";
  if (t.includes("javascript")) return "devicon-javascript-plain text-[#F7DF1E]";
  if (t.includes("typescript")) return "devicon-typescript-plain text-[#3178C6]";
  if (t.includes("react")) return "devicon-react-original text-[#61DAFB]";
  if (t.includes("node")) return "devicon-nodejs-plain text-[#339933]";
  if (t.includes("mongo")) return "devicon-mongodb-plain text-[#47A248]";
  if (t.includes("nginx")) return "devicon-nginx-original text-[#009639]";
  return null;
};

export default function App() {
  const [expandedService, setExpandedService] = useState<number | null>(1);
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

  // Move in opposite directions for parallax depth
  const nameParallaxX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [30, -30]);
  const nameParallaxY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [30, -30]);
  
  const imgParallaxX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-15, 15]);
  const imgParallaxY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-15, 15]);

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-400 selection:bg-amber-500/30 selection:text-amber-200 cursor-default relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <CustomCursor />
      
      {/* Floating Resume Button */}
      <motion.a 
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 hover:border-amber-500/50 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors tracking-wide">View Resume</span>
      </motion.a>
      
      {/* Navbar / Header */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-neutral-950/50 border-b border-neutral-800/50"
      >
        <div className="font-display font-medium text-neutral-200 tracking-tight text-lg">
          {DATA.name.toUpperCase()}
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-neutral-400">
          <a href="#about" className="hover:text-neutral-200 transition-colors">About</a>
          <a href="#work" className="hover:text-neutral-200 transition-colors">Work</a>
          <a href="#contact" className="hover:text-neutral-200 transition-colors">Contact</a>
        </div>
      </motion.nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col gap-32 md:gap-48">
        
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center min-h-[85vh] pt-10 overflow-visible z-10 w-full" id="landing">
          {/* Big Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none flex flex-col items-center justify-center overflow-visible">
            <motion.h1 
              style={{ x: nameParallaxX, y: nameParallaxY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14vw] md:text-[11vw] font-display font-bold tracking-tighter leading-none text-neutral-800/80 whitespace-nowrap select-none uppercase"
            >
              {DATA.name}
            </motion.h1>
          </div>
          
          {/* Center Portrait */}
          <motion.div 
            style={{ x: imgParallaxX, y: imgParallaxY }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg md:max-w-2xl flex justify-center items-end mt-12 md:mt-0"
          >
            {/* The user can upload their cutout image to public/profile.png */}
            <motion.img 
              src="/profile.png" 
              alt="Profile" 
              className="w-full h-auto max-h-[70vh] object-contain object-bottom drop-shadow-[0_0_60px_rgba(245,158,11,0.15)] relative z-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Majidulla+SK&background=0a0a0a&color=fbbf24&size=512";
              }}
            />
            
            {/* Ambient Glow Behind Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

            {/* Fog / Fade at the bottom */}
            <div className="absolute bottom-[-2px] left-0 w-full h-32 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent z-20 pointer-events-none"></div>
          </motion.div>

          {/* Bottom Title overlapping the fade */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 mt-[-4rem] md:mt-[-5rem] text-center flex flex-col items-center gap-1"
          >
             <p className="text-amber-500 font-serif italic text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase">
                I am an
             </p>
             <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-none mt-2">
                {DATA.title}
             </h2>
          </motion.div>
        </section>

        {/* About */}
        <section id="about" className="py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left Column - Massive Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-amber-500" />
                <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">About Me</span>
              </div>
              <h2 className="text-[3.5rem] md:text-6xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.05]">
                I don't just deploy <br />
                <span className="font-serif italic text-amber-500 font-medium tracking-normal">infrastructure</span>—I build the <br />
                <span className="font-serif italic text-amber-500 font-medium tracking-normal">platforms</span> around <br />
                them.
              </h2>
            </motion.div>

            {/* Right Column - Bio and Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 flex flex-col justify-center lg:mt-20"
            >
              <div className="text-neutral-400 text-sm md:text-base leading-relaxed mb-12 whitespace-pre-line">
                {DATA.about}
              </div>

              <div className="w-full h-px bg-neutral-800/50 mb-8" />

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                }}
                className="flex flex-wrap gap-8 md:gap-12"
              >
                {DATA.stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    className="flex flex-col"
                  >
                    <span className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">{stat.value}</span>
                    <span className="text-neutral-500 uppercase tracking-widest text-[10px] md:text-xs font-semibold max-w-[120px] leading-snug">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What I Do */}
        <section className="py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
            {/* Left sticky column */}
            <div className="lg:col-span-5 h-fit lg:sticky lg:top-48">
              <h2 className="text-[5rem] md:text-[7rem] lg:text-[8rem] font-black italic tracking-tighter leading-[0.85]">
                <span className="text-white">W HAT</span>
                <br />
                <span className="text-amber-500">I DO</span>
              </h2>
            </div>
            
            {/* Right accordion column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {DATA.services.map((service, idx) => {
                const isExpanded = expandedService === idx;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onMouseEnter={() => setExpandedService(idx)}
                    onMouseLeave={() => setExpandedService(null)}
                    className="group relative flex flex-col p-8 md:p-10 border border-dashed border-neutral-700/50 bg-[#0a0a0a]/50 transition-colors hover:border-neutral-500/50"
                  >
                    {/* Glowing Corners */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] -translate-y-[2px]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] -translate-y-[2px]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] translate-y-[2px]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] translate-y-[2px]" />
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">{service.title}</h3>
                    <p className="text-neutral-500 text-sm mb-6">{service.subtitle}</p>
                    
                    <div className="relative">
                      <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? "auto" : "44px" }}
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
                              className="mt-8"
                            >
                              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">Skillset & Tools</p>
                              <div className="flex flex-wrap gap-2">
                                {service.skills.map((skill, i) => (
                                  <span key={i} className="px-3 py-1.5 bg-[#1a1a1a] text-neutral-300 rounded-full text-[11px] font-medium border border-neutral-800 transition-colors duration-300">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      
                      {/* Gradient overlay when collapsed to fade out text */}
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* Chevron Button */}
                    <div className="absolute bottom-8 right-8 w-8 h-8 flex items-center justify-center border border-neutral-700/50 rounded transition-colors group-hover:border-neutral-500 text-neutral-500 group-hover:text-white bg-[#0a0a0a]">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section ref={experienceRef} className="py-24">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-display font-medium text-white tracking-tight">
              My journey & <br />
              <span className="text-amber-500">experience</span>
            </h2>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 md:px-0">
            {/* Continuous background line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800/50 -translate-x-1/2" />
            
            {/* Animated glowing line that maps perfectly to scroll */}
            <motion.div 
              style={{ height: expLineHeight }}
              className="hidden md:block absolute left-1/2 top-0 w-px bg-gradient-to-b from-transparent via-amber-500 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-20 -translate-x-1/2"
            >
              {/* Glowing dot at the tip of the line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,1)]" />
            </motion.div>

            <div className="flex flex-col gap-20 md:gap-32 relative z-10">
              {DATA.experience.map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col md:flex-row items-start md:items-center w-full relative"
                >
                  {/* Left Side: Role, Company & Date */}
                  <div className="w-full md:w-1/2 flex flex-col md:flex-row md:items-center justify-between pr-0 md:pr-12 gap-4 md:gap-8 mb-6 md:mb-0">
                    <div className="flex flex-col gap-2 md:max-w-[70%]">
                      <h3 className="text-2xl font-bold text-white leading-snug">{exp.role}</h3>
                      <p className="text-amber-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">{exp.company}</p>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-widest shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  {/* Timeline Dot for this item */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] z-10" />

                  {/* Right Side: Description */}
                  <div className="w-full md:w-1/2 pl-0 md:pl-12">
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-[90%]">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition */}
        <section>
          <SectionHeader title="Recognition" />
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="flex flex-col gap-6"
          >
            {DATA.recognition.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                whileHover={{ scale: 1.02 }}
                className="glass-panel p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-12 group hover:border-amber-500/30 transition-all duration-500 hover:bg-neutral-900/80 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                <div className="md:w-1/4 shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-4 relative z-10">
                  <span className="text-5xl md:text-6xl font-display font-medium text-neutral-800 group-hover:text-amber-500/20 transition-colors duration-500">
                    {item.id}
                  </span>
                  <div className="text-right md:text-left">
                    <span className="block text-amber-500 font-medium uppercase tracking-wider text-xs md:text-sm mb-1">{item.award}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-6 justify-center flex-grow relative z-10">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-display font-medium text-white mb-3 group-hover:text-amber-100 transition-colors duration-300">{item.title}</h4>
                    <p className="text-neutral-500 text-sm tracking-wide uppercase">{item.event}</p>
                  </div>
                  <blockquote className="border-l-2 border-neutral-700 group-hover:border-amber-500 pl-4 py-1 text-neutral-300 italic text-lg transition-colors duration-300">
                    "{item.quote}"
                  </blockquote>
                  <p className="text-xs font-mono text-neutral-500">
                    — {item.meta}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Projects */}
        <section id="work" className="py-24 md:py-32">
          <div className="flex flex-col items-start mb-16 md:mb-24">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-px bg-amber-500" />
              <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">Portfolio</span>
            </div>
            
            <div className="flex w-full flex-col md:flex-row md:items-end justify-between gap-8">
              <h2 className="text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold tracking-tight text-white leading-[1.05]">
                My <span className="font-serif italic text-amber-500 font-medium tracking-normal">selected</span><br />
                works.
              </h2>
              <a href={DATA.links.github} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors pb-4 border-b border-transparent hover:border-white w-fit">
                See All Works <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {DATA.projects.map((project, idx) => (
                <motion.a 
                  key={idx}
                  href={project.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex flex-col p-8 md:p-10 border border-dashed border-neutral-700/50 bg-[#0a0a0a]/50 hover:border-neutral-500/50 transition-colors duration-500 overflow-hidden"
                >
                  {/* Glowing Corners */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] -translate-y-[2px]" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] -translate-y-[2px]" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[3px] border-l-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] -translate-x-[2px] translate-y-[2px]" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] translate-x-[2px] translate-y-[2px]" />

                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex justify-between items-start mb-16 md:mb-32 relative z-10">
                    <span className="text-xl font-mono text-neutral-600 group-hover:text-amber-500/50 transition-colors duration-500">{project.id}</span>
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-amber-500 transition-colors bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800 group-hover:border-neutral-700">
                      {project.linkText}
                    </span>
                  </div>
                  
                  <div className="mt-auto relative z-10">
                    <p className="text-xs font-bold tracking-[0.2em] text-amber-500 uppercase mb-4">{project.category}</p>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-8 group-hover:text-amber-100 transition-colors">{project.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-800/50">
                      {project.tools.map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#1a1a1a] text-neutral-300 rounded-full text-[11px] font-medium border border-neutral-800 transition-colors duration-300 group-hover:border-neutral-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.a>
            ))}
          </motion.div>
          
          <a href={DATA.links.github} target="_blank" rel="noreferrer" className="md:hidden flex items-center justify-center gap-2 mt-12 text-neutral-400 hover:text-white transition-colors py-4 border border-dashed border-neutral-700 bg-[#0a0a0a]/50">
            See All Works <ArrowUpRight size={16} />
          </a>
        </section>

        {/* Tech Stack */}
        <section className="py-24 md:py-32">
          <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-8 h-px bg-amber-500" />
              <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">Expertise</span>
              <div className="w-8 h-px bg-amber-500" />
            </div>
            
            <h2 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold tracking-tight text-white leading-[1.05]">
              Tools of the <span className="font-serif italic text-amber-500 font-medium tracking-normal">trade.</span>
            </h2>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="flex flex-wrap gap-3 md:gap-4 justify-center"
          >
            {DATA.techStack.map((tech, i) => (
              <motion.span 
                key={i} 
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                whileHover={{ scale: 1.1, rotate: (i % 2 === 0 ? 3 : -3) }}
                className="flex items-center gap-2.5 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm md:text-base font-mono font-medium text-neutral-300 hover:text-white hover:border-amber-500/40 transition-all cursor-default hover:bg-neutral-800 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                {getTechIcon(tech) ? (
                  <i className={`text-lg ${getTechIcon(tech)}`}></i>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-80"></span>
                )}
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </section>

      </main>

      {/* Footer / CTA */}
      <footer 
        id="contact" 
        className="relative pt-32 pb-16 px-6 overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      >
        {/* Giant Watermark Name with Spotlight Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-full text-center z-0 pointer-events-none select-none">
           <h1 className="text-[13vw] font-display font-bold tracking-tighter leading-[0.85] text-[#0a0a0a] uppercase">
             {DATA.name.split(' ').map((part, i) => <React.Fragment key={i}>{part}<br/></React.Fragment>)}
           </h1>
           <h1 
             className="absolute inset-0 text-[13vw] font-display font-bold tracking-tighter leading-[0.85] text-[#1a1a1a] uppercase"
             style={{
                WebkitMaskImage: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
                maskImage: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)'
             }}
           >
             {DATA.name.split(' ').map((part, i) => <React.Fragment key={i}>{part}<br/></React.Fragment>)}
           </h1>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col relative z-10">
          
          <div className="flex flex-col items-start mb-24">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-px bg-amber-500" />
              <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">Get in touch</span>
            </div>
            
            <h2 className="text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold tracking-tight text-white leading-[1.05] mb-16">
              Let's build <span className="font-serif italic text-amber-500 font-medium tracking-normal">something</span><br />
              worth shipping.
            </h2>
            
            <a href={`mailto:${DATA.email}`} className="inline-flex items-center gap-6 px-8 py-5 md:px-12 md:py-6 rounded-full border border-amber-500/40 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all bg-neutral-950/50 backdrop-blur-sm group">
              <span className="text-2xl md:text-4xl text-white font-medium">{DATA.email}</span>
              <ArrowUpRight className="text-neutral-500 group-hover:text-amber-500 transition-colors" size={28} />
            </a>
          </div>

          <div className="flex justify-center w-full mb-16">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
          </div>
          
          {/* Data Grid */}
          <div className="border-y border-neutral-800/50 py-12 mb-12 bg-neutral-950/30 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {/* Col 1 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold">Status</span>
                <p className="flex items-center gap-2 text-white text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {DATA.status}
                </p>
              </div>
              {/* Col 2 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold">Based in</span>
                <p className="text-white text-sm font-medium">{DATA.location}</p>
              </div>
              {/* Col 3 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold">Local Time</span>
                <p className="text-white text-sm font-medium">{new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' })} IST</p>
              </div>
              {/* Col 4 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold">Open to</span>
                <p className="text-white text-sm font-medium">{DATA.availability}</p>
              </div>
            </div>
          </div>

          {/* Footer Base */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pt-4 pb-16">
            {/* The Studio */}
            <div className="md:col-span-6 flex flex-col gap-3 pr-8">
              <p className="text-neutral-400 text-sm md:text-base italic font-serif leading-relaxed">
                A solo practice for <span className="font-sans font-medium text-white not-italic">AI engineering</span> and full-stack product work — quiet,<br/>focused, and deeply technical.
              </p>
            </div>
            
            {/* Nav Column 1 */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <a href="#about" className="text-neutral-400 hover:text-white transition-colors text-sm text-left flex items-center justify-between w-24">
                About <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href="#work" className="text-neutral-400 hover:text-white transition-colors text-sm text-left flex items-center justify-between w-24">
                Work <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <button className="text-neutral-400 hover:text-white transition-colors text-sm text-left flex items-center justify-between w-24 cursor-not-allowed opacity-50">
                Gallery <ArrowUpRight size={12} className="text-neutral-600" />
              </button>
              <a href="#contact" className="text-neutral-400 hover:text-white transition-colors text-sm text-left flex items-center justify-between w-24">
                Contact <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
            </div>
            
            {/* Nav Column 2 */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <a href={DATA.links.linkedin} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center justify-between w-28">
                LinkedIn <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
              <a href={DATA.links.twitter} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center justify-between w-28">
                X / Twitter <ArrowUpRight size={12} className="text-neutral-600" />
              </a>
            </div>
          </div>
          
          {/* Very Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-neutral-800/30 text-[10px] tracking-[0.2em] font-mono text-neutral-600 uppercase">
            <div>
              &copy; {new Date().getFullYear()} {DATA.name} . DESIGNED & BUILT SOLO
            </div>
            <div className="flex items-center gap-8">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-500 transition-colors">
                BACK TO TOP &uarr;
              </button>
              <a href="/resume.pdf" target="_blank" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs font-sans tracking-widest">
                RESUME <i className="devicon-devicon-plain text-sm"></i>
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

