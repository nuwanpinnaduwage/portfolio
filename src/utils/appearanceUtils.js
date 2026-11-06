/**
 * =========================================================================
 * APPEARANCE & TYPOGRAPHY SYSTEM CONFIGURATION & UTILITIES
 * =========================================================================
 * Centralized registry for section metadata, fonts, font-size scales,
 * line-spacing presets, curated Clean Slate palette, and CSS dynamic injection.
 */

// All configurable sections across the portfolio
export const SECTION_LIST = [
  { id: 'global', name: 'Global (All Sections)', icon: 'Globe', desc: 'Baseline typography and colors across the entire website', badge: 'Site Default' },
  { id: 'hero', name: 'Home / Hero', icon: 'Home', desc: 'Hero greeting, name, degree, career, and call-to-actions', badge: 'Hero' },
  { id: 'about', name: 'About Me', icon: 'User', desc: 'Bio, quick stats metrics, and terminal facts', badge: 'About' },
  { id: 'skills', name: 'Skills & Tech', icon: 'Cpu', desc: 'Skill categories, tech stacks, and badges', badge: 'Skills' },
  { id: 'projects', name: 'Featured Projects', icon: 'FolderGit2', desc: 'Projects grid, links, tags, and case studies', badge: 'Projects' },
  { id: 'experience', name: 'Experience & Roles', icon: 'Briefcase', desc: 'Internships, work history, and achievements timeline', badge: 'Experience' },
  { id: 'education', name: 'Education & Honors', icon: 'GraduationCap', desc: 'University, degree, coursework, and GPA', badge: 'Education' },
  { id: 'contact', name: 'Contact & Inquiries', icon: 'Mail', desc: 'Get in touch form, cards, and direct email', badge: 'Contact' },
  { id: 'footer', name: 'Footer Landmark', icon: 'Layers', desc: 'Branding logo, navigation links, and copyright notice', badge: 'Footer' },
];

// Curated Preset Accent Colors — Clean Slate Design System
export const ACCENT_OPTIONS = [
  {
    id: 'clean-slate',
    name: 'Clean Slate (Default)',
    color: '#2D3748',
    light: '#2D3748',
    dark: '#F5F7FA',
    soft: '#F5F7FA',
    deep: '#1A202C',
    glow: 'rgba(160, 174, 192, 0.25)',
    ring: 'ring-[#2D3748]',
    bg: '#0A0A0A',
    secondaryBg: '#050505',
    cardBg: '#121212',
    border: '#262626',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0AEC0',
    desc: 'Pure White, Cloud White, Slate Gray & Charcoal Slate design system',
    badge: 'Brand Theme',
    isFullTheme: true
  },
  {
    id: 'neon-emerald',
    name: 'Clean Slate (Active)',
    color: '#2D3748',
    light: '#2D3748',
    dark: '#F5F7FA',
    soft: '#F5F7FA',
    deep: '#1A202C',
    glow: 'rgba(160, 174, 192, 0.25)',
    ring: 'ring-[#2D3748]',
    bg: '#0A0A0A',
    secondaryBg: '#050505',
    cardBg: '#121212',
    border: '#262626',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0AEC0',
    desc: 'Pure White, Cloud White, Slate Gray & Charcoal Slate design system',
    badge: 'Clean Slate',
    isFullTheme: true
  },
  {
    id: 'emerald',
    name: 'Clean Slate',
    color: '#2D3748',
    light: '#2D3748',
    dark: '#F5F7FA',
    soft: '#F5F7FA',
    deep: '#1A202C',
    glow: 'rgba(160, 174, 192, 0.25)',
    ring: 'ring-[#2D3748]',
    bg: '#0A0A0A',
    secondaryBg: '#050505',
    cardBg: '#121212',
    border: '#262626',
    textPrimary: '#F5F7FA',
    textSecondary: '#A0AEC0',
    desc: 'Pure White, Cloud White, Slate Gray & Charcoal Slate design system',
    badge: 'Clean Slate',
    isFullTheme: true
  },
  { id: 'violet', name: 'Electric Violet', color: '#8b5cf6', light: '#7c3aed', dark: '#a78bfa', glow: 'rgba(139, 92, 246, 0.35)', ring: 'ring-violet-500', bg: '#1E2530', desc: 'Signature developer violet' },
  { id: 'indigo', name: 'Deep Indigo', color: '#6366f1', light: '#4f46e5', dark: '#818cf8', glow: 'rgba(99, 102, 241, 0.35)', ring: 'ring-indigo-500', bg: '#1E2530', desc: 'Classic engineering blue' },
  { id: 'cyan', name: 'Cyber Cyan', color: '#06b6d4', light: '#0891b2', dark: '#22d3ee', glow: 'rgba(6, 182, 212, 0.35)', ring: 'ring-cyan-500', bg: '#1E2530', desc: 'Vibrant futuristic cyan' },
  { id: 'blue', name: 'Electric Blue', color: '#3b82f6', light: '#2563eb', dark: '#60a5fa', glow: 'rgba(59, 130, 246, 0.35)', ring: 'ring-blue-500', bg: '#1E2530', desc: 'Punchy vivid cobalt blue' },
  { id: 'rose', name: 'Vibrant Rose', color: '#f43f5e', light: '#e11d48', dark: '#fb7185', glow: 'rgba(244, 63, 94, 0.35)', ring: 'ring-rose-500', bg: '#1E2530', desc: 'Bold energetic rose' },
  { id: 'orange', name: 'Sunset Orange', color: '#f97316', light: '#ea580c', dark: '#fb923c', glow: 'rgba(249, 115, 22, 0.35)', ring: 'ring-orange-500', bg: '#1E2530', desc: 'Warm creative glow' },
  { id: 'amber', name: 'Terminal Amber', color: '#f59e0b', light: '#d97706', dark: '#fbbf24', glow: 'rgba(245, 158, 11, 0.35)', ring: 'ring-amber-500', bg: '#1E2530', desc: 'Warm retro terminal' },
];

