import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import JSZip from 'jszip';

// Configure pdfjs worker using local bundled Vite URL
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Extracts plain text from an uploaded PDF file
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false
    });
    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageStr = '';

      for (const item of textContent.items) {
        if ('str' in item && typeof item.str === 'string') {
          const str = item.str;
          // Check for line break based on vertical position
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
            pageStr += '\n';
          } else if (pageStr.length > 0 && !pageStr.endsWith('\n') && !pageStr.endsWith(' ') && str.trim()) {
            pageStr += ' ';
          }
          pageStr += str;
          lastY = item.transform[5];
        }
      }
      if (pageStr.trim()) {
        pageTexts.push(pageStr.trim());
      }
    }

    return pageTexts.join('\n\n');
  } catch (error) {
    console.error('Error parsing PDF document:', error);
    throw new Error('Could not parse PDF. The file may be password-protected or contain scanned images without text.');
  }
}

/**
 * Extracts text from a Microsoft Word .docx file using JSZip to parse word/document.xml
 */
export async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXmlFile = zip.file('word/document.xml');
    
    if (!docXmlFile) {
      throw new Error('Invalid .docx file: word/document.xml not found.');
    }

    const xmlText = await docXmlFile.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const paragraphs = xmlDoc.getElementsByTagName('w:p');

    const lines: string[] = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const textNodes = p.getElementsByTagName('w:t');
      let pText = '';
      for (let j = 0; j < textNodes.length; j++) {
        pText += textNodes[j].textContent || '';
      }
      if (pText.trim()) {
        lines.push(pText.trim());
      }
    }

    return lines.join('\n');
  } catch (error) {
    console.error('Error parsing DOCX document:', error);
    throw new Error('Could not parse Word document. Please ensure it is a valid .docx file.');
  }
}

/**
 * Universal file reader that extracts text from any uploaded CV format:
 * PDF, Word (.docx), Plain Text (.txt), Markdown (.md), LaTeX (.tex), JSON (.json)
 */
export async function extractTextFromFile(file: File): Promise<{ text: string; format: string }> {
  const fileName = file.name.toLowerCase();
  
  // 1. PDF Documents
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    const buffer = await file.arrayBuffer();
    const text = await extractTextFromPdf(buffer);
    return { text, format: 'pdf' };
  }

  // 2. Word Documents (.docx)
  if (fileName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
    const buffer = await file.arrayBuffer();
    const text = await extractTextFromDocx(buffer);
    return { text, format: 'docx' };
  }

  // 3. JSON Resume or Atelier Export (.json)
  if (fileName.endsWith('.json') || file.type === 'application/json') {
    const text = await file.text();
    return { text, format: 'json' };
  }

  // 4. LaTeX Document (.tex)
  if (fileName.endsWith('.tex')) {
    const text = await file.text();
    return { text, format: 'latex' };
  }

  // 5. Plain Text or Markdown (.txt, .md, etc.)
  const text = await file.text();
  return { text, format: 'text' };
}
