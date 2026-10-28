import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { GripVertical, PanelRightClose, Eye } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorSidebar, EditorSection } from '../components/editor/EditorSidebar';
import { PersonalInfoForm } from '../components/editor/forms/PersonalInfoForm';
import { SummaryForm } from '../components/editor/forms/SummaryForm';
import { ExperienceForm } from '../components/editor/forms/ExperienceForm';
import { EducationForm } from '../components/editor/forms/EducationForm';
import { SkillsForm } from '../components/editor/forms/SkillsForm';
import { ProjectsForm } from '../components/editor/forms/ProjectsForm';
import { CertificationsForm } from '../components/editor/forms/CertificationsForm';
import { StyleSettingsForm } from '../components/editor/forms/StyleSettingsForm';
import { LaTeXEditor } from '../components/editor/LaTeXEditor';
import { LaTeXSplitLayout } from '../components/editor/LaTeXSplitLayout';
import { CVDocumentRenderer } from '../components/preview/CVDocumentRenderer';

const STORAGE_KEY_SIDEBAR = 'atelier_sidebar_collapsed';
const STORAGE_KEY_PREVIEW_COLLAPSED = 'atelier_preview_collapsed';
const STORAGE_KEY_PREVIEW_WIDTH = 'atelier_preview_width';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents, currentDoc, setCurrentDocId, activeMode, setActiveMode } = useCV();

  const [activeSection, setActiveSection] = useState<EditorSection>('personal');
  const [zoom, setZoom] = useState<number>(0.85);

  // Manageable Studio: Collapsible Document Sections Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SIDEBAR) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Manageable Studio: Collapsible & Resizable Live Preview
  const [previewCollapsed, setPreviewCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PREVIEW_COLLAPSED) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [previewWidth, setPreviewWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREVIEW_WIDTH);
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 380 && val <= 780) return val;
      }
    } catch (e) {}
    return 540;
  });

  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Persist layout choices
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, sidebarCollapsed.toString());
    } catch (e) {}
  }, [sidebarCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREVIEW_COLLAPSED, previewCollapsed.toString());
    } catch (e) {}
  }, [previewCollapsed]);

  useEffect(() => {
    if (!isDraggingPreview) {
      try {
        localStorage.setItem(STORAGE_KEY_PREVIEW_WIDTH, previewWidth.toString());
      } catch (e) {}
    }
  }, [previewWidth, isDraggingPreview]);

  // Handle dragging preview divider
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const newWidth = rect.right - e.clientX;
    const clamped = Math.max(380, Math.min(780, newWidth));
    setPreviewWidth(clamped);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDraggingPreview(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isDraggingPreview) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPreview, handleMouseMove, handleMouseUp]);

  // Set active doc from route if provided
  useEffect(() => {
    if (id && id !== currentDoc.id) {
      const match = documents.find(d => d.id === id);
      if (match) {
        setCurrentDocId(match.id);
      }
    }
  }, [id, currentDoc.id, documents, setCurrentDocId]);

  // Render active visual section
  const renderVisualSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'summary':
        return <SummaryForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'certifications':
        return <CertificationsForm />;
      case 'style':
        return <StyleSettingsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F3] overflow-hidden selection:bg-[#8C8172] selection:text-white">
      {/* 1. Consistent Top Toolbar */}
      <EditorToolbar
        zoom={zoom}
        setZoom={setZoom}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        previewCollapsed={previewCollapsed}
        onTogglePreview={() => setPreviewCollapsed(prev => !prev)}
      />

      {/* 2. Workspace Body: 3-Part Manageable Architecture */}
      <div 
        ref={workspaceRef}
        className="flex-1 flex overflow-hidden relative"
      >
        {/* Fullscreen drag overlay during divider dragging */}
        {isDraggingPreview && (
          <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
        )}

        {/* Mobile View Handling */}
        {activeMode === 'preview' ? (
          /* Mobile Preview Only */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EFEEEA] flex justify-center items-start">
            <CVDocumentRenderer doc={currentDoc} zoom={zoom} />
          </div>
        ) : activeMode === 'latex' ? (
          /* LaTeX Studio Mode: Resizable Split View */
          <LaTeXSplitLayout
            theme="light"
            editor={<LaTeXEditor />}
            preview={
              <div className="w-full flex flex-col items-center p-6">
                <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DF] text-xs text-[#807D7A]">
                  <span className="font-mono text-[10px] uppercase text-[#8C8172] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Rendered Typeset
                  </span>
                  <span>{currentDoc.settings.paperSize.toUpperCase()}</span>
                </div>
                <div className="w-full flex justify-center py-2">
                  <CVDocumentRenderer doc={currentDoc} zoom={0.75} />
                </div>
              </div>
            }
          />
        ) : (
          /* Visual Editor Mode: 3-Panel Manageable Layout */
          <>
            {/* Panel 1: Left Navigation Sidebar (Collapsible: 260px <-> 64px) */}
            <div className="hidden md:block h-full shrink-0">
              <EditorSidebar
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
              />
            </div>

            {/* Panel 2: Center Active Editing Interface (Flexible width) */}
            <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 border-r border-[#E5E3DF] bg-[#F5F5F3]">
              <div className="max-w-3xl mx-auto">
                {/* Mobile Section Selector Pills */}
                <div className="flex md:hidden overflow-x-auto gap-1 pb-4 mb-4 border-b border-[#E5E3DF] text-xs">
                  {(['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'style'] as EditorSection[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveSection(s)}
                      className={`px-3 py-1.5 rounded-sm whitespace-nowrap capitalize transition-colors ${
                        activeSection === s
                          ? 'bg-[#0A0A0A] text-white font-medium'
                          : 'bg-white text-[#4A4845] border border-[#E5E3DF]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {renderVisualSection()}
              </div>
            </main>

            {/* Draggable Divider between Form and Live Preview */}
            {!previewCollapsed && (
              <div
                onMouseDown={() => setIsDraggingPreview(true)}
                onDoubleClick={() => setPreviewWidth(540)}
                title="Drag to resize Live Preview (Double-click for default width)"
                className={`hidden lg:flex w-3 shrink-0 items-center justify-center cursor-col-resize relative select-none z-20 group transition-colors ${
                  isDraggingPreview ? 'bg-[#8C8172]/25' : 'hover:bg-[#8C8172]/15'
                }`}
              >
                <div className="w-[1px] h-full bg-[#E5E3DF] group-hover:bg-[#8C8172] transition-colors" />
                <div className="absolute top-1/2 -translate-y-1/2 w-3.5 py-2 flex flex-col items-center justify-center bg-white border border-[#D1CECA] rounded-sm group-hover:border-[#8C8172] shadow-sm">
                  <GripVertical className="w-3 h-3 text-[#807D7A] group-hover:text-[#8C8172]" />
                </div>
              </div>
            )}

            {/* Panel 3: Right Panel Realistic Document Preview (Resizable / Collapsible) */}
            {!previewCollapsed ? (
              <aside 
                style={{ width: `${previewWidth}px` }}
                className="hidden lg:flex shrink-0 bg-[#EFEEEA] p-6 xl:p-8 overflow-y-auto flex-col items-center transition-[width] duration-75 ease-out relative"
              >
                <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DF] text-xs text-[#807D7A]">
                  <span className="font-mono text-[10px] uppercase text-[#8C8172] tracking-wider font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Live Vector Surface
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase bg-white/70 px-1.5 py-0.5 rounded border border-[#E5E3DF]">
                      {currentDoc.settings.templateId.replace('-', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewCollapsed(true)}
                      className="p-1 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white rounded transition-colors"
                      title="Hide Live Preview (Focus on Form)"
                    >
                      <PanelRightClose className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="w-full flex justify-center py-2">
                  <CVDocumentRenderer doc={currentDoc} zoom={zoom} />
                </div>
              </aside>
            ) : (
              <button
                type="button"
                onClick={() => setPreviewCollapsed(false)}
                className="hidden lg:flex fixed right-4 bottom-6 z-40 px-3.5 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs font-mono uppercase tracking-wider rounded shadow-2xl items-center gap-2 transition-all animate-in fade-in slide-in-from-right-2"
                title="Restore Live Document Preview"
              >
                <Eye className="w-3.5 h-3.5 text-[#8C8172]" />
                <span>Show Preview</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
