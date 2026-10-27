import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents, currentDoc, setCurrentDocId, activeMode, setActiveMode } = useCV();

  const [activeSection, setActiveSection] = useState<EditorSection>('personal');
  const [zoom, setZoom] = useState<number>(0.85);

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
      />

      {/* 2. Workspace Body: 3-Part Architecture */}
      <div className="flex-1 flex overflow-hidden relative">
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
          /* Visual Editor Mode: 3-Panel Layout */
          <>
            {/* Panel 1: Left Navigation Sidebar (240-260px) */}
            <div className="hidden md:block">
              <EditorSidebar
                activeSection={activeSection}
                onSelectSection={setActiveSection}
              />
            </div>

            {/* Panel 2: Center Active Editing Interface (Flexible width) */}
            <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 max-w-3xl border-r border-[#E5E3DF] bg-[#F5F5F3]">
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
            </main>

            {/* Panel 3: Right Panel Realistic Document Preview (480-600px) */}
            <aside className="hidden lg:flex flex-1 min-w-[480px] max-w-[620px] bg-[#EFEEEA] p-6 xl:p-8 overflow-y-auto flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DF] text-xs text-[#807D7A]">
                <span className="font-mono text-[10px] uppercase text-[#8C8172] tracking-wider font-semibold">
                  Live Vector Surface
                </span>
                <span className="font-mono text-[10px] uppercase">
                  {currentDoc.settings.templateId.replace('-', ' ')}
                </span>
              </div>

              <div className="w-full flex justify-center py-2">
                <CVDocumentRenderer doc={currentDoc} zoom={zoom} />
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};
