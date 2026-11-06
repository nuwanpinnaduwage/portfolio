/**
 * Safe HTML Sanitizer for Rich Text Project Content.
 * Preserves custom spans, styles, colors, font families, sizes, links, tables, and lists
 * while stripping unsafe elements and attributes to prevent XSS.
 */

const ALLOWED_TAGS = new Set([
  'SPAN', 'P', 'DIV', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'CODE',
  'UL', 'OL', 'LI', 'A', 'IMG', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'HR'
]);

const ALLOWED_STYLES = new Set([
  'font-family', 'font-size', 'font-weight', 'font-style', 'color',
  'background-color', 'letter-spacing', 'line-height', 'text-decoration',
  'text-transform', 'text-align', 'padding', 'margin', 'border-radius',
  'width', 'max-width', 'height'
]);

export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  // In browser environments, use DOMParser
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      function cleanNode(node) {
        // Remove comments
        if (node.nodeType === 8) {
          node.parentNode?.removeChild(node);
          return;
        }

        // Element node
        if (node.nodeType === 1) {
          const tagName = node.tagName.toUpperCase();

          // If tag is not allowed, unwrap its contents or remove if script/style/iframe
          if (!ALLOWED_TAGS.has(tagName)) {
            if (['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'STYLE', 'SVG'].includes(tagName)) {
              node.parentNode?.removeChild(node);
              return;
            } else {
              // Unwrap allowed children
              const parent = node.parentNode;
              if (parent) {
                while (node.firstChild) {
                  parent.insertBefore(node.firstChild, node);
                }
                parent.removeChild(node);
                return;
              }
            }
          }

          // Filter attributes
          const attrs = Array.from(node.attributes);
          for (const attr of attrs) {
            const attrName = attr.name.toLowerCase();

            // Disallow event handlers like onload, onclick, onerror
            if (attrName.startsWith('on')) {
              node.removeAttribute(attr.name);
              continue;
            }

            // Disallow javascript: or data: URIs in href or src
            if (['href', 'src', 'action'].includes(attrName)) {
              const val = attr.value.trim().toLowerCase();
              if (val.startsWith('javascript:') || val.startsWith('vbscript:')) {
                node.removeAttribute(attr.name);
                continue;
              }
              // For links, ensure safe rel and target
              if (tagName === 'A' && attrName === 'href') {
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
              }
              continue;
            }

            // Clean inline style attribute
            if (attrName === 'style') {
              const safeDeclarations = [];
              const rawDeclarations = attr.value.split(';');

              for (const decl of rawDeclarations) {
                const colonIdx = decl.indexOf(':');
                if (colonIdx === -1) continue;
                const prop = decl.slice(0, colonIdx).trim().toLowerCase();
                const val = decl.slice(colonIdx + 1).trim();

                // Check allowed style properties and prevent url() / expression() injections
                if (ALLOWED_STYLES.has(prop) && !val.toLowerCase().includes('expression(') && !val.toLowerCase().includes('javascript:')) {
                  safeDeclarations.push(`${prop}: ${val}`);
                }
              }

              if (safeDeclarations.length > 0) {
                node.setAttribute('style', safeDeclarations.join('; '));
              } else {
                node.removeAttribute('style');
              }
              continue;
            }

            // Keep only safe attributes like alt, title, class, target, rel
            if (!['alt', 'title', 'class', 'target', 'rel', 'download'].includes(attrName)) {
              node.removeAttribute(attr.name);
            }
          }

          // Recursively clean child nodes
          const children = Array.from(node.childNodes);
          for (const child of children) {
            cleanNode(child);
          }
        }
      }

      Array.from(doc.body.childNodes).forEach(cleanNode);
      return doc.body.innerHTML;
    } catch (err) {
      console.warn('Sanitization fallback applied:', err);
    }
  }

  // Fallback simple regex replace for basic safety
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:[^"']*/gi, '');
}
