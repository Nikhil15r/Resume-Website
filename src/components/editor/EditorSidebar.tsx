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
  CheckCircle2
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

interface EditorSidebarProps {
  activeSection: EditorSection;
  onSelectSection: (section: EditorSection) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeSection,
  onSelectSection
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

  return (
    <aside className="w-full md:w-[240px] lg:w-[260px] bg-[#EFEEEA] border-r border-[#E5E3DF] p-3 sm:p-4 flex flex-col justify-between shrink-0 no-print">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#8C8172] mb-1 font-semibold px-2">
            Document Sections
          </div>
          <div className="text-xs text-[#807D7A] px-2 mb-3">
            Select a section to edit
          </div>
        </div>

        <nav className="space-y-1">
          {sections.map(sec => {
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
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
      <div className="pt-4 border-t border-[#E5E3DF] px-2">
        <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#8C8172] mb-1.5">
          <span>Dossier Quality</span>
          <span className="font-semibold text-[#0A0A0A]">
            {Math.round((sections.filter(s => s.complete).length / sections.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#E5E3DF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8C8172] transition-all duration-500 rounded-full"
            style={{
              width: `${(sections.filter(s => s.complete).length / sections.length) * 100}%`
            }}
          />
        </div>
      </div>
    </aside>
  );
};
