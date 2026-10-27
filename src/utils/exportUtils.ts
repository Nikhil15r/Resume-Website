import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CVDocument } from '../types/cv';
import { generateLatexSource } from './latexGenerator';

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
