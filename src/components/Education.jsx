import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Award, 
  BookOpen, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations/MotionWrappers';
import SectionHeader from './SectionHeader';

export default function Education({ data }) {
  const education = data || portfolioData.education;

  return (
    <section 
      id="education" 
      aria-labelledby="education-heading"
      className="py-16 sm:py-20 relative bg-white dark:bg-[#0A0A0A] border-t border-[#A0AEC0]/20 dark:border-[#222222] overflow-hidden scroll-mt-24 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader 
          id="education-heading"
          title={education.title || "Education & Honors"}
          subtitle={education.subtitle}
        />

        {/* Education Degree Cards */}
        <StaggerContainer staggerDelay={0.15} className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {education.degrees.map((edu, idx) => (
            <StaggerItem key={idx} direction="up" distance={24}>
              <div className="rounded-xl p-5 sm:p-7 md:p-8 border border-[#A0AEC0]/30 dark:border-[#262626] bg-[#F5F7FA] dark:bg-[#121212] shadow-subtle relative">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-slate-200/60 dark:border-[#222222]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold font-mono bg-white dark:bg-[#1A1A1A] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] mb-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Undergraduate Degree</span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-[#2D3748] dark:text-white">
                      {edu.degree}
                    </h3>
                    <h4 className="text-sm sm:text-base font-medium font-sans text-[#4A5568] dark:text-[#A0AEC0] mt-1">
                      {edu.institution}
                    </h4>
                  </div>

                  <div className="flex flex-col md:items-end gap-1.5 text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                      <span>{edu.location}</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-[#1A1A1A] text-[#2D3748] dark:text-[#F5F7FA] font-semibold border border-[#A0AEC0]/30 dark:border-[#262626] w-fit">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>Cumulative GPA: {edu.gpa}</span>
                    </div>
                  </div>
                </div>

                {/* Honors & Recognition */}
                {edu.honors && edu.honors.length > 0 && (
                  <div className="py-4 border-b border-slate-200/60 dark:border-[#222222]">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                      <span>Honors & Awards</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {edu.honors.map((honor, hIdx) => (
                        <span 
                          key={hIdx}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1 rounded-md bg-white dark:bg-[#1A1A1A] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D3748] dark:text-[#A0AEC0] shrink-0" />
                          <span>{honor}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Coursework */}
                <div className="py-4 sm:py-5 border-b border-slate-200/60 dark:border-[#222222]">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 sm:mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                    <span>Key CS Coursework</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {edu.coursework.map((course, cIdx) => (
                      <span 
                        key={cIdx}
                        className="text-xs font-mono px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white dark:bg-[#1A1A1A] text-[#2D3748] dark:text-[#F5F7FA] border border-[#A0AEC0]/30 dark:border-[#262626] hover:border-[#2D3748] dark:hover:border-white transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Involvements & Leadership on Campus */}
                <div className="pt-4 sm:pt-5">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#718096] dark:text-[#A0AEC0] shrink-0" />
                    <span>Campus Leadership & Involvement</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {edu.extracurriculars.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D3748] dark:bg-[#A0AEC0] shrink-0 mt-1.5"></span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
