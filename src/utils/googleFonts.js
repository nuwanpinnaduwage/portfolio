// Utility for dynamic Google Fonts loading and curated font metadata

// Cache of loaded font families to avoid duplicate <link> elements
const loadedFonts = new Set();

/**
 * Dynamically loads a Google Font by family name.
 * Safe for client-side execution; no-op during SSR.
 */
export function loadGoogleFont(fontFamily) {
  if (typeof window === 'undefined' || !fontFamily) return;

  const sanitized = fontFamily.trim().replace(/['"]/g, '');
  if (!sanitized || sanitized === 'system-ui' || sanitized === 'monospace' || sanitized === 'sans-serif') return;

  // Check if standard web-safe font
  const systemFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Trebuchet MS'];
  if (systemFonts.includes(sanitized)) return;

  if (loadedFonts.has(sanitized)) return;
  loadedFonts.add(sanitized);

  try {
    const formattedFamily = sanitized.replace(/\s+/g, '+');
    const linkId = `gfont-${formattedFamily.toLowerCase()}`;

    if (document.getElementById(linkId)) return;

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap`;
    document.head.appendChild(link);
  } catch (err) {
    console.warn(`Failed to dynamically load Google Font "${sanitized}":`, err);
  }
}

// Curated list of popular, high-quality Google Fonts categorized by genre
export const GOOGLE_FONTS_CATALOG = [
  // Sans-Serif
  { name: 'Roboto', category: 'Sans-Serif', weights: [300, 400, 500, 700] },
  { name: 'Manrope', category: 'Sans-Serif', weights: [400, 500, 600, 700, 800] },
  { name: 'Inter', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Open Sans', category: 'Sans-Serif', weights: [300, 400, 600, 700] },
  { name: 'Montserrat', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Poppins', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Lato', category: 'Sans-Serif', weights: [300, 400, 700] },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', weights: [400, 500, 600, 700] },
  { name: 'Outfit', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Work Sans', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { name: 'DM Sans', category: 'Sans-Serif', weights: [400, 500, 700] },
  { name: 'Space Grotesk', category: 'Sans-Serif', weights: [400, 500, 600, 700] },
  { name: 'Nunito', category: 'Sans-Serif', weights: [300, 400, 600, 700] },
  { name: 'Raleway', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Cabinet Grotesk', category: 'Sans-Serif', weights: [400, 700, 800] },
  { name: 'Sora', category: 'Sans-Serif', weights: [400, 600, 700] },

  // Serif
  { name: 'Playfair Display', category: 'Serif', weights: [400, 500, 600, 700] },
  { name: 'Merriweather', category: 'Serif', weights: [300, 400, 700] },
  { name: 'Lora', category: 'Serif', weights: [400, 500, 600, 700] },
  { name: 'Cinzel', category: 'Serif', weights: [400, 600, 700] },
  { name: 'EB Garamond', category: 'Serif', weights: [400, 500, 600, 700] },
  { name: 'Cormorant Garamond', category: 'Serif', weights: [400, 600, 700] },
  { name: 'Bitter', category: 'Serif', weights: [400, 600, 700] },
  { name: 'PT Serif', category: 'Serif', weights: [400, 700] },

  // Monospace
  { name: 'Fira Code', category: 'Monospace', weights: [400, 500, 600, 700] },
  { name: 'JetBrains Mono', category: 'Monospace', weights: [400, 500, 700] },
  { name: 'Source Code Pro', category: 'Monospace', weights: [400, 500, 600] },
  { name: 'Inconsolata', category: 'Monospace', weights: [400, 600, 700] },
  { name: 'Space Mono', category: 'Monospace', weights: [400, 700] },
  { name: 'IBM Plex Mono', category: 'Monospace', weights: [400, 500, 600] },

  // Display
  { name: 'Syne', category: 'Display', weights: [500, 700, 800] },
  { name: 'Bebas Neue', category: 'Display', weights: [400] },
  { name: 'Oswald', category: 'Display', weights: [400, 500, 600, 700] },
  { name: 'Clash Display', category: 'Display', weights: [500, 600, 700] },
  { name: 'Righteous', category: 'Display', weights: [400] },
  { name: 'Abril Fatface', category: 'Display', weights: [400] },
  { name: 'Anton', category: 'Display', weights: [400] },
  { name: 'Unbounded', category: 'Display', weights: [400, 600, 800] },
];
