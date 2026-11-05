import React from 'react';
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
  Code2,
  Cpu,
  Wrench,
  Shield,
  Cloud,
  Smartphone,
  Compass,
  Flame,
  Layout,
  HardDrive
} from 'lucide-react';

/**
 * Registry of supported Lucide icons for technologies
 */
export const AVAILABLE_TECH_ICONS = [
  { id: 'Code2', label: 'Code (Default)', icon: Code2, color: 'text-violet-500' },
  { id: 'FileCode', label: 'File Code / Scripts', icon: FileCode, color: 'text-blue-500' },
  { id: 'Terminal', label: 'Terminal / CLI', icon: Terminal, color: 'text-cyan-500' },
  { id: 'Coffee', label: 'Coffee / Java', icon: Coffee, color: 'text-rose-500' },
  { id: 'Database', label: 'Database / SQL', icon: Database, color: 'text-indigo-500' },
  { id: 'Atom', label: 'Atom / React', icon: Atom, color: 'text-cyan-400' },
  { id: 'Globe', label: 'Globe / Web / Next.js', icon: Globe, color: 'text-slate-400' },
  { id: 'Palette', label: 'Palette / Tailwind / UI', icon: Palette, color: 'text-teal-400' },
  { id: 'Layers', label: 'Layers / Full-Stack', icon: Layers, color: 'text-emerald-500' },
  { id: 'Server', label: 'Server / Node / Backend', icon: Server, color: 'text-emerald-500' },
  { id: 'Zap', label: 'Zap / Redis / Performance', icon: Zap, color: 'text-amber-500' },
  { id: 'Binary', label: 'Binary / Algorithms', icon: Binary, color: 'text-violet-500' },
  { id: 'Box', label: 'Box / OOP / Architecture', icon: Box, color: 'text-indigo-500' },
  { id: 'GitPullRequest', label: 'Git / Collaboration', icon: GitPullRequest, color: 'text-orange-500' },
  { id: 'Container', label: 'Container / Docker', icon: Container, color: 'text-blue-500' },
  { id: 'Cpu', label: 'CPU / Systems', icon: Cpu, color: 'text-purple-500' },
  { id: 'Wrench', label: 'Wrench / DevTools', icon: Wrench, color: 'text-yellow-500' },
  { id: 'Shield', label: 'Shield / Security / Auth', icon: Shield, color: 'text-green-500' },
  { id: 'Cloud', label: 'Cloud / AWS / Infra', icon: Cloud, color: 'text-sky-500' },
  { id: 'Smartphone', label: 'Smartphone / Mobile', icon: Smartphone, color: 'text-pink-500' },
  { id: 'Layout', label: 'Layout / Frontend', icon: Layout, color: 'text-teal-500' },
  { id: 'HardDrive', label: 'Storage / Systems', icon: HardDrive, color: 'text-blue-400' },
  { id: 'Flame', label: 'Flame / Hot Reload', icon: Flame, color: 'text-orange-500' },
];

const ICON_COMPONENT_MAP = {
  Code2,
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
  Cpu,
  Wrench,
  Shield,
  Cloud,
  Smartphone,
  Compass,
  Flame,
  Layout,
  HardDrive
};

// Skill name based automatic matching
const NAME_TO_ICON_MAP = {
  Python: { icon: 'FileCode', color: 'text-violet-500' },
  'JavaScript (ES6+)': { icon: 'FileCode', color: 'text-amber-500' },
  JavaScript: { icon: 'FileCode', color: 'text-amber-500' },
  TypeScript: { icon: 'FileCode', color: 'text-blue-500' },
  Java: { icon: 'Coffee', color: 'text-rose-500' },
  'C / C++': { icon: 'Terminal', color: 'text-cyan-500' },
  'SQL (PostgreSQL)': { icon: 'Database', color: 'text-indigo-500' },
  PostgreSQL: { icon: 'Database', color: 'text-blue-400' },
  'React.js': { icon: 'Atom', color: 'text-cyan-400' },
  React: { icon: 'Atom', color: 'text-cyan-400' },
  'Next.js': { icon: 'Globe', color: 'text-slate-700 dark:text-slate-300' },
  'Tailwind CSS': { icon: 'Palette', color: 'text-teal-400' },
  'HTML5 & Semantic Markup': { icon: 'Code2', color: 'text-orange-500' },
  'Node.js & Express': { icon: 'Server', color: 'text-emerald-500' },
  'Node.js': { icon: 'Server', color: 'text-emerald-500' },
  MongoDB: { icon: 'Layers', color: 'text-emerald-500' },
  Redis: { icon: 'Zap', color: 'text-rose-500' },
  'Docker & Containerization': { icon: 'Container', color: 'text-blue-500' },
  Docker: { icon: 'Container', color: 'text-blue-500' },
  'Git & GitHub Collaboration': { icon: 'GitPullRequest', color: 'text-orange-500' },
  Git: { icon: 'GitPullRequest', color: 'text-orange-500' },
  'Data Structures & Algorithms': { icon: 'Binary', color: 'text-violet-500' },
  'Object-Oriented Design (OOP)': { icon: 'Box', color: 'text-indigo-500' },
};

/**
 * Returns a React icon element for a technology
 */
export function renderTechIcon(iconKey, skillName, className = 'w-4 h-4 shrink-0') {
  // 1. Try explicit iconKey
  if (iconKey && ICON_COMPONENT_MAP[iconKey]) {
    const IconComp = ICON_COMPONENT_MAP[iconKey];
    const registered = AVAILABLE_TECH_ICONS.find(i => i.id === iconKey);
    const colorClass = registered ? registered.color : 'text-violet-500';
    return <IconComp className={`${className} ${colorClass}`} />;
  }

  // 2. Try match by skill name
  if (skillName && NAME_TO_ICON_MAP[skillName]) {
    const entry = NAME_TO_ICON_MAP[skillName];
    const IconComp = ICON_COMPONENT_MAP[entry.icon] || Code2;
    return <IconComp className={`${className} ${entry.color}`} />;
  }

  // 3. Default fallback
  return <Code2 className={`${className} text-violet-500`} />;
}
