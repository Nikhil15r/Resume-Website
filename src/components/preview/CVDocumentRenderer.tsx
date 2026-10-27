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
  const { templateId, paperSize } = doc.settings;

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

  // Dimensions: A4 is 210mm × 297mm (~794px × 1123px at 96 DPI), US Letter is 8.5" × 11" (~816px × 1056px)
  const isA4 = paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9; // 8.5in = 215.9mm
  const heightMm = isA4 ? 297 : 279.4; // 11in = 279.4mm

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
        {/* Document Sheet */}
        <div
          id="cv-printable-document"
          className={`cv-document-sheet relative bg-white overflow-hidden text-left transition-shadow ${
            showPageBorders ? 'shadow-paper hover:shadow-paper-lg border border-[#E5E3DF]' : ''
          }`}
          style={{
            width: `${widthMm}mm`,
            minHeight: `${heightMm}mm`,
            boxSizing: 'border-box'
          }}
        >
          {/* Watermark / Subtle corner branding for non-print visual fidelity */}
          <div className="absolute top-2 right-3 text-[7pt] text-[#D1CECA] uppercase font-mono tracking-widest pointer-events-none select-none print:hidden">
            ATELIER • {doc.settings.templateId.toUpperCase()} • {paperSize.toUpperCase()}
          </div>

          {/* Template Content */}
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
