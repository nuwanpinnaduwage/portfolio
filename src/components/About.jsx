import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Terminal, 
  Coffee, 
  Database, 
  Atom, 
  Globe, 
  Palette, 
  Layers, 
  Server, 
  Zap, 
  Binary, 
  Box, 
  GitPullRequest, 
  Container, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  Code2,
  ExternalLink,
  Shield,
  Network,
  Cpu,
  Lock,
  Activity
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { renderTechIcon } from '../utils/techIconUtils';
import SectionHeader from './SectionHeader';
import { ScrollReveal, ScaleReveal, StaggerContainer, StaggerItem } from './animations/MotionWrappers';

export default function About({ 
  data, 
  settings, 
  personalData, 
  educationData, 
  skillsData, 
  achievementsData 
}) {
  const about = data || portfolioData.about;
  const personal = personalData || portfolioData.personal;
  const education = educationData || portfolioData.education;
  const skills = skillsData || portfolioData.skills;
  const achievements = achievementsData || portfolioData.achievements;

  // Icon mapping for tech stack
  const skillIconMap = {
    Python: <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />,
    "JavaScript (ES6+)": <FileCode className="w-4 h-4 text-amber-500 shrink-0" />,
    JavaScript: <FileCode className="w-4 h-4 text-amber-500 shrink-0" />,
    TypeScript: <FileCode className="w-4 h-4 text-blue-500 shrink-0" />,
    Java: <Coffee className="w-4 h-4 text-rose-500 shrink-0" />,
    "C / C++": <Terminal className="w-4 h-4 text-cyan-500 shrink-0" />,
    "SQL (PostgreSQL)": <Database className="w-4 h-4 text-indigo-500 shrink-0" />,
    "React.js": <Atom className="w-4 h-4 text-cyan-400 shrink-0" />,
    React: <Atom className="w-4 h-4 text-cyan-400 shrink-0" />,
    "Next.js": <Globe className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />,
    "Tailwind CSS": <Palette className="w-4 h-4 text-teal-400 shrink-0" />,
    "HTML5 & Semantic Markup": <Code2 className="w-4 h-4 text-orange-500 shrink-0" />,
    "Node.js & Express": <Server className="w-4 h-4 text-emerald-500 shrink-0" />,
    PostgreSQL: <Database className="w-4 h-4 text-blue-400 shrink-0" />,
    MongoDB: <Layers className="w-4 h-4 text-emerald-500 shrink-0" />,
    Redis: <Zap className="w-4 h-4 text-rose-500 shrink-0" />,
    "Docker & Containerization": <Container className="w-4 h-4 text-blue-500 shrink-0" />,
    Docker: <Container className="w-4 h-4 text-blue-500 shrink-0" />,
    "Git & GitHub Collaboration": <GitPullRequest className="w-4 h-4 text-orange-500 shrink-0" />,
    Git: <GitPullRequest className="w-4 h-4 text-orange-500 shrink-0" />,
    "Data Structures & Algorithms": <Binary className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Object-Oriented Design (OOP)": <Box className="w-4 h-4 text-indigo-500 shrink-0" />,
    "Network Security & Hardening": <Shield className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Penetration Testing & Ethical Hacking": <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Vulnerability Assessment & Auditing": <Lock className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Intrusion Detection Systems (Snort / Suricata)": <Activity className="w-4 h-4 text-emerald-500 shrink-0" />,
    "TCP/IP & Network Protocols": <Network className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Routing & Switching (OSPF, BGP, VLANs)": <Network className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Cisco IOS & Simulation (Packet Tracer, GNS3)": <Server className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Firewall & Perimeter Defense (pfSense, iptables)": <Shield className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Machine Learning & Deep Learning (PyTorch, TensorFlow)": <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Network Anomaly Detection & Threat Modeling": <Shield className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Kali Linux & Security Distributions": <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />,
    "Wireshark & Packet Analysis": <Activity className="w-4 h-4 text-emerald-500 shrink-0" />,
  };

  // Experience durations mapping
  const skillDurationMap = {
    Python: '3+ Yrs',
    'JavaScript (ES6+)': '3+ Yrs',
    JavaScript: '3+ Yrs',
    TypeScript: '2+ Yrs',
    'React.js': '3+ Yrs',
    React: '3+ Yrs',
    'Next.js': '1+ Yrs',
    'Tailwind CSS': '2+ Yrs',
    'Node.js & Express': '2+ Yrs',
    'Node.js': '2+ Yrs',
    PostgreSQL: '2+ Yrs',
    'SQL (PostgreSQL)': '2+ Yrs',
    'C / C++': '2 Yrs',
    Java: '2 Yrs',
    'Docker & Containerization': '1+ Yrs',
    Docker: '1+ Yrs',
    'Git & GitHub Collaboration': '3+ Yrs',
    Git: '3+ Yrs',
    'Network Security & Hardening': '3+ Yrs',
    'Penetration Testing & Ethical Hacking': '2+ Yrs',
    'Vulnerability Assessment & Auditing': '2+ Yrs',
    'Intrusion Detection Systems (Snort / Suricata)': '2+ Yrs',
    'TCP/IP & Network Protocols': '3+ Yrs',
    'Routing & Switching (OSPF, BGP, VLANs)': '2+ Yrs',
    'Cisco IOS & Simulation (Packet Tracer, GNS3)': '2+ Yrs',
    'Firewall & Perimeter Defense (pfSense, iptables)': '2+ Yrs',
    'Machine Learning & Deep Learning (PyTorch, TensorFlow)': '2+ Yrs',
    'Network Anomaly Detection & Threat Modeling': '2+ Yrs',
    'Kali Linux & Security Distributions': '3+ Yrs',
    'Wireshark & Packet Analysis': '3+ Yrs',
    'Data Structures & Algorithms': 'Core CS',
  };

  // Compile skills for two-column presentation: check about.techStack first
  const categoriesList = skills.categories || [];
  const primarySkills = useMemo(() => {
    if (about.techStack && Array.isArray(about.techStack) && about.techStack.length > 0) {
      return about.techStack.map(s => ({
        ...s,
        duration: s.duration || skillDurationMap[s.name] || s.tag || '',
        level: s.level !== undefined ? s.level : 85,
      }));
    }

    const flat = categoriesList.flatMap(cat => cat.skills || []);
    if (flat.length === 0) return [];

    return flat.slice(0, 10).map(s => ({
      ...s,
      duration: s.duration || skillDurationMap[s.name] || s.tag || ''
    }));
  }, [about.techStack, categoriesList]);

  // Education items (arranged horizontally, without enclosing card boxes)
  const educationItems = education.degrees || [];

  // Certificates list: check about.certificates first
  const certificateItems = useMemo(() => {
    if (about.certificates && Array.isArray(about.certificates) && about.certificates.length > 0) {
      return about.certificates.map(item => ({
        ...item,
        year: item.year || item.date || '2024',
        tags: Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(',').map(t => t.trim()).filter(Boolean) : ['Engineering']),
        image: item.image || item.image_url || null,
        credentialUrl: item.credential_url || item.credentialUrl || '',
      }));
    }

    const raw = achievements.items || [];
    if (raw.length === 0) return [];

    return raw.map((item) => {
      let tags = ['Engineering'];
      let year = '2024';

      const titleLower = item.title.toLowerCase();
      if (titleLower.includes('aws') || titleLower.includes('cloud')) {
        tags = ['Cloud', 'AWS', 'Infrastructure'];
        year = '2024';
      } else if (titleLower.includes('hackathon') || titleLower.includes('hacktech')) {
        tags = ['Hackathon', 'Full-Stack', 'Real-Time'];
        year = '2024';
      } else if (titleLower.includes('dean') || titleLower.includes('academic')) {
        tags = ['Academic Honors', 'Dean\'s List'];
        year = '2022-2025';
      } else if (titleLower.includes('icpc') || titleLower.includes('programming')) {
        tags = ['Algorithms', 'Competitive Programming'];
        year = '2023';
      }

      return {
        ...item,
        tags: item.tags || tags,
        year: item.year || item.date || year,
        image: item.image || item.image_url || null,
        credentialUrl: item.credential_url || item.credentialUrl || '',
      };
    });
  }, [about.certificates, achievements]);

  const [activeCertIndex, setActiveCertIndex] = useState(0);

  const handlePrevCertificate = () => {
    setActiveCertIndex(prev => (prev - 1 + certificateItems.length) % certificateItems.length);
  };

  const handleNextCertificate = () => {
    setActiveCertIndex(prev => (prev + 1) % certificateItems.length);
  };

  const currentCertificate = certificateItems[activeCertIndex] || null;
  const avatarToDisplay = about.profilePhotoUrl || personal.avatarUrl;

  return (
    <section 
      id="about" 
      aria-labelledby="about-heading"
      className="py-16 sm:py-20 relative scroll-mt-24 bg-white dark:bg-[#0b0f17] border-t border-slate-200/60 dark:border-slate-800/60 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <SectionHeader 
          id="about-heading"
          title={about.title || "About Me"}
          subtitle={about.subtitle || "Turning abstract algorithms into resilient, user-first software."}
        />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN (approx 65% width): Who I Am, Education, Tech Stack           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-9">
            
            {/* 1. Who I Am */}
            <div>
              <ScrollReveal direction="up" distance={20} duration={0.55} once={false}>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                  {about.whoIAmHeading || "Who I Am"}
                </h3>
              </ScrollReveal>
              <StaggerContainer staggerDelay={0.08} once={false} className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {about.paragraphs && about.paragraphs.length > 0 ? (
                  about.paragraphs.map((p, idx) => (
                    <StaggerItem key={idx} direction="up" distance={16} duration={0.5}>
                      <p>{p}</p>
                    </StaggerItem>
                  ))
                ) : (
                  <StaggerItem direction="up" distance={16} duration={0.5}>
                    <p>{personal.bioShort}</p>
                  </StaggerItem>
                )}
                {about.professionalSummary && (
                  <StaggerItem direction="up" distance={16} duration={0.5}>
                    <p className="text-slate-700 dark:text-slate-200 font-medium pt-1">
                      {about.professionalSummary}
                    </p>
                  </StaggerItem>
                )}
              </StaggerContainer>
            </div>

            {/* 2. Education (horizontal row of items, without enclosing card boxes) */}
            <div>
              <ScrollReveal direction="up" distance={20} duration={0.55} once={false}>
                <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Education
                </h3>
              </ScrollReveal>
              
              <StaggerContainer staggerDelay={0.1} once={false} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {educationItems.map((edu, idx) => (
                  <StaggerItem key={edu.id || idx} direction="up" distance={18} duration={0.5} className="space-y-1">
                    <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 block">
                      {edu.period}
                    </span>
                    <h4 className="text-sm sm:text-base font-heading font-bold text-slate-900 dark:text-white leading-snug">
                      {edu.degree}
                    </h4>
                    <p className="text-xs sm:text-sm font-sans text-slate-600 dark:text-slate-400">
                      {edu.institution}
                    </p>
                    {edu.description && (
                      <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* 3. Tech Stack (two columns of skills, with icons, names, durations, and simple proficiency bars) */}
            <div>
              <ScrollReveal direction="up" distance={20} duration={0.55} once={false}>
                <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Tech Stack
                </h3>
              </ScrollReveal>

              <StaggerContainer staggerDelay={0.05} once={false} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                {primarySkills.map((skill, sIdx) => (
                  <StaggerItem key={skill.id || skill.name || sIdx} direction="up" distance={14} duration={0.45} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm gap-2 min-w-0">
                      <div className="flex items-center gap-2 truncate min-w-0">
                        {renderTechIcon(skill.icon, skill.name)}
                        <span className="font-medium text-slate-800 dark:text-slate-200 font-sans text-xs sm:text-sm truncate">
                          {skill.name}
                        </span>
                      </div>
                      {skill.duration && (
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                          {skill.duration}
                        </span>
                      )}
                    </div>

                    {/* Simple horizontal proficiency bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, skill.level ?? 80))}%` }}
                      />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

          </div>


          {/* ========================================================================= */}
          {/* RIGHT COLUMN (approx 35% width): Profile Photo, Certificates Carousel      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Existing profile photograph at the top, centered and circular */}
            <ScaleReveal initialScale={0.94} duration={0.65} once={false} className="flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-emerald-500/40 shadow-md">
                <img
                  src={avatarToDisplay}
                  alt={personal.name || "Profile Photograph"}
                  className="w-full h-full object-cover"
                />
              </div>
            </ScaleReveal>

            {/* 2. Certificates Heading */}
            <ScrollReveal direction="up" distance={20} duration={0.6} once={false} id="certificates" className="scroll-mt-24">
              {/* Centered Certificates Heading */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white text-center mb-4 sm:mb-5 tracking-tight">
                Certificates
              </h3>

              {/* 3. Certificate Carousel Display */}
              {currentCertificate ? (
                <div className="relative px-6 sm:px-7">
                  
                  {/* Circular Previous Arrow Button (Left side, vertically centered with card) */}
                  {certificateItems.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevCertificate}
                      aria-label="Previous certificate"
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 shadow-sm flex items-center justify-center transition-all focus:outline-none touch-manipulation"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  {/* Horizontal, compact certificate card */}
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-dark-900/70 p-3 sm:p-4 shadow-sm">
                    {/* Prominent Certificate Image across the top, preserving aspect ratio */}
                    <div className="w-full aspect-[16/10] bg-slate-100 dark:bg-dark-850 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
                      {currentCertificate.image ? (
                        <img 
                          src={currentCertificate.image} 
                          alt={currentCertificate.title} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-dark-850">
                          <Award className="w-8 h-8 text-emerald-500 mb-1.5" />
                          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                            {currentCertificate.issuer}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Under the image: issue year, title, technology tags */}
                    <div className="pt-3 space-y-1">
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">
                        {currentCertificate.year}
                      </span>
                      <h4 className="text-sm sm:text-base font-heading font-bold text-slate-900 dark:text-white leading-snug">
                        {currentCertificate.title}
                      </h4>
                      {currentCertificate.tags && currentCertificate.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {currentCertificate.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-xs font-mono text-emerald-600 dark:text-emerald-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {currentCertificate.credentialUrl && (
                        <div className="pt-1.5">
                          <a
                            href={currentCertificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Circular Next Arrow Button (Right side, vertically centered with card) */}
                  {certificateItems.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNextCertificate}
                      aria-label="Next certificate"
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-dark-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 shadow-sm flex items-center justify-center transition-all focus:outline-none touch-manipulation"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center">No certificates available.</p>
              )}
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
}
