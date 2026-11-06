import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  RotateCcw, 
  RotateCw, 
  Undo2,
  Redo2,
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Columns, 
  Type, 
  Image as ImageIcon, 
  Table as TableIcon, 
  List, 
  FileText, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Film,
  Monitor, 
  Tablet, 
  Smartphone, 
  Upload, 
  X, 
  Check, 
  Search, 
  SlidersHorizontal, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Heading1, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  RemoveFormatting,
  AlertTriangle,
  Highlighter,
  CheckSquare,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { GithubIcon } from '../BrandIcons';
import { loadGoogleFont, GOOGLE_FONTS_CATALOG } from '../../utils/googleFonts';
import { sanitizeHtml } from '../../utils/richTextSanitizer';

// Preset color swatches including Clean Slate theme tokens
const THEME_PRESET_COLORS = [
  '#0A0A0A', '#121212', '#1A1A1A', '#262626', '#2D3748',
  '#FFFFFF', '#F5F7FA', '#E2E8F0', '#A0AEC0', '#718096',
  '#10B981', '#059669', '#3B82F6', '#2563EB', '#8B5CF6',
  '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#F97316'
];

export default function AdvancedProjectVisualEditor({ 
  initialProject, 
  onSave, 
  onClose, 
  uploadAsset 
}) {
  // -------------------------------------------------------------
  // PROJECT NORMALIZATION & INITIALIZATION
  // -------------------------------------------------------------
  const normalizeProject = (raw) => {
    const base = { ...raw };
    base.title = base.title || '';
    base.slug = base.slug || base.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    base.category = base.category || 'Cybersecurity';
    base.subcategory = base.subcategory || '';
    base.type = base.type || 'Security Tool';
    base.status = base.status || 'Completed';
    base.completionYear = base.completionYear || '2024';
    base.tagline = base.tagline || '';
    base.description = base.description || '';
    base.image = base.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900';
    base.gallery = Array.isArray(base.gallery) ? base.gallery : (base.image ? [base.image] : []);
    base.github = base.github || '';
    base.demo = base.demo || '';
    base.documentationUrl = base.documentationUrl || '';
    base.technologies = Array.isArray(base.technologies) ? base.technologies : [];
    base.tags = Array.isArray(base.tags) ? base.tags : base.technologies;
    base.metrics = Array.isArray(base.metrics) ? base.metrics : [];
    base.attachments = Array.isArray(base.attachments) ? base.attachments : [];
    base.customStyling = (typeof base.custom_styling === 'object' && base.custom_styling) ? base.custom_styling : (base.customStyling || {});
    base.is_published = base.is_published !== undefined ? Boolean(base.is_published) : true;

    // Synthesize structured sections from existing fields if empty
    if (!Array.isArray(base.sections) || base.sections.length === 0) {
      const generatedSections = [];

      // Section 1: Overview & Problem Statement
      const s1Blocks = [];
      if (base.fullOverview || base.description) {
        s1Blocks.push({
          id: `blk-${Date.now()}-1`,
          type: 'text',
          content: base.fullOverview || base.description,
          fontSize: '15px',
          lineHeight: '1.7',
        });
      }
      if (base.problemStatement) {
        s1Blocks.push({
          id: `blk-${Date.now()}-2`,
          type: 'callout',
          content: base.problemStatement,
        });
      }
      if (s1Blocks.length > 0) {
        generatedSections.push({
          id: `sec-${Date.now()}-1`,
          title: 'Problem Statement & System Constraints',
          columnsCount: 1,
          columns: [{ id: 'col-1', blocks: s1Blocks }]
        });
      }

      // Section 2: Architecture & Implementation
      const s2Blocks = [];
      if (base.proposedSolution) {
        s2Blocks.push({
          id: `blk-${Date.now()}-3`,
          type: 'text',
          content: base.proposedSolution,
          fontSize: '15px',
          lineHeight: '1.7',
        });
      }
      if (base.technicalImplementation) {
        s2Blocks.push({
          id: `blk-${Date.now()}-4`,
          type: 'text',
          content: base.technicalImplementation,
          fontSize: '15px',
          lineHeight: '1.7',
        });
      }
      if (base.architectureDiagram || base.topologyDiagram) {
        s2Blocks.push({
          id: `blk-${Date.now()}-5`,
          type: 'image',
          imageUrl: base.architectureDiagram || base.topologyDiagram,
          caption: 'System Architecture & Infrastructure Topology',
          imageAlign: 'center',
          borderRadius: '12px',
        });
      }
      if (s2Blocks.length > 0) {
        generatedSections.push({
          id: `sec-${Date.now()}-2`,
          title: 'Technical Architecture & Implementation',
          columnsCount: 1,
          columns: [{ id: 'col-1', blocks: s2Blocks }]
        });
      }

      // Section 3: Performance Benchmarks
      if (base.metrics && base.metrics.length > 0) {
        generatedSections.push({
          id: `sec-${Date.now()}-3`,
          title: 'Benchmark Metrics & Verified Results',
          columnsCount: 2,
          columns: [
            {
              id: 'col-1',
              blocks: [
                {
                  id: `blk-${Date.now()}-6`,
                  type: 'callout',
                  content: base.metrics[0] || 'High performance throughput verified.',
                }
              ]
            },
            {
              id: 'col-2',
              blocks: [
                {
                  id: `blk-${Date.now()}-7`,
                  type: 'callout',
                  content: base.metrics[1] || (base.results || 'Production-grade security compliance achieved.'),
                }
              ]
            }
          ]
        });
      }

      base.sections = generatedSections.length > 0 ? generatedSections : [
        {
          id: `sec-${Date.now()}-init`,
          title: 'Project Overview',
          columnsCount: 1,
          columns: [
            {
              id: 'col-1',
              blocks: [
                {
                  id: `blk-${Date.now()}-init`,
                  type: 'text',
                  content: 'Describe your engineering architecture, constraints, and solutions here.',
                  fontSize: '15px',
                  lineHeight: '1.7',
                }
              ]
            }
          ]
        }
      ];
    }

    return base;
  };

  // State
  const [project, setProject] = useState(() => normalizeProject(initialProject));
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [insertDropdownOpen, setInsertDropdownOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState('canvas'); // 'structure' | 'canvas' | 'inspector' (for small screens)

  // Selection state
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('typography'); // 'typography' | 'block' | 'section' | 'project'

  // Selected Text Range Reference & Floating Toolbar State
  const [activeTextSelection, setActiveTextSelection] = useState(null);
  const [floatingToolbarPos, setFloatingToolbarPos] = useState(null);
  const savedRangeRef = useRef(null);

  // History for Undo / Redo
  const [history, setHistory] = useState([normalizeProject(initialProject)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Recent custom colors (persisted in localStorage)
  const [recentColors, setRecentColors] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_recent_colors');
      return saved ? JSON.parse(saved) : THEME_PRESET_COLORS.slice(0, 8);
    } catch {
      return THEME_PRESET_COLORS.slice(0, 8);
    }
  });

  const addRecentColor = (color) => {
    if (!color) return;
    setRecentColors(prev => {
      const next = [color, ...prev.filter(c => c.toLowerCase() !== color.toLowerCase())].slice(0, 16);
      try { localStorage.setItem('portfolio_recent_colors', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Font Search
  const [fontSearch, setFontSearch] = useState('');

  // Saving & Status
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const isSavingRef = useRef(false);

  // Debounce timer for continuous typing grouping
  const typingDebounceRef = useRef(null);

  // Push to undo/redo history with support for immediate checkpoints and grouped continuous typing
  const updateProjectWithHistory = useCallback((updater, immediate = true) => {
    setProject((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      
      if (immediate) {
        if (typingDebounceRef.current) {
          clearTimeout(typingDebounceRef.current);
          typingDebounceRef.current = null;
        }
        setHistory((prevHist) => {
          const sliced = prevHist.slice(0, historyIndex + 1);
          return [...sliced, next].slice(-60);
        });
        setHistoryIndex((prevIdx) => {
          const newLen = Math.min(prevIdx + 2, 60);
          return newLen - 1;
        });
        setSaveStatus('unsaved');
      } else {
        // Continuous typing: update live state immediately, group snapshot with 600ms debounce
        setSaveStatus('unsaved');
        if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
        typingDebounceRef.current = setTimeout(() => {
          setHistory((prevHist) => {
            const sliced = prevHist.slice(0, historyIndex + 1);
            return [...sliced, next].slice(-60);
          });
          setHistoryIndex((prevIdx) => {
            const newLen = Math.min(prevIdx + 2, 60);
            return newLen - 1;
          });
        }, 600);
      }
      return next;
    });
  }, [historyIndex]);

  // Synchronize live contentEditable DOM elements with project state on Undo / Redo
  const syncDomWithState = (targetState) => {
    if (!targetState || !Array.isArray(targetState.sections)) return;
    setTimeout(() => {
      targetState.sections.forEach(sec => {
        (sec.columns || []).forEach(col => {
          (col.blocks || []).forEach(b => {
            const el = document.querySelector(`[data-editable-block-id="${b.id}"]`);
            if (el && b.content !== undefined && el.innerHTML !== b.content) {
              el.innerHTML = b.content;
            }
          });
        });
      });
    }, 10);
  };

  // Undo
  const handleUndo = useCallback(() => {
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
      typingDebounceRef.current = null;
    }
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const targetState = history[newIdx];
      setHistoryIndex(newIdx);
      setProject(targetState);
      setSaveStatus('unsaved');
      syncDomWithState(targetState);
    }
  }, [historyIndex, history]);

  // Redo
  const handleRedo = useCallback(() => {
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
      typingDebounceRef.current = null;
    }
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      const targetState = history[newIdx];
      setHistoryIndex(newIdx);
      setProject(targetState);
      setSaveStatus('unsaved');
      syncDomWithState(targetState);
    }
  }, [historyIndex, history]);

  // Keyboard Shortcuts for Undo (Ctrl+Z / Cmd+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Ctrl+Z or Cmd+Z (without Shift)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Shift+Z, Cmd+Shift+Z, or Ctrl+Y
      else if (((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && e.shiftKey) ||
               ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y'))) {
        e.preventDefault();
        handleRedo();
      }
      // Save: Ctrl+S or Cmd+S
      else if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSave(project.is_published);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, project.is_published]);

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = 'You have unsaved project modifications.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Preload any custom Google Fonts
  useEffect(() => {
    (project.sections || []).forEach(sec => {
      (sec.columns || []).forEach(col => {
        (col.blocks || []).forEach(b => {
          if (b.fontFamily) loadGoogleFont(b.fontFamily);
          if (b.content && typeof b.content === 'string') {
            const fontMatches = b.content.matchAll(/font-family:\s*['"]?([^;'"]+)['"]?/gi);
            for (const match of fontMatches) {
              if (match[1]) loadGoogleFont(match[1]);
            }
          }
        });
      });
    });
  }, [project.sections]);

  // Current selected block reference
  const currentSection = (project.sections || []).find(s => s.id === selectedSectionId) || project.sections?.[0];
  const currentColumn = currentSection?.columns?.[selectedColumnIndex] || currentSection?.columns?.[0];
  const currentBlock = currentColumn?.blocks?.find(b => b.id === selectedBlockId);

  // -------------------------------------------------------------
  // SELECTION DETECTION & FLOATING TOOLBAR COORDINATOR
  // -------------------------------------------------------------
  const handleSelectionChange = useCallback(() => {
    // If the active element or target is inside the inspector or floating toolbar, retain the saved selection
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.closest('[data-inspector-panel]') || activeEl.closest('[data-floating-toolbar]'))) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (document.activeElement && (document.activeElement.closest('[data-inspector-panel]') || document.activeElement.closest('[data-floating-toolbar]'))) {
        return;
      }
      setActiveTextSelection(null);
      setFloatingToolbarPos(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();
    if (!selectedText) {
      if (document.activeElement && (document.activeElement.closest('[data-inspector-panel]') || document.activeElement.closest('[data-floating-toolbar]'))) {
        return;
      }
      setActiveTextSelection(null);
      setFloatingToolbarPos(null);
      return;
    }

    // Check if the selection belongs inside an editable block container
    let container = range.commonAncestorContainer;
    if (container.nodeType === 3) container = container.parentElement;

    // Ignore if selection is inside inspector or toolbar
    if (container && (container.closest('[data-inspector-panel]') || container.closest('[data-floating-toolbar]'))) {
      return;
    }

    const editableBlockEl = container ? container.closest('[data-editable-block-id]') : null;

    if (editableBlockEl) {
      const blockId = editableBlockEl.getAttribute('data-editable-block-id');
      savedRangeRef.current = range.cloneRange();
      setActiveTextSelection({ blockId, text: selectedText });

      const rect = range.getBoundingClientRect();
      setFloatingToolbarPos({
        top: Math.max(70, rect.top - 52),
        left: Math.max(16, Math.min(window.innerWidth - 380, rect.left + rect.width / 2 - 180)),
      });
    } else {
      setActiveTextSelection(null);
      setFloatingToolbarPos(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Flush DOM content from active contentEditable back into project state
  const flushBlockContent = (blockId, forcedHtml = null) => {
    const targetBlockId = blockId || selectedBlockId || activeTextSelection?.blockId;
    if (!targetBlockId) return;

    let html = forcedHtml;
    if (html === null) {
      const el = document.querySelector(`[data-editable-block-id="${targetBlockId}"]`);
      if (el) html = el.innerHTML;
    }
    if (html === null) return;

    updateProjectWithHistory(prev => {
      const updated = prev.sections.map(sec => ({
        ...sec,
        columns: (sec.columns || []).map(col => ({
          ...col,
          blocks: (col.blocks || []).map(b => b.id === targetBlockId ? { ...b, content: html } : b)
        }))
      }));
      return { ...prev, sections: updated };
    });
  };

  // -------------------------------------------------------------
  // SELECTED TEXT FORMATTING ENGINE (Word & Sentence Level)
  // -------------------------------------------------------------
  const applyFormatToSelection = ({
    fontFamily,
    fontSize,
    color,
    bgColor,
    bold,
    italic,
    underline,
    strikethrough,
    fontWeight,
    letterSpacing,
    clear
  }) => {
    const selection = window.getSelection();
    let range = (selection && selection.rangeCount > 0 && !selection.isCollapsed) 
      ? selection.getRangeAt(0) 
      : savedRangeRef.current;

    if (!range || range.collapsed) return;

    // Ensure target block is focused
    let container = range.commonAncestorContainer;
    if (container.nodeType === 3) container = container.parentElement;
    const editableBlockEl = container ? container.closest('[data-editable-block-id]') : null;
    if (editableBlockEl && typeof editableBlockEl.focus === 'function') {
      editableBlockEl.focus();
    }

    // Restore range if needed
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // 1. Clear Formatting
    if (clear) {
      document.execCommand('removeFormat', false, null);
      document.execCommand('unlink', false, null);
      
      // Also unwrap any styled spans in range
      if (container) {
        if (container.tagName === 'SPAN' && !container.hasAttribute('data-editable-block-id')) {
          const parent = container.parentNode;
          if (parent) {
            while (container.firstChild) parent.insertBefore(container.firstChild, container);
            parent.removeChild(container);
          }
        } else {
          const spans = container.querySelectorAll ? container.querySelectorAll('span') : [];
          spans.forEach(sp => {
            const p = sp.parentNode;
            if (p) {
              while (sp.firstChild) p.insertBefore(sp.firstChild, sp);
              p.removeChild(sp);
            }
          });
        }
      }
      flushBlockContent();
      return;
    }

    // 2. Standard Toggles
    if (bold !== undefined) document.execCommand('bold', false, null);
    if (italic !== undefined) document.execCommand('italic', false, null);
    if (underline !== undefined) document.execCommand('underline', false, null);
    if (strikethrough !== undefined) document.execCommand('strikeThrough', false, null);

    // 3. Advanced Style Wrapping (Font, Size, Color, Highlight, Letter Spacing, Weight)
    const hasStyles = fontFamily || fontSize || color || bgColor || letterSpacing || fontWeight;
    if (hasStyles) {
      if (fontFamily) loadGoogleFont(fontFamily);
      if (color) addRecentColor(color);
      if (bgColor && bgColor !== 'transparent') addRecentColor(bgColor);

      let parentSpan = range.commonAncestorContainer;
      if (parentSpan.nodeType === 3) parentSpan = parentSpan.parentElement;

      if (parentSpan && parentSpan.tagName === 'SPAN' && parentSpan.innerText === range.toString()) {
        if (fontFamily) parentSpan.style.fontFamily = fontFamily;
        if (fontSize) parentSpan.style.fontSize = formatSizeUnit(fontSize);
        if (color) parentSpan.style.color = color;
        if (bgColor) parentSpan.style.backgroundColor = bgColor;
        if (letterSpacing) parentSpan.style.letterSpacing = letterSpacing;
        if (fontWeight) parentSpan.style.fontWeight = fontWeight;
      } else {
        const fragment = range.extractContents();
        const span = document.createElement('span');

        if (fontFamily) span.style.fontFamily = fontFamily;
        if (fontSize) span.style.fontSize = formatSizeUnit(fontSize);
        if (color) span.style.color = color;
        if (bgColor) span.style.backgroundColor = bgColor;
        if (letterSpacing) span.style.letterSpacing = letterSpacing;
        if (fontWeight) span.style.fontWeight = fontWeight;

        span.appendChild(fragment);
        range.insertNode(span);

        // Keep newly formatted span actively selected
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);
        savedRangeRef.current = newRange.cloneRange();
      }
    }

    flushBlockContent();
  };

  // Helper to validate and format size unit (e.g. 24 -> 24px)
  const formatSizeUnit = (val) => {
    if (!val) return '15px';
    const str = String(val).trim();
    if (/^\d+(\.\d+)?$/.test(str)) {
      return `${str}px`;
    }
    return str;
  };

  // -------------------------------------------------------------
  // SECTION & TOPIC MANAGEMENT
  // -------------------------------------------------------------
  const handleAddSection = () => {
    const newSec = {
      id: `sec-${Date.now()}`,
      title: 'New Section Topic',
      columnsCount: 1,
      columns: [
        {
          id: `col-${Date.now()}-1`,
          blocks: [
            {
              id: `blk-${Date.now()}-1`,
              type: 'text',
              content: 'Add technical description, specifications, or diagrams here.',
              fontSize: '15px',
              lineHeight: '1.7',
            }
          ]
        }
      ]
    };
    updateProjectWithHistory(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSec]
    }));
    setSelectedSectionId(newSec.id);
    setSelectedBlockId(newSec.columns[0].blocks[0].id);
    setActiveInspectorTab('section');
  };

  const handleDeleteSection = (secId) => {
    if ((project.sections || []).length <= 1) {
      alert("A project must contain at least one section.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this entire section topic?")) return;
    updateProjectWithHistory(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== secId)
    }));
    setSelectedSectionId(project.sections[0]?.id || null);
    setSelectedBlockId(null);
  };

  const handleDuplicateSection = (secId) => {
    const sec = project.sections.find(s => s.id === secId);
    if (!sec) return;
    const duplicated = JSON.parse(JSON.stringify(sec));
    duplicated.id = `sec-${Date.now()}`;
    duplicated.title = `${duplicated.title} (Copy)`;
    duplicated.columns.forEach(c => {
      c.id = `col-${Date.now()}-${Math.random()}`;
      c.blocks.forEach(b => { b.id = `blk-${Date.now()}-${Math.random()}`; });
    });
    const idx = project.sections.findIndex(s => s.id === secId);
    const updated = [...project.sections];
    updated.splice(idx + 1, 0, duplicated);
    updateProjectWithHistory(prev => ({ ...prev, sections: updated }));
  };

  const handleMoveSection = (secId, direction) => {
    const idx = project.sections.findIndex(s => s.id === secId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= project.sections.length) return;
    const updated = [...project.sections];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    updateProjectWithHistory(prev => ({ ...prev, sections: updated }));
  };

  const handleSetSectionColumns = (secId, count) => {
    updateProjectWithHistory(prev => {
      const updated = prev.sections.map(sec => {
        if (sec.id !== secId) return sec;
        const currentCols = sec.columns || [];
        let newCols = [...currentCols];
        if (count > currentCols.length) {
          for (let i = currentCols.length; i < count; i++) {
            newCols.push({ id: `col-${Date.now()}-${i}`, blocks: [] });
          }
        } else if (count < currentCols.length) {
          const overflowBlocks = currentCols.slice(count).flatMap(c => c.blocks || []);
          newCols = currentCols.slice(0, count);
          newCols[count - 1].blocks = [...(newCols[count - 1].blocks || []), ...overflowBlocks];
        }
        return { ...sec, columnsCount: count, columns: newCols };
      });
      return { ...prev, sections: updated };
    });
  };

  // -------------------------------------------------------------
  // BLOCK MANAGEMENT
  // -------------------------------------------------------------
  const handleAddBlock = (type) => {
    const secId = selectedSectionId || project.sections[0]?.id;
    if (!secId) return;

    let newBlock = {
      id: `blk-${Date.now()}`,
      type,
    };

    if (type === 'text') {
      newBlock.content = 'New formatted paragraph text. Highlight any word to style independently.';
      newBlock.fontSize = '15px';
      newBlock.lineHeight = '1.7';
    } else if (type === 'heading') {
      newBlock.content = 'Section Topic Heading';
      newBlock.headingLevel = 'h3';
      newBlock.fontSize = '22px';
      newBlock.fontWeight = '700';
    } else if (type === 'callout') {
      newBlock.content = 'Important technical constraint, engineering metric, or architecture parameter.';
    } else if (type === 'image') {
      newBlock.imageUrl = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900';
      newBlock.caption = 'Architecture component illustration';
      newBlock.imageWidth = '100%';
      newBlock.borderRadius = '12px';
    } else if (type === 'table') {
      newBlock.tableData = {
        hasHeader: true,
        rows: [
          [{ text: 'Parameter' }, { text: 'Default' }, { text: 'Benchmark' }],
          [{ text: 'Inspection Queue' }, { text: '64 KB' }, { text: '16 MB Ring' }],
          [{ text: 'End-to-End Latency' }, { text: '18.4 ms' }, { text: '< 4.2 ms' }]
        ]
      };
    } else if (type === 'list') {
      newBlock.listType = 'bullet';
      newBlock.listItems = [
        { text: 'Core network socket optimization.' },
        { text: 'Zero-copy kernel packet capture buffer.' },
        { text: 'Real-time SIEM syslog dispatch.' }
      ];
    } else if (type === 'attachment') {
      newBlock.attachment = {
        name: 'Technical_Whitepaper.pdf',
        url: '#',
        size: '2.4 MB',
        fileType: 'pdf'
      };
    }

    updateProjectWithHistory(prev => {
      const updated = prev.sections.map(sec => {
        if (sec.id !== secId) return sec;
        const colIdx = Math.min(selectedColumnIndex, (sec.columns?.length || 1) - 1);
        const cols = [...(sec.columns || [{ id: 'c1', blocks: [] }])];
        cols[colIdx] = {
          ...cols[colIdx],
          blocks: [...(cols[colIdx].blocks || []), newBlock]
        };
        return { ...sec, columns: cols };
      });
      return { ...prev, sections: updated };
    });

    setSelectedBlockId(newBlock.id);
    setActiveInspectorTab(type === 'text' || type === 'heading' ? 'typography' : 'block');
  };

  const handleUpdateCurrentBlock = (updates) => {
    if (!selectedBlockId || !selectedSectionId) return;
    updateProjectWithHistory(prev => {
      const updated = prev.sections.map(sec => {
        if (sec.id !== selectedSectionId) return sec;
        const cols = (sec.columns || []).map(col => ({
          ...col,
          blocks: (col.blocks || []).map(b => b.id === selectedBlockId ? { ...b, ...updates } : b)
        }));
        return { ...sec, columns: cols };
      });
      return { ...prev, sections: updated };
    });
  };

  const handleDeleteBlock = (blockId) => {
    updateProjectWithHistory(prev => {
      const updated = prev.sections.map(sec => ({
        ...sec,
        columns: (sec.columns || []).map(col => ({
          ...col,
          blocks: (col.blocks || []).filter(b => b.id !== blockId)
        }))
      }));
      return { ...prev, sections: updated };
    });
    setSelectedBlockId(null);
  };

  // Upload handlers
  const handleUploadBlockImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadAsset(file, 'projects');
      if (res?.publicUrl) {
        handleUpdateCurrentBlock({ imageUrl: res.publicUrl });
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAttachment = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadAsset(file, 'attachments');
      if (res?.publicUrl) {
        const ext = file.name.split('.').pop() || 'file';
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        const newAtt = {
          name: file.name,
          url: res.publicUrl,
          size: sizeMb,
          fileType: ext
        };
        updateProjectWithHistory(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), newAtt]
        }));
      }
    } catch (err) {
      alert("Attachment upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------------------------
  // RELIABLE SAVING & AUTOSAVE ARCHITECTURE
  // -------------------------------------------------------------
  const handleSave = async (publish = true) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    setSaveStatus('saving');
    setStatusMessage('Saving project to database...');

    // Force flush all active contentEditable elements from live DOM to eliminate stale state
    let currentSections = project.sections;
    if (Array.isArray(currentSections)) {
      currentSections = currentSections.map(sec => ({
        ...sec,
        columns: (sec.columns || []).map(col => ({
          ...col,
          blocks: (col.blocks || []).map(b => {
            const el = document.querySelector(`[data-editable-block-id="${b.id}"]`);
            if (el) {
              return { ...b, content: el.innerHTML };
            }
            return b;
          })
        }))
      }));
    }

    const payload = {
      ...project,
      sections: currentSections,
      is_published: publish,
      slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      updated_at: new Date().toISOString(),
    };

    // Keep React state in sync with flushed DOM
    setProject(prev => ({ ...prev, sections: currentSections }));

    try {
      const res = await onSave(payload);
      if (res?.error || res?.success === false) {
        setSaveStatus('error');
        setStatusMessage(res?.error || 'Save operation failed');
      } else {
        setSaveStatus('saved');
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(timeStr);
        setStatusMessage(publish ? `Published live at ${timeStr}` : `Draft saved at ${timeStr}`);
      }
    } catch (err) {
      setSaveStatus('error');
      setStatusMessage(err.message || 'Save failed');
    } finally {
      isSavingRef.current = false;
    }
  };

  // Debounced Autosave (Every 25 seconds if changes are unsaved)
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;

    const timer = setTimeout(() => {
      // Background autosave as draft
      handleSave(project.is_published);
    }, 25000);

    return () => clearTimeout(timer);
  }, [saveStatus, project]);

  return (
    <div className="w-full h-screen h-[100dvh] max-h-[100dvh] bg-[#0A0A0A] text-white flex flex-col overflow-hidden font-sans select-none fixed inset-0 z-50">
      
      {/* ========================================================= */}
      {/* 1. TOP WORKSPACE TOOLBAR                                  */}
      {/* ========================================================= */}
      <header className="h-14 border-b border-[#222222] bg-[#121212] px-2 sm:px-4 flex items-center justify-between shrink-0 z-30 gap-1 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E1E1E] transition-colors cursor-pointer shrink-0"
            title="Exit Visual Studio"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:inline shrink-0">
              Visual Studio
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span 
              className="text-xs sm:text-sm font-semibold text-white truncate max-w-[70px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[240px] lg:max-w-[320px]"
              title={project.title || 'Untitled Project'}
            >
              {project.title || 'Untitled Project'}
            </span>
          </div>

          {/* UNDO & REDO BUTTONS — ALWAYS VISIBLE ACROSS ALL SCREEN SIZES */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-[#0A0A0A] p-0.5 rounded-lg border border-[#222222] ml-0.5 sm:ml-1 shrink-0">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#1E1E1E] transition-colors ${
                historyIndex <= 0 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer hover:text-white'
              }`}
              title="Undo last change (Ctrl+Z / Cmd+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#1E1E1E] transition-colors ${
                historyIndex >= history.length - 1 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer hover:text-white'
              }`}
              title="Redo change (Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Center: Device Viewport Switcher (Desktop Preview frames) */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center bg-[#0A0A0A] p-0.5 rounded-lg border border-[#222222]">
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${viewMode === 'desktop' ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Desktop Preview (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${viewMode === 'tablet' ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tablet Preview (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${viewMode === 'mobile' ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Mobile Preview (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions: Real-time Save Status Pill, Draft, Publish */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-[#161616] border border-[#222222] shrink-0">
            {saveStatus === 'saving' && (
              <>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="text-blue-400 hidden sm:inline">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-400 text-[11px] truncate max-w-[120px]">
                  {statusMessage || 'All Changes Saved'}
                </span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-400 text-[11px] hidden sm:inline">Unsaved Changes</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400 text-[11px]">Save Failed</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1E1E1E] border border-[#262626] transition-colors cursor-pointer shrink-0"
            title="Open Live Public Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Test URL</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E1E1E] hover:bg-[#262626] text-white border border-[#333333] transition-colors cursor-pointer shrink-0"
            title="Save as Draft"
          >
            Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#0A0A0A] shadow-md transition-all cursor-pointer shrink-0"
            title="Publish Project Live"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Publish</span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Panel Navigation Bar (< 1024px) */}
      <div className="lg:hidden h-10 border-b border-[#222222] bg-[#121212] flex items-center justify-around text-xs font-semibold shrink-0">
        <button
          type="button"
          onClick={() => setMobilePanel('structure')}
          className={`flex-1 h-full flex items-center justify-center gap-1.5 ${mobilePanel === 'structure' ? 'text-white border-b-2 border-white' : 'text-slate-400'}`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Structure</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('canvas')}
          className={`flex-1 h-full flex items-center justify-center gap-1.5 ${mobilePanel === 'canvas' ? 'text-white border-b-2 border-white' : 'text-slate-400'}`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Canvas</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('inspector')}
          className={`flex-1 h-full flex items-center justify-center gap-1.5 ${mobilePanel === 'inspector' ? 'text-white border-b-2 border-white' : 'text-slate-400'}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Inspector</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. THREE-PANEL STUDIO BODY                                */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ------------------------------------------------------- */}
        {/* PANEL 1: LEFT SIDEBAR (STRUCTURE & TOPICS TREE)         */}
        {/* ------------------------------------------------------- */}
        <aside className={`w-full lg:w-72 border-r border-[#222222] bg-[#0E0E0E] flex flex-col shrink-0 ${
          mobilePanel === 'structure' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="p-3 border-b border-[#222222] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Structure
            </span>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Section</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Project Meta Card Trigger */}
            <div
              onClick={() => {
                setSelectedBlockId(null);
                setActiveInspectorTab('project');
                setMobilePanel('inspector');
              }}
              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${activeInspectorTab === 'project' ? 'bg-[#1E1E1E] border-white/40 text-white' : 'border-[#222222] text-slate-400 hover:bg-[#141414] hover:text-slate-200'}`}
            >
              <div className="font-semibold text-slate-200">Main Project Metadata</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Title, Slug, Category, Links</div>
            </div>

            {/* Sections & Blocks Tree */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                Sections & Topics
              </div>

              {(project.sections || []).map((sec, sIdx) => (
                <div
                  key={sec.id}
                  className={`rounded-lg border transition-all ${
                    selectedSectionId === sec.id 
                      ? 'border-[#2D3748] dark:border-white/30 bg-[#161616]' 
                      : 'border-[#222222] bg-[#121212]/60 hover:bg-[#161616]'
                  }`}
                >
                  <div 
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      setSelectedBlockId(null);
                      setActiveInspectorTab('section');
                    }}
                    className="p-2.5 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="truncate flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500">#{sIdx + 1}</span>
                      <span className="text-xs font-semibold text-white truncate">
                        {sec.title || 'Untitled Section'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sec.id, 'up')}
                        disabled={sIdx === 0}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sec.id, 'down')}
                        disabled={sIdx === project.sections.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Columns & Blocks Subtree */}
                  {selectedSectionId === sec.id && (
                    <div className="px-2.5 pb-2.5 pt-1 border-t border-[#222222] space-y-2 text-[11px]">
                      {(sec.columns || []).map((col, cIdx) => (
                        <div key={col.id} className="space-y-1">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Col {cIdx + 1} ({col.blocks?.length || 0})</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedColumnIndex(cIdx);
                                handleAddBlock('text');
                              }}
                              className="text-slate-400 hover:text-white cursor-pointer"
                            >
                              + Text
                            </button>
                          </div>

                          {(col.blocks || []).map(b => (
                            <div
                              key={b.id}
                              onClick={() => {
                                setSelectedBlockId(b.id);
                                setSelectedColumnIndex(cIdx);
                                setActiveInspectorTab(b.type === 'text' || b.type === 'heading' ? 'typography' : 'block');
                              }}
                              className={`p-1.5 rounded flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                selectedBlockId === b.id 
                                  ? 'bg-white/20 text-white font-medium' 
                                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {b.type === 'heading' && <Heading2 className="w-3 h-3 text-indigo-400" />}
                                {b.type === 'text' && <Type className="w-3 h-3 text-slate-400" />}
                                {b.type === 'image' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                                {b.type === 'table' && <TableIcon className="w-3 h-3 text-amber-400" />}
                                {b.type === 'list' && <List className="w-3 h-3 text-purple-400" />}
                                {b.type === 'callout' && <Sparkles className="w-3 h-3 text-yellow-400" />}
                                {b.type === 'attachment' && <FileText className="w-3 h-3 text-red-400" />}
                                <span className="truncate">{b.content?.replace(/<[^>]+>/g, '') || b.caption || b.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBlock(b.id);
                                }}
                                className="text-slate-500 hover:text-red-400 cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Content Insertion */}
            <div className="pt-2 border-t border-[#222222]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
                Insert Content Block
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleAddBlock('text')}
                  className="p-2 rounded bg-[#161616] hover:bg-[#222222] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span>Paragraph</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('heading')}
                  className="p-2 rounded bg-[#161616] hover:bg-[#222222] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Heading2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Heading</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('image')}
                  className="p-2 rounded bg-[#161616] hover:bg-[#222222] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('table')}
                  className="p-2 rounded bg-[#161616] hover:bg-[#222222] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <TableIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('list')}
                  className="p-2 rounded bg-[#161616] hover:bg-[#222222] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <List className="w-3.5 h-3.5 text-purple-400" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('callout')}
                  className="p-2 rounded bg-[#161616] hover:bg-[#222222] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Callout</span>
                </button>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="pt-2 border-t border-[#222222]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  File Downloads ({project.attachments?.length || 0})
                </span>
                <label className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer font-semibold">
                  + Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUploadAttachment}
                  />
                </label>
              </div>
              <div className="space-y-1">
                {(project.attachments || []).map((att, aIdx) => (
                  <div key={aIdx} className="p-1.5 rounded bg-[#161616] text-[11px] flex items-center justify-between gap-1 text-slate-300">
                    <span className="truncate">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => updateProjectWithHistory(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter((_, i) => i !== aIdx)
                      }))}
                      className="text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ------------------------------------------------------- */}
        {/* PANEL 2: CENTER LIVE WYSIWYG CANVAS PREVIEW             */}
        {/* ------------------------------------------------------- */}
        <main className={`flex-1 bg-[#050505] overflow-hidden flex flex-col relative ${
          mobilePanel === 'canvas' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* UNIFIED QUICK FORMATTING TOOLBAR */}
          <div className="sticky top-0 z-20 w-full bg-[#121212] border-b border-[#222222] px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 text-xs shrink-0 select-none">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
              {/* Group 1: History (Undo & Redo) */}
              <div className="flex items-center bg-[#0A0A0A] p-0.5 rounded-lg border border-[#262626] shrink-0">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Undo (Ctrl+Z / Cmd+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Redo (Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-px h-4 bg-[#262626] mx-0.5 hidden xs:block" />

              {/* Group 2: Typography (Font & Size) */}
              <div className="flex items-center gap-1 shrink-0">
                <select
                  onMouseDown={e => e.stopPropagation()}
                  onChange={e => {
                    const val = e.target.value;
                    if (val) {
                      loadGoogleFont(val);
                      if (activeTextSelection) {
                        applyFormatToSelection({ fontFamily: val });
                      } else {
                        handleUpdateCurrentBlock({ fontFamily: val });
                      }
                    }
                  }}
                  value={currentBlock?.fontFamily || ''}
                  className="bg-[#1A1A1A] border border-[#2E2E2E] rounded px-1.5 py-1 text-xs text-white focus:outline-none max-w-[90px] sm:max-w-[110px] cursor-pointer"
                  title="Font Family"
                >
                  <option value="" disabled>Font</option>
                  <option value="Manrope">Manrope</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Inter">Inter</option>
                  <option value="Space Grotesk">Space Grotesk</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="JetBrains Mono">JetBrains</option>
                  <option value="Playfair Display">Playfair</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Syne">Syne</option>
                  <option value="Cabinet Grotesk">Cabinet</option>
                  <option value="Bebas Neue">Bebas</option>
                  <option value="Cinzel">Cinzel</option>
                </select>

                <select
                  onMouseDown={e => e.stopPropagation()}
                  onChange={e => {
                    const val = e.target.value;
                    if (val) {
                      if (activeTextSelection) {
                        applyFormatToSelection({ fontSize: val });
                      } else {
                        handleUpdateCurrentBlock({ fontSize: val });
                      }
                    }
                  }}
                  value={currentBlock?.fontSize || '15px'}
                  className="bg-[#1A1A1A] border border-[#2E2E2E] rounded px-1 py-1 text-xs text-white focus:outline-none max-w-[58px] sm:max-w-[68px] cursor-pointer"
                  title="Font Size"
                >
                  {['12px', '14px', '15px', '16px', '18px', '20px', '22px', '24px', '28px', '32px', '40px'].map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              <div className="w-px h-4 bg-[#262626] mx-0.5" />

              {/* Group 3: Inline Styles (B / I / U / Color) */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    if (activeTextSelection) {
                      applyFormatToSelection({ bold: true });
                    } else {
                      handleUpdateCurrentBlock({ fontWeight: currentBlock?.fontWeight === '700' ? '400' : '700' });
                    }
                  }}
                  className={`p-1.5 rounded hover:bg-[#222] transition-colors cursor-pointer ${
                    currentBlock?.fontWeight === '700' ? 'bg-white/20 text-white font-bold' : 'text-slate-300'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    if (activeTextSelection) {
                      applyFormatToSelection({ italic: true });
                    } else {
                      handleUpdateCurrentBlock({ fontStyle: currentBlock?.fontStyle === 'italic' ? 'normal' : 'italic' });
                    }
                  }}
                  className={`p-1.5 rounded hover:bg-[#222] transition-colors cursor-pointer ${
                    currentBlock?.fontStyle === 'italic' ? 'bg-white/20 text-white' : 'text-slate-300'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    applyFormatToSelection({ underline: true });
                  }}
                  className="p-1.5 rounded hover:bg-[#222] text-slate-300 transition-colors cursor-pointer hidden sm:inline-flex"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>

                <label
                  className="p-1.5 rounded hover:bg-[#222] text-slate-300 flex items-center gap-1 cursor-pointer"
                  title="Text Color"
                  onMouseDown={e => e.preventDefault()}
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="color"
                    className="hidden"
                    value={currentBlock?.textColor || '#CBD5E1'}
                    onChange={e => {
                      const val = e.target.value;
                      if (activeTextSelection) applyFormatToSelection({ color: val });
                      handleUpdateCurrentBlock({ textColor: val });
                    }}
                  />
                </label>
              </div>

              <div className="w-px h-4 bg-[#262626] mx-0.5 hidden md:block" />

              {/* Group 4: Alignment (Desktop & Tablet) */}
              <div className="hidden md:flex items-center gap-0.5 shrink-0">
                {['left', 'center', 'right'].map(align => (
                  <button
                    key={align}
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      handleUpdateCurrentBlock({ textAlign: align });
                    }}
                    className={`p-1.5 rounded hover:bg-[#222] cursor-pointer ${
                      currentBlock?.textAlign === align ? 'bg-white/20 text-white' : 'text-slate-400'
                    }`}
                    title={`Align ${align}`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              <div className="w-px h-4 bg-[#262626] mx-0.5" />

              {/* Group 5: Content Insertion */}
              <div className="relative shrink-0">
                {/* Desktop Block Buttons */}
                <div className="hidden xl:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleAddBlock('text')}
                    className="px-2 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    title="Insert Paragraph"
                  >
                    <Type className="w-3 h-3 text-blue-400" />
                    <span>+Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('heading')}
                    className="px-2 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    title="Insert Heading"
                  >
                    <Heading2 className="w-3 h-3 text-indigo-400" />
                    <span>+Heading</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('image')}
                    className="px-2 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    title="Insert Image"
                  >
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    <span>+Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('table')}
                    className="px-2 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    title="Insert Table"
                  >
                    <TableIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>+Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('list')}
                    className="px-2 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-slate-300 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    title="Insert List"
                  >
                    <List className="w-3 h-3 text-purple-400" />
                    <span>+List</span>
                  </button>
                </div>

                {/* Tablet & Mobile +Insert Dropdown */}
                <div className="xl:hidden relative">
                  <button
                    type="button"
                    onClick={() => setInsertDropdownOpen(!insertDropdownOpen)}
                    className="px-2.5 py-1 rounded bg-[#1E1E1E] hover:bg-[#262626] text-white flex items-center gap-1 text-xs font-medium border border-[#333333] cursor-pointer"
                    title="Insert Content Block"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Insert</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {insertDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-44 bg-[#161616] border border-[#2E2E2E] rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => { handleAddBlock('text'); setInsertDropdownOpen(false); }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                      >
                        <Type className="w-3.5 h-3.5 text-blue-400" />
                        <span>Paragraph Text</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleAddBlock('heading'); setInsertDropdownOpen(false); }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                      >
                        <Heading2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Heading</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleAddBlock('image'); setInsertDropdownOpen(false); }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Image Block</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleAddBlock('table'); setInsertDropdownOpen(false); }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                      >
                        <TableIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Data Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleAddBlock('list'); setInsertDropdownOpen(false); }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                      >
                        <List className="w-3.5 h-3.5 text-purple-400" />
                        <span>Bulleted List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleAddBlock('callout'); setInsertDropdownOpen(false); }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-[#222222] flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Callout Box</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile More Menu */}
              <div className="md:hidden relative">
                <button
                  type="button"
                  onClick={() => setMoreToolsOpen(!moreToolsOpen)}
                  className="p-1 rounded bg-[#161616] hover:bg-[#222222] text-slate-400 hover:text-white cursor-pointer"
                  title="More Formatting Tools"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {moreToolsOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-[#161616] border border-[#2E2E2E] rounded-xl shadow-2xl p-2 z-50 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Alignment
                    </div>
                    <div className="flex items-center justify-around bg-[#0E0E0E] p-1 rounded-lg">
                      {['left', 'center', 'right'].map(align => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => {
                            handleUpdateCurrentBlock({ textAlign: align });
                            setMoreToolsOpen(false);
                          }}
                          className={`p-1.5 rounded hover:bg-[#222] cursor-pointer ${
                            currentBlock?.textAlign === align ? 'bg-white/20 text-white' : 'text-slate-400'
                          }`}
                        >
                          {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 border-t border-[#262626]">
                      <button
                        type="button"
                        onClick={() => {
                          applyFormatToSelection({ underline: true });
                          setMoreToolsOpen(false);
                        }}
                        className="w-full px-2 py-1 rounded text-left text-xs text-slate-300 hover:text-white hover:bg-[#222] flex items-center gap-2 cursor-pointer"
                      >
                        <Underline className="w-3.5 h-3.5" />
                        <span>Underline</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Block Indicator */}
            <div className="hidden 2xl:flex items-center gap-1 text-[11px] text-slate-500 font-mono shrink-0">
              <span>{currentBlock?.type ? `Block: ${currentBlock.type}` : 'Canvas'}</span>
              {currentBlock?.fontSize && <span>({currentBlock.fontSize})</span>}
            </div>
          </div>

          {/* Canvas Scrollable Content Area */}
          <div className="flex-1 w-full overflow-y-auto flex justify-center p-3 sm:p-6 lg:p-8 relative">
          
          {/* FLOATING TEXT SELECTION TOOLBAR */}
          {floatingToolbarPos && activeTextSelection && (
            <div
              data-floating-toolbar="true"
              style={{
                top: `${floatingToolbarPos.top}px`,
                left: `${floatingToolbarPos.left}px`,
              }}
              className="fixed z-50 bg-[#161616] border border-[#333333] shadow-2xl rounded-xl p-1.5 flex items-center gap-1.5 text-xs animate-fade-in"
              onMouseDown={e => e.preventDefault()}
            >
              {/* Quick Font Family Selector on Floating Toolbar */}
              <select
                onMouseDown={e => e.stopPropagation()}
                onChange={e => {
                  const val = e.target.value;
                  if (val) {
                    loadGoogleFont(val);
                    applyFormatToSelection({ fontFamily: val });
                  }
                }}
                defaultValue=""
                className="bg-[#222222] border border-[#383838] rounded px-1.5 py-1 text-[11px] text-white focus:outline-none max-w-[95px] cursor-pointer"
                title="Apply font family to selected text"
              >
                <option value="" disabled>Font</option>
                <option value="Manrope">Manrope</option>
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
                <option value="Space Grotesk">Space Grotesk</option>
                <option value="Fira Code">Fira Code</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="Playfair Display">Playfair</option>
                <option value="Outfit">Outfit</option>
                <option value="Syne">Syne</option>
                <option value="Cabinet Grotesk">Cabinet</option>
                <option value="Bebas Neue">Bebas</option>
                <option value="Cinzel">Cinzel</option>
              </select>

              <div className="w-px h-4 bg-[#333] mx-0.5" />

              {/* Bold */}
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  applyFormatToSelection({ bold: true });
                }}
                className="p-1.5 rounded hover:bg-white/20 text-white font-bold cursor-pointer"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              {/* Italic */}
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  applyFormatToSelection({ italic: true });
                }}
                className="p-1.5 rounded hover:bg-white/20 text-white italic cursor-pointer"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              {/* Underline */}
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  applyFormatToSelection({ underline: true });
                }}
                className="p-1.5 rounded hover:bg-white/20 text-white underline cursor-pointer"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              {/* Strikethrough */}
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  applyFormatToSelection({ strikethrough: true });
                }}
                className="p-1.5 rounded hover:bg-white/20 text-white line-through cursor-pointer"
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-[#333] mx-0.5" />

              {/* Quick Font Size Input on floating toolbar */}
              <input
                type="text"
                placeholder="Size"
                defaultValue="20px"
                onMouseDown={e => e.stopPropagation()}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyFormatToSelection({ fontSize: e.target.value });
                  }
                }}
                onBlur={e => {
                  if (e.target.value) {
                    applyFormatToSelection({ fontSize: e.target.value });
                  }
                }}
                className="w-12 bg-[#222222] border border-[#383838] rounded px-1.5 py-0.5 text-[11px] text-white text-center focus:outline-none"
                title="Type font size (e.g. 24px, 1.5rem, 18pt)"
              />

              {/* Text Color Picker */}
              <label 
                className="p-1.5 rounded hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
                title="Selected text color"
                onMouseDown={e => e.preventDefault()}
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <input
                  type="color"
                  className="hidden"
                  onChange={e => applyFormatToSelection({ color: e.target.value })}
                />
              </label>

              {/* Text Highlight / Background Color Picker */}
              <label 
                className="p-1.5 rounded hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
                title="Selected text highlight"
                onMouseDown={e => e.preventDefault()}
              >
                <Highlighter className="w-3.5 h-3.5 text-yellow-300" />
                <input
                  type="color"
                  className="hidden"
                  onChange={e => applyFormatToSelection({ bgColor: e.target.value })}
                />
              </label>

              <div className="w-px h-4 bg-[#333] mx-0.5" />

              {/* Clear Formatting */}
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  applyFormatToSelection({ clear: true });
                }}
                className="p-1.5 rounded hover:bg-white/20 text-slate-400 hover:text-red-400 cursor-pointer"
                title="Clear Formatting"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Canvas Wrapper */}
          <div 
            className={`transition-all duration-300 bg-[#0A0A0A] border border-[#222222] rounded-2xl shadow-2xl p-4 sm:p-8 lg:p-10 space-y-8 sm:space-y-10 min-h-full ${
              viewMode === 'mobile' ? 'w-full max-w-[375px]' :
              viewMode === 'tablet' ? 'w-full max-w-[768px]' :
              'w-full max-w-4xl'
            }`}
          >
            {/* Project Header Canvas */}
            <div className="space-y-4 border-b border-[#222222] pb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-white/10 text-white">
                  {project.category}
                </span>
                <span className="text-xs text-slate-400">{project.type}</span>
                <span className="text-xs text-slate-400">• Completed {project.completionYear}</span>
              </div>

              <input
                type="text"
                value={project.title}
                onChange={e => updateProjectWithHistory(prev => ({ ...prev, title: e.target.value }), false)}
                placeholder="Project Title"
                className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-white focus:outline-none w-full"
              />

              <textarea
                value={project.tagline}
                onChange={e => updateProjectWithHistory(prev => ({ ...prev, tagline: e.target.value }), false)}
                placeholder="High-level engineering overview / tagline..."
                rows={2}
                className="text-sm font-sans text-slate-400 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-white focus:outline-none w-full resize-none leading-relaxed"
              />

              {/* Main Thumbnail Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-[#262626]">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Sections Canvas */}
            <div className="space-y-8">
              {(project.sections || []).map((sec, sIdx) => (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    setSelectedBlockId(null);
                    setActiveInspectorTab('section');
                  }}
                  className={`p-5 rounded-xl border transition-all ${
                    selectedSectionId === sec.id 
                      ? 'border-white/40 ring-1 ring-white/20 bg-[#121212]' 
                      : 'border-[#222222] bg-[#0E0E0E] hover:border-slate-700'
                  }`}
                >
                  {/* Inline Section Title */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#222222]">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={e => {
                        const val = e.target.value;
                        updateProjectWithHistory(prev => ({
                          ...prev,
                          sections: prev.sections.map(s => s.id === sec.id ? { ...s, title: val } : s)
                        }), false);
                      }}
                      placeholder="Section Title"
                      className="text-lg font-heading font-bold text-white bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-white/40 rounded px-1"
                    />

                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {sec.columnsCount} Col{sec.columnsCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Section Columns */}
                  <div 
                    className={`grid gap-5 ${
                      viewMode === 'mobile' ? 'grid-cols-1' :
                      viewMode === 'tablet' ? (sec.columnsCount > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1') :
                      sec.columnsCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
                      sec.columnsCount === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                      sec.columnsCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                      'grid-cols-1'
                    }`}
                  >
                    {(sec.columns || []).map((col, cIdx) => (
                      <div key={col.id} className="space-y-4">
                        {(col.blocks || []).map(b => (
                          <div
                            key={b.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSectionId(sec.id);
                              setSelectedColumnIndex(cIdx);
                              setSelectedBlockId(b.id);
                              setActiveInspectorTab(b.type === 'text' || b.type === 'heading' ? 'typography' : 'block');
                            }}
                            className={`p-3 rounded-lg border transition-all relative ${
                              selectedBlockId === b.id 
                                ? 'border-white bg-[#1A1A1A] ring-2 ring-white/20' 
                                : 'border-transparent hover:border-slate-700 hover:bg-[#141414]'
                            }`}
                          >
                            {/* Render block according to type with contentEditable for rich text */}
                            {b.type === 'heading' ? (
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                data-editable-block-id={b.id}
                                onBlur={e => flushBlockContent(b.id, e.currentTarget.innerHTML)}
                                onInput={() => setSaveStatus('unsaved')}
                                dangerouslySetInnerHTML={{ __html: b.content || 'Heading Text' }}
                                style={{
                                  fontFamily: b.fontFamily || undefined,
                                  fontSize: formatSizeUnit(b.fontSize || '22px'),
                                  fontWeight: b.fontWeight || '700',
                                  color: b.textColor || '#FFFFFF',
                                  textAlign: b.textAlign || 'left',
                                }}
                                className="font-heading focus:outline-none focus:ring-1 focus:ring-white/30 rounded p-1 cursor-text"
                              />
                            ) : b.type === 'image' ? (
                              <div className="space-y-1">
                                <img
                                  src={b.imageUrl}
                                  alt={b.caption || 'Project visual'}
                                  style={{ borderRadius: b.borderRadius || '8px' }}
                                  className="w-full object-cover max-h-64"
                                />
                                {b.caption && (
                                  <p className="text-xs text-center text-slate-400 italic">{b.caption}</p>
                                )}
                              </div>
                            ) : b.type === 'callout' ? (
                              <div className="p-3.5 rounded-lg bg-[#161616] border-l-4 border-slate-400 text-xs sm:text-sm text-slate-300">
                                <div
                                  contentEditable
                                  suppressContentEditableWarning
                                  data-editable-block-id={b.id}
                                  onBlur={e => flushBlockContent(b.id, e.currentTarget.innerHTML)}
                                  onInput={() => setSaveStatus('unsaved')}
                                  dangerouslySetInnerHTML={{ __html: b.content || 'Callout note...' }}
                                  className="focus:outline-none cursor-text leading-relaxed"
                                />
                              </div>
                            ) : b.type === 'table' && b.tableData ? (
                              <div className="overflow-x-auto text-xs">
                                <table className="min-w-full border border-[#222222]">
                                  <tbody>
                                    {b.tableData.rows.map((row, rI) => (
                                      <tr key={rI} className={rI === 0 && b.tableData.hasHeader ? 'bg-[#1E1E1E] font-bold' : 'border-t border-[#222222]'}>
                                        {row.map((cell, cI) => (
                                          <td key={cI} className="p-2 border-r border-[#222222]">
                                            <input
                                              type="text"
                                              value={cell.text || ''}
                                              onChange={e => {
                                                const val = e.target.value;
                                                const newRows = JSON.parse(JSON.stringify(b.tableData.rows));
                                                newRows[rI][cI].text = val;
                                                handleUpdateCurrentBlock({
                                                  tableData: { ...b.tableData, rows: newRows }
                                                });
                                              }}
                                              className="bg-transparent w-full border-none focus:outline-none"
                                            />
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : b.type === 'attachment' && b.attachment ? (
                              <div className="p-3 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-red-400" />
                                  <span className="font-semibold text-slate-200">{b.attachment.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{b.attachment.size}</span>
                              </div>
                            ) : (
                              /* Default Rich Text Block with full inline word/sentence styling */
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                data-editable-block-id={b.id}
                                onBlur={e => flushBlockContent(b.id, e.currentTarget.innerHTML)}
                                onInput={() => setSaveStatus('unsaved')}
                                dangerouslySetInnerHTML={{ __html: b.content || 'Type paragraph text here...' }}
                                style={{
                                  fontFamily: b.fontFamily || undefined,
                                  fontSize: formatSizeUnit(b.fontSize || '15px'),
                                  fontWeight: b.fontWeight || undefined,
                                  fontStyle: b.fontStyle || undefined,
                                  lineHeight: b.lineHeight || '1.7',
                                  letterSpacing: b.letterSpacing || undefined,
                                  textTransform: b.textTransform || undefined,
                                  textAlign: b.textAlign || 'left',
                                  color: b.textColor || '#CBD5E1',
                                }}
                                className="focus:outline-none focus:ring-1 focus:ring-white/20 rounded p-1 cursor-text leading-relaxed whitespace-pre-wrap"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

        {/* ------------------------------------------------------- */}
        {/* PANEL 3: RIGHT CONTEXT-SENSITIVE INSPECTOR              */}
        {/* ------------------------------------------------------- */}
        <aside
          data-inspector-panel="true"
          className={`w-full lg:w-80 border-l border-[#222222] bg-[#0E0E0E] flex flex-col shrink-0 ${
            mobilePanel === 'inspector' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          
          {/* Inspector Tab Bar */}
          <div className="h-11 border-b border-[#222222] flex items-center bg-[#121212]">
            <button
              type="button"
              onClick={() => setActiveInspectorTab('typography')}
              className={`flex-1 h-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeInspectorTab === 'typography' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('block')}
              className={`flex-1 h-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeInspectorTab === 'block' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Block</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('section')}
              className={`flex-1 h-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeInspectorTab === 'section' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Section</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInspectorTab('project')}
              className={`flex-1 h-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeInspectorTab === 'project' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meta</span>
            </button>
          </div>

          {/* Inspector Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            
            {/* --------------------------------------------------- */}
            {/* TAB: UNRESTRICTED TYPOGRAPHY & SELECTION STYLER     */}
            {/* --------------------------------------------------- */}
            {activeInspectorTab === 'typography' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Active Selection Indicator */}
                {activeTextSelection ? (
                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Styling Selected Text</span>
                    </div>
                    <p className="text-[11px] truncate italic text-white/90">
                      "{activeTextSelection.text}"
                    </p>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-[#161616] text-[11px] text-slate-400">
                    💡 Tip: Highlight words on the canvas to style only that specific text.
                  </div>
                )}

                {/* Google Fonts Catalog Search */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Google Fonts Catalog
                  </label>
                  
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={e => setFontSearch(e.target.value)}
                      placeholder="Search 50+ Google Fonts..."
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-[#262626] p-1 bg-[#121212]">
                    {GOOGLE_FONTS_CATALOG
                      .filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase()) || f.category.toLowerCase().includes(fontSearch.toLowerCase()))
                      .map(f => (
                        <div
                          key={f.name}
                          onMouseDown={e => {
                            e.preventDefault();
                            loadGoogleFont(f.name);
                            if (activeTextSelection) {
                              applyFormatToSelection({ fontFamily: f.name });
                            } else {
                              handleUpdateCurrentBlock({ fontFamily: f.name });
                            }
                          }}
                          className={`p-1.5 rounded cursor-pointer text-xs flex items-center justify-between ${
                            currentBlock?.fontFamily === f.name ? 'bg-white text-black font-bold' : 'hover:bg-white/10 text-slate-200'
                          }`}
                        >
                          <span style={{ fontFamily: f.name }}>{f.name}</span>
                          <span className="text-[9px] text-slate-500 uppercase">{f.category}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Unrestricted Font Size Input + Presets */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Font Size (Any px, rem, em, pt or presets)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. 24px, 1.5rem, 18pt"
                      value={currentBlock?.fontSize || ''}
                      onChange={e => {
                        const val = e.target.value;
                        if (activeTextSelection) {
                          applyFormatToSelection({ fontSize: val });
                        }
                        handleUpdateCurrentBlock({ fontSize: val });
                      }}
                      className="flex-1 bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Common Size Preset Pills */}
                  <div className="flex flex-wrap gap-1">
                    {['12px', '14px', '15px', '16px', '18px', '20px', '24px', '32px', '40px'].map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onMouseDown={e => {
                          e.preventDefault();
                          if (activeTextSelection) {
                            applyFormatToSelection({ fontSize: sz });
                          }
                          handleUpdateCurrentBlock({ fontSize: sz });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                          currentBlock?.fontSize === sz ? 'bg-white text-black border-white' : 'border-[#262626] bg-[#161616] text-slate-300 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight & Style */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Font Weight
                    </label>
                    <select
                      value={currentBlock?.fontWeight || '400'}
                      onMouseDown={e => e.stopPropagation()}
                      onChange={e => {
                        const val = e.target.value;
                        if (activeTextSelection) applyFormatToSelection({ fontWeight: val });
                        handleUpdateCurrentBlock({ fontWeight: val });
                      }}
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white cursor-pointer"
                    >
                      <option value="300">300 (Light)</option>
                      <option value="400">400 (Regular)</option>
                      <option value="500">500 (Medium)</option>
                      <option value="600">600 (Semi-Bold)</option>
                      <option value="700">700 (Bold)</option>
                      <option value="800">800 (Extra Bold)</option>
                      <option value="900">900 (Black)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Font Style
                    </label>
                    <select
                      value={currentBlock?.fontStyle || 'normal'}
                      onMouseDown={e => e.stopPropagation()}
                      onChange={e => {
                        const val = e.target.value;
                        if (activeTextSelection) applyFormatToSelection({ italic: val === 'italic' });
                        handleUpdateCurrentBlock({ fontStyle: val });
                      }}
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white cursor-pointer"
                    >
                      <option value="normal">Normal</option>
                      <option value="italic">Italic</option>
                    </select>
                  </div>
                </div>

                {/* Unrestricted Font Color Picker (HEX, RGB, HSL) */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Text Color (Unrestricted HEX / RGB / HSL)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={currentBlock?.textColor || '#CBD5E1'}
                      onChange={e => {
                        const val = e.target.value;
                        if (activeTextSelection) applyFormatToSelection({ color: val });
                        handleUpdateCurrentBlock({ textColor: val });
                      }}
                      className="w-8 h-8 rounded border border-[#262626] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentBlock?.textColor || '#CBD5E1'}
                      onChange={e => {
                        const val = e.target.value;
                        if (activeTextSelection) applyFormatToSelection({ color: val });
                        handleUpdateCurrentBlock({ textColor: val });
                      }}
                      placeholder="#CBD5E1 or rgb(203, 213, 225)"
                      className="flex-1 bg-[#161616] border border-[#262626] rounded-lg p-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Swatches (Presets & Recents) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recentColors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onMouseDown={e => {
                          e.preventDefault();
                          if (activeTextSelection) applyFormatToSelection({ color: c });
                          handleUpdateCurrentBlock({ textColor: c });
                        }}
                        style={{ backgroundColor: c }}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Highlight / Background Color */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Highlight / Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      defaultValue="#F59E0B"
                      onChange={e => {
                        const val = e.target.value;
                        if (activeTextSelection) applyFormatToSelection({ bgColor: val });
                        handleUpdateCurrentBlock({ backgroundColor: val });
                      }}
                      className="w-8 h-8 rounded border border-[#262626] cursor-pointer bg-transparent"
                    />
                    <button
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault();
                        if (activeTextSelection) applyFormatToSelection({ bgColor: 'transparent' });
                        handleUpdateCurrentBlock({ backgroundColor: 'transparent' });
                      }}
                      className="px-2.5 py-1.5 rounded bg-[#161616] border border-[#262626] text-[11px] text-slate-300 hover:text-white cursor-pointer"
                    >
                      Clear Highlight
                    </button>
                  </div>
                </div>

                {/* Alignment & Letter Spacing */}
                <div className="pt-2 border-t border-[#222222] space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Paragraph Alignment
                    </label>
                    <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-lg border border-[#262626]">
                      {['left', 'center', 'right', 'justify'].map(align => (
                        <button
                          key={align}
                          type="button"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleUpdateCurrentBlock({ textAlign: align });
                          }}
                          className={`flex-1 p-1.5 rounded flex items-center justify-center cursor-pointer ${
                            currentBlock?.textAlign === align ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                          {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Line Height
                      </label>
                      <select
                        value={currentBlock?.lineHeight || '1.7'}
                        onMouseDown={e => e.stopPropagation()}
                        onChange={e => handleUpdateCurrentBlock({ lineHeight: e.target.value })}
                        className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white cursor-pointer"
                      >
                        <option value="1.2">1.2 (Tight)</option>
                        <option value="1.4">1.4 (Compact)</option>
                        <option value="1.6">1.6 (Normal)</option>
                        <option value="1.7">1.7 (Comfortable)</option>
                        <option value="2.0">2.0 (Double)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Letter Spacing
                      </label>
                      <select
                        value={currentBlock?.letterSpacing || 'normal'}
                        onMouseDown={e => e.stopPropagation()}
                        onChange={e => {
                          const val = e.target.value;
                          if (activeTextSelection) applyFormatToSelection({ letterSpacing: val });
                          handleUpdateCurrentBlock({ letterSpacing: val });
                        }}
                        className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white cursor-pointer"
                      >
                        <option value="-0.02em">-0.02em</option>
                        <option value="normal">Normal</option>
                        <option value="0.05em">0.05em</option>
                        <option value="0.1em">0.1em</option>
                        <option value="0.15em">0.15em</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* --------------------------------------------------- */}
            {/* TAB: BLOCK SETTINGS                                 */}
            {/* --------------------------------------------------- */}
            {activeInspectorTab === 'block' && (
              <div className="space-y-4 animate-fade-in">
                {currentBlock ? (
                  <>
                    <div className="text-xs font-bold text-white flex items-center justify-between pb-2 border-b border-[#222222]">
                      <span>Block Type: {currentBlock.type.toUpperCase()}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(currentBlock.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Delete Block
                      </button>
                    </div>

                    {/* Image Settings */}
                    {currentBlock.type === 'image' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Upload Image File
                          </label>
                          <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[#333] hover:border-white bg-[#161616] cursor-pointer">
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-300">Choose File</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleUploadBlockImage} />
                          </label>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={currentBlock.imageUrl || ''}
                            onChange={e => handleUpdateCurrentBlock({ imageUrl: e.target.value })}
                            className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Caption
                          </label>
                          <input
                            type="text"
                            value={currentBlock.caption || ''}
                            onChange={e => handleUpdateCurrentBlock({ caption: e.target.value })}
                            placeholder="Optional caption..."
                            className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Table Settings */}
                    {currentBlock.type === 'table' && currentBlock.tableData && (
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(currentBlock.tableData.hasHeader)}
                            onChange={e => handleUpdateCurrentBlock({
                              tableData: { ...currentBlock.tableData, hasHeader: e.target.checked }
                            })}
                            className="rounded"
                          />
                          <span className="text-xs text-slate-300">First row is Header</span>
                        </label>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const rows = JSON.parse(JSON.stringify(currentBlock.tableData.rows));
                              const numCols = rows[0]?.length || 2;
                              rows.push(Array(numCols).fill({ text: 'New Cell' }));
                              handleUpdateCurrentBlock({ tableData: { ...currentBlock.tableData, rows } });
                            }}
                            className="p-2 rounded bg-[#1A1A1A] hover:bg-[#262626] text-xs font-medium cursor-pointer"
                          >
                            + Add Row
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const rows = JSON.parse(JSON.stringify(currentBlock.tableData.rows));
                              rows.forEach(r => r.push({ text: 'New Col' }));
                              handleUpdateCurrentBlock({ tableData: { ...currentBlock.tableData, rows } });
                            }}
                            className="p-2 rounded bg-[#1A1A1A] hover:bg-[#262626] text-xs font-medium cursor-pointer"
                          >
                            + Add Column
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-8">
                    Select a block on the left tree or canvas to customize its settings.
                  </p>
                )}
              </div>
            )}

            {/* --------------------------------------------------- */}
            {/* TAB: SECTION SETTINGS                               */}
            {/* --------------------------------------------------- */}
            {activeInspectorTab === 'section' && (
              <div className="space-y-4 animate-fade-in">
                {currentSection ? (
                  <>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={currentSection.title || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateProjectWithHistory(prev => ({
                            ...prev,
                            sections: prev.sections.map(s => s.id === currentSection.id ? { ...s, title: val } : s)
                          }));
                        }}
                        className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Column Layout (1 to 4 Columns)
                      </label>
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[1, 2, 3, 4].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleSetSectionColumns(currentSection.id, c)}
                            className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              currentSection.columnsCount === c 
                                ? 'bg-white text-black border-white' 
                                : 'bg-[#161616] text-slate-400 border-[#262626] hover:text-white'
                            }`}
                          >
                            {c} Col
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#222222] space-y-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateSection(currentSection.id)}
                        className="w-full p-2 rounded-lg bg-[#161616] hover:bg-[#222222] text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate Section</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(currentSection.id)}
                        className="w-full p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-xs font-semibold text-red-400 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-8">
                    Select a section to configure its column layouts.
                  </p>
                )}
              </div>
            )}

            {/* --------------------------------------------------- */}
            {/* TAB: PROJECT META & GENERAL SETTINGS                */}
            {/* --------------------------------------------------- */}
            {activeInspectorTab === 'project' && (
              <div className="space-y-3.5 animate-fade-in">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={project.slug || ''}
                    onChange={e => updateProjectWithHistory(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Direct link: /projects/{project.slug}</p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={project.category}
                    onChange={e => updateProjectWithHistory(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Computer Networking">Computer Networking</option>
                    <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                    <option value="Cloud & Distributed Systems">Cloud & Systems</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={project.github || ''}
                    onChange={e => updateProjectWithHistory(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Live Demo / Tool URL
                  </label>
                  <input
                    type="url"
                    value={project.demo || ''}
                    onChange={e => updateProjectWithHistory(prev => ({ ...prev, demo: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    value={project.documentationUrl || ''}
                    onChange={e => updateProjectWithHistory(prev => ({ ...prev, documentationUrl: e.target.value }))}
                    placeholder="https://docs..."
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={project.technologies?.join(', ') || ''}
                    onChange={e => {
                      const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      updateProjectWithHistory(prev => ({ ...prev, technologies: arr, tags: arr }));
                    }}
                    placeholder="Python, C++, Docker, Snort"
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(project.featured)}
                      onChange={e => updateProjectWithHistory(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-xs text-slate-300">Flagship project featured in showcase</span>
                  </label>
                </div>

                {/* Cinematic Scroll & Motion Effects Settings */}
                <div className="pt-3 border-t border-[#222222] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        Scroll & Motion Effects
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Cinematic
                    </span>
                  </div>

                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#141414] border border-[#222222] hover:border-[#333333] transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.customStyling?.scrollEffects?.enablePremiumScroll !== false && project.customStyling?.smartScrollEnabled !== false}
                      onChange={e => {
                        const checked = e.target.checked;
                        updateProjectWithHistory(prev => ({
                          ...prev,
                          customStyling: {
                            ...(prev.customStyling || {}),
                            smartScrollEnabled: checked,
                            scrollEffects: {
                              ...(prev.customStyling?.scrollEffects || {}),
                              enablePremiumScroll: checked
                            }
                          }
                        }));
                      }}
                      className="rounded accent-emerald-500 mt-0.5 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-medium text-slate-200 block">Cinematic Section Scrolling</span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                        Advances maximum 1 section per intentional gesture with momentum suppression
                      </span>
                    </div>
                  </label>

                  {(project.customStyling?.scrollEffects?.enablePremiumScroll !== false && project.customStyling?.smartScrollEnabled !== false) && (
                    <div className="space-y-3 pl-3 border-l-2 border-emerald-500/30">
                      
                      {/* Transition Style */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-300 block">
                          Transition Choreography
                        </label>
                        <select
                          value={project.customStyling?.scrollEffects?.transitionStyle || 'cinematic-fade'}
                          onChange={e => {
                            const val = e.target.value;
                            updateProjectWithHistory(prev => ({
                              ...prev,
                              customStyling: {
                                ...(prev.customStyling || {}),
                                scrollEffects: {
                                  ...(prev.customStyling?.scrollEffects || {}),
                                  transitionStyle: val
                                }
                              }
                            }));
                          }}
                          className="w-full text-xs bg-[#161616] border border-[#262626] rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="cinematic-fade">Cinematic Rise & Fade (Recommended)</option>
                          <option value="smooth-slide">Editorial Smooth Slide</option>
                          <option value="minimal">Minimal Clean Fade</option>
                        </select>
                      </div>

                      {/* Animation Speed */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-300 block">
                          Animation Timing & Pacing
                        </label>
                        <select
                          value={project.customStyling?.scrollEffects?.animationSpeed || 'normal'}
                          onChange={e => {
                            const val = e.target.value;
                            updateProjectWithHistory(prev => ({
                              ...prev,
                              customStyling: {
                                ...(prev.customStyling || {}),
                                scrollEffects: {
                                  ...(prev.customStyling?.scrollEffects || {}),
                                  animationSpeed: val
                                }
                              }
                            }));
                          }}
                          className="w-full text-xs bg-[#161616] border border-[#262626] rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="normal">Balanced Cinematic (750ms)</option>
                          <option value="slow">Slow & Atmospheric (900ms)</option>
                          <option value="fast">Fast & Responsive (550ms)</option>
                        </select>
                      </div>

                      {/* Stagger Content Reveal */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.customStyling?.scrollEffects?.staggerContent !== false}
                          onChange={e => {
                            const checked = e.target.checked;
                            updateProjectWithHistory(prev => ({
                              ...prev,
                              customStyling: {
                                ...(prev.customStyling || {}),
                                scrollEffects: {
                                  ...(prev.customStyling?.scrollEffects || {}),
                                  staggerContent: checked
                                }
                              }
                            }));
                          }}
                          className="rounded accent-emerald-500"
                        />
                        <span className="text-xs text-slate-300">Stagger reveal for titles, badges & blocks</span>
                      </label>

                      {/* Image Animation */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.customStyling?.scrollEffects?.imageAnimation !== false}
                          onChange={e => {
                            const checked = e.target.checked;
                            updateProjectWithHistory(prev => ({
                              ...prev,
                              customStyling: {
                                ...(prev.customStyling || {}),
                                scrollEffects: {
                                  ...(prev.customStyling?.scrollEffects || {}),
                                  imageAnimation: checked
                                }
                              }
                            }));
                          }}
                          className="rounded accent-emerald-500"
                        />
                        <span className="text-xs text-slate-300">Cinematic scale reveal for images & media</span>
                      </label>

                      {/* Mobile Touch Behavior */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-300 block">
                          Mobile Device Behavior
                        </label>
                        <select
                          value={project.customStyling?.scrollEffects?.mobileBehavior || 'smooth-snap'}
                          onChange={e => {
                            const val = e.target.value;
                            updateProjectWithHistory(prev => ({
                              ...prev,
                              customStyling: {
                                ...(prev.customStyling || {}),
                                scrollEffects: {
                                  ...(prev.customStyling?.scrollEffects || {}),
                                  mobileBehavior: val
                                }
                              }
                            }));
                          }}
                          className="w-full text-xs bg-[#161616] border border-[#262626] rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="smooth-snap">Directional Section Snap (Mobile Swipes)</option>
                          <option value="standard-scroll">Standard Free-Flow Touch Scroll</option>
                        </select>
                      </div>

                      {/* Reduced Motion Fallback */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.customStyling?.scrollEffects?.reducedMotionFallback !== false}
                          onChange={e => {
                            const checked = e.target.checked;
                            updateProjectWithHistory(prev => ({
                              ...prev,
                              customStyling: {
                                ...(prev.customStyling || {}),
                                scrollEffects: {
                                  ...(prev.customStyling?.scrollEffects || {}),
                                  reducedMotionFallback: checked
                                }
                              }
                            }));
                          }}
                          className="rounded accent-emerald-500"
                        />
                        <span className="text-xs text-slate-300">Honor OS Reduced Motion preference</span>
                      </label>

                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>

    </div>
  );
}
