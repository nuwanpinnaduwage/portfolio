import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations/MotionWrappers';
import SectionHeader from './SectionHeader';

export default function Experience({ experienceData, achievementsData }) {
  const experience = experienceData || portfolioData.experience;
  const achievements = achievementsData || portfolioData.achievements;

  return (
    <section 
      id="experience" 
      aria-labelledby="experience-heading"
      className="py-16 sm:py-20 relative bg-[#F5F7FA] dark:bg-[#050505] border-t border-[#A0AEC0]/20 dark:border-[#1F1F1F] overflow-hidden scroll-mt-24 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader 
          id="experience-heading"
          title={experience.title || "Experience & Roles"}
          subtitle={experience.subtitle}
        />

        {/* Experience Timeline */}
        <StaggerContainer 
          staggerDelay={0.12} 
          className="max-w-4xl mx-auto relative ml-1 sm:ml-auto pl-5 sm:pl-8 border-l-2 border-[#A0AEC0]/40 dark:border-[#262626] space-y-8 sm:space-y-10 mb-16 sm:mb-20"
        >
          {experience.roles.map((role, idx) => (
            <StaggerItem key={idx} direction="up" distance={20} className="relative group">
              {/* Timeline Dot */}
              <div 
                aria-hidden="true" 
                className="absolute -left-[27px] sm:-left-[39px] top-2 w-3.5 h-3.5 rounded-full bg-[#2D3748] dark:bg-[#F5F7FA] border-2 border-white dark:border-[#050505] transition-colors" 
              />

              {/* Experience Card */}
              <div className="rounded-xl p-5 sm:p-6 md:p-7 border border-[#A0AEC0]/30 dark:border-[#222222] bg-white dark:bg-[#0E0E0E] shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3.5 sm:pb-4 border-b border-slate-200/60 dark:border-[#222222]">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#F5F7FA] dark:bg-[#161616] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] mb-1.5">
                      {role.type}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold font-heading text-[#2D3748] dark:text-white">
                      {role.role}
                    </h3>
                    <h4 className="text-xs sm:text-sm font-semibold font-sans text-[#4A5568] dark:text-[#A0AEC0] mt-0.5">
                      {role.organization}
                    </h4>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                      <span>{role.period}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                      <span>{role.location}</span>
                    </span>
                  </div>
                </div>

                {/* Bullet Points */}
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {role.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Badges */}
                <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 pt-3.5 sm:pt-4 border-t border-slate-100 dark:border-[#222222]">
                  {role.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-[#161616] text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-[#262626]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Section 7b: Honors & Achievements Grid */}
        <div className="max-w-5xl mx-auto pt-4 sm:pt-6">
          <ScrollReveal direction="up" distance={20} duration={0.6} className="text-center mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-[#2D3748] dark:text-white">
              {achievements.title}
            </h3>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400">
              {achievements.subtitle}
            </p>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {achievements.items.map((item, idx) => (
              <StaggerItem key={idx} direction="up" distance={18}>
                <div className="rounded-xl p-4 sm:p-5 border border-[#A0AEC0]/30 dark:border-[#222222] bg-white dark:bg-[#0E0E0E] shadow-subtle flex items-start gap-3 sm:gap-4 hover:border-[#2D3748] dark:hover:border-[#333333] transition-all h-full">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#F5F7FA] dark:bg-[#161616] text-[#2D3748] dark:text-[#F5F7FA] flex items-center justify-center shrink-0 border border-[#A0AEC0]/30 dark:border-[#262626]">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm md:text-base font-semibold font-heading text-[#2D3748] dark:text-white truncate">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#F5F7FA] dark:bg-[#161616] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      <span>{item.issuer}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="mt-2 text-xs font-sans text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

      </div>
    </section>
  );
}
