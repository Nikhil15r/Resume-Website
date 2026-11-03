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
  autoFitMobile?: boolean; // When true, automatically scales the A4 paper to fit viewport on small screens
}

export const CVDocumentRenderer: React.FC<CVDocumentRendererProps> = ({
  doc,
  zoom = 1,
  className = '',
  showPageBorders = true,
  autoFitMobile = true
}) => {
  const { templateId } = doc.settings;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = React.useState<number>(1);

  // Measure available container width and auto-scale on mobile/narrow screens
  React.useEffect(() => {
    if (!autoFitMobile) return;

    const updateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth;
      const isA4 = doc.settings.paperSize === 'a4';
      // 210mm in pixels at 96 DPI is ~794px, plus margins padding ~800px
      const naturalWidthPx = isA4 ? 794 : 816;

      // If container is narrower than document at natural zoom, scale down to fit comfortably
      if (availableWidth > 0 && availableWidth < naturalWidthPx * zoom) {
        const paddingBuffer = 24; // safety margins
        const targetScale = Math.min(zoom, Math.max(0.35, (availableWidth - paddingBuffer) / naturalWidthPx));
        setMobileScale(targetScale);
      } else {
        setMobileScale(zoom);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [autoFitMobile, zoom, doc.settings.paperSize]);

  const effectiveZoom = autoFitMobile ? mobileScale : zoom;

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
    <div ref={containerRef} className={`w-full flex flex-col items-center justify-start overflow-hidden ${className}`}>
      {/* Scalable Container */}
      <div
        style={{
          transform: `scale(${effectiveZoom})`,
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