// Font Family Options
export const FONT_OPTIONS = [
  { 
    id: 'roboto', 
    name: 'Roboto', 
    category: 'Body & Interface',
    sample: 'Clean, comfortable, and engineered for high legibility across all digital devices.',
    fontFamily: "'Roboto', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    badge: 'Default Body'
  },
  { 
    id: 'manrope', 
    name: 'Manrope', 
    category: 'Headings & Display',
    sample: 'Modern, distinctive geometric sans designed for confident, elegant headings.',
    fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
    badge: 'Headings'
  },
  { 
    id: 'jetbrains-mono', 
    name: 'JetBrains Mono', 
    category: 'Developer Mono',
    sample: 'Engineered for developers, reading code, technical metadata, and terminal clarity.',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    badge: 'Code'
  },
  { 
    id: 'inter', 
    name: 'Inter', 
    category: 'Sans-Serif',
    sample: 'Modern, balanced, and engineered for high readability on digital screens.',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    badge: 'Alternative'
  },
  { 
    id: 'space-grotesk', 
    name: 'Space Grotesk', 
    category: 'Display / Tech',
    sample: 'Bold geometric forms engineered for modern developer branding and headings.',
    fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    badge: 'Tech'
  },
  { 
    id: 'plus-jakarta', 
    name: 'Plus Jakarta Sans', 
    category: 'Geometric Sans',
    sample: 'Crisp contemporary curves with modern geometric elegance.',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    badge: 'Modern'
  },
  { 
    id: 'outfit', 
    name: 'Outfit', 
    category: 'Futuristic Sans',
    sample: 'Distinctive, minimal, and forward-thinking aesthetic for tech creators.',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    badge: 'Popular'
  },
  { 
    id: 'fira-code', 
    name: 'Fira Code', 
    category: 'Monospace',
    sample: 'Monospaced font designed for developers, terminals, and code editors.',
    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
    badge: 'Hacker'
  },
  { 
    id: 'system', 
    name: 'System UI', 
    category: 'Native OS',
    sample: 'Zero-latency native system font matching Apple SF Pro, Segoe UI, or Roboto.',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    badge: 'Ultra Fast'
  },
];

// Base Font Size Scale
export const FONT_SIZE_OPTIONS = [
  { id: 'sm', label: 'Compact', px: '15px', scale: 0.94, desc: 'Dense information hierarchy' },
  { id: 'md', label: 'Default', px: '16px', scale: 1.0, desc: 'Standard balanced web sizing', recommended: true },
  { id: 'lg', label: 'Comfortable', px: '17.5px', scale: 1.09, desc: 'Relaxed reading with high legibility' },
  { id: 'xl', label: 'Large', px: '19px', scale: 1.19, desc: 'Bold, prominent, high accessibility' },
];

