/**
 * Theme-Aware Rich-Text Range Slicing & Styling Utility for Hero Studio Pro
 * Supports independent Light Mode and Dark Mode text color customization.
 * Deterministic character offset algorithms without regex or innerHTML injection.
 * Preserves individual animation configurations, word spacing, and layer data models.
 */

export const PRESET_DARK_COLORS = [
  { name: 'Emerald', hex: '#16C96B' },
  { name: 'Mint', hex: '#6EE7B7' },
  { name: 'Crisp White', hex: '#FFFFFF' },
  { name: 'Sky Blue', hex: '#60A5FA' },
  { name: 'Warm Amber', hex: '#F59E0B' },
  { name: 'Rose Coral', hex: '#FB7185' },
];

export const PRESET_LIGHT_COLORS = [
  { name: 'Deep Emerald', hex: '#047857' },
  { name: 'Obsidian Slate', hex: '#0F172A' },
  { name: 'Ocean Blue', hex: '#2563EB' },
  { name: 'Deep Teal', hex: '#0D9488' },
  { name: 'Warm Bronze', hex: '#D97706' },
  { name: 'Rich Crimson', hex: '#BE123C' },
];

// Default backward compatibility aliases
export const PRESET_HERO_COLORS = PRESET_DARK_COLORS;

/**
 * Validates a 3, 6, or 8 digit HEX color string
 */
