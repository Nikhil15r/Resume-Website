import React from 'react';
import { CVDocument } from '../../types/cv';
import { CorporateClassicTemplate } from './templates/CorporateClassicTemplate';
import { ModernProfessionalTemplate } from './templates/ModernProfessionalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TechnicalResumeTemplate } from './templates/TechnicalResumeTemplate';
import { ConsultingTemplate } from './templates/ConsultingTemplate';
import { AcademicCVTemplate } from './templates/AcademicCVTemplate';

interface CVDocumentRendererProps {
  doc: CVDocument;
  zoom?: number; // scale: 0.5 to 1.5 (default 1)
  className?: string;
  showPageBorders?: boolean;
}

export const CVDocumentRenderer: React.FC<CVDocumentRendererProps> = ({
  doc,
  zoom = 1,
  className = '',
  showPageBorders = true
}) => {
  const { templateId } = doc.settings;

  // Determine template component
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern-professional':
        return <ModernProfessionalTemplate doc={doc} />;
      case 'executive':
        return <ExecutiveTemplate doc={doc} />;
      case 'technical-resume':
        return <TechnicalResumeTemplate doc={doc} />;
      case 'consulting':
        return <ConsultingTemplate doc={doc} />;
      case 'academic-cv':
        return <AcademicCVTemplate doc={doc} />;
      case 'corporate-classic':
      default:
        return <CorporateClassicTemplate doc={doc} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-start ${className}`}>
      {/* Scalable Container */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="print:transform-none"
      >
        {/* Printable Document Root (contains NO watermarks or website names) */}
        <div id="cv-printable-document" className="flex flex-col items-center">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
