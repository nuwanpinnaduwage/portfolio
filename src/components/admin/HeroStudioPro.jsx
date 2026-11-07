import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Play, 
  Pause,
  Monitor, 
  Tablet, 
  Smartphone, 
  Sun, 
  Moon, 
  Sparkles, 
  Type, 
  Sliders, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  CheckCircle2, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  Palette,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Copy,
  Scissors,
  Layers as LayersIcon,
  Clock,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  X,
  Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import Hero from '../Hero';

// Animation Categories & Types
const ANIMATION_TYPES = [
  // Entrance
  { value: 'fade-in', label: 'Fade In', category: 'entrance' },
  { value: 'slide-up', label: 'Slide Up', category: 'entrance' },
  { value: 'slide-down', label: 'Slide Down', category: 'entrance' },
  { value: 'slide-left', label: 'Slide Left', category: 'entrance' },
  { value: 'slide-right', label: 'Slide Right', category: 'entrance' },
  { value: 'zoom-in', label: 'Zoom In', category: 'entrance' },
  { value: 'blur-reveal', label: 'Blur Reveal', category: 'entrance' },
  { value: 'mask-reveal', label: 'Mask Reveal', category: 'entrance' },
  { value: 'word-reveal', label: 'Word Reveal', category: 'entrance' },
  { value: 'character-reveal', label: 'Character Reveal', category: 'entrance' },

  // Typing
  { value: 'typewriter', label: 'Typewriter', category: 'typing' },
  { value: 'cursor-blink', label: 'Cursor Blink', category: 'typing' },
  { value: 'character-by-character', label: 'Character-by-Character', category: 'typing' },
  { value: 'word-by-word', label: 'Word-by-Word', category: 'typing' },

  // Continuous
  { value: 'floating-text', label: 'Floating Text', category: 'continuous' },
  { value: 'subtle-pulse', label: 'Subtle Pulse', category: 'continuous' },
  { value: 'color-transition', label: 'Color Transition', category: 'continuous' },
  { value: 'text-shimmer', label: 'Text Shimmer', category: 'continuous' },

  // Exit
  { value: 'fade-out', label: 'Fade Out', category: 'exit' },
  { value: 'slide-out', label: 'Slide Out', category: 'exit' },
  { value: 'zoom-out', label: 'Zoom Out', category: 'exit' },

  // None
  { value: 'none', label: 'None (Static)', category: 'none' },
];

const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter (Clean Sans)' },
  { value: 'Manrope', label: 'Manrope (Modern Heading)' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'Outfit', label: 'Outfit (Geometric)' },
  { value: 'Space Grotesk', label: 'Space Grotesk (Tech)' },
  { value: 'Fira Code', label: 'Fira Code (Monospace)' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'system-ui', label: 'System Default' },
];

import {
  applyColorToRange,
  applyStyleToRange,
  PRESET_DARK_COLORS,
  PRESET_LIGHT_COLORS,
  PRESET_HERO_COLORS,
  resolveSegmentColor,
  resolveLayerColor,
  normalizeSegmentColors,
  isValidHexColor,
  getPlainText
} from '../../utils/heroTextRange.js';

// Default Preset Colors
const PRESET_COLORS = PRESET_DARK_COLORS;

const EXTENDED_SWATCHES = [
  '#FFFFFF', '#16C96B', '#10B981', '#34D399', '#6EE7B7',
  '#A0AEC0', '#CBD5E1', '#60A5FA', '#38BDF8', '#F59E0B',
  '#EF4444', '#EC4899', '#9333EA', '#111827', '#000000'
];

export { applyColorToRange, applyStyleToRange };