// Linespace (Line Height) Options
export const LINE_SPACING_OPTIONS = [
  { id: 'compact', label: 'Compact', value: '1.4', desc: 'Tighter lines for compact high-density layouts' },
  { id: 'normal', label: 'Normal', value: '1.6', desc: 'Natural, balanced reading rhythm', recommended: true },
  { id: 'relaxed', label: 'Relaxed', value: '1.75', desc: 'Comfortable breathing room between lines' },
  { id: 'loose', label: 'Loose', value: '1.9', desc: 'Expansive editorial spacing for maximum reading ease' },
];

// Default configuration for a section
export const DEFAULT_SECTION_APPEARANCE = {
  inheritGlobal: true,
  fontFamily: 'roboto',
  fontSize: 'md',
  lineHeight: 'normal',
  accentColor: 'clean-slate',
  customAccentColor: '',
};

/**
 * Resolves the active visual appearance properties for a section,
 * respecting its inheritGlobal flag and falling back to global settings.
 */
export function resolveSectionAppearance(secId, sectionAppearance = {}, globalSettings = {}) {
  const isGlobal = secId === 'global';
  const secCfg = (!isGlobal && sectionAppearance[secId]) ? sectionAppearance[secId] : {};
  const inherit = isGlobal ? false : (secCfg.inheritGlobal !== false);

  const fontFamilyId = (!inherit && secCfg.fontFamily) ? secCfg.fontFamily : (globalSettings.fontFamily || 'roboto');
  const fontSizeId = (!inherit && secCfg.fontSize) ? secCfg.fontSize : (globalSettings.fontSize || 'md');
  const lineHeightId = (!inherit && secCfg.lineHeight) ? secCfg.lineHeight : (globalSettings.lineHeight || 'normal');
  const accentColorId = (!inherit && secCfg.accentColor) ? secCfg.accentColor : (globalSettings.accentColor || 'clean-slate');
  const customAccent = (!inherit && secCfg.customAccentColor) ? secCfg.customAccentColor : (globalSettings.customAccentColor || '');

  const font = FONT_OPTIONS.find(f => f.id === fontFamilyId) || FONT_OPTIONS[0];
  const fontSize = FONT_SIZE_OPTIONS.find(s => s.id === fontSizeId) || FONT_SIZE_OPTIONS[1];
  const lineHeight = LINE_SPACING_OPTIONS.find(l => l.id === lineHeightId) || LINE_SPACING_OPTIONS[1];

  let accentObj;
  if (customAccent && customAccent.startsWith('#')) {
    accentObj = {
      id: 'custom',
      name: 'Custom Hex',
      color: customAccent,
      light: customAccent,
      dark: customAccent,
      glow: `${customAccent}35`,
    };
  } else {
    accentObj = ACCENT_OPTIONS.find(a => a.id === accentColorId) || ACCENT_OPTIONS[0];
  }

  return {
    isGlobal,
    inheritGlobal: inherit,
    fontFamilyId,
    fontSizeId,
    lineHeightId,
    accentColorId,
    customAccentColor: customAccent,
    font,
    fontSize,
    lineHeight,
    accent: accentObj,
    accentColor: accentObj.color,
  };
}

/**
 * Generates dynamic scoped CSS rules for global root and all customized sections
 * so they override fonts, font-sizes, linespace, and accents seamlessly.
 */
