import React, { useMemo } from 'react';
import { 
  Network, 
  Shield, 
  Cpu, 
  FileCode, 
  Database, 
  Binary, 
  Globe, 
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { ScrollReveal, AnimatedProgressBar } from './animations/MotionWrappers';
import SectionHeader from './SectionHeader';

export default function Skills({ data }) {
  const skillsData = data || portfolioData.skills;
  const rawCategories = skillsData.categories || [];

  // Filter only published catalogs and skills for public view, sorted by order_index
  const publishedCatalogs = useMemo(() => {
    return rawCategories
      .filter(cat => cat.is_published !== false)
      .map(cat => ({
        ...cat,
        skills: (cat.skills || []).filter(s => s.is_published !== false)
      }))
      .filter(cat => cat.skills.length > 0)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }, [rawCategories]);

  // Helper for catalog icons across all 8 technical competency categories
  const getCatalogIcon = (catId, className = "w-5 h-5") => {
    switch (catId) {
      case 'network':
      case 'networking':
        return <Network className={className} />;
      case 'cyber_security':
      case 'cybersecurity':
        return <Shield className={className} />;
      case 'cs_fundamentals':
        return <Cpu className={className} />;
      case 'ai':
        return <Activity className={className} />;
      case 'machine_learning':
        return <Binary className={className} />;
      case 'math_stats_research':
        return <Binary className={className} />;
      case 'programming_languages':
        return <FileCode className={className} />;
      case 'tools':
        return <Terminal className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  // Helper for skill icons
  const getSkillIcon = (iconName, catId) => {
    const iconClass = "w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0] shrink-0";
    switch (iconName) {
      case 'Network': return <Network className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      case 'FileCode': return <FileCode className={iconClass} />;
      case 'Database': return <Database className={iconClass} />;
      case 'Binary': return <Binary className={iconClass} />;
      case 'Globe': return <Globe className={iconClass} />;
      case 'Terminal': return <Terminal className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      default:
        if (catId === 'network' || catId === 'networking') return <Network className={iconClass} />;
        if (catId === 'cyber_security' || catId === 'cybersecurity') return <Shield className={iconClass} />;
        return <FileCode className={iconClass} />;
    }
  };

  return (
    <section 
      id="skills" 
      aria-labelledby="skills-heading"
      className="py-16 sm:py-24 relative overflow-hidden scroll-mt-20 bg-[#F5F7FA] dark:bg-[#050505] border-t border-[#A0AEC0]/20 dark:border-[#1F1F1F] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader 
          id="skills-heading"
          title={skillsData.title || "Skills & Technologies"}
          subtitle={skillsData.subtitle || "A balanced technical toolkit spanning Computer Networking, Cyber Security, and Computer Science & Analytical Fundamentals."}
        />

        {/* Static Two-Column Catalog Grid (Desktop: 2 per row; Mobile: 1 per row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {publishedCatalogs.map((catalog, catIdx) => (
            <ScrollReveal 
              key={catalog.id}
              direction="up" 
              distance={24} 
              duration={0.55} 
              delay={catIdx * 0.08}
              once={false}
              className="h-full"
            >
              <div className="h-full p-6 sm:p-7 rounded-xl bg-white dark:bg-[#0E0E0E] border border-[#A0AEC0]/30 dark:border-[#222222] shadow-subtle transition-colors flex flex-col justify-between">
                <div>
                  {/* Simple Section Heading */}
                  <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-200/60 dark:border-[#222222]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#2D3748] dark:text-[#F5F7FA] shrink-0">
                        {getCatalogIcon(catalog.id, "w-5 h-5")}
                      </span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold font-heading text-[#2D3748] dark:text-white">
                          {catalog.name}
                        </h3>
                        {catalog.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {catalog.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#2D3748] dark:text-[#F5F7FA] bg-[#F5F7FA] dark:bg-[#161616] border border-[#A0AEC0]/30 dark:border-[#262626] px-2.5 py-0.5 rounded-md shrink-0">
                      {catalog.skills.length} Skills
                    </span>
                  </div>

                  {/* Vertical Stack of Skill Bars */}
                  <div className="space-y-4 sm:space-y-4.5">
                    {catalog.skills.map((skill, sIdx) => (
                      <div 
                        key={skill.id || skill.name} 
                        className="group flex flex-col justify-between"
                      >
                        {/* Top Label & Percentage */}
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 gap-2 min-w-0">
                          <span className="font-medium text-[#2D3748] dark:text-[#F5F7FA] flex items-center gap-2 truncate min-w-0 group-hover:text-[#1A202C] dark:group-hover:text-white transition-colors">
                            <span className="p-1 rounded-md bg-slate-100 dark:bg-[#161616] group-hover:bg-slate-200 dark:group-hover:bg-[#262626] transition-colors shrink-0">
                              {getSkillIcon(skill.icon, catalog.id)}
                            </span>
                            <span className="truncate">{skill.name}</span>
                          </span>

                          <span className="font-mono text-xs sm:text-sm font-bold text-[#2D3748] dark:text-[#F5F7FA] min-w-[36px] text-right shrink-0">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Horizontal Animated Progress Bar (Re-animates bidirectionally) */}
                        <AnimatedProgressBar 
                          value={skill.level} 
                          label={`${skill.name} proficiency level: ${skill.level}%`}
                          delay={sIdx * 0.03}
                          duration={0.8}
                          once={false}
                          containerClassName="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-[#161616] overflow-hidden"
                          barClassName="h-full rounded-full bg-[#2D3748] dark:bg-[#F5F7FA]"
                        />

                        {/* Optional Short Description */}
                        {skill.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
