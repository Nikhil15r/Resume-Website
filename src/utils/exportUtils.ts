import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CVDocument, CoverLetterDocument } from '../types/cv';
import { generateLatexSource } from './latexGenerator';

/**
 * Directly renders and downloads the CV as a crisp, multi-page vector-quality PDF file
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
      console.warn('Document fonts ready error:', e);
    }
  }

  const isA4 = doc.settings.paperSize === 'a4';
  const pageWidth = isA4 ? 210 : 215.9; // mm
  const pageHeight = isA4 ? 297 : 279.4; // mm

  const pageElements = container.querySelectorAll<HTMLElement>('.cv-page-sheet');
  const sheetsToProcess: HTMLElement[] = pageElements.length > 0
    ? Array.from(pageElements)
    : [container];

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

      const canvas = await html2canvas(sheet, {
        scale: 2, // 2x high-resolution capture for crisp typography
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: sheetWidth,
        height: sheetHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // Remove parent transforms so capture is unwarped at 1:1 scale
          const clonedSheets = clonedDoc.querySelectorAll<HTMLElement>('.cv-page-sheet');
          const targetClonedSheet = clonedSheets[i] || clonedDoc.getElementById(elementId);
          if (targetClonedSheet) {
            let parent: HTMLElement | null = targetClonedSheet.parentElement;
            while (parent && parent !== clonedDoc.body) {
              parent.style.transform = 'none';
              parent = parent.parentElement;
            }
            // Strip any browser preview border or shadow on the exported PDF sheet
            targetClonedSheet.style.boxShadow = 'none';
            targetClonedSheet.style.border = 'none';
            targetClonedSheet.style.margin = '0';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    const filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating direct PDF, falling back to print dialog:', error);
    window.print();
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
  const sheetWidth = element.offsetWidth;
  const sheetHeight = element.offsetHeight;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      width: sheetWidth,
      height: sheetHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          let parent: HTMLElement | null = clonedEl.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.transform = 'none';
            parent = parent.parentElement;
          }
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.border = 'none';
          clonedEl.style.margin = '0';
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    let pageIndex = 1;
    while (heightLeft > 8) {
      pdf.addPage();
      position = -(pageIndex * pageHeight);
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageIndex++;
    }

    const filename = `${cl.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating cover letter PDF:', error);
    window.print();
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