export function isValidHexColor(hex) {
  if (typeof hex !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/i.test(hex.trim());
}

/**
 * Extracts plain text from an array of rich-text segments
 */
export function getPlainText(segments = []) {
  if (!Array.isArray(segments)) return '';
  return segments.map((s) => s?.text || '').join('');
}

/**
 * Resolves the active color for an individual rich-text segment based on the active theme
 * Follows strict inheritance:
 * 1. Segment explicit color for active theme (segment.colors[theme])
 * 2. Segment legacy fallback (segment.color for dark, segment.lightColor for light)
 * 3. Parent layer color for active theme
 * 4. Theme default hero color (dark: #FFFFFF, light: #0F172A)
 */
export function resolveSegmentColor(segment, isDark, parentColor = null) {
  if (!segment) {
    return parentColor || (isDark ? '#FFFFFF' : '#0F172A');
  }

  const themeKey = isDark ? 'dark' : 'light';

  // 1. Check segment explicit theme color
  if (segment.colors && segment.colors[themeKey] && segment.colors[themeKey] !== 'inherit') {
    return segment.colors[themeKey];
  }

  // 2. Legacy fallback
  if (isDark && segment.color && segment.color !== 'inherit') {
    return segment.color;
  }
  if (!isDark) {
    if (segment.lightColor && segment.lightColor !== 'inherit') {
      return segment.lightColor;
    }
    if (segment.color && segment.color !== 'inherit') {
      return segment.color;
    }
  }

  // 3. Inherit from parent layer
  if (parentColor && parentColor !== 'inherit') {
    return parentColor;
  }

  // 4. Default Hero color
  return isDark ? '#FFFFFF' : '#0F172A';
}

/**
 * Resolves the active theme color for a layer
 */
export function resolveLayerColor(layer, isDark, heroDefaultColor = null) {
  if (!layer) {
    return heroDefaultColor || (isDark ? '#FFFFFF' : '#0F172A');
  }

  const typo = layer.typography || {};
  const themeKey = isDark ? 'dark' : 'light';

  if (typo.colors && typo.colors[themeKey] && typo.colors[themeKey] !== 'inherit') {
    return typo.colors[themeKey];
  }

  if (isDark && typo.color && typo.color !== 'inherit') {
    return typo.color;
  }
  if (!isDark) {
    if (typo.lightColor && typo.lightColor !== 'inherit') {
      return typo.lightColor;
    }
    if (typo.color && typo.color !== 'inherit') {
      return typo.color;
    }
  }

  if (heroDefaultColor && heroDefaultColor !== 'inherit') {
    return heroDefaultColor;
  }

  return isDark ? '#FFFFFF' : '#0F172A';
}

/**
 * Normalizes a segment to guarantee stable `colors` structure: { light, dark }
 */
export function normalizeSegmentColors(segment) {
  if (!segment) return segment;
  const existingColors = segment.colors || {};
  return {
    ...segment,
    colors: {
      dark: existingColors.dark !== undefined ? existingColors.dark : (segment.color || null),
      light: existingColors.light !== undefined ? existingColors.light : (segment.lightColor || null),
    },
    // Keep legacy color property aligned with dark for backward compatibility
    color: existingColors.dark || segment.color || '#FFFFFF',
  };
}

/**
 * Pure Text Range Slicing Algorithm with Theme-Aware Color Slicing.
 *
 * @param {Array} segments - Array of rich-text segment objects
 * @param {number} rangeStart - Start character offset
 * @param {number} rangeEnd - End character offset
 * @param {string|Object} newColor - Hex string, 'inherit', null, or { light, dark }
 * @param {string} targetTheme - 'dark' | 'light' | 'both'
 */
export function applyColorToRange(segments, rangeStart, rangeEnd, newColor, targetTheme = 'both') {
  if (!Array.isArray(segments) || rangeStart >= rangeEnd) return segments;

  const nextSegments = [];
  let currentOffset = 0;

  for (const seg of segments) {
    const segText = seg.text || '';
    const segLength = segText.length;
    const segStart = currentOffset;
    const segEnd = currentOffset + segLength;
    currentOffset = segEnd;

    // Segment completely before selection
    if (segEnd <= rangeStart) {
      nextSegments.push({ ...seg });
      continue;
    }

    // Segment completely after selection
    if (segStart >= rangeEnd) {
      nextSegments.push({ ...seg });
      continue;
    }

    // Segment intersects with selection
    const overlapStart = Math.max(segStart, rangeStart) - segStart;
    const overlapEnd = Math.min(segEnd, rangeEnd) - segStart;

    // 1. Prefix before overlap
    if (overlapStart > 0) {
      nextSegments.push({
        ...seg,
        id: `${seg.id}-p`,
        text: segText.slice(0, overlapStart),
      });
    }

    // 2. The highlighted overlap
    const highlightedText = segText.slice(overlapStart, overlapEnd);
    const prevColors = seg.colors || {
      dark: seg.color || null,
      light: seg.lightColor || null,
    };

    let nextColors = { ...prevColors };

    if (typeof newColor === 'object' && newColor !== null) {
      if (newColor.dark !== undefined) nextColors.dark = newColor.dark;
      if (newColor.light !== undefined) nextColors.light = newColor.light;
    } else {
      const colorVal = (newColor === 'inherit' || newColor === null) ? null : newColor;
      if (targetTheme === 'dark') {
        nextColors.dark = colorVal;
      } else if (targetTheme === 'light') {
        nextColors.light = colorVal;
      } else {
        // 'both'
        nextColors.dark = colorVal;
        nextColors.light = colorVal;
      }
    }

    nextSegments.push({
      ...seg,
      id: `seg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      text: highlightedText,
      colors: nextColors,
      color: nextColors.dark || seg.color || '#FFFFFF',
    });

    // 3. Suffix after overlap
    if (overlapEnd < segLength) {
      nextSegments.push({
        ...seg,
        id: `${seg.id}-s`,
        text: segText.slice(overlapEnd),
      });
    }
  }

  return cleanAndMergeSegments(nextSegments);
}

/**
 * Applies custom style updates (e.g. bold, italic, letterSpacing) and animation
 * to a selected character range within rich-text segments.
 */
export function applyStyleToRange(segments, rangeStart, rangeEnd, styleUpdates = {}, animUpdates = null) {
  if (!Array.isArray(segments) || rangeStart >= rangeEnd) return segments;

  const nextSegments = [];
  let currentOffset = 0;

  for (const seg of segments) {
    const segText = seg.text || '';
    const segLength = segText.length;
    const segStart = currentOffset;
    const segEnd = currentOffset + segLength;
    currentOffset = segEnd;

    if (segEnd <= rangeStart || segStart >= rangeEnd) {
      nextSegments.push({ ...seg });
      continue;
    }

    const overlapStart = Math.max(segStart, rangeStart) - segStart;
    const overlapEnd = Math.min(segEnd, rangeEnd) - segStart;

    if (overlapStart > 0) {
      nextSegments.push({
        ...seg,
        id: `${seg.id}-p`,
        text: segText.slice(0, overlapStart),
      });
    }

    const highlightedText = segText.slice(overlapStart, overlapEnd);
    nextSegments.push({
      ...seg,
      id: `seg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      text: highlightedText,
      ...styleUpdates,
      ...(animUpdates ? { animation: { ...(seg.animation || {}), ...animUpdates } } : {}),
    });

    if (overlapEnd < segLength) {
      nextSegments.push({
        ...seg,
        id: `${seg.id}-s`,
        text: segText.slice(overlapEnd),
      });
    }
  }

  return cleanAndMergeSegments(nextSegments);
}

/**
 * Filter out empty segments while preserving inter-word spacing.
 */
function cleanAndMergeSegments(segments) {
  return segments.filter((seg) => seg && typeof seg.text === 'string' && seg.text.length > 0);
}
