import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code2,
  Award
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function CVModal({ isOpen, onClose, onShowToast, data }) {
  const [copied, setCopied] = useState(false);
  const source = data || portfolioData;
  const { personal, education, skills, experience, projects, achievements, cvDetails } = source;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow || '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const generatePlainTextCV = () => {
    return `
========================================================================
${personal.name.toUpperCase()} - RESUME
${personal.role} | ${personal.specialization}
Location: ${personal.location}
Email: ${personal.email}
GitHub: ${personal.github} | LinkedIn: ${personal.linkedin}
========================================================================

EDUCATION
------------------------------------------------------------------------
${education.degrees[0].institution} - ${education.degrees[0].location}
${education.degrees[0].degree}
Expected Graduation: ${personal.expectedGraduation} | Cumulative GPA: ${education.degrees[0].gpa}
Relevant Coursework: ${education.degrees[0].coursework.join(', ')}

TECHNICAL SKILLS
------------------------------------------------------------------------
* Languages: Python, JavaScript (ES6+), TypeScript, Java, C/C++, SQL
* Frontend: React, Next.js, Tailwind CSS, Responsive Design
* Backend & Storage: Node.js, Express, PostgreSQL, MongoDB, Redis, REST APIs
* Tools & Core: Git, Docker, Linux, CI/CD, Data Structures, OOP, Systems

EXPERIENCE
------------------------------------------------------------------------
${experience.roles.map(r => `
${r.role} - ${r.organization} (${r.period})
${r.responsibilities.map(bullet => `  • ${bullet}`).join('\n')}
Tech: ${r.technologies.join(', ')}
`).join('\n')}

FLAGSHIP PROJECTS
------------------------------------------------------------------------
${projects.items.slice(0, 3).map(p => `
${p.title}
${p.tagline}
  • ${p.highlights.join('\n  • ')}
Tech: ${p.technologies.join(', ')}
`).join('\n')}

HONORS & ACHIEVEMENTS
------------------------------------------------------------------------
${achievements.items.map(a => `• ${a.title} - ${a.issuer} (${a.date})`).join('\n')}
========================================================================
    `.trim();
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainTextCV());
      setCopied(true);
      onShowToast({ type: 'success', message: 'Plain text resume copied to clipboard!' });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to copy resume to clipboard.' });
    }
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generatePlainTextCV()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${personal.preferredName}_Rivera_CS_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast({ type: 'success', message: 'Resume document downloaded successfully!' });
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="cv-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-[#050505]/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-[#0E0E0E] border border-[#A0AEC0]/30 dark:border-[#262626] shadow-card-hover overflow-hidden my-2 sm:my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions Bar */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-[#A0AEC0]/20 dark:border-[#222222] bg-[#F5F7FA] dark:bg-[#121212] shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-5 h-5 text-[#2D3748] dark:text-[#A0AEC0] shrink-0" />
            <h3 id="cv-modal-title" className="text-sm sm:text-lg font-heading font-bold text-[#2D3748] dark:text-white truncate">
              Curriculum Vitae Preview
            </h3>
            <span className="text-xs font-mono text-slate-400 hidden md:inline truncate">
              ({personal.resumeFileName})
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleDownloadFile}
              className="btn-secondary-pill shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Download</span>
            </button>

            <button
              onClick={handleCopyText}
              aria-label="Copy plain text resume"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors touch-manipulation"
              title="Copy plain text CV"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              aria-label="Print resume"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors hidden sm:inline-flex touch-manipulation"
              title="Print resume"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              aria-label="Close CV modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-dark-800 transition-colors ml-0.5 sm:ml-1 touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formatted Printable Resume Container */}
        <div className="p-4 sm:p-6 md:p-10 overflow-y-auto space-y-5 sm:space-y-6 font-sans text-slate-800 dark:text-slate-200 print:text-black print:bg-white">
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-[#2D3748] dark:text-white">
              {personal.name}
            </h1>
            <p className="text-sm font-semibold text-[#2D3748] dark:text-[#F5F7FA] mt-1">
              {personal.role} • {personal.specialization}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{personal.location}</span>
              <span>•</span>
              <a href={`mailto:${personal.email}`} className="text-[#2D3748] dark:text-[#A0AEC0] hover:underline">
                {personal.email}
              </a>
              <span>•</span>
              <a href={personal.github} target="_blank" rel="noreferrer" className="text-[#2D3748] dark:text-[#A0AEC0] hover:underline">
                GitHub
              </a>
              <span>•</span>
              <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-[#2D3748] dark:text-[#A0AEC0] hover:underline">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Objective / Summary */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2D3748] dark:text-[#F5F7FA] mb-2">
              Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {cvDetails.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2D3748] dark:text-[#F5F7FA] mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </h2>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm">
                <span className="font-bold text-[#2D3748] dark:text-white">
                  {education.degrees[0].institution}
                </span>
                <span className="font-mono text-slate-500 text-xs">
                  {education.degrees[0].period}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="italic">{education.degrees[0].degree}</span>
                <span className="font-semibold text-[#2D3748] dark:text-[#F5F7FA]">GPA: {education.degrees[0].gpa}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong className="font-semibold text-slate-700 dark:text-slate-300">Coursework: </strong>
                {education.degrees[0].coursework.join(', ')}
              </p>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2D3748] dark:text-[#F5F7FA] mb-2 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              <span>Technical Skills</span>
            </h2>
            <div className="space-y-1 text-xs">
              <div>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">Languages: </strong>
                <span className="text-slate-600 dark:text-slate-400">Python, Java, C/C++, JavaScript, TypeScript, SQL (PostgreSQL)</span>
              </div>
              <div>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">Frameworks & Web: </strong>
                <span className="text-slate-600 dark:text-slate-400">React.js, Next.js, Node.js, Express, Tailwind CSS, HTML5, REST APIs</span>
              </div>
              <div>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">Tools & Infrastructure: </strong>
                <span className="text-slate-600 dark:text-slate-400">Git/GitHub, Docker, Linux, Redis, PostgreSQL, Jest, CI/CD Actions</span>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2D3748] dark:text-[#F5F7FA] mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>Experience</span>
            </h2>
            <div className="space-y-4">
              {experience.roles.map((role, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm">
                    <span className="font-bold text-[#2D3748] dark:text-white">
                      {role.role} <span className="font-normal text-slate-500">| {role.organization}</span>
                    </span>
                    <span className="font-mono text-slate-500 text-xs">
                      {role.period}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                    {role.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Flagship Projects */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2D3748] dark:text-[#F5F7FA] mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Key Software Projects</span>
            </h2>
            <div className="space-y-3">
              {projects.items.slice(0, 3).map((proj) => (
                <div key={proj.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2D3748] dark:text-white">
                      {proj.title} <span className="font-normal font-mono text-[11px] text-[#2D3748] dark:text-[#A0AEC0]">({proj.technologies.slice(0, 4).join(', ')})</span>
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Honors */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2D3748] dark:text-[#F5F7FA] mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Honors & Certifications</span>
            </h2>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              {achievements.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span> — <span>{item.issuer} ({item.date})</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Footer Note */}
        <div className="p-4 border-t border-[#A0AEC0]/20 dark:border-[#4A5568] bg-[#F5F7FA] dark:bg-[#1A202C] flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Formatted for standard ATS & technical recruiters.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-800 font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