export function generateSectionStylesCSS(settings = {}) {
  const sectionAppearance = settings.sectionAppearance || {};
  const globalResolved = resolveSectionAppearance('global', sectionAppearance, settings);

  const rules = [];

  // 1. GLOBAL ROOT BASELINE RULES
  rules.push(`
/* ======================================================== */
/* GLOBAL ROOT APPEARANCE BASELINE (MANROPE + ROBOTO)       */
/* ======================================================== */
:root {
  --portfolio-accent: ${globalResolved.accent.color} !important;
  --portfolio-accent-light: ${globalResolved.accent.light} !important;
  --portfolio-accent-dark: ${globalResolved.accent.dark} !important;
  --portfolio-accent-glow: ${globalResolved.accent.glow} !important;
  --font-heading: 'Manrope', system-ui, -apple-system, sans-serif !important;
  --font-sans: ${globalResolved.font.fontFamily} !important;
  --font-body: ${globalResolved.font.fontFamily} !important;
  --portfolio-font-family: ${globalResolved.font.fontFamily} !important;
  --portfolio-font-size: ${globalResolved.fontSize.px} !important;
  --portfolio-line-height: ${globalResolved.lineHeight.value} !important;
}

html {
  font-size: ${globalResolved.fontSize.px} !important;
}

h1,
h2,
h3,
h4,
h5,
h6,
.font-heading,
[class*="font-heading"] {
  font-family: var(--font-heading, 'Manrope', sans-serif) !important;
}

body,
.font-sans,
[class*="font-sans"],
button,
input,
select,
textarea,
table,
th,
td,
nav,
label,
p,
li,
a:not(.font-mono) {
  font-family: ${globalResolved.font.fontFamily};
}

p,
li,
.section-desc,
.leading-relaxed,
.leading-normal,
.leading-loose {
  line-height: ${globalResolved.lineHeight.value} !important;
}

/* Global accent color bindings */
[class*="text-violet-"] {
  color: ${globalResolved.accent.color} !important;
}

html.dark [class*="text-violet-"] {
  color: ${globalResolved.accent.dark || globalResolved.accent.color} !important;
}

html:not(.dark) [class*="text-violet-"] {
  color: ${globalResolved.accent.light || globalResolved.accent.color} !important;
}

[class*="bg-violet-600"],
[class*="bg-violet-500"] {
  background-color: ${globalResolved.accent.color} !important;
}

[class*="bg-violet-950/"],
[class*="bg-violet-100"] {
  background-color: ${globalResolved.accent.glow} !important;
}

[class*="border-violet-"] {
  border-color: ${globalResolved.accent.color} !important;
}

.nav-tab-label::after {
  background-color: ${globalResolved.accent.light || globalResolved.accent.color} !important;
}
html.dark .nav-tab-label::after {
  background-color: ${globalResolved.accent.dark || globalResolved.accent.color} !important;
}
`);

  // 2. PER-SECTION OVERRIDE RULES
  const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact', 'footer'];

  sectionIds.forEach((secId) => {
    const secCfg = sectionAppearance[secId];
    if (secCfg && secCfg.inheritGlobal === false) {
      const resolved = resolveSectionAppearance(secId, sectionAppearance, settings);
      const selector = `#${secId}`;
      const lineHeightValue = resolved.lineHeight.value;
      const fontFamilyValue = resolved.font.fontFamily;
      const scaleValue = resolved.fontSize.scale;
      const accent = resolved.accent;

      rules.push(`
/* ======================================================== */
/* SECTION OVERRIDE: #${secId}                              */
/* ======================================================== */
${selector} {
  --portfolio-accent: ${accent.color} !important;
  --portfolio-accent-light: ${accent.light} !important;
  --portfolio-accent-dark: ${accent.dark} !important;
  --portfolio-accent-glow: ${accent.glow} !important;
  --section-font-family: ${fontFamilyValue} !important;
  --section-line-height: ${lineHeightValue} !important;
  --section-scale: ${scaleValue} !important;
}

${selector},
${selector} button,
${selector} input,
${selector} select,
${selector} textarea,
${selector} p,
${selector} li,
${selector} a:not(.font-mono),
${selector} .font-sans,
${selector} [class*="font-sans"] {
  font-family: ${fontFamilyValue};
}

${selector} p,
${selector} li,
${selector} .section-desc,
${selector} .section-text,
${selector} .leading-relaxed,
${selector} .leading-normal,
${selector} .leading-loose {
  line-height: ${lineHeightValue} !important;
}

/* Scaled font sizing inside #${secId} */
${selector} .text-xs {
  font-size: calc(0.75rem * ${scaleValue}) !important;
}
${selector} .text-sm {
  font-size: calc(0.875rem * ${scaleValue}) !important;
}
${selector} .text-base {
  font-size: calc(1rem * ${scaleValue}) !important;
}
${selector} .text-lg {
  font-size: calc(1.125rem * ${scaleValue}) !important;
}
${selector} .text-xl {
  font-size: calc(1.25rem * ${scaleValue}) !important;
}

${selector} [class*="text-violet-"] {
  color: ${accent.color} !important;
}

html.dark ${selector} [class*="text-violet-"] {
  color: ${accent.dark || accent.color} !important;
}

html:not(.dark) ${selector} [class*="text-violet-"] {
  color: ${accent.light || accent.color} !important;
}

${selector} [class*="bg-violet-600"],
${selector} [class*="bg-violet-500"] {
  background-color: ${accent.color} !important;
}

${selector} [class*="border-violet-"] {
  border-color: ${accent.color} !important;
}
`);
    }
  });

  return rules.join('\n');
}
