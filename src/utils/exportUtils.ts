import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { CVDocument, CoverLetterDocument } from '../types/cv';
import { generateLatexSource } from './latexGenerator';

/**
 * Directly renders and downloads the CV as a crisp, multi-page vector-quality PDF file.
 * Accurately replicates preview typography, line alignments, and exact dimensions.
 */
export async function downloadPdfDirect(
  doc: CVDocument,
  elementId = 'cv-printable-document'
): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    // Fallback if DOM element is not rendered
    window.print();
    return;
  }

  // Ensure all web fonts are fully loaded and rendered before capturing
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Document fonts ready check:', e);
    }
  }

  const isA4 = doc.settings.paperSize === 'a4';
  const pageWidth = isA4 ? 210 : 215.9; // mm
  const pageHeight = isA4 ? 297 : 279.4; // mm

  const pageElements = container.querySelectorAll<HTMLElement>('.cv-page-sheet');
  const sheetsToProcess: HTMLElement[] = pageElements.length > 0
    ? Array.from(pageElements)
    : [container];

  // Find any parent transform wrapper (such as zoom scale in the editor preview)
  let transformWrapper: HTMLElement | null = null;
  let originalTransform = '';
  let currentEl: HTMLElement | null = container;
  while (currentEl && currentEl !== document.body) {
    if (currentEl.style.transform && currentEl.style.transform !== 'none') {
      transformWrapper = currentEl;
      originalTransform = currentEl.style.transform;
      break;
    }
    currentEl = currentEl.parentElement;
  }

  // Temporarily reset transform so sheets render and measure at natural 100% 1:1 scale
  if (transformWrapper) {
    transformWrapper.style.transform = 'none';
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isA4 ? 'a4' : 'letter',
      compress: true
    });

    for (let i = 0; i < sheetsToProcess.length; i++) {
      const sheet = sheetsToProcess[i];
      if (i > 0) {
        pdf.addPage();
      }

      const sheetWidth = sheet.offsetWidth;
      const sheetHeight = sheet.offsetHeight;

      // Temporarily strip screen-only paper styling (border and shadow) for clean document output
      const origBorder = sheet.style.border;
      const origShadow = sheet.style.boxShadow;
      sheet.style.border = 'none';
      sheet.style.boxShadow = 'none';

      let imgData = '';
      try {
        // Preferred: html-to-image captures DOM via browser native SVG foreignObject rasterization
        imgData = await toPng(sheet, {
          pixelRatio: 2.5,
          backgroundColor: '#FFFFFF',
          cacheBust: true,
          width: sheetWidth,
          height: sheetHeight
        });
      } catch (toPngErr) {
        console.warn('html-to-image fallback to html2canvas:', toPngErr);
        // Fallback: html2canvas with lossless PNG
        const canvas = await html2canvas(sheet, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          logging: false,
          width: sheetWidth,
          height: sheetHeight,
          scrollX: 0,
          scrollY: 0
        });
        imgData = canvas.toDataURL('image/png');
      } finally {
        sheet.style.border = origBorder;
        sheet.style.boxShadow = origShadow;
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    const filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating direct PDF, falling back to print dialog:', error);
    window.print();
  } finally {
    if (transformWrapper) {
      transformWrapper.style.transform = originalTransform;
    }
  }
}

/**
 * Directly renders and downloads the Cover Letter as a PDF file
 */
export async function downloadCoverLetterPdfDirect(
  cl: CoverLetterDocument,
  elementId = 'cv-printable-document'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Fonts ready check:', e);
    }
  }

  const pageWidth = 210; // mm A4
  const pageHeight = 297; // mm A4

  let transformWrapper: HTMLElement | null = null;
  let originalTransform = '';
  let currentEl: HTMLElement | null = element;
  while (currentEl && currentEl !== document.body) {
    if (currentEl.style.transform && currentEl.style.transform !== 'none') {
      transformWrapper = currentEl;
      originalTransform = currentEl.style.transform;
      break;
    }
    currentEl = currentEl.parentElement;
  }

  if (transformWrapper) {
    transformWrapper.style.transform = 'none';
  }

  const origBorder = element.style.border;
  const origShadow = element.style.boxShadow;
  element.style.border = 'none';
  element.style.boxShadow = 'none';

  try {
    const sheetWidth = element.offsetWidth;
    const sheetHeight = element.offsetHeight;
    let imgData = '';

    try {
      imgData = await toPng(element, {
        pixelRatio: 2.5,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
        width: sheetWidth,
        height: sheetHeight
      });
    } catch (toPngErr) {
      console.warn('Cover letter toPng fallback to html2canvas:', toPngErr);
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: sheetWidth,
        height: sheetHeight,
        scrollX: 0,
        scrollY: 0
      });
      imgData = canvas.toDataURL('image/png');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

    const filename = `${cl.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating cover letter PDF:', error);
    window.print();
  } finally {
    element.style.border = origBorder;
    element.style.boxShadow = origShadow;
    if (transformWrapper) {
      transformWrapper.style.transform = originalTransform;
    }
  }
}

/**
 * Triggers standard browser print dialog styled for 1:1 vector PDF printing
 */
export function exportToPdfPrint(): void {
  window.print();
}

/**
 * Downloads the document's generated or custom LaTeX source file (.tex)
 */
export function downloadLatexSource(doc: CVDocument): void {
  const source = doc.isCustomLatex && doc.latexSource ? doc.latexSource : generateLatexSource(doc);
  const blob = new Blob([source], { type: 'text/x-tex;charset=utf-8' });
  const filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.tex`;
  saveAs(blob, filename);
}

/**
 * Downloads the full structured JSON backup of the CV
 */
export function downloadJsonBackup(doc: CVDocument): void {
  const jsonStr = JSON.stringify(doc, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_backup.json`;
  saveAs(blob, filename);
}

/**
 * Packages full LaTeX project into a zip file ready for Overleaf, TeX Live, or distribution
 */
export async function exportLatexProjectZip(doc: CVDocument): Promise<void> {
  const zip = new JSZip();
  const source = doc.isCustomLatex && doc.latexSource ? doc.latexSource : generateLatexSource(doc);

  // Main tex document
  zip.file('main.tex', source);

  // Readme instructions
  const readmeContent = `# ${doc.title}
ATELIER CV — Executive LaTeX Project
Template: ${doc.settings.templateId}
Generated: ${new Date().toISOString()}

## Compilation Instructions
You can compile this document directly using pdflatex or xelatex:

\`\`\`bash
pdflatex main.tex
\`\`\`

Or upload this entire zip archive to Overleaf (New Project -> Upload Project).

## Required LaTeX Packages
- geometry
- charter
- microtype
- enumitem
- xcolor
- hyperref
- titlesec

All packages are standard in TeX Live and MacTeX distributions.
`;
  zip.file('README.md', readmeContent);

  // Metadata
  zip.file('metadata.json', JSON.stringify({
    title: doc.title,
    author: doc.personalInfo.fullName,
    template: doc.settings.templateId,
    exportedAt: new Date().toISOString()
  }, null, 2));

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_latex_project.zip`;
  saveAs(zipBlob, filename);
}
