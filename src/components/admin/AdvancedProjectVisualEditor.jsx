import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  RotateCcw, 
  RotateCw, 
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
  Heading1, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  SplitSquareVertical, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { GithubIcon } from '../BrandIcons';
import { loadGoogleFont, GOOGLE_FONTS_CATALOG } from '../../utils/googleFonts';

// Recent / saved colors palette
const PRESET_COLORS = [
  '#0A0A0A', '#121212', '#1A1A1A', '#262626', '#2D3748',
  '#FFFFFF', '#F5F7FA', '#E2E8F0', '#A0AEC0', '#718096',
  '#10B981', '#059669', '#3B82F6', '#2563EB', '#8B5CF6',
  '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#6366F1'
];

export default function AdvancedProjectVisualEditor({ 
  initialProject, 
  onSave, 
  onClose, 
  uploadAsset 
}) {
  // Normalize project structure and synthesize initial sections if empty
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

    // If no custom sections exist, synthesize rich default sections from existing data
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

      // Section 3: Performance Benchmarks & Results
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
  
  // Selection
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('typography'); // 'typography' | 'block' | 'section' | 'project'

  // History for Undo / Redo
  const [history, setHistory] = useState([normalizeProject(initialProject)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Font Search
  const [fontSearch, setFontSearch] = useState('');
  
  // Feedback
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Push to history
  const updateProjectWithHistory = useCallback((updater) => {
    setProject((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setHistory((prevHist) => {
        const sliced = prevHist.slice(0, historyIndex + 1);
        return [...sliced, next].slice(-30); // Keep last 30 steps
      });
      setHistoryIndex((prevIdx) => Math.min(prevIdx + 1, 29));
      return next;
    });
  }, [historyIndex]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setProject(history[newIdx]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setProject(history[newIdx]);
    }
  };

  // Autosave to localStorage every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (project?.id) {
        try {
          localStorage.setItem(`portfolio_draft_project_${project.id}`, JSON.stringify(project));
        } catch (e) {}
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [project]);

  // Preload any custom Google Fonts currently used
  useEffect(() => {
    (project.sections || []).forEach(sec => {
      (sec.columns || []).forEach(col => {
        (col.blocks || []).forEach(b => {
          if (b.fontFamily) loadGoogleFont(b.fontFamily);
        });
      });
    });
  }, [project.sections]);

  // Current selected block reference
  const currentSection = (project.sections || []).find(s => s.id === selectedSectionId) || project.sections?.[0];
  const currentColumn = currentSection?.columns?.[selectedColumnIndex] || currentSection?.columns?.[0];
  const currentBlock = currentColumn?.blocks?.find(b => b.id === selectedBlockId);

  // -------------------------------------------------------------
  // SECTION MANAGEMENT
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
      alert("A project must have at least one section.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this section?")) return;
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
          // Merge blocks from surplus columns into the last remaining column
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
      newBlock.content = 'New formatted paragraph text with rich typography.';
      newBlock.fontSize = '15px';
      newBlock.lineHeight = '1.7';
    } else if (type === 'heading') {
      newBlock.content = 'Section Topic Heading';
      newBlock.headingLevel = 'h3';
      newBlock.fontSize = '20px';
      newBlock.fontWeight = '700';
    } else if (type === 'callout') {
      newBlock.content = 'Important technical note, architectural constraint, or security requirement.';
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
          [{ text: 'Socket Buffer' }, { text: '64 KB' }, { text: '16 MB Ring' }],
          [{ text: 'Latency' }, { text: '18.4 ms' }, { text: '< 4.2 ms' }]
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

  // Image upload
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

  // File Attachment upload
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

  // Save Project Action (Draft or Publish)
  const handleSave = async (publish = true) => {
    setSaveStatus('saving');
    setStatusMessage('Saving project to database...');
    
    const payload = {
      ...project,
      is_published: publish,
      slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    try {
      const res = await onSave(payload);
      if (res?.error) {
        setSaveStatus('error');
        setStatusMessage(res.error);
      } else {
        setSaveStatus('saved');
        setStatusMessage(publish ? 'Project published live!' : 'Draft saved successfully.');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      setSaveStatus('error');
      setStatusMessage(err.message || 'Save failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* ========================================================= */}
      {/* TOP WORKSPACE TOOLBAR                                     */}
      {/* ========================================================= */}
      <header className="h-14 border-b border-[#222222] bg-[#121212] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E1E1E] transition-colors cursor-pointer"
            title="Exit Editor"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Visual Studio
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-[320px]">
                {project.title || 'Untitled Project'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher & Undo/Redo */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-[#0A0A0A] p-0.5 rounded-lg border border-[#222222]">
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'desktop' ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Desktop Preview (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'tablet' ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tablet Preview (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'mobile' ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Mobile Preview (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-[#222222] pl-3">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E1E1E] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E1E1E] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions: Add Block Dropdown, Preview, Save Draft, Publish */}
        <div className="flex items-center gap-2.5">
          {saveStatus && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${saveStatus === 'saved' ? 'text-emerald-400 bg-emerald-500/10' : saveStatus === 'error' ? 'text-red-400 bg-red-500/10' : 'text-amber-400'}`}>
              {statusMessage}
            </span>
          )}

          <button
            type="button"
            onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1E1E1E] border border-[#262626] transition-colors cursor-pointer"
            title="Open Live URL in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test URL</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1E1E1E] hover:bg-[#262626] text-white border border-[#333333] transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#F5F7FA] hover:bg-white text-[#0A0A0A] shadow-md transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* THREE-PANEL STUDIO BODY                                   */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ------------------------------------------------------- */}
        {/* PANEL 1: LEFT SIDEBAR (STRUCTURE & TOPICS TREE)         */}
        {/* ------------------------------------------------------- */}
        <aside className="w-64 sm:w-72 border-r border-[#222222] bg-[#0E0E0E] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#222222] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Structure
            </span>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1A1A1A] hover:bg-[#262626] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Section</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Project Meta Card Trigger */}
            <div
              onClick={() => {
                setSelectedBlockId(null);
                setActiveInspectorTab('project');
              }}
              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${activeInspectorTab === 'project' ? 'bg-[#1E1E1E] border-white/40 text-white' : 'border-[#222222] text-slate-400 hover:bg-[#141414] hover:text-slate-200'}`}
            >
              <div className="font-semibold text-slate-200">Main Project Settings</div>
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
                  {/* Section Title Header */}
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
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sec.id, 'down')}
                        disabled={sIdx === project.sections.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Columns & Blocks List */}
                  {selectedSectionId === sec.id && (
                    <div className="px-2.5 pb-2.5 pt-1 border-t border-[#222222] space-y-1.5 text-[11px]">
                      {(sec.columns || []).map((col, cIdx) => (
                        <div key={col.id} className="space-y-1">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Col {cIdx + 1} ({col.blocks?.length || 0})</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedColumnIndex(cIdx);
                                  handleAddBlock('text');
                                }}
                                className="text-slate-400 hover:text-white"
                                title="Add text block"
                              >
                                + Text
                              </button>
                            </div>
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
                                {b.type === 'heading' && <Heading2 className="w-3 h-3 text-blue-400" />}
                                {b.type === 'text' && <Type className="w-3 h-3 text-slate-400" />}
                                {b.type === 'image' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                                {b.type === 'table' && <TableIcon className="w-3 h-3 text-amber-400" />}
                                {b.type === 'list' && <List className="w-3 h-3 text-purple-400" />}
                                {b.type === 'callout' && <Sparkles className="w-3 h-3 text-yellow-400" />}
                                {b.type === 'attachment' && <FileText className="w-3 h-3 text-red-400" />}
                                <span className="truncate">{b.content || b.caption || b.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBlock(b.id);
                                }}
                                className="text-slate-500 hover:text-red-400"
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

            {/* Quick Add Content Blocks Bar */}
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
                <label className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer">
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
                      className="text-slate-500 hover:text-red-400"
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
        <main className="flex-1 bg-[#050505] overflow-y-auto flex justify-center p-4 sm:p-8">
          <div 
            className={`transition-all duration-300 bg-[#0A0A0A] border border-[#222222] rounded-2xl shadow-2xl p-6 sm:p-10 space-y-10 min-h-full ${
              viewMode === 'mobile' ? 'w-[375px]' :
              viewMode === 'tablet' ? 'w-[768px]' :
              'w-full max-w-4xl'
            }`}
          >
            {/* Project Header Live Preview */}
            <div className="space-y-4 border-b border-[#222222] pb-8">
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
                onChange={e => updateProjectWithHistory(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project Title"
                className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-white focus:outline-none w-full"
              />

              <textarea
                value={project.tagline}
                onChange={e => updateProjectWithHistory(prev => ({ ...prev, tagline: e.target.value }))}
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
                      ? 'border-[#2D3748] dark:border-white/40 ring-1 ring-white/20 bg-[#121212]' 
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
                        }));
                      }}
                      placeholder="Section Title"
                      className="text-lg font-heading font-bold text-white bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-white/40 rounded px-1"
                    />

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {sec.columnsCount} Col{sec.columnsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Section Columns */}
                  <div 
                    className={`grid gap-5 ${
                      sec.columnsCount === 2 ? 'grid-cols-2' :
                      sec.columnsCount === 3 ? 'grid-cols-3' :
                      sec.columnsCount === 4 ? 'grid-cols-4' :
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
                            className={`p-3 rounded-lg border transition-all relative group/block ${
                              selectedBlockId === b.id 
                                ? 'border-white bg-[#1A1A1A] ring-2 ring-white/20' 
                                : 'border-transparent hover:border-slate-700 hover:bg-[#141414]'
                            }`}
                          >
                            {/* Render block according to type */}
                            {b.type === 'heading' ? (
                              <input
                                type="text"
                                value={b.content || ''}
                                onChange={e => handleUpdateCurrentBlock({ content: e.target.value })}
                                style={{
                                  fontFamily: b.fontFamily || undefined,
                                  fontSize: b.fontSize || '20px',
                                  fontWeight: b.fontWeight || '700',
                                  color: b.textColor || '#FFFFFF',
                                  textAlign: b.textAlign || 'left',
                                }}
                                className="w-full bg-transparent border-none focus:outline-none"
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
                                <textarea
                                  value={b.content || ''}
                                  onChange={e => handleUpdateCurrentBlock({ content: e.target.value })}
                                  className="w-full bg-transparent border-none focus:outline-none resize-none"
                                  rows={2}
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
                              /* Default Text Block */
                              <textarea
                                value={b.content || ''}
                                onChange={e => handleUpdateCurrentBlock({ content: e.target.value })}
                                style={{
                                  fontFamily: b.fontFamily || undefined,
                                  fontSize: b.fontSize || '15px',
                                  fontWeight: b.fontWeight || undefined,
                                  fontStyle: b.fontStyle || undefined,
                                  lineHeight: b.lineHeight || '1.7',
                                  letterSpacing: b.letterSpacing || undefined,
                                  textTransform: b.textTransform || undefined,
                                  textAlign: b.textAlign || 'left',
                                  color: b.textColor || '#CBD5E1',
                                }}
                                rows={Math.max(2, (b.content || '').split('\n').length)}
                                className="w-full bg-transparent border-none focus:outline-none resize-none leading-relaxed"
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
        </main>

        {/* ------------------------------------------------------- */}
        {/* PANEL 3: RIGHT CONTEXT-SENSITIVE INSPECTOR              */}
        {/* ------------------------------------------------------- */}
        <aside className="w-72 sm:w-80 border-l border-[#222222] bg-[#0E0E0E] flex flex-col shrink-0">
          
          {/* Inspector Navigation Tabs */}
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
            {/* TAB: COMPLETE TYPOGRAPHY & GOOGLE FONTS             */}
            {/* --------------------------------------------------- */}
            {activeInspectorTab === 'typography' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Google Fonts Catalog
                  </label>
                  
                  {/* Font Search Filter */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={e => setFontSearch(e.target.value)}
                      placeholder="Search Google Fonts..."
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Font Select List with Live Preview */}
                  <div className="max-h-44 overflow-y-auto space-y-1 rounded-lg border border-[#262626] p-1 bg-[#121212]">
                    {GOOGLE_FONTS_CATALOG
                      .filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase()) || f.category.toLowerCase().includes(fontSearch.toLowerCase()))
                      .map(f => (
                        <div
                          key={f.name}
                          onClick={() => {
                            loadGoogleFont(f.name);
                            handleUpdateCurrentBlock({ fontFamily: f.name });
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

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Font Size
                    </label>
                    <select
                      value={currentBlock?.fontSize || '15px'}
                      onChange={e => handleUpdateCurrentBlock({ fontSize: e.target.value })}
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="12px">12px (Small)</option>
                      <option value="14px">14px (Regular)</option>
                      <option value="15px">15px (Body)</option>
                      <option value="16px">16px (Lead)</option>
                      <option value="18px">18px (H4)</option>
                      <option value="20px">20px (H3)</option>
                      <option value="24px">24px (H2)</option>
                      <option value="32px">32px (H1)</option>
                      <option value="40px">40px (Hero)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Weight
                    </label>
                    <select
                      value={currentBlock?.fontWeight || '400'}
                      onChange={e => handleUpdateCurrentBlock({ fontWeight: e.target.value })}
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="300">300 (Light)</option>
                      <option value="400">400 (Regular)</option>
                      <option value="500">500 (Medium)</option>
                      <option value="600">600 (Semi-Bold)</option>
                      <option value="700">700 (Bold)</option>
                      <option value="800">800 (Extra Bold)</option>
                    </select>
                  </div>
                </div>

                {/* Text Formatting Controls: Alignment & Case */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Text Alignment
                  </label>
                  <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-lg border border-[#262626]">
                    {['left', 'center', 'right', 'justify'].map(align => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => handleUpdateCurrentBlock({ textAlign: align })}
                        className={`flex-1 p-1.5 rounded flex items-center justify-center ${
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

                {/* Text Colors & Presets */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Text Color (Unrestricted HEX / Picker)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={currentBlock?.textColor || '#CBD5E1'}
                      onChange={e => handleUpdateCurrentBlock({ textColor: e.target.value })}
                      className="w-8 h-8 rounded border border-[#262626] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={currentBlock?.textColor || '#CBD5E1'}
                      onChange={e => handleUpdateCurrentBlock({ textColor: e.target.value })}
                      placeholder="#CBD5E1"
                      className="flex-1 bg-[#161616] border border-[#262626] rounded-lg p-1.5 text-xs text-white"
                    />
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleUpdateCurrentBlock({ textColor: c })}
                        style={{ backgroundColor: c }}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Line Height & Letter Spacing */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#222222]">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Line Height
                    </label>
                    <select
                      value={currentBlock?.lineHeight || '1.7'}
                      onChange={e => handleUpdateCurrentBlock({ lineHeight: e.target.value })}
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="1.3">1.3 (Compact)</option>
                      <option value="1.5">1.5 (Standard)</option>
                      <option value="1.7">1.7 (Comfortable)</option>
                      <option value="2.0">2.0 (Double)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Transform
                    </label>
                    <select
                      value={currentBlock?.textTransform || 'none'}
                      onChange={e => handleUpdateCurrentBlock({ textTransform: e.target.value })}
                      className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="none">Normal</option>
                      <option value="uppercase">UPPERCASE</option>
                      <option value="capitalize">Capitalize</option>
                      <option value="lowercase">lowercase</option>
                    </select>
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
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete Block
                      </button>
                    </div>

                    {/* Image Block Settings */}
                    {currentBlock.type === 'image' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Upload New Image
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

                    {/* Table Block Settings */}
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
                            className="p-2 rounded bg-[#1A1A1A] hover:bg-[#262626] text-xs font-medium"
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
                            className="p-2 rounded bg-[#1A1A1A] hover:bg-[#262626] text-xs font-medium"
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
                            className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
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

                    <div className="pt-4 border-t border-[#222222]">
                      <button
                        type="button"
                        onClick={() => handleDuplicateSection(currentSection.id)}
                        className="w-full p-2 rounded-lg bg-[#161616] hover:bg-[#222222] text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 mb-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate Section</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(currentSection.id)}
                        className="w-full p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-xs font-semibold text-red-400 flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-8">
                    Select a section to configure column widths and background styles.
                  </p>
                )}
              </div>
            )}

            {/* --------------------------------------------------- */}
            {/* TAB: PROJECT META & REPOSITORY LINKS                */}
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
                  <p className="text-[10px] text-slate-500 mt-1">Direct URL: /projects/{project.slug}</p>
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
                    <span className="text-xs text-slate-300">Feature this project in showcase header</span>
                  </label>
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>

    </div>
  );
}
