import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Undo2, 
  Redo2, 
  Download, 
  Printer, 
  FileCode, 
  FileText, 
  Eye, 
  Check, 
  ChevronDown, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Archive, 
  ArrowLeft, 
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Upload
} from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { TEMPLATES } from '../../data/templates';
import { TemplateId } from '../../types/cv';
import { 
  downloadPdfDirect, 
  exportToPdfPrint, 
  downloadLatexSource, 
  exportLatexProjectZip, 
  downloadJsonBackup 
} from '../../utils/exportUtils';
import { ResumeParserModal } from '../parser/ResumeParserModal';

interface EditorToolbarProps {
  zoom: number;
  setZoom: (z: number) => void;
  activeMode: 'visual' | 'latex' | 'preview';
  setActiveMode: (mode: 'visual' | 'latex' | 'preview') => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  previewCollapsed?: boolean;
  onTogglePreview?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  zoom,
  setZoom,
  activeMode,
  setActiveMode,
  sidebarCollapsed,
  onToggleSidebar,
  previewCollapsed,
  onTogglePreview
}) => {
  const { 
    currentDoc, 
    updateField, 
    saveStatus, 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    setTemplate 
  } = useCV();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [docTitle, setDocTitle] = useState(currentDoc.title);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isParserModalOpen, setIsParserModalOpen] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (docTitle.trim()) {
      updateField('title', docTitle.trim());
    } else {
      setDocTitle(currentDoc.title);
    }
  };

  const handleDirectDownload = async () => {
    setIsExportingPdf(true);
    try {
      await downloadPdfDirect(currentDoc);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const currentTemplateDef = TEMPLATES.find(t => t.id === currentDoc.settings.templateId) || TEMPLATES[0];

  return (
    <header className="h-16 bg-white border-b border-[#E5E3DF] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 no-print">
      {/* 1. Left Group: Back link, Title, Save status */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <Link
          to="/dashboard"
          className="p-1.5 hover:bg-[#EFEEEA] rounded-sm text-[#807D7A] hover:text-[#0A0A0A] transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Toggle Document Sections Sidebar */}
        {activeMode === 'visual' && onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`hidden md:flex p-1.5 rounded-sm transition-colors ${
              sidebarCollapsed
                ? 'text-[#8C8172] bg-[#EFEEEA] hover:bg-[#E5E3DF]'
                : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-[#EFEEEA]'
            }`}
            title={sidebarCollapsed ? "Expand Document Sections" : "Collapse Document Sections"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        {/* Editable Title */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={docTitle}
              onChange={e => setDocTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setDocTitle(currentDoc.title);
                  setIsEditingTitle(false);
                }
              }}
              className="font-serif text-sm sm:text-base font-semibold text-[#0A0A0A] bg-[#F5F5F3] px-2 py-0.5 rounded border border-[#8C8172] focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="font-serif text-sm sm:text-base font-semibold text-[#0A0A0A] hover:text-[#8C8172] text-left truncate max-w-[180px] sm:max-w-xs transition-colors"
              title="Click to rename document"
            >
              {currentDoc.title}
            </button>
          )}

          {/* Auto-save status */}
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-mono text-[#807D7A] pl-2 border-l border-[#E5E3DF]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saving'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-emerald-600'
              }`}
            />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Saved'}</span>
          </span>
        </div>
      </div>

      {/* 2. Center Group: Mode Switcher & Undo/Redo */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-1 border-r border-[#E5E3DF] pr-3">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded hover:bg-[#EFEEEA] text-[#807D7A] hover:text-[#0A0A0A] disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded hover:bg-[#EFEEEA] text-[#807D7A] hover:text-[#0A0A0A] disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* View / Editing Mode Switcher */}
        <div className="flex items-center bg-[#EFEEEA] p-0.5 rounded-sm border border-[#E5E3DF]">
          <button
            onClick={() => setActiveMode('visual')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-luxury flex items-center gap-1.5 ${
              activeMode === 'visual'
                ? 'bg-white text-[#0A0A0A] shadow-subtle font-semibold'
                : 'text-[#807D7A] hover:text-[#0A0A0A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual Editor</span>
          </button>

          <button
            onClick={() => setActiveMode('latex')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-luxury flex items-center gap-1.5 ${
              activeMode === 'latex'
                ? 'bg-[#0A0A0A] text-white shadow-subtle font-semibold'
                : 'text-[#807D7A] hover:text-[#0A0A0A]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#8C8172]" />
            <span className="hidden sm:inline">LaTeX Studio</span>
          </button>

          <button
            onClick={() => setActiveMode('preview')}
            className={`md:hidden px-3 py-1 text-xs font-medium rounded-sm transition-luxury flex items-center gap-1.5 ${
              activeMode === 'preview'
                ? 'bg-white text-[#0A0A0A] shadow-subtle'
                : 'text-[#807D7A]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Template Selector Dropdown */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
            className="px-3 py-1.5 bg-white border border-[#E5E3DF] hover:border-[#8C8172] rounded-sm text-xs font-medium text-[#0A0A0A] flex items-center gap-2 transition-colors"
          >
            <span className="text-[#807D7A] font-normal">Template:</span>
            <span>{currentTemplateDef.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#807D7A]" />
          </button>

          {templateDropdownOpen && (
            <div
              onClick={() => setTemplateDropdownOpen(false)}
              className="absolute left-0 top-full mt-1 w-64 bg-white border border-[#E5E3DF] rounded-sm shadow-floating py-1.5 z-40 text-xs"
            >
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#EFEEEA] transition-colors ${
                    currentDoc.settings.templateId === tpl.id
                      ? 'bg-[#EFEEEA]/60 font-semibold text-[#0A0A0A]'
                      : 'text-[#4A4845]'
                  }`}
                >
                  <div>
                    <div>{tpl.name}</div>
                    <div className="text-[10px] text-[#807D7A]">{tpl.category} • {tpl.atsScore}</div>
                  </div>
                  {currentDoc.settings.templateId === tpl.id && (
                    <Check className="w-3.5 h-3.5 text-[#8C8172]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Import & Parse CV Button */}
        <button
          type="button"
          onClick={() => setIsParserModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#4A4845] hover:text-[#0A0A0A] bg-white border border-[#E5E3DF] hover:bg-[#EFEEEA] rounded-sm transition-colors shadow-2xs"
          title="Import and parse an external PDF, Word docx, LaTeX, or raw text resume"
        >
          <Upload className="w-3.5 h-3.5 text-[#8C8172]" />
          <span>Import CV</span>
        </button>
      </div>

      {/* 3. Right Group: Zoom & Export Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Zoom Controls (Desktop only) */}
        <div className="hidden xl:flex items-center gap-1 border-r border-[#E5E3DF] pr-3 text-xs text-[#807D7A]">
          <button
            onClick={() => setZoom(Math.max(0.4, Number((zoom - 0.1).toFixed(2))))}
            className="p-1 hover:bg-[#EFEEEA] rounded text-[#807D7A] hover:text-[#0A0A0A]"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-12 text-center text-[#0A0A0A]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(1.5, Number((zoom + 0.1).toFixed(2))))}
            className="p-1 hover:bg-[#EFEEEA] rounded text-[#807D7A] hover:text-[#0A0A0A]"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-[#EFEEEA] rounded text-[#807D7A] hover:text-[#0A0A0A] ml-1"
            title="Reset to 100%"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        {/* Toggle Live Preview (Visual mode) */}
        {activeMode === 'visual' && onTogglePreview && (
          <button
            type="button"
            onClick={onTogglePreview}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs border transition-colors ${
              previewCollapsed
                ? 'text-[#4A4845] bg-[#F5F5F3] border-[#E5E3DF] hover:bg-[#EFEEEA]'
                : 'text-[#8C8172] bg-[#EFEEEA] border-[#D1CECA] font-medium'
            }`}
            title={previewCollapsed ? "Show Live Document Preview" : "Hide Live Preview (Focus Mode)"}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{previewCollapsed ? 'Show Preview' : 'Split View'}</span>
          </button>
        )}

        {/* Primary Export Button & Dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <button
              onClick={handleDirectDownload}
              disabled={isExportingPdf}
              className="px-3 sm:px-4 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-[0.12em] font-medium rounded-l-sm transition-colors flex items-center gap-2 shadow-subtle disabled:opacity-60"
              title="Download PDF directly"
            >
              {isExportingPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8C8172]" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-2 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white border-l border-white/20 rounded-r-sm transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Options Dropdown */}
          {exportDropdownOpen && (
            <div
              onClick={() => setExportDropdownOpen(false)}
              className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#E5E3DF] rounded-sm shadow-floating py-1.5 z-40 text-xs"
            >
              <button
                onClick={handleDirectDownload}
                className="w-full px-3 py-2 text-left hover:bg-[#EFEEEA] flex items-center gap-2 text-[#0A0A0A]"
              >
                <Download className="w-3.5 h-3.5 text-[#8C8172]" />
                <div>
                  <div className="font-medium">Direct PDF Download</div>
                  <div className="text-[10px] text-[#807D7A]">Saves .pdf file directly to disk</div>
                </div>
              </button>

              <button
                onClick={exportToPdfPrint}
                className="w-full px-3 py-2 text-left hover:bg-[#EFEEEA] flex items-center gap-2 text-[#0A0A0A]"
              >
                <Printer className="w-3.5 h-3.5 text-[#8C8172]" />
                <div>
                  <div className="font-medium">Print / Browser PDF Dialog</div>
                  <div className="text-[10px] text-[#807D7A]">Uses system print engine</div>
                </div>
              </button>

              <button
                onClick={() => downloadLatexSource(currentDoc)}
                className="w-full px-3 py-2 text-left hover:bg-[#EFEEEA] flex items-center gap-2 text-[#0A0A0A]"
              >
                <FileCode className="w-3.5 h-3.5 text-[#8C8172]" />
                <div>
                  <div className="font-medium">Download .tex Source</div>
                  <div className="text-[10px] text-[#807D7A]">TeX Live / MacTeX compatible</div>
                </div>
              </button>

              <button
                onClick={() => exportLatexProjectZip(currentDoc)}
                className="w-full px-3 py-2 text-left hover:bg-[#EFEEEA] flex items-center gap-2 text-[#0A0A0A]"
              >
                <Archive className="w-3.5 h-3.5 text-[#8C8172]" />
                <div>
                  <div className="font-medium">Export Overleaf ZIP</div>
                  <div className="text-[10px] text-[#807D7A]">Complete TeX bundle with readme</div>
                </div>
              </button>

              <div className="border-t border-[#E5E3DF] my-1"></div>

              <button
                onClick={() => downloadJsonBackup(currentDoc)}
                className="w-full px-3 py-2 text-left hover:bg-[#EFEEEA] flex items-center gap-2 text-[#0A0A0A]"
              >
                <Download className="w-3.5 h-3.5 text-[#8C8172]" />
                <div>
                  <div className="font-medium">Export JSON Backup</div>
                  <div className="text-[10px] text-[#807D7A]">Full structured data</div>
                </div>
              </button>

              <div className="border-t border-[#E5E3DF] my-1"></div>

              <button
                onClick={() => setIsParserModalOpen(true)}
                className="w-full px-3 py-2 text-left hover:bg-[#EFEEEA] flex items-center gap-2 text-[#0A0A0A]"
              >
                <Upload className="w-3.5 h-3.5 text-[#8C8172]" />
                <div>
                  <div className="font-medium">Import &amp; Parse CV</div>
                  <div className="text-[10px] text-[#807D7A]">PDF, Word, LaTeX or raw text</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resume Parser Modal */}
      <ResumeParserModal
        isOpen={isParserModalOpen}
        onClose={() => setIsParserModalOpen(false)}
        targetMode="current"
      />
    </header>
  );
};