export default function HeroStudioPro() {
  const navigate = useNavigate();
  const { portfolio, saveHero } = usePortfolio();

  const personal = portfolio?.personal || {};
  const settings = portfolio?.settings || {};

  // Initialize structured layers from existing portfolio
  const initialLayers = useMemo(() => {
    const savedPro = settings?.heroStudioPro || personal?.heroStudioPro || {};
    const savedDesign = settings?.heroDesign || personal?.heroDesign || {};
    const savedContent = savedDesign?.content || {};
    const savedAnim = savedDesign?.animations || {};

    if (Array.isArray(savedPro.layers) && savedPro.layers.length > 0) {
      return savedPro.layers.map(layer => {
        const typo = layer.typography || {};
        const layerDark = typo.colors?.dark || typo.color || '#FFFFFF';
        const layerLight = typo.colors?.light || typo.lightColor || '#0F172A';

        const normalizedSegments = (layer.segments || []).map(seg => {
          const segDark = seg.colors?.dark !== undefined ? seg.colors.dark : (seg.color || null);
          const segLight = seg.colors?.light !== undefined ? seg.colors.light : (seg.lightColor || null);
          return {
            ...seg,
            colors: {
              dark: segDark,
              light: segLight,
            },
            color: segDark || '#FFFFFF',
          };
        });

        return {
          ...layer,
          typography: {
            ...typo,
            colors: {
              dark: layerDark,
              light: layerLight,
            },
            color: layerDark,
          },
          segments: normalizedSegments,
        };
      });
    }

    const defaultHeading = savedContent.heading || personal.name || "Nuwan Pinnaduwage";
    const defaultHighlight = savedContent.highlightedText || "Nuwan";

    return [
      {
        id: 'badge',
        name: 'Status Badge',
        type: 'badge',
        visible: true,
        locked: false,
        order: 0,
        rawText: savedContent.statusText || personal.statusBadge?.text || "AVAILABLE FOR OPPORTUNITIES.",
        segments: [],
        typography: {
          fontFamily: 'Fira Code',
          fontSize: { desktop: '11px', tablet: '11px', mobile: '10px' },
          fontWeight: '600',
          lineHeight: '1.4',
          letterSpacing: 'wider',
          color: '#2D3748',
          colors: { dark: '#2D3748', light: '#2D3748' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '0px', spaceBelow: '16px', lineHeight: '1.4' },
        animation: { type: 'none', duration: 0.5, delay: 0 },
      },
      {
        id: 'greeting',
        name: 'Greeting',
        type: 'greeting',
        visible: true,
        locked: false,
        order: 1,
        rawText: savedContent.greeting || "Hi, I'm",
        segments: [
          { 
            id: 'g-1', 
            text: savedContent.greeting || "Hi, I'm", 
            color: '#94A3B8',
            colors: { dark: '#94A3B8', light: '#64748B' }
          }
        ],
        typography: {
          fontFamily: 'Inter',
          fontSize: { desktop: '18px', tablet: '16px', mobile: '14px' },
          fontWeight: '500',
          lineHeight: '1.4',
          color: '#94A3B8',
          colors: { dark: '#94A3B8', light: '#64748B' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '0px', spaceBelow: '8px', lineHeight: '1.4' },
        animation: { type: 'fade-in', duration: 0.5, delay: 0.1 },
      },
      {
        id: 'heading',
        name: 'Main Heading',
        type: 'heading',
        visible: true,
        locked: false,
        order: 2,
        rawText: defaultHeading,
        segments: [
          { 
            id: 'seg-1', 
            text: defaultHeading.startsWith(defaultHighlight) ? `${defaultHighlight} ` : defaultHighlight, 
            color: '#16C96B', 
            colors: { dark: '#16C96B', light: '#047857' },
            fontWeight: '800',
            animation: { type: 'character-reveal', duration: 0.6, delay: 0.2, easing: 'ease-out' } 
          },
          { 
            id: 'seg-2', 
            text: defaultHeading.startsWith(defaultHighlight) 
              ? defaultHeading.slice(defaultHighlight.length).trimStart() 
              : defaultHeading, 
            color: '#FFFFFF', 
            colors: { dark: '#FFFFFF', light: '#0F172A' },
            fontWeight: '800',
            animation: { type: 'word-reveal', duration: 0.7, delay: 0.4, easing: 'ease-out' } 
          }
        ],
        typography: {
          fontFamily: 'Manrope',
          fontSize: { desktop: '60px', tablet: '48px', mobile: '32px' },
          fontWeight: '800',
          lineHeight: '1.18',
          letterSpacing: 'tight',
          color: '#FFFFFF',
          colors: { dark: '#FFFFFF', light: '#0F172A' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '0px', spaceBelow: '16px', lineHeight: '1.18' },
        animation: { type: savedAnim.heading?.type || 'word-reveal', duration: 0.7, delay: 0.2 },
      },
      {
        id: 'subtitle',
        name: 'Subtitle',
        type: 'subtitle',
        visible: true,
        locked: false,
        order: 3,
        rawText: savedContent.subtitle || personal.degree || "Bachelor of Science in Computer Science",
        segments: [
          { 
            id: 'sub-1', 
            text: savedContent.subtitle || personal.degree || "Bachelor of Science in Computer Science", 
            color: '#E2E8F0',
            colors: { dark: '#E2E8F0', light: '#334155' }
          }
        ],
        typography: {
          fontFamily: 'Inter',
          fontSize: { desktop: '20px', tablet: '18px', mobile: '15px' },
          fontWeight: '600',
          lineHeight: '1.45',
          color: '#E2E8F0',
          colors: { dark: '#E2E8F0', light: '#334155' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '8px', spaceBelow: '8px', lineHeight: '1.45' },
        animation: { type: savedAnim.subtitle?.type || 'fade-in', duration: 0.6, delay: 0.35 },
      },
      {
        id: 'university',
        name: 'University',
        type: 'custom',
        visible: true,
        locked: false,
        order: 4,
        rawText: savedContent.university || personal.university || "Edith Cowan University",
        segments: [
          { 
            id: 'uni-1', 
            text: savedContent.university || personal.university || "Edith Cowan University", 
            color: '#94A3B8',
            colors: { dark: '#94A3B8', light: '#64748B' }
          }
        ],
        typography: {
          fontFamily: 'Inter',
          fontSize: { desktop: '14px', tablet: '13px', mobile: '12px' },
          fontWeight: '400',
          lineHeight: '1.5',
          color: '#94A3B8',
          colors: { dark: '#94A3B8', light: '#64748B' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '4px', spaceBelow: '12px', lineHeight: '1.5' },
        animation: { type: 'fade-in', duration: 0.5, delay: 0.45 },
      },
      {
        id: 'career',
        name: 'Career Path',
        type: 'custom',
        visible: true,
        locked: false,
        order: 5,
        rawText: savedContent.careerPath || personal.careerPath || personal.specialization || "Full-Stack Development & Distributed Systems",
        segments: [
          { 
            id: 'car-1', 
            text: savedContent.careerPath || personal.careerPath || personal.specialization || "Full-Stack Development & Distributed Systems", 
            color: '#CBD5E1',
            colors: { dark: '#CBD5E1', light: '#334155' }
          }
        ],
        typography: {
          fontFamily: 'Inter',
          fontSize: { desktop: '15px', tablet: '14px', mobile: '13px' },
          fontWeight: '500',
          lineHeight: '1.5',
          color: '#CBD5E1',
          colors: { dark: '#CBD5E1', light: '#334155' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '8px', spaceBelow: '6px', lineHeight: '1.5' },
        animation: { type: 'slide-up', duration: 0.6, delay: 0.5 },
      },
      {
        id: 'location',
        name: 'Location',
        type: 'custom',
        visible: true,
        locked: false,
        order: 6,
        rawText: savedContent.location || personal.location || "Perth, Australia & Colombo, Sri Lanka",
        segments: [
          { 
            id: 'loc-1', 
            text: savedContent.location || personal.location || "Perth, Australia & Colombo, Sri Lanka", 
            color: '#94A3B8',
            colors: { dark: '#94A3B8', light: '#64748B' }
          }
        ],
        typography: {
          fontFamily: 'Inter',
          fontSize: { desktop: '14px', tablet: '13px', mobile: '12px' },
          fontWeight: '400',
          lineHeight: '1.5',
          color: '#94A3B8',
          colors: { dark: '#94A3B8', light: '#64748B' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '4px', spaceBelow: '16px', lineHeight: '1.5' },
        animation: { type: 'fade-in', duration: 0.5, delay: 0.6 },
      },
      {
        id: 'description',
        name: 'Description',
        type: 'description',
        visible: true,
        locked: false,
        order: 7,
        rawText: savedContent.description || personal.bioShort || "Cybersecurity Specialist & Systems Developer with a background in secure network architectures, distributed systems, and modern AI engineering.",
        segments: [
          { 
            id: 'desc-1', 
            text: savedContent.description || personal.bioShort || "Cybersecurity Specialist & Systems Developer with a background in secure network architectures, distributed systems, and modern AI engineering.", 
            color: '#CBD5E1',
            colors: { dark: '#CBD5E1', light: '#475569' }
          }
        ],
        typography: {
          fontFamily: 'Inter',
          fontSize: { desktop: '15px', tablet: '14px', mobile: '13px' },
          fontWeight: '400',
          lineHeight: '1.75',
          color: '#CBD5E1',
          colors: { dark: '#CBD5E1', light: '#475569' },
          textAlign: 'left',
        },
        spacing: { spaceAbove: '8px', spaceBelow: '24px', lineHeight: '1.75', maxWidth: '640px' },
        animation: { type: savedAnim.description?.type || 'blur-reveal', duration: 0.7, delay: 0.7 },
      }
    ];
  }, [personal, settings]);

  // Master Studio State
  const [layers, setLayers] = useState(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState('heading');
  const [selectedSegmentId, setSelectedSegmentId] = useState('seg-1');
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'typography' | 'spacing' | 'colors' | 'animations' | 'advanced'

  // History stack for Undo / Redo
  const [history, setHistory] = useState([initialLayers]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Viewport and Preview Environment
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [previewDarkMode, setPreviewDarkMode] = useState(true);
  const [propertiesThemeTab, setPropertiesThemeTab] = useState('dark'); // 'dark' | 'light'
  const [floatingTheme, setFloatingTheme] = useState('dark'); // 'dark' | 'light'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [replayKey, setReplayKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // In-Canvas Active Text Range Selection state
  const [activeSelection, setActiveSelection] = useState(null);
  // { layerId, text, start, end, rect: { top, left, width, height } }

  // Animation Timeline State
  const [timelineZoom, setTimelineZoom] = useState(120);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [timelineCurrentTime, setTimelineCurrentTime] = useState(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const timelineAnimRef = useRef(null);
  const scrubberLineRef = useRef(null);
  const timeDisplayRef = useRef(null);

  // Status & Feedback
  const [saveStatus, setSaveStatus] = useState('saved');
  const [statusMessage, setStatusMessage] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Selected Layer & Segment references
  const selectedLayer = useMemo(() => {
    return layers.find(l => l.id === selectedLayerId) || layers[0] || null;
  }, [layers, selectedLayerId]);

  const selectedSegment = useMemo(() => {
    if (!selectedLayer?.segments) return null;
    return selectedLayer.segments.find(s => s.id === selectedSegmentId) || selectedLayer.segments[0] || null;
  }, [selectedLayer, selectedSegmentId]);

  // Memoized customHero config for <Hero> to guarantee stable object reference across unrelated renders
  const customHeroConfig = useMemo(() => {
    const activeTextColor = previewDarkMode
      ? (selectedLayer?.typography?.colors?.dark || selectedLayer?.typography?.color || '#FFFFFF')
      : (selectedLayer?.typography?.colors?.light || selectedLayer?.typography?.lightColor || '#0F172A');

    return {
      heroStudioPro: { layers },
      layers: layers,
      design: {
        textColor: activeTextColor,
        lightTextColor: selectedLayer?.typography?.colors?.light || selectedLayer?.typography?.lightColor || '#0F172A',
        colors: {
          dark: selectedLayer?.typography?.colors?.dark || selectedLayer?.typography?.color || '#FFFFFF',
          light: selectedLayer?.typography?.colors?.light || selectedLayer?.typography?.lightColor || '#0F172A',
        },
        accentColor: '#16C96B',
      }
    };
  }, [layers, selectedLayer?.typography?.colors, selectedLayer?.typography?.color, selectedLayer?.typography?.lightColor, previewDarkMode]);

  // Push new state snapshot to History
  const recordHistory = useCallback((nextLayers) => {
    setHistory(prev => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      nextHistory.push(JSON.parse(JSON.stringify(nextLayers)));
      return nextHistory;
    });
    setHistoryIndex(idx => idx + 1);
    setSaveStatus('unsaved');
  }, [historyIndex]);

  // Update Layers with history push
  const updateLayers = useCallback((updater) => {
    setLayers(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      recordHistory(next);
      return next;
    });
  }, [recordHistory]);

  // Direct Layer Property Updater
  const updateCurrentLayer = useCallback((propGroup, key, value) => {
    if (!selectedLayerId) return;
    setLayers(prev => {
      const next = prev.map(layer => {
        if (layer.id !== selectedLayerId) return layer;
        if (!propGroup) {
          return { ...layer, [key]: value };
        }
        return {
          ...layer,
          [propGroup]: {
            ...(layer[propGroup] || {}),
            [key]: value,
          }
        };
      });
      recordHistory(next);
      return next;
    });
  }, [selectedLayerId, recordHistory]);

  // Direct Segment Property Updater
  const updateCurrentSegment = useCallback((key, value) => {
    if (!selectedLayerId || !selectedSegmentId) return;
    setLayers(prev => {
      const next = prev.map(layer => {
        if (layer.id !== selectedLayerId) return layer;
        const nextSegments = (layer.segments || []).map(seg => {
          if (seg.id !== selectedSegmentId) return seg;
          if (key.startsWith('animation.')) {
            const animKey = key.split('.')[1];
            return {
              ...seg,
              animation: {
                ...(seg.animation || {}),
                [animKey]: value,
              }
            };
          }
          return { ...seg, [key]: value };
        });
        return { ...layer, segments: nextSegments };
      });
      recordHistory(next);
      return next;
    });
  }, [selectedLayerId, selectedSegmentId, recordHistory]);

  // Update segment theme color ('dark' | 'light')
  const updateCurrentSegmentThemeColor = useCallback((theme, val) => {
    if (!selectedLayerId || !selectedSegmentId) return;
    setLayers(prev => {
      const next = prev.map(layer => {
        if (layer.id !== selectedLayerId) return layer;
        const updatedSegments = (layer.segments || []).map(seg => {
          if (seg.id !== selectedSegmentId) return seg;
          const prevColors = seg.colors || {
            dark: seg.color || '#FFFFFF',
            light: seg.lightColor || '#0F172A',
          };
          const nextColors = {
            ...prevColors,
            [theme]: val === 'inherit' ? null : val,
          };
          return {
            ...seg,
            colors: nextColors,
            color: nextColors.dark || seg.color || '#FFFFFF',
          };
        });
        return { ...layer, segments: updatedSegments };
      });
      recordHistory(next);
      return next;
    });
  }, [selectedLayerId, selectedSegmentId, recordHistory]);

  // Update layer theme color ('dark' | 'light')
  const updateCurrentLayerThemeColor = useCallback((theme, val) => {
    if (!selectedLayerId) return;
    setLayers(prev => {
      const next = prev.map(layer => {
        if (layer.id !== selectedLayerId) return layer;
        const typo = layer.typography || {};
        const prevColors = typo.colors || {
          dark: typo.color || '#FFFFFF',
          light: typo.lightColor || '#0F172A',
        };
        const nextColors = {
          ...prevColors,
          [theme]: val === 'inherit' ? null : val,
        };
        return {
          ...layer,
          typography: {
            ...typo,
            colors: nextColors,
            color: nextColors.dark || typo.color || '#FFFFFF',
          }
        };
      });
      recordHistory(next);
      return next;
    });
  }, [selectedLayerId, recordHistory]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setLayers(JSON.parse(JSON.stringify(history[nextIdx])));
      setSaveStatus('unsaved');
      setActiveSelection(null);
    }
  }, [historyIndex, history]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setLayers(JSON.parse(JSON.stringify(history[nextIdx])));
      setSaveStatus('unsaved');
      setActiveSelection(null);
    }
  }, [historyIndex, history]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (cmdKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Replay entrance animations strictly on user request
  const triggerReplay = () => {
    setReplayKey(k => k + 1);
    setTimelineCurrentTime(0);
    setIsTimelinePlaying(true);
  };

  // Timeline scrubber playback animation (Uses direct DOM style updates to avoid 60fps React re-renders)
  const maxAnimationDuration = useMemo(() => {
    let maxT = 2.0;
    layers.forEach(layer => {
      if (layer.visible === false) return;
      const d = (layer.animation?.delay || 0) + (layer.animation?.duration || 0.6);
      if (d > maxT) maxT = d;
      (layer.segments || []).forEach(seg => {
        const segD = (seg.animation?.delay || 0) + (seg.animation?.duration || 0.6);
        if (segD > maxT) maxT = segD;
      });
    });
    return Math.ceil((maxT + 0.5) * 10) / 10;
  }, [layers]);

  useEffect(() => {
    if (!isTimelinePlaying) {
      if (timelineAnimRef.current) cancelAnimationFrame(timelineAnimRef.current);
      return;
    }

    const startTime = performance.now() - (timelineCurrentTime * 1000);

    const step = (now) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed >= maxAnimationDuration) {
        setTimelineCurrentTime(maxAnimationDuration);
        setIsTimelinePlaying(false);
        if (scrubberLineRef.current) {
          scrubberLineRef.current.style.transform = `translateX(${maxAnimationDuration * timelineZoom}px)`;
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.innerText = `${maxAnimationDuration.toFixed(2)}s`;
        }
      } else {
        if (scrubberLineRef.current) {
          scrubberLineRef.current.style.transform = `translateX(${elapsed * timelineZoom}px)`;
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.innerText = `${elapsed.toFixed(2)}s`;
        }
        timelineAnimRef.current = requestAnimationFrame(step);
      }
    };

    timelineAnimRef.current = requestAnimationFrame(step);
    return () => {
      if (timelineAnimRef.current) cancelAnimationFrame(timelineAnimRef.current);
    };
  }, [isTimelinePlaying, maxAnimationDuration, timelineZoom, timelineCurrentTime]);

  // Reorder Layers
  const moveLayer = (layerId, direction) => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= layers.length) return;

    const newLayers = [...layers];
    const [moved] = newLayers.splice(index, 1);
    newLayers.splice(targetIndex, 0, moved);
    newLayers.forEach((l, idx) => { l.order = idx; });
    updateLayers(newLayers);
  };

  const toggleLayerVisibility = (layerId) => {
    setLayers(prev => {
      const next = prev.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l);
      recordHistory(next);
      return next;
    });
  };

  const toggleLayerLock = (layerId) => {
    setLayers(prev => {
      const next = prev.map(l => l.id === layerId ? { ...l, locked: !l.locked } : l);
      recordHistory(next);
      return next;
    });
  };

  // Add Custom Layer
  const handleAddCustomLayer = () => {
    const newId = `layer-${Date.now().toString(36)}`;
    const newLayer = {
      id: newId,
      name: `Custom Text Layer ${layers.length + 1}`,
      type: 'custom',
      visible: true,
      locked: false,
      order: layers.length,
      rawText: 'New Custom Text Layer',
      segments: [
        { id: `seg-${Date.now()}`, text: 'New Custom Text Layer', color: '#16C96B' }
      ],
      typography: {
        fontFamily: 'Inter',
        fontSize: { desktop: '16px', tablet: '15px', mobile: '14px' },
        fontWeight: '500',
        lineHeight: '1.5',
        color: '#16C96B',
        textAlign: 'left',
      },
      spacing: { spaceAbove: '8px', spaceBelow: '8px', lineHeight: '1.5' },
      animation: { type: 'slide-up', duration: 0.6, delay: 0.2 },
    };

    updateLayers([...layers, newLayer]);
    setSelectedLayerId(newId);
    setSelectedSegmentId(newLayer.segments[0].id);
  };

  const handleDeleteLayer = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    if (['heading', 'subtitle', 'description', 'greeting'].includes(layer.id)) {
      alert('Core Hero layers cannot be deleted. You can hide them using the eye icon.');
      return;
    }
    if (window.confirm(`Delete "${layer.name}"?`)) {
      const newLayers = layers.filter(l => l.id !== layerId);
      updateLayers(newLayers);
      setSelectedLayerId('heading');
    }
  };

  const handleDuplicateLayer = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    const dupId = `dup-${Date.now().toString(36)}`;
    const duplicated = {
      ...JSON.parse(JSON.stringify(layer)),
      id: dupId,
      name: `${layer.name} (Copy)`,
      order: layer.order + 1,
    };
    const newLayers = [...layers];
    const idx = newLayers.findIndex(l => l.id === layerId);
    newLayers.splice(idx + 1, 0, duplicated);
    newLayers.forEach((l, i) => { l.order = i; });
    updateLayers(newLayers);
    setSelectedLayerId(dupId);
  };

  // Auto-Split Text into Word Segments
  const handleSplitWords = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    const textToSplit = layer.rawText || (layer.segments || []).map(s => s.text).join('') || '';
    const words = textToSplit.split(/\s+/).filter(Boolean);

    const newSegments = words.map((word, wIdx) => ({
      id: `seg-w-${Date.now().toString(36)}-${wIdx}`,
      text: wIdx < words.length - 1 ? `${word} ` : word,
      color: layer.typography?.color || '#FFFFFF',
      fontWeight: layer.typography?.fontWeight || '700',
      animation: {
        type: 'word-reveal',
        duration: 0.6,
        delay: Math.min(1.5, wIdx * 0.1),
        easing: 'ease-out',
      }
    }));

    setLayers(prev => {
      const next = prev.map(l => l.id === layerId ? { ...l, segments: newSegments } : l);
      recordHistory(next);
      return next;
    });

    if (newSegments.length > 0) {
      setSelectedSegmentId(newSegments[0].id);
    }
  };

  // =========================================================================
  // TASK 2 & 3: PRECISE TEXT RANGE HIGHLIGHTING & COLOR CUSTOMIZATION
  // =========================================================================

  // Helper to calculate exact character offset of selection inside layer
  const getSelectionOffsets = (layer, selectedText, range) => {
    const fullText = (layer.segments && layer.segments.length > 0)
      ? layer.segments.map(s => s.text).join('')
      : (layer.rawText || '');

    const firstIdx = fullText.indexOf(selectedText);
    if (firstIdx !== -1) {
      const lastIdx = fullText.lastIndexOf(selectedText);
      if (firstIdx === lastIdx) {
        return { start: firstIdx, end: firstIdx + selectedText.length };
      }
    }

    const layerEl = document.querySelector(`[data-layer-id="${layer.id}"]`);
    if (layerEl) {
      try {
        const preRange = range.cloneRange();
        preRange.selectNodeContents(layerEl);
        preRange.setEnd(range.startContainer, range.startOffset);
        const start = preRange.toString().length;
        const end = start + selectedText.length;
        return { start, end };
      } catch (e) {}
    }

    return { start: firstIdx !== -1 ? firstIdx : 0, end: (firstIdx !== -1 ? firstIdx : 0) + selectedText.length };
  };

  // Canvas MouseUp handler to detect text highlighting
  const handleCanvasMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }

    const selectedText = selection.toString();
    if (!selectedText || !selectedText.trim()) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const layerEl = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer.closest('[data-layer-id]')
      : range.commonAncestorContainer.parentElement?.closest('[data-layer-id]');

    const targetLayerId = layerEl?.getAttribute('data-layer-id') || selectedLayerId;
    const layer = layers.find(l => l.id === targetLayerId);
    if (!layer) return;

    const { start, end } = getSelectionOffsets(layer, selectedText, range);
    if (start >= 0 && end > start) {
      setSelectedLayerId(targetLayerId);
      setActiveSelection({
        layerId: targetLayerId,
        text: selectedText,
        start,
        end,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }
      });
    }
  };

  // Apply color to the highlighted text selection
  const applyColorToSelection = (color, targetTheme = null) => {
    if (!activeSelection) return;
    const { layerId, start, end } = activeSelection;
    const theme = targetTheme || floatingTheme || (previewDarkMode ? 'dark' : 'light');

    setLayers(prev => {
      const next = prev.map(layer => {
        if (layer.id !== layerId) return layer;
        const currentSegments = (layer.segments && layer.segments.length > 0)
          ? layer.segments
          : [{ id: `seg-${Date.now()}`, text: layer.rawText || '', color: layer.typography?.color || '#FFFFFF' }];

        const updatedSegments = applyColorToRange(currentSegments, start, end, color, theme);
        return { ...layer, segments: updatedSegments };
      });
      recordHistory(next);
      return next;
    });

    setActiveSelection(null);
  };

  // Apply style (Bold, Italic, Animation) to highlighted text selection
  const applyStyleToSelection = (styleUpdates, animUpdates = null) => {
    if (!activeSelection) return;
    const { layerId, start, end } = activeSelection;

    setLayers(prev => {
      const next = prev.map(layer => {
        if (layer.id !== layerId) return layer;
        const currentSegments = (layer.segments && layer.segments.length > 0)
          ? layer.segments
          : [{ id: `seg-${Date.now()}`, text: layer.rawText || '', color: layer.typography?.color || '#FFFFFF' }];

        const updatedSegments = applyStyleToRange(currentSegments, start, end, styleUpdates, animUpdates);
        return { ...layer, segments: updatedSegments };
      });
      recordHistory(next);
      return next;
    });

    setActiveSelection(null);
  };

  // Construct payload for persistence
  const buildSavePayload = useCallback(() => {
    const getLayerVal = (id, fallback = '') => {
      const l = layers.find(item => item.id === id);
      if (!l) return fallback;
      if (l.rawText) return l.rawText;
      if (l.segments && l.segments.length > 0) return l.segments.map(s => s.text).join('');
      return fallback;
    };

    const headingLayer = layers.find(l => l.id === 'heading');
    const highlightedSegment = headingLayer?.segments?.find(s => s.color === '#16C96B' || s.id === 'seg-1');

    return {
      heroStudioPro: {
        version: 2,
        published: true,
        updatedAt: new Date().toISOString(),
        layers: layers,
      },
      heroDesign: {
        content: {
          heading: getLayerVal('heading', personal.name),
          highlightedText: highlightedSegment?.text?.trim() || "Nuwan",
          subtitle: getLayerVal('subtitle', personal.degree),
          university: getLayerVal('university', personal.university),
          careerPath: getLayerVal('career', personal.careerPath),
          location: getLayerVal('location', personal.location),
          description: getLayerVal('description', personal.bioShort),
          greeting: getLayerVal('greeting', "Hi, I'm"),
          statusText: getLayerVal('badge', "AVAILABLE FOR OPPORTUNITIES."),
        },
        design: {
          textColor: headingLayer?.typography?.colors?.dark || headingLayer?.typography?.color || '#FFFFFF',
          lightTextColor: headingLayer?.typography?.colors?.light || headingLayer?.typography?.lightColor || '#0F172A',
          colors: {
            dark: headingLayer?.typography?.colors?.dark || headingLayer?.typography?.color || '#FFFFFF',
            light: headingLayer?.typography?.colors?.light || headingLayer?.typography?.lightColor || '#0F172A',
            accentDark: highlightedSegment?.colors?.dark || highlightedSegment?.color || '#16C96B',
            accentLight: highlightedSegment?.colors?.light || highlightedSegment?.lightColor || '#047857',
          },
          accentColor: highlightedSegment?.colors?.dark || highlightedSegment?.color || '#16C96B',
          lightAccentColor: highlightedSegment?.colors?.light || highlightedSegment?.lightColor || '#047857',
          textAlign: headingLayer?.typography?.textAlign || 'left',
          headingFontWeight: headingLayer?.typography?.fontWeight || '800',
          lineHeight: headingLayer?.spacing?.lineHeight || '1.18',
        },
        animations: {
          heading: headingLayer?.animation || { type: 'word-reveal', duration: 0.7, delay: 0.2 },
        }
      },
      heading: getLayerVal('heading', personal.name),
      subtitle: getLayerVal('subtitle', personal.degree),
      university: getLayerVal('university', personal.university),
      careerPath: getLayerVal('career', personal.careerPath),
      location: getLayerVal('location', personal.location),
      description: getLayerVal('description', personal.bioShort),
    };
  }, [layers, personal]);

  // Save Draft (Local Cache & Staged State)
  const handleSaveDraft = async () => {
    try {
      const payload = buildSavePayload();
      localStorage.setItem('portfolio_hero_studio_draft', JSON.stringify(payload));
      await saveHero(payload);
      setFeedback({ type: 'success', message: 'Draft saved successfully to local cache.' });
      setSaveStatus('saved');
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to save draft locally.' });
    }
  };

  // Publish Changes (Supabase + Staged Cache)
  const handlePublish = async () => {
    setSaveStatus('saving');
    setStatusMessage('Publishing Hero Studio Pro changes...');

    try {
      const payload = buildSavePayload();
      localStorage.setItem('portfolio_hero_studio_draft', JSON.stringify(payload));
      const res = await saveHero(payload);
      if (res.success) {
        setSaveStatus('published');
        setFeedback({ type: 'success', message: 'Hero Studio Pro modifications published live!' });
        setTimeout(() => setSaveStatus('saved'), 3000);
      } else {
        setSaveStatus('error');
        setFeedback({ type: 'error', message: res.error || 'Failed to publish modifications.' });
      }
    } catch (err) {
      setSaveStatus('error');
      setFeedback({ type: 'error', message: err.message || 'Unknown save error.' });
    }
  };

  // Reset entire hero to defaults
  const handleResetToDefaults = () => {
    if (window.confirm('Reset all Hero Studio Pro layers and settings back to initial portfolio defaults?')) {
      setLayers(initialLayers);
      recordHistory(initialLayers);
      setSelectedLayerId('heading');
      setSelectedSegmentId('seg-1');
      setFeedback({ type: 'info', message: 'Hero Studio Pro reset to initial defaults.' });
      triggerReplay();
    }
  };

  // Viewport dimensions simulation frame
  const viewportStyles = useMemo(() => {
    switch (viewMode) {
      case 'mobile':
        return { width: '390px', minHeight: '844px', border: '8px solid #262626', borderRadius: '40px' };
      case 'tablet':
        return { width: '768px', minHeight: '1024px', border: '8px solid #262626', borderRadius: '24px' };
      case 'desktop':
      default:
        return { width: '100%', minHeight: '100%', border: 'none', borderRadius: '0px' };
    }
  }, [viewMode]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0C] text-[#EDEDED] font-sans overflow-hidden select-none">
      
      {/* 1. TOP STUDIO CONTROL BAR */}
      <header className="h-14 border-b border-[#222225] bg-[#111114] px-4 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (saveStatus === 'unsaved') {
                if (!window.confirm('You have unsaved changes. Exit anyway?')) return;
              }
              navigate('/admin/hero');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#1C1C21] text-[#A0AEC0] hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Exit Hero Studio Pro"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Hero Manager</span>
          </button>

          <div className="h-4 w-px bg-[#26262B]" />

          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm tracking-wide text-white">
              Hero Studio <span className="text-[#16C96B]">Pro</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#16C96B]/15 text-[#16C96B] border border-[#16C96B]/30 uppercase">
              Visual Architecture
            </span>
          </div>
        </div>

        {/* Center: Playhead Controls & Undo/Redo */}
        <div className="flex items-center gap-2">
          
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded border text-xs flex items-center gap-1 transition-colors ${
              historyIndex > 0
                ? 'bg-[#18181C] hover:bg-[#222228] text-white border-[#2E2E36] cursor-pointer'
                : 'bg-[#121215] text-[#555] border-[#1C1C20] cursor-not-allowed opacity-40'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          {/* Redo Button */}
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded border text-xs flex items-center gap-1 transition-colors ${
              historyIndex < history.length - 1
                ? 'bg-[#18181C] hover:bg-[#222228] text-white border-[#2E2E36] cursor-pointer'
                : 'bg-[#121215] text-[#555] border-[#1C1C20] cursor-not-allowed opacity-40'
            }`}
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#26262B] mx-1" />

          {/* Replay Entrance */}
          <button
            onClick={triggerReplay}
            className="px-2.5 py-1 rounded bg-[#18181C] hover:bg-[#222228] text-white text-xs font-medium border border-[#2E2E36] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Replay all Hero entrance animations"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#16C96B]" />
            <span>Replay</span>
          </button>

          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2.5 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPaused 
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                : 'bg-[#18181C] hover:bg-[#222228] text-white border-[#2E2E36]'
            }`}
            title={isPaused ? "Resume animations" : "Pause animations"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Paused' : 'Playing'}</span>
          </button>
        </div>

        {/* Right: Actions (Reset, Draft, Publish) */}
        <div className="flex items-center gap-2.5">
          {feedback && (
            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${
              feedback.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' :
              feedback.type === 'error' ? 'bg-rose-950/40 text-rose-300 border-rose-800/40' :
              'bg-blue-950/40 text-blue-300 border-blue-800/40'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{feedback.message}</span>
            </div>
          )}

          <button
            onClick={handleResetToDefaults}
            className="px-2.5 py-1.5 rounded-md hover:bg-[#1C1C21] text-[#A0AEC0] hover:text-white text-xs font-medium border border-[#26262B] transition-colors cursor-pointer"
            title="Reset Hero to initial defaults"
          >
            Reset Defaults
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 rounded-md bg-[#18181C] hover:bg-[#222228] text-white text-xs font-medium border border-[#2E2E36] transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            disabled={saveStatus === 'saving'}
            className="btn-primary-pill text-xs px-4 py-1.5 font-semibold cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveStatus === 'saving' ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>

      </header>

      {/* 2. THREE-PANEL CORE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ============================================================== */}
        {/* LEFT PANEL: TEXT LAYERS & STRUCTURE */}
        {/* ============================================================== */}
        <aside className="w-72 bg-[#111114] border-r border-[#222225] flex flex-col shrink-0 overflow-hidden">
          
          {/* Header */}
          <div className="p-3 border-b border-[#222225] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayersIcon className="w-4 h-4 text-[#16C96B]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0]">Text Layers</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#1C1C22] text-[#888]">
                {layers.length}
              </span>
            </div>

            <button
              onClick={handleAddCustomLayer}
              className="p-1 rounded bg-[#1A1A20] hover:bg-[#25252E] text-[#16C96B] hover:text-white border border-[#262630] transition-colors cursor-pointer"
              title="Add New Text Layer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Layer List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {layers.map((layer, index) => {
              const isSelected = selectedLayerId === layer.id;
              const hasSegments = layer.segments && layer.segments.length > 0;

              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    setSelectedLayerId(layer.id);
                    if (hasSegments) setSelectedSegmentId(layer.segments[0].id);
                  }}
                  className={`group relative rounded-md border p-2 text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#18231E] border-[#16C96B]/50 text-white shadow-xs'
                      : 'bg-[#141418] border-[#222228] text-[#CBD5E1] hover:bg-[#18181E] hover:border-[#2C2C35]'
                  } ${layer.visible === false ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-[#555] shrink-0">#{index + 1}</span>
                      <span className={`font-semibold truncate ${isSelected ? 'text-[#16C96B]' : 'text-white'}`}>
                        {layer.name}
                      </span>
                    </div>

                    {/* Layer Actions */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }}
                        disabled={index === 0}
                        className="p-0.5 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }}
                        disabled={index === layers.length - 1}
                        className="p-0.5 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                        className="p-0.5 hover:text-white cursor-pointer ml-1"
                        title={layer.visible === false ? "Show Layer" : "Hide Layer"}
                      >
                        {layer.visible === false ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3 text-[#A0AEC0]" />}
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                        className="p-0.5 hover:text-white cursor-pointer"
                        title={layer.locked ? "Unlock Layer" : "Lock Layer"}
                      >
                        {layer.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-[#555]" />}
                      </button>
                    </div>
                  </div>

                  {/* Meta Preview */}
                  <div className="mt-1 flex items-center justify-between text-[10px] text-[#718096]">
                    <span className="truncate max-w-[140px]">
                      {layer.rawText || (layer.segments && layer.segments.map(s => s.text).join(''))}
                    </span>
                    <span className="font-mono bg-[#1C1C22] px-1 py-0.2 rounded border border-[#282830] text-[#A0AEC0]">
                      {layer.animation?.type || 'none'}
                    </span>
                  </div>

                  {/* Sub-Segments Chips inside Left Panel */}
                  {hasSegments && isSelected && (
                    <div className="mt-2 pt-1.5 border-t border-[#26322C] flex flex-wrap gap-1">
                      {layer.segments.map((seg, sIdx) => {
                        const isSegSelected = selectedSegmentId === seg.id;
                        return (
                          <button
                            key={seg.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSegmentId(seg.id);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer flex items-center gap-1 ${
                              isSegSelected
                                ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                                : 'bg-[#1C201E] text-[#CBD5E1] border-[#2A342E] hover:border-emerald-500/50'
                            }`}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full inline-block shrink-0" 
                              style={{ backgroundColor: seg.color || '#FFFFFF' }}
                            />
                            <span className="truncate max-w-[70px]">{seg.text.trim() || `Seg ${sIdx + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Left Panel Footer Summary */}
          <div className="p-3 border-t border-[#222225] bg-[#0E0E11] text-[11px] text-[#718096] flex items-center justify-between">
            <span>Selected: <strong className="text-white">{selectedLayer?.name || 'None'}</strong></span>
            {selectedLayer?.type === 'custom' && (
              <button
                onClick={() => handleDeleteLayer(selectedLayer.id)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </aside>

        {/* ============================================================== */}
        {/* CENTER PANEL: VISUAL CANVAS & BOTTOM TIMELINE */}
        {/* ============================================================== */}
        <main 
          className="flex-1 flex flex-col bg-[#070709] overflow-hidden relative"
          onMouseUp={handleCanvasMouseUp}
        >
          
          {/* Canvas Sub-Header Bar (Viewports, Zoom, Theme) */}
          <div className="h-10 border-b border-[#1E1E22] bg-[#0D0D10] px-4 flex items-center justify-between shrink-0 z-20">
            
            {/* Viewport Modes */}
            <div className="flex items-center gap-1 bg-[#151518] p-0.5 rounded-md border border-[#222226]">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'desktop' ? 'bg-[#222228] text-white font-medium' : 'text-[#888] hover:text-[#CCC]'
                }`}
                title="Desktop 100% View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                onClick={() => setViewMode('tablet')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'tablet' ? 'bg-[#222228] text-white font-medium' : 'text-[#888] hover:text-[#CCC]'
                }`}
                title="Tablet 768px Bezel"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>

              <button
                onClick={() => setViewMode('mobile')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'mobile' ? 'bg-[#222228] text-white font-medium' : 'text-[#888] hover:text-[#CCC]'
                }`}
                title="Mobile 390px Bezel"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-xs text-[#A0AEC0]">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))}
                className="p-1 rounded hover:bg-[#1C1C22] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={() => setZoomLevel(1)}
                className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#18181C] hover:bg-[#222228] cursor-pointer"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              <button
                onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))}
                className="p-1 rounded hover:bg-[#1C1C22] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Theme Toggle & Timeline Drawer Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#15151A] p-0.5 rounded-lg border border-[#25252D]">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDarkMode(false);
                    setPropertiesThemeTab('light');
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    !previewDarkMode 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' 
                      : 'text-[#A0AEC0] hover:text-white'
                  }`}
                  title="Switch Live Preview to Light Mode"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-[11px]">Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDarkMode(true);
                    setPropertiesThemeTab('dark');
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    previewDarkMode 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs' 
                      : 'text-[#A0AEC0] hover:text-white'
                  }`}
                  title="Switch Live Preview to Dark Mode"
                >
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-[11px]">Dark</span>
                </button>
              </div>

              <div className="h-4 w-px bg-[#26262B]" />

              <button
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isTimelineOpen 
                    ? 'bg-[#16C96B]/15 text-[#16C96B] border-[#16C96B]/30' 
                    : 'bg-[#18181C] text-[#888] border-[#25252A] hover:text-white'
                }`}
                title="Toggle Animation Timeline Drawer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
            </div>

          </div>

          {/* Interactive Live Canvas Viewport */}
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-[radial-gradient(#1E1E24_1px,transparent_1px)] bg-[size:16px_16px]">
            
            <div 
              style={{
                ...viewportStyles,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'width 250ms ease, border-radius 250ms ease, transform 150ms ease',
              }}
              className={`${previewDarkMode ? 'dark bg-[#060608]' : 'light bg-slate-50'} shadow-2xl relative overflow-hidden`}
            >
              {/* Actual Live Hero Component */}
              <Hero
                data={personal}
                settings={settings}
                darkMode={previewDarkMode}
                customHero={customHeroConfig}
                replayKey={replayKey}
                isEditorMode={true}
                selectedLayerId={selectedLayerId}
                selectedSegmentId={selectedSegmentId}
                onSelectLayer={(id) => {
                  setSelectedLayerId(id);
                  const l = layers.find(item => item.id === id);
                  if (l?.segments && l.segments.length > 0) {
                    setSelectedSegmentId(l.segments[0].id);
                  }
                }}
                onSelectSegment={(segId) => {
                  setSelectedSegmentId(segId);
                  const parent = layers.find(l => (l.segments || []).some(s => s.id === segId));
                  if (parent) setSelectedLayerId(parent.id);
                }}
                isPaused={isPaused}
                viewMode={viewMode}
              />
            </div>

            {/* ============================================================== */}
            {/* FLOATING TEXT FORMATTING TOOLBAR FOR HIGHLIGHTED RANGE */}
            {/* ============================================================== */}
            {activeSelection && (
              <div
                style={{
                  position: 'fixed',
                  top: Math.max(70, activeSelection.rect.top - 54),
                  left: Math.max(16, Math.min(window.innerWidth - 380, activeSelection.rect.left + activeSelection.rect.width / 2 - 160)),
                  zIndex: 9999,
                }}
                className="bg-[#121216] border border-[#2F2F3D] rounded-xl shadow-2xl p-1.5 flex items-center gap-1.5 backdrop-blur-md animate-fade-in text-xs"
                onMouseDown={(e) => e.preventDefault()} // Keeps browser text selection highlighted!
              >
                <div className="flex items-center gap-1 pr-1.5 border-r border-[#262630]">
                  <span className="text-[10px] font-mono text-[#16C96B] font-semibold px-1 truncate max-w-[80px]">
                    "{activeSelection.text.trim()}"
                  </span>
                </div>

                {/* Theme Selector for Floating Formatting */}
                <div className="flex items-center bg-[#1C1C24] p-0.5 rounded-md border border-[#2E2E3C] mr-0.5">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFloatingTheme('dark');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                      floatingTheme === 'dark'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Style Dark Mode color for selection"
                  >
                    <Moon className="w-2.5 h-2.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFloatingTheme('light');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                      floatingTheme === 'light'
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Style Light Mode color for selection"
                  >
                    <Sun className="w-2.5 h-2.5" />
                    <span>Light</span>
                  </button>
                </div>

                {/* Preset Colors for active floating theme */}
                <div className="flex items-center gap-1">
                  {(floatingTheme === 'dark' ? PRESET_DARK_COLORS : PRESET_LIGHT_COLORS).map(preset => (
                    <button
                      key={preset.hex}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyColorToSelection(preset.hex, floatingTheme);
                      }}
                      style={{ backgroundColor: preset.hex }}
                      className="w-5 h-5 rounded-full border border-white/20 hover:scale-115 active:scale-95 transition-transform cursor-pointer shadow-xs"
                      title={`${preset.name} (${preset.hex}) - ${floatingTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`}
                    />
                  ))}
                </div>

                {/* Visual Color Picker */}
                <div className="flex items-center gap-1 pl-1.5 border-l border-[#262630]">
                  <input
                    type="color"
                    defaultValue={floatingTheme === 'dark' ? '#16C96B' : '#047857'}
                    key={floatingTheme}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => applyColorToSelection(e.target.value, floatingTheme)}
                    className="w-5 h-5 rounded border border-[#444] bg-transparent cursor-pointer p-0"
                    title={`Custom Color Picker (${floatingTheme === 'dark' ? 'Dark Mode' : 'Light Mode'})`}
                  />
                </div>

                {/* Reset to Inherit/Parent Color */}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyColorToSelection('inherit', floatingTheme);
                  }}
                  className="p-1 rounded hover:bg-[#202028] text-[#A0AEC0] hover:text-white cursor-pointer ml-0.5"
                  title={`Reset ${floatingTheme === 'dark' ? 'Dark' : 'Light'} Mode color to inherit parent`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Quick Bold / Italic Toggles */}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyStyleToSelection({ fontWeight: '800' });
                  }}
                  className="p-1 rounded hover:bg-[#202028] text-[#A0AEC0] hover:text-white cursor-pointer"
                  title="Bold Range"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>

                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyStyleToSelection({ fontStyle: 'italic' });
                  }}
                  className="p-1 rounded hover:bg-[#202028] text-[#A0AEC0] hover:text-white cursor-pointer"
                  title="Italic Range"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>

                {/* Close floating toolbar */}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setActiveSelection(null);
                  }}
                  className="p-1 rounded hover:bg-[#202028] text-[#666] hover:text-white cursor-pointer ml-1"
                  title="Close Toolbar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* ============================================================== */}
          {/* BOTTOM PANEL: VISUAL ANIMATION TIMELINE */}
          {/* ============================================================== */}
          {isTimelineOpen && (
            <div className="h-56 bg-[#0E0E12] border-t border-[#222228] flex flex-col shrink-0 z-20">
              
              {/* Timeline Header Toolbar */}
              <div className="h-9 px-3 border-b border-[#222228] bg-[#121216] flex items-center justify-between text-xs">
                
                {/* Timeline Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isTimelinePlaying) {
                        setIsTimelinePlaying(false);
                      } else {
                        if (timelineCurrentTime >= maxAnimationDuration) setTimelineCurrentTime(0);
                        setIsTimelinePlaying(true);
                      }
                    }}
                    className="p-1 rounded bg-[#18181F] hover:bg-[#22222A] text-white border border-[#262630] cursor-pointer"
                    title={isTimelinePlaying ? "Pause Timeline" : "Play Timeline"}
                  >
                    {isTimelinePlaying ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-[#16C96B]" />}
                  </button>

                  <button
                    onClick={triggerReplay}
                    className="p-1 rounded bg-[#18181F] hover:bg-[#22222A] text-white border border-[#262630] cursor-pointer"
                    title="Replay from 0.0s"
                  >
                    <RotateCcw className="w-3 h-3 text-[#A0AEC0]" />
                  </button>

                  <span className="font-mono text-[11px] text-[#A0AEC0] ml-2">
                    <strong ref={timeDisplayRef} className="text-white">{timelineCurrentTime.toFixed(2)}s</strong> / {maxAnimationDuration.toFixed(1)}s
                  </span>
                </div>

                {/* Timeline Helpers */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 border-l border-[#222228] pl-2 text-[10px] text-[#718096]">
                    <span>Scale:</span>
                    <button
                      onClick={() => setTimelineZoom(z => Math.max(60, z - 20))}
                      className="px-1 hover:text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-[#CBD5E1]">{timelineZoom}px/s</span>
                    <button
                      onClick={() => setTimelineZoom(z => Math.min(240, z + 20))}
                      className="px-1 hover:text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Timeline Body (Tracks & Ruler) */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left: Track Labels */}
                <div className="w-48 bg-[#111115] border-r border-[#222228] overflow-y-auto shrink-0 select-none">
                  <div className="h-6 border-b border-[#222228] px-2 flex items-center text-[10px] font-mono text-[#555] uppercase">
                    Element / Track
                  </div>

                  {layers.map((layer) => {
                    const isSelected = selectedLayerId === layer.id;
                    const anim = layer.animation || {};

                    return (
                      <div key={layer.id} className="border-b border-[#1A1A20]">
                        <div 
                          onClick={() => {
                            setSelectedLayerId(layer.id);
                            setActiveTab('animations');
                          }}
                          className={`h-7 px-2 flex items-center justify-between text-[11px] cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#18231E] text-[#16C96B] font-semibold' : 'text-[#A0AEC0] hover:bg-[#16161C]'
                          }`}
                        >
                          <span className="truncate max-w-[100px]">{layer.name}</span>
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#1F1F26] text-[#888]">
                            {anim.type || 'none'}
                          </span>
                        </div>

                        {(layer.segments || []).map((seg) => (
                          <div
                            key={seg.id}
                            onClick={() => {
                              setSelectedLayerId(layer.id);
                              setSelectedSegmentId(seg.id);
                              setActiveTab('animations');
                            }}
                            className={`h-6 pl-4 pr-2 flex items-center justify-between text-[10px] font-mono cursor-pointer transition-colors ${
                              selectedSegmentId === seg.id ? 'bg-[#1D2B24] text-emerald-300 font-bold' : 'text-[#777] hover:bg-[#16161C]'
                            }`}
                          >
                            <span className="truncate max-w-[85px]">• {seg.text.trim() || 'Word'}</span>
                            <span className="text-[8px] text-[#555]">
                              {seg.animation?.type || 'inherit'}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Right: Scrollable Timeline Canvas */}
                <div className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#09090C] select-none">
                  
                  {/* Timeline Ruler */}
                  <div 
                    style={{ width: `${maxAnimationDuration * timelineZoom + 100}px` }}
                    className="h-6 border-b border-[#222228] relative bg-[#121216]"
                  >
                    {Array.from({ length: Math.ceil(maxAnimationDuration * 2) + 1 }).map((_, i) => {
                      const t = i * 0.5;
                      const leftPos = t * timelineZoom;
                      return (
                        <div 
                          key={i} 
                          style={{ left: `${leftPos}px` }} 
                          className="absolute top-0 bottom-0 border-l border-[#262630] pl-1 text-[9px] font-mono text-[#718096]"
                        >
                          {t.toFixed(1)}s
                        </div>
                      );
                    })}

                    {/* Scrubber Playhead Line */}
                    <div
                      ref={scrubberLineRef}
                      style={{ transform: `translateX(${timelineCurrentTime * timelineZoom}px)` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-30 pointer-events-none will-change-transform"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 -ml-1 -top-1 absolute shadow-xs" />
                    </div>
                  </div>

                  {/* Tracks Content Area */}
                  <div 
                    style={{ width: `${maxAnimationDuration * timelineZoom + 100}px` }}
                    className="relative"
                  >
                    {layers.map((layer) => {
                      const lDelay = layer.animation?.delay || 0;
                      const lDur = layer.animation?.duration || 0.6;
                      const lLeft = lDelay * timelineZoom;
                      const lWidth = Math.max(20, lDur * timelineZoom);

                      return (
                        <div key={layer.id} className="border-b border-[#1A1A20]">
                          {/* Layer Track Row */}
                          <div className="h-7 relative flex items-center">
                            <div
                              style={{ left: `${lLeft}px`, width: `${lWidth}px` }}
                              onClick={() => {
                                setSelectedLayerId(layer.id);
                                setActiveTab('animations');
                              }}
                              className={`absolute h-4 rounded-sm flex items-center px-1.5 text-[9px] font-mono font-semibold cursor-grab active:cursor-grabbing shadow-xs transition-colors ${
                                selectedLayerId === layer.id
                                  ? 'bg-emerald-500 text-black ring-1 ring-emerald-300'
                                  : 'bg-[#1C3327] text-emerald-300 border border-[#274635]'
                              }`}
                              title={`${layer.name}: Delay ${lDelay.toFixed(2)}s, Duration ${lDur.toFixed(2)}s`}
                            >
                              <span className="truncate">{lDur.toFixed(2)}s</span>
                            </div>
                          </div>

                          {/* Segments Track Rows */}
                          {(layer.segments || []).map((seg) => {
                            const sDelay = seg.animation?.delay !== undefined ? seg.animation.delay : lDelay;
                            const sDur = seg.animation?.duration !== undefined ? seg.animation.duration : 0.6;
                            const sLeft = sDelay * timelineZoom;
                            const sWidth = Math.max(16, sDur * timelineZoom);

                            return (
                              <div key={seg.id} className="h-6 relative flex items-center">
                                <div
                                  style={{ left: `${sLeft}px`, width: `${sWidth}px` }}
                                  onClick={() => {
                                    setSelectedLayerId(layer.id);
                                    setSelectedSegmentId(seg.id);
                                    setActiveTab('animations');
                                  }}
                                  className={`absolute h-3.5 rounded-xs flex items-center px-1 text-[8px] font-mono cursor-grab active:cursor-grabbing transition-colors ${
                                    selectedSegmentId === seg.id
                                      ? 'bg-emerald-400 text-black font-bold ring-1 ring-white'
                                      : 'bg-[#2A2A38] text-[#CBD5E1] border border-[#3C3C4E]'
                                  }`}
                                  title={`"${seg.text}": Delay ${sDelay.toFixed(2)}s, Duration ${sDur.toFixed(2)}s`}
                                >
                                  <span className="truncate">{sDur.toFixed(1)}s</span>
                                </div>
                              </div>
                            );
                          })}

                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>

        {/* ============================================================== */}
        {/* RIGHT PANEL: PROPERTIES & INSPECTOR */}
        {/* ============================================================== */}
        <aside className="w-84 bg-[#111114] border-l border-[#222225] flex flex-col shrink-0 overflow-hidden">
          
          {/* Target Header */}
          <div className="p-3 border-b border-[#222225] bg-[#141418]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-[#888] uppercase tracking-wider">Properties</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1F1F26] text-[#16C96B] border border-[#2B2B36]">
                {selectedLayer?.type || 'layer'}
              </span>
            </div>
            
            <div className="mt-1 flex items-center justify-between">
              <h2 className="font-semibold text-sm text-white truncate max-w-[180px]">
                {selectedLayer?.name || 'No Layer Selected'}
              </h2>

              {selectedSegment && (
                <span className="text-[11px] font-mono text-[#A0AEC0] truncate max-w-[100px]">
                  Seg: "{selectedSegment.text.trim()}"
                </span>
              )}
            </div>
          </div>

          {/* Six Tabs Selector */}
          <div className="grid grid-cols-6 border-b border-[#222225] bg-[#0E0E12] text-[10px] font-medium text-center">
            {[
              { id: 'content', label: 'Text' },
              { id: 'typography', label: 'Type' },
              { id: 'spacing', label: 'Space' },
              { id: 'colors', label: 'Color' },
              { id: 'animations', label: 'Anim' },
              { id: 'advanced', label: 'Adv' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 transition-colors cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#16C96B] text-white font-semibold bg-[#16161C]'
                    : 'border-transparent text-[#718096] hover:text-[#CCC] hover:bg-[#131317]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Properties Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            
            {/* -------------------------------------------------------- */}
            {/* TAB 1: CONTENT & SEGMENTS */}
            {/* -------------------------------------------------------- */}
            {activeTab === 'content' && selectedLayer && (
              <div className="space-y-4">
                
                {/* Layer Name */}
                <div>
                  <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Layer Label</label>
                  <input
                    type="text"
                    value={selectedLayer.name}
                    onChange={(e) => updateCurrentLayer(null, 'name', e.target.value)}
                    className="w-full bg-[#18181D] border border-[#2A2A33] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#16C96B]"
                  />
                </div>

                {/* Raw Full Text */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#A0AEC0]">Text Content</label>
                    <span className="text-[10px] text-[#718096]">Preserves spacing</span>
                  </div>
                  <textarea
                    rows={3}
                    value={selectedLayer.rawText || (selectedLayer.segments || []).map(s => s.text).join('')}
                    onChange={(e) => {
                      const newText = e.target.value;
                      updateCurrentLayer(null, 'rawText', newText);
                      if (selectedLayer.segments && selectedLayer.segments.length === 1) {
                        updateCurrentSegment('text', newText);
                      }
                    }}
                    className="w-full bg-[#18181D] border border-[#2A2A33] rounded p-2 text-white text-xs font-mono focus:outline-none focus:border-[#16C96B]"
                  />
                </div>

                {/* Segment Management & Word-Level Range Coloring */}
                <div className="p-2.5 rounded-md bg-[#16161B] border border-[#25252D]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#16C96B]" />
                      <span>Rich Segments ({selectedLayer.segments?.length || 0})</span>
                    </span>

                    <button
                      onClick={() => handleSplitWords(selectedLayer.id)}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#1E2E24] hover:bg-[#253D30] text-[#16C96B] border border-[#16C96B]/30 transition-colors cursor-pointer"
                      title="Split text into individual word segments for per-word animation and styling"
                    >
                      Split Words
                    </button>
                  </div>

                  <p className="text-[10px] text-[#718096] mb-2 leading-relaxed">
                    Highlight any text in the live canvas or click a word chip below to customize its exact color and animation.
                  </p>

                  {/* Segment Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(selectedLayer.segments || []).map((seg, sIdx) => {
                      const isSegActive = selectedSegmentId === seg.id;
                      const segDark = resolveSegmentColor(seg, true, selectedLayer.typography?.colors?.dark || '#FFFFFF');
                      const segLight = resolveSegmentColor(seg, false, selectedLayer.typography?.colors?.light || '#0F172A');
                      return (
                        <button
                          key={seg.id}
                          onClick={() => setSelectedSegmentId(seg.id)}
                          className={`px-2 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSegActive
                              ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-xs'
                              : 'bg-[#1C1C24] text-[#CBD5E1] border-[#2C2C38] hover:border-[#444]'
                          }`}
                        >
                          <span className="flex items-center gap-0.5">
                            <span 
                              className="w-2 h-2 rounded-full shrink-0 border border-white/20" 
                              style={{ backgroundColor: segDark }} 
                              title={`Dark mode: ${segDark}`}
                            />
                            <span 
                              className="w-2 h-2 rounded-full shrink-0 border border-black/20" 
                              style={{ backgroundColor: segLight }} 
                              title={`Light mode: ${segLight}`}
                            />
                          </span>
                          <span>"{seg.text.trim() || `Seg ${sIdx + 1}`}"</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Segment Color Quick Swatches */}
                  {selectedSegment && (() => {
                    const activeTheme = previewDarkMode ? 'dark' : 'light';
                    const activeSegColor = resolveSegmentColor(selectedSegment, previewDarkMode, selectedLayer.typography?.colors?.[activeTheme] || (previewDarkMode ? '#FFFFFF' : '#0F172A'));
                    const presets = previewDarkMode ? PRESET_DARK_COLORS : PRESET_LIGHT_COLORS;

                    return (
                      <div className="p-2.5 rounded bg-[#101014] border border-[#22222A] space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#A0AEC0]">Word: <strong className="text-white">"{selectedSegment.text.trim()}"</strong></span>
                          <span className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: activeSegColor }} />
                            <span className="text-white">{activeSegColor}</span>
                            <span className="text-[#718096]">({activeTheme === 'dark' ? '🌙 Dark' : '☀️ Light'})</span>
                          </span>
                        </div>

                        {/* Quick Presets for current preview theme */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {presets.map(c => (
                            <button
                              key={c.hex}
                              onClick={() => updateCurrentSegmentThemeColor(activeTheme, c.hex)}
                              style={{ backgroundColor: c.hex }}
                              className={`w-6 h-6 rounded-full border transition-transform cursor-pointer shadow-xs ${
                                activeSegColor.toLowerCase() === c.hex.toLowerCase() ? 'scale-115 border-white ring-2 ring-emerald-500' : 'border-white/20 hover:scale-105'
                              }`}
                              title={`${c.name} (${c.hex}) - applies to ${activeTheme} mode`}
                            />
                          ))}

                          <button
                            onClick={() => setActiveTab('colors')}
                            className="ml-auto px-2 py-0.5 rounded text-[10px] bg-[#1F1F28] hover:bg-[#282834] text-emerald-400 border border-[#333] cursor-pointer"
                          >
                            Full Dual Color Settings →
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                </div>

              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TAB 2: TYPOGRAPHY */}
            {/* -------------------------------------------------------- */}
            {activeTab === 'typography' && selectedLayer && (
              <div className="space-y-4">
                
                {/* Font Family */}
                <div>
                  <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Font Family</label>
                  <select
                    value={selectedLayer.typography?.fontFamily || 'Inter'}
                    onChange={(e) => updateCurrentLayer('typography', 'fontFamily', e.target.value)}
                    className="w-full bg-[#18181D] border border-[#2A2A33] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#16C96B] cursor-pointer"
                  >
                    {FONT_FAMILIES.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size (Responsive: Desktop, Tablet, Mobile) */}
                <div className="p-2.5 rounded-md bg-[#16161B] border border-[#25252D] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white">Responsive Font Size</span>
                    <span className="font-mono text-[10px] text-[#16C96B]">
                      {selectedLayer.typography?.fontSize?.[viewMode] || 'auto'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={12}
                      max={96}
                      step={1}
                      value={parseInt(selectedLayer.typography?.fontSize?.[viewMode] || '32', 10) || 32}
                      onChange={(e) => {
                        const val = `${e.target.value}px`;
                        const currentSizes = selectedLayer.typography?.fontSize || {};
                        updateCurrentLayer('typography', 'fontSize', {
                          ...currentSizes,
                          [viewMode]: val,
                        });
                      }}
                      className="flex-1 accent-[#16C96B] cursor-pointer"
                    />

                    <input
                      type="text"
                      value={selectedLayer.typography?.fontSize?.[viewMode] || ''}
                      onChange={(e) => {
                        const currentSizes = selectedLayer.typography?.fontSize || {};
                        updateCurrentLayer('typography', 'fontSize', {
                          ...currentSizes,
                          [viewMode]: e.target.value,
                        });
                      }}
                      className="w-16 bg-[#18181D] border border-[#2B2B36] rounded px-1.5 py-1 text-center text-white font-mono text-xs"
                      placeholder="px/rem"
                    />
                  </div>
                </div>

                {/* Font Weight */}
                <div>
                  <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Font Weight</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['400', '500', '600', '700', '800', '900'].map(w => (
                      <button
                        key={w}
                        onClick={() => {
                          if (selectedSegment) {
                            updateCurrentSegment('fontWeight', w);
                          } else {
                            updateCurrentLayer('typography', 'fontWeight', w);
                          }
                        }}
                        className={`py-1 rounded text-center font-mono text-xs border transition-colors cursor-pointer ${
                          (selectedSegment?.fontWeight === w || (!selectedSegment?.fontWeight && selectedLayer.typography?.fontWeight === w))
                            ? 'bg-[#16C96B] text-black font-bold border-[#16C96B]'
                            : 'bg-[#18181D] text-[#A0AEC0] border-[#2A2A33] hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Style & Decoration */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Style</label>
                    <div className="flex gap-1">
                      {['normal', 'italic'].map(st => (
                        <button
                          key={st}
                          onClick={() => {
                            if (selectedSegment) {
                              updateCurrentSegment('fontStyle', st);
                            } else {
                              updateCurrentLayer('typography', 'fontStyle', st);
                            }
                          }}
                          className={`flex-1 py-1 rounded text-xs border transition-colors cursor-pointer capitalize ${
                            (selectedSegment?.fontStyle === st || selectedLayer.typography?.fontStyle === st)
                              ? 'bg-[#16C96B] text-black font-semibold border-[#16C96B]'
                              : 'bg-[#18181D] text-[#A0AEC0] border-[#2A2A33] hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Decoration</label>
                    <div className="flex gap-1">
                      {['none', 'underline'].map(dec => (
                        <button
                          key={dec}
                          onClick={() => {
                            if (selectedSegment) {
                              updateCurrentSegment('textDecoration', dec);
                            } else {
                              updateCurrentLayer('typography', 'textDecoration', dec);
                            }
                          }}
                          className={`flex-1 py-1 rounded text-xs border transition-colors cursor-pointer capitalize ${
                            (selectedSegment?.textDecoration === dec || selectedLayer.typography?.textDecoration === dec)
                              ? 'bg-[#16C96B] text-black font-semibold border-[#16C96B]'
                              : 'bg-[#18181D] text-[#A0AEC0] border-[#2A2A33] hover:text-white'
                          }`}
                        >
                          {dec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Text Alignment</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'left', icon: AlignLeft },
                      { id: 'center', icon: AlignCenter },
                      { id: 'right', icon: AlignRight },
                    ].map(al => {
                      const Icon = al.icon;
                      return (
                        <button
                          key={al.id}
                          onClick={() => updateCurrentLayer('typography', 'textAlign', al.id)}
                          className={`flex-1 py-1.5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                            selectedLayer.typography?.textAlign === al.id
                              ? 'bg-[#16C96B] text-black border-[#16C96B]'
                              : 'bg-[#18181D] text-[#A0AEC0] border-[#2A2A33] hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TAB 3: SPACING (Decoupled line-height, margins, padding) */}
            {/* -------------------------------------------------------- */}
            {activeTab === 'spacing' && selectedLayer && (
              <div className="space-y-4">
                
                {/* Independent Line Height Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#A0AEC0]">Line Height (Independent)</label>
                    <span className="font-mono text-white text-[11px]">{selectedLayer.spacing?.lineHeight || '1.18'}</span>
                  </div>
                  <input
                    type="range"
                    min={0.9}
                    max={2.5}
                    step={0.05}
                    value={parseFloat(selectedLayer.spacing?.lineHeight || '1.18')}
                    onChange={(e) => updateCurrentLayer('spacing', 'lineHeight', e.target.value)}
                    className="w-full accent-[#16C96B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#555] font-mono mt-0.5">
                    <span>Tight (0.9)</span>
                    <span>Normal (1.5)</span>
                    <span>Loose (2.5)</span>
                  </div>
                </div>

                {/* Space Below (Margin Bottom) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#A0AEC0]">Space Below (Margin Bottom)</label>
                    <span className="font-mono text-white text-[11px]">{selectedLayer.spacing?.spaceBelow || '16px'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={2}
                    value={parseInt(selectedLayer.spacing?.spaceBelow || '16', 10)}
                    onChange={(e) => updateCurrentLayer('spacing', 'spaceBelow', `${e.target.value}px`)}
                    className="w-full accent-[#16C96B] cursor-pointer"
                  />
                </div>

                {/* Space Above (Margin Top) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#A0AEC0]">Space Above (Margin Top)</label>
                    <span className="font-mono text-white text-[11px]">{selectedLayer.spacing?.spaceAbove || '0px'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={2}
                    value={parseInt(selectedLayer.spacing?.spaceAbove || '0', 10)}
                    onChange={(e) => updateCurrentLayer('spacing', 'spaceAbove', `${e.target.value}px`)}
                    className="w-full accent-[#16C96B] cursor-pointer"
                  />
                </div>

                {/* Letter Spacing */}
                <div>
                  <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Letter Spacing</label>
                  <div className="grid grid-cols-5 gap-1 text-[10px]">
                    {[
                      { id: '-0.05em', label: 'Tighter' },
                      { id: '-0.025em', label: 'Tight' },
                      { id: 'normal', label: 'Normal' },
                      { id: '0.05em', label: 'Wide' },
                      { id: '0.1em', label: 'Wider' },
                    ].map(ls => (
                      <button
                        key={ls.id}
                        onClick={() => updateCurrentLayer('spacing', 'letterSpacing', ls.id)}
                        className={`py-1 rounded text-center border transition-colors cursor-pointer ${
                          selectedLayer.spacing?.letterSpacing === ls.id
                            ? 'bg-[#16C96B] text-black font-semibold border-[#16C96B]'
                            : 'bg-[#18181D] text-[#A0AEC0] border-[#2A2A33] hover:text-white'
                        }`}
                      >
                        {ls.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TAB 4: COLORS (Task 1 & 2: Dual Light & Dark Mode Text Colors) */}
            {/* -------------------------------------------------------- */}
            {activeTab === 'colors' && selectedLayer && (() => {
              const targetDark = selectedSegment 
                ? resolveSegmentColor(selectedSegment, true, selectedLayer.typography?.colors?.dark || '#FFFFFF')
                : (selectedLayer.typography?.colors?.dark || '#FFFFFF');
              const targetLight = selectedSegment 
                ? resolveSegmentColor(selectedSegment, false, selectedLayer.typography?.colors?.light || '#0F172A')
                : (selectedLayer.typography?.colors?.light || '#0F172A');

              const isDarkCustom = selectedSegment
                ? (selectedSegment.colors?.dark !== undefined && selectedSegment.colors?.dark !== null)
                : (selectedLayer.typography?.colors?.dark !== undefined && selectedLayer.typography?.colors?.dark !== null);
              const isLightCustom = selectedSegment
                ? (selectedSegment.colors?.light !== undefined && selectedSegment.colors?.light !== null)
                : (selectedLayer.typography?.colors?.light !== undefined && selectedLayer.typography?.colors?.light !== null);

              const currentTheme = propertiesThemeTab; // 'dark' | 'light'
              const currentColorVal = currentTheme === 'dark' ? targetDark : targetLight;
              const hasCustomForCurrent = currentTheme === 'dark' ? isDarkCustom : isLightCustom;
              const themePresets = currentTheme === 'dark' ? PRESET_DARK_COLORS : PRESET_LIGHT_COLORS;

              return (
                <div className="space-y-4">
                  
                  {/* Active Target Header & Segment/Layer Switcher */}
                  <div className="p-2.5 rounded-md bg-[#16161B] border border-[#25252D] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#A0AEC0] uppercase tracking-wider font-semibold">Active Target:</span>
                      {selectedSegment ? (
                        <button
                          onClick={() => setSelectedSegmentId(null)}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                          title="Click to customize entire layer color instead of single segment"
                        >
                          Select Whole Layer
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#718096]">Whole Layer Mode</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-xs" 
                        style={{ backgroundColor: previewDarkMode ? targetDark : targetLight }} 
                      />
                      <strong className="text-white text-xs truncate">
                        {selectedSegment ? `Word/Segment: "${selectedSegment.text.trim()}"` : selectedLayer.name}
                      </strong>
                      <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        selectedSegment ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {selectedSegment ? 'Word Level' : 'Layer Level'}
                      </span>
                    </div>
                  </div>

                  {/* Dual Theme Overview Status Card */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Dark Mode Overview Card */}
                    <div 
                      onClick={() => setPropertiesThemeTab('dark')}
                      className={`p-2 rounded-md border cursor-pointer transition-all ${
                        propertiesThemeTab === 'dark' 
                          ? 'bg-[#18261F] border-emerald-500/60 ring-1 ring-emerald-500/30' 
                          : 'bg-[#141418] border-[#25252D] hover:border-[#383842]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <Moon className="w-3 h-3" /> Dark Mode
                        </span>
                        <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                          isDarkCustom ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {isDarkCustom ? 'Custom' : 'Inherited'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-white/20 shadow-xs" style={{ backgroundColor: targetDark }} />
                        <span className="font-mono text-[11px] text-white font-medium">{targetDark}</span>
                      </div>
                    </div>

                    {/* Light Mode Overview Card */}
                    <div 
                      onClick={() => setPropertiesThemeTab('light')}
                      className={`p-2 rounded-md border cursor-pointer transition-all ${
                        propertiesThemeTab === 'light' 
                          ? 'bg-[#262016] border-amber-500/60 ring-1 ring-amber-500/30' 
                          : 'bg-[#141418] border-[#25252D] hover:border-[#383842]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                          <Sun className="w-3 h-3" /> Light Mode
                        </span>
                        <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                          isLightCustom ? 'bg-amber-500/20 text-amber-300' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {isLightCustom ? 'Custom' : 'Inherited'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-black/20 shadow-xs" style={{ backgroundColor: targetLight }} />
                        <span className="font-mono text-[11px] text-white font-medium">{targetLight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Independent Theme Switcher Sub-Tabs */}
                  <div className="flex rounded-lg bg-[#111115] p-1 border border-[#25252D]">
                    <button
                      onClick={() => setPropertiesThemeTab('dark')}
                      className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        propertiesThemeTab === 'dark'
                          ? 'bg-[#1C2C24] text-emerald-400 border border-emerald-500/50 shadow-xs'
                          : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Theme Colors</span>
                    </button>
                    <button
                      onClick={() => setPropertiesThemeTab('light')}
                      className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        propertiesThemeTab === 'light'
                          ? 'bg-[#2E2416] text-amber-300 border border-amber-500/50 shadow-xs'
                          : 'text-[#888] hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Theme Colors</span>
                    </button>
                  </div>

                  {/* Theme Sync Alert / Button if Canvas preview does not match current editing theme */}
                  {previewDarkMode !== (propertiesThemeTab === 'dark') && (
                    <div className="p-2 rounded bg-[#1A1A22] border border-[#2E2E3C] flex items-center justify-between text-[10px]">
                      <span className="text-[#A0AEC0]">
                        Previewing in <strong className="text-white">{previewDarkMode ? 'Dark' : 'Light'} Mode</strong> canvas.
                      </span>
                      <button
                        onClick={() => setPreviewDarkMode(propertiesThemeTab === 'dark')}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-medium transition-colors cursor-pointer"
                      >
                        Switch Canvas to {propertiesThemeTab === 'dark' ? 'Dark' : 'Light'}
                      </button>
                    </div>
                  )}

                  {/* Custom Hex & Visual Color Picker */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-[#A0AEC0]">
                        {currentTheme === 'dark' ? '🌙 Dark Mode Color (Hex / Picker)' : '☀️ Light Mode Color (Hex / Picker)'}
                      </label>
                      <span className="text-[10px] text-[#718096] font-mono">
                        {hasCustomForCurrent ? 'Custom Override' : 'Inheriting'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={isValidHexColor(currentColorVal) ? currentColorVal : (currentTheme === 'dark' ? '#FFFFFF' : '#0F172A')}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (selectedSegment) {
                            updateCurrentSegmentThemeColor(currentTheme, val);
                          } else {
                            updateCurrentLayerThemeColor(currentTheme, val);
                          }
                        }}
                        className="w-8 h-8 rounded border border-[#333] bg-transparent cursor-pointer p-0"
                        title={`Pick ${currentTheme} mode color`}
                      />

                      <input
                        type="text"
                        value={currentColorVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (selectedSegment) {
                            updateCurrentSegmentThemeColor(currentTheme, val);
                          } else {
                            updateCurrentLayerThemeColor(currentTheme, val);
                          }
                        }}
                        className="flex-1 bg-[#18181D] border border-[#2A2A33] rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#16C96B]"
                        placeholder={currentTheme === 'dark' ? '#16C96B' : '#047857'}
                      />

                      <button
                        onClick={() => {
                          if (selectedSegment) {
                            updateCurrentSegmentThemeColor(currentTheme, 'inherit');
                          } else {
                            updateCurrentLayerThemeColor(currentTheme, 'inherit');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded bg-[#18181D] hover:bg-[#202028] text-[#A0AEC0] hover:text-white border border-[#2B2B36] text-[10px] cursor-pointer"
                        title={selectedSegment ? `Inherit ${currentTheme} color from layer` : `Inherit ${currentTheme} color from default`}
                      >
                        Inherit
                      </button>
                    </div>
                  </div>

                  {/* Theme-Specific Preset Swatches */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1.5">
                      {currentTheme === 'dark' ? 'Recommended Dark Mode Presets' : 'Recommended Light Mode Presets'}
                    </label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {themePresets.map(preset => {
                        const isMatch = currentColorVal.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            onClick={() => {
                              if (selectedSegment) {
                                updateCurrentSegmentThemeColor(currentTheme, preset.hex);
                              } else {
                                updateCurrentLayerThemeColor(currentTheme, preset.hex);
                              }
                            }}
                            style={{ backgroundColor: preset.hex }}
                            className="h-8 rounded-md border border-white/10 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xs flex items-center justify-center"
                            title={`${preset.name} (${preset.hex})`}
                          >
                            {isMatch && (
                              <Check className={`w-3.5 h-3.5 ${preset.hex === '#FFFFFF' || preset.hex === '#6EE7B7' ? 'text-black' : 'text-white'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Extended Palette */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1.5">Extended Palette</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {EXTENDED_SWATCHES.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            if (selectedSegment) {
                              updateCurrentSegmentThemeColor(currentTheme, color);
                            } else {
                              updateCurrentLayerThemeColor(currentTheme, color);
                            }
                          }}
                          style={{ backgroundColor: color }}
                          className="h-6 rounded border border-white/10 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                          title={`Apply ${color} to ${currentTheme} mode`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* -------------------------------------------------------- */}
            {/* TAB 5: ANIMATIONS */}
            {/* -------------------------------------------------------- */}
            {activeTab === 'animations' && selectedLayer && (
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-2 rounded bg-[#16161B] border border-[#25252D] text-[11px]">
                  <span className="text-[#A0AEC0]">
                    Target: <strong className="text-white">{selectedSegment ? `Word: "${selectedSegment.text.trim()}"` : selectedLayer.name}</strong>
                  </span>
                  <button
                    onClick={triggerReplay}
                    className="flex items-center gap-1 text-[#16C96B] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replay</span>
                  </button>
                </div>

                {/* Animation Type */}
                <div>
                  <label className="block text-[11px] font-medium text-[#A0AEC0] mb-1">Animation Type</label>
                  <select
                    value={selectedSegment?.animation?.type || selectedLayer.animation?.type || 'none'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (selectedSegment) {
                        updateCurrentSegment('animation.type', val);
                      } else {
                        updateCurrentLayer('animation', 'type', val);
                      }
                      triggerReplay();
                    }}
                    className="w-full bg-[#18181D] border border-[#2A2A33] rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#16C96B] cursor-pointer"
                  >
                    <optgroup label="Entrance Animations (Play Once)">
                      {ANIMATION_TYPES.filter(a => a.category === 'entrance').map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Typing Animations">
                      {ANIMATION_TYPES.filter(a => a.category === 'typing').map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Continuous Animations (Looping)">
                      {ANIMATION_TYPES.filter(a => a.category === 'continuous').map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Exit Animations">
                      {ANIMATION_TYPES.filter(a => a.category === 'exit').map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Static">
                      <option value="none">None (Static Text)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#A0AEC0]">Duration</label>
                    <span className="font-mono text-white text-[11px]">
                      {((selectedSegment?.animation?.duration !== undefined ? selectedSegment.animation.duration : selectedLayer.animation?.duration) || 0.6).toFixed(2)}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={4.0}
                    step={0.05}
                    value={(selectedSegment?.animation?.duration !== undefined ? selectedSegment.animation.duration : selectedLayer.animation?.duration) || 0.6}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (selectedSegment) {
                        updateCurrentSegment('animation.duration', val);
                      } else {
                        updateCurrentLayer('animation', 'duration', val);
                      }
                    }}
                    className="w-full accent-[#16C96B] cursor-pointer"
                  />
                </div>

                {/* Delay */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#A0AEC0]">Start Delay</label>
                    <span className="font-mono text-white text-[11px]">
                      {((selectedSegment?.animation?.delay !== undefined ? selectedSegment.animation.delay : selectedLayer.animation?.delay) || 0.0).toFixed(2)}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={4.0}
                    step={0.05}
                    value={(selectedSegment?.animation?.delay !== undefined ? selectedSegment.animation.delay : selectedLayer.animation?.delay) || 0.0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (selectedSegment) {
                        updateCurrentSegment('animation.delay', val);
                      } else {
                        updateCurrentLayer('animation', 'delay', val);
                      }
                    }}
                    className="w-full accent-[#16C96B] cursor-pointer"
                  />
                </div>

                {/* Infinite Loop Repeat Toggle */}
                <div className="flex items-center justify-between p-2 rounded bg-[#16161B] border border-[#25252D]">
                  <div>
                    <span className="text-white font-medium block">Infinite Loop Repeat</span>
                    <span className="text-[10px] text-[#718096]">Disabled by default (plays once)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedSegment?.animation?.repeat !== undefined ? selectedSegment.animation.repeat : selectedLayer.animation?.repeat)}
                    onChange={(e) => {
                      const val = e.target.checked;
                      if (selectedSegment) {
                        updateCurrentSegment('animation.repeat', val);
                      } else {
                        updateCurrentLayer('animation', 'repeat', val);
                      }
                    }}
                    className="w-4 h-4 accent-[#16C96B] cursor-pointer"
                  />
                </div>

              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TAB 6: ADVANCED */}
            {/* -------------------------------------------------------- */}
            {activeTab === 'advanced' && selectedLayer && (
              <div className="space-y-4">
                
                <div className="p-2.5 rounded bg-[#16161B] border border-[#25252D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0AEC0]">Visible on Site</span>
                    <input
                      type="checkbox"
                      checked={selectedLayer.visible !== false}
                      onChange={() => toggleLayerVisibility(selectedLayer.id)}
                      className="w-4 h-4 accent-[#16C96B] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#A0AEC0]">Lock Layer</span>
                    <input
                      type="checkbox"
                      checked={Boolean(selectedLayer.locked)}
                      onChange={() => toggleLayerLock(selectedLayer.id)}
                      className="w-4 h-4 accent-[#16C96B] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleDuplicateLayer(selectedLayer.id)}
                    className="w-full py-2 rounded bg-[#18181D] hover:bg-[#222228] text-white border border-[#2A2A33] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#16C96B]" />
                    <span>Duplicate Layer</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Reset "${selectedLayer.name}" to defaults?`)) {
                        const def = initialLayers.find(l => l.id === selectedLayer.id);
                        if (def) {
                          setLayers(prev => prev.map(l => l.id === selectedLayer.id ? JSON.parse(JSON.stringify(def)) : l));
                        }
                      }
                    }}
                    className="w-full py-2 rounded bg-[#18181D] hover:bg-[#222228] text-[#A0AEC0] hover:text-white border border-[#2A2A33] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Layer to Defaults</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Right Panel Bottom Status */}
          <div className="p-3 border-t border-[#222225] bg-[#0E0E12] flex items-center justify-between text-[11px] text-[#718096]">
            <span>Save Status:</span>
            <span className={`font-semibold capitalize ${
              saveStatus === 'saved' ? 'text-emerald-400' :
              saveStatus === 'unsaved' ? 'text-amber-400' :
              saveStatus === 'saving' ? 'text-blue-400' :
              saveStatus === 'published' ? 'text-emerald-400 font-bold' :
              'text-rose-400'
            }`}>
              {saveStatus}
            </span>
          </div>

        </aside>

      </div>

    </div>
  );
}
