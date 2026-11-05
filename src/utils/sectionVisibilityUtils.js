/**
 * =========================================================================
 * SECTION VISIBILITY & RENAME SYSTEM UTILITIES
 * =========================================================================
 * Single source of truth for all public website sections, navigation links,
 * custom display names, validation, and visibility resolution.
 */

// Baseline default visibility state for all managed sections
export const DEFAULT_SECTION_VISIBILITY = {
  about: true,
  skills: true,
  projects: true,
  experience: true,
  education: true,
  contact: true,
};

// Baseline default navigation tab visibility state for all managed sections
export const DEFAULT_NAV_VISIBILITY = {
  about: true,
  skills: true,
  projects: true,
  experience: true,
  education: true,
  contact: true,
};

// Baseline default display names for navigation tabs
export const DEFAULT_SECTION_NAMES = {
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  contact: 'Contact',
};

// All non-Home managed sections that can be toggled and renamed by the administrator
export const MANAGED_SECTIONS = [
  {
    id: 'about',
    defaultName: 'About Me',
    navLabel: 'About',
    href: '#about',
    desc: 'Narrative biography, personal pillars, quick metrics, and terminal details.',
    icon: 'User',
    accentColor: 'violet',
  },
  {
    id: 'skills',
    defaultName: 'Skills & Technologies',
    navLabel: 'Skills',
    href: '#skills',
    desc: 'Technical competency categories, proficiency levels, and developer tooling.',
    icon: 'Wrench',
    accentColor: 'indigo',
  },
  {
    id: 'projects',
    defaultName: 'Research & Projects',
    navLabel: 'Projects',
    href: '#projects',
    desc: 'Dual-component showcase for research publications and software projects, dynamic filters, and detail modals.',
    icon: 'FolderGit2',
    accentColor: 'emerald',
  },
  {
    id: 'experience',
    defaultName: 'Experience & Leadership',
    navLabel: 'Experience',
    href: '#experience',
    desc: 'Professional work history timeline, internships, roles, and achievements.',
    icon: 'Briefcase',
    accentColor: 'cyan',
  },
  {
    id: 'education',
    defaultName: 'Education & Honors',
    navLabel: 'Education',
    href: '#education',
    desc: 'Undergraduate degree, university, cumulative GPA, coursework, and awards.',
    icon: 'GraduationCap',
    accentColor: 'emerald',
  },
  {
    id: 'contact',
    defaultName: 'Contact & Inquiries',
    navLabel: 'Contact',
    href: '#contact',
    desc: 'Interactive contact form, direct email address, and social network links.',
    icon: 'Mail',
    accentColor: 'rose',
  },
];

/**
 * Checks whether a section is visible.
 * 'hero' / 'home' is permanently visible and cannot be hidden.
 */
export function isSectionVisible(sectionId, visibilityMap = {}) {
  if (sectionId === 'hero' || sectionId === 'home') {
    return true;
  }
  // If explicitly set to false, it is hidden; otherwise visible by default
  return visibilityMap?.[sectionId] !== false;
}

/**
 * Resolves the display name for a section navigation label.
 */
export function getSectionDisplayName(sectionId, sectionNames = {}) {
  if (sectionId === 'hero' || sectionId === 'home') {
    return 'Home';
  }
  const custom = sectionNames?.[sectionId];
  if (custom && typeof custom === 'string' && custom.trim().length > 0) {
    return custom.trim();
  }
  const def = MANAGED_SECTIONS.find((s) => s.id === sectionId);
  return def ? def.navLabel : sectionId;
}

/**
 * Checks whether a navigation tab is visible.
 * 'hero' / 'home' is permanently visible and cannot be hidden.
 * If the section itself is hidden on the page, the nav tab is also hidden.
 */
export function isNavVisible(sectionId, navVisibilityMap = {}, sectionVisibilityMap = {}) {
  if (sectionId === 'hero' || sectionId === 'home') {
    return true;
  }
  // If the section itself is completely hidden from the page, omit from nav
  if (sectionVisibilityMap?.[sectionId] === false) {
    return false;
  }
  // Otherwise check explicit navbar toggle state (defaults to true)
  return navVisibilityMap?.[sectionId] !== false;
}

/**
 * Returns the filtered list of navigation links based on active section visibility,
 * navigation tab visibility, and customized display names.
 * Home ('#hero') is always the first item and is permanently included.
 */
export function getVisibleNavLinks(visibilityMap = {}, sectionNames = {}, navVisibilityMap = {}) {
  const allNavLinks = [
    { name: 'Home', href: '#hero', id: 'hero' },
    ...MANAGED_SECTIONS.map((sec) => ({
      name: getSectionDisplayName(sec.id, sectionNames),
      href: sec.href,
      id: sec.id,
    })),
  ];

  return allNavLinks.filter((link) => isNavVisible(link.id, navVisibilityMap, visibilityMap));
}

/**
 * Validates a proposed menu tab display name:
 * 1. Must not be empty (after trimming).
 * 2. Maximum 30 characters.
 * 3. Must not duplicate "Home" (case-insensitive).
 * 4. Must not duplicate another menu tab's display name (case-insensitive).
 */
export function validateSectionName(sectionId, newName, currentSectionNames = {}) {
  const trimmed = (newName || '').trim();

  if (!trimmed) {
    return { valid: false, error: 'Menu tab label cannot be empty.' };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Menu tab label cannot exceed 30 characters.' };
  }

  // Prevent renaming to "Home" (case-insensitive) as Home is reserved for Hero
  if (trimmed.toLowerCase() === 'home') {
    return { valid: false, error: '"Home" is reserved for the primary landing section.' };
  }

  // Prevent duplicate names across other managed sections (case-insensitive)
  const isDuplicate = MANAGED_SECTIONS.some((sec) => {
    if (sec.id === sectionId) return false; // ignore self
    const existingName = getSectionDisplayName(sec.id, currentSectionNames).trim().toLowerCase();
    return existingName === trimmed.toLowerCase();
  });

  if (isDuplicate) {
    return { valid: false, error: `The menu label "${trimmed}" is already in use by another tab.` };
  }

  return { valid: true, trimmedName: trimmed };
}
