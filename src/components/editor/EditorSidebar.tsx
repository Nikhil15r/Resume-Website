import React from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Layers, 
  Award, 
  Sliders,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCV } from '../../context/CVContext';

export type EditorSection = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'style';

export interface EditorSidebarProps {
  activeSection: EditorSection;
  onSelectSection: (section: EditorSection) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { currentDoc } = useCV();

  const sections: { id: EditorSection; label: string; icon: React.ReactNode; count?: number; complete: boolean }[] = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: <User className="w-4 h-4" />,
      complete: Boolean(currentDoc.personalInfo.fullName && currentDoc.personalInfo.email)
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: <FileText className="w-4 h-4" />,
      complete: Boolean(currentDoc.summary.length > 30)
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: <Briefcase className="w-4 h-4" />,
      count: currentDoc.experience.length,
      complete: currentDoc.experience.length > 0
    },
    {
      id: 'education',
      label: 'Education',
      icon: <GraduationCap className="w-4 h-4" />,
      count: currentDoc.education.length,
      complete: currentDoc.education.length > 0
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Sparkles className="w-4 h-4" />,
      count: currentDoc.skills.reduce((acc, s) => acc + s.items.length, 0),
      complete: currentDoc.skills.length > 0
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Layers className="w-4 h-4" />,
      count: currentDoc.projects.length,
      complete: currentDoc.projects.length > 0
    },
    {
      id: 'certifications',
      label: 'Credentials',
      icon: <Award className="w-4 h-4" />,
      count: currentDoc.certifications.length + currentDoc.publications.length,
      complete: currentDoc.certifications.length > 0 || currentDoc.publications.length > 0
    },
    {
      id: 'style',
      label: 'Styling & Page',
      icon: <Sliders className="w-4 h-4" />,
      complete: true
    }
  ];

  const qualityScore = Math.round((sections.filter(s => s.complete).length / sections.length) * 100);

  return (
    <aside 
      className={`h-full bg-[#EFEEEA] border-r border-[#E5E3DF] flex flex-col justify-between shrink-0 no-print transition-all duration-200 ease-in-out relative ${
        isCollapsed 
          ? 'w-[64px] p-2' 
          : 'w-[240px] lg:w-[260px] p-3 sm:p-4'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header */}
        {isCollapsed ? (
          <div className="flex flex-col items-center pb-2 mb-1 border-b border-[#E5E3DF]">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white rounded transition-colors group relative"
              title="Expand Document Sections"
            >
              <PanelLeftOpen className="w-4 h-4 text-[#8C8172]" />
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#0A0A0A] text-white text-[11px] font-sans font-medium rounded shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Expand Sections
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 mb-2">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#8C8172] font-semibold">
                Document Sections
              </div>
              <div className="text-xs text-[#807D7A]">
                Select a section to edit
              </div>
            </div>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white rounded transition-colors"
                title="Collapse Document Sections"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Navigation list */}
        <nav className="space-y-1">
          {sections.map(sec => {
            const isActive = activeSection === sec.id;

            if (isCollapsed) {
              return (
                <div key={sec.id} className="relative group flex justify-center">
                  <button
                    type="button"
                    onClick={() => onSelectSection(sec.id)}
                    className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all relative ${
                      isActive
                        ? 'bg-white text-[#8C8172] shadow-subtle border border-[#E5E3DF]'
                        : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60'
                    }`}
                  >
                    {sec.icon}

                    {/* Completion dot indicator */}
                    {sec.complete ? (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600 border border-white" />
                    ) : sec.count !== undefined && sec.count > 0 ? (
                      <span className="absolute -top-1 -right-1 text-[9px] font-mono bg-[#8C8172] text-white px-1 rounded-full leading-tight">
                        {sec.count}
                      </span>
                    ) : null}
                  </button>

                  {/* Floating Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#0A0A0A] text-white text-xs font-sans rounded shadow-2xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <span className="font-medium">{sec.label}</span>
                    {sec.count !== undefined && (
                      <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white/90">
                        {sec.count}
                      </span>
                    )}
                    {sec.complete && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium transition-luxury text-left ${
                  isActive
                    ? 'bg-white text-[#0A0A0A] shadow-subtle border border-[#E5E3DF] font-semibold'
                    : 'text-[#4A4845] hover:text-[#0A0A0A] hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#8C8172]' : 'text-[#807D7A]'}>
                    {sec.icon}
                  </span>
                  <span>{sec.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {sec.count !== undefined && sec.count > 0 && (
                    <span className="text-[10px] bg-[#E5E3DF] px-1.5 py-0.2 rounded-full text-[#4A4845] font-mono">
                      {sec.count}
                    </span>
                  )}
                  {sec.complete ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D1CECA]"></span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Completion Progress Indicator */}
      {isCollapsed ? (
        <div className="py-2 border-t border-[#E5E3DF] flex flex-col items-center group relative">
          <div className="w-8 h-8 rounded-full border-2 border-[#E5E3DF] flex items-center justify-center text-[10px] font-mono font-semibold text-[#8C8172]">
            {qualityScore}%
          </div>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 bottom-2 px-2.5 py-1.5 bg-[#0A0A0A] text-white text-xs font-sans rounded shadow-2xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Dossier Quality: {qualityScore}%
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-[#E5E3DF] px-2">
          <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#8C8172] mb-1.5">
            <span>Dossier Quality</span>
            <span className="font-semibold text-[#0A0A0A]">
              {qualityScore}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E5E3DF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8C8172] transition-all duration-500 rounded-full"
              style={{
                width: `${qualityScore}%`
              }}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
