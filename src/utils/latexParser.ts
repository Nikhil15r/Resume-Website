import { CVDocument, WorkExperience, Education, SkillCategory, Project, Certification, Publication } from '../types/cv';

/**
 * Unescapes special LaTeX symbols back into plain text
 */
export function unescapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\textbackslash\{\}/g, '\\')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\\textasciitilde\{\}/g, '~')
    .replace(/\\textasciicircum\{\}/g, '^')
    .replace(/\$\\cdot\$/g, '•')
    .replace(/\\cdot/g, '•')
    .replace(/\\textbullet\\;/g, '•')
    .replace(/\\textbullet/g, '•')
    .replace(/\\\\/g, '\n')
    .replace(/\\vspace\{[^}]*\}/g, '')
    .trim();
}

/**
 * Strips formatting macros while preserving inner text
 */
function stripMacros(text: string): string {
  if (!text) return '';
  let cleaned = text;
  // Remove font size & color commands
  cleaned = cleaned.replace(/\\fontsize\{[^}]*\}\{[^}]*\}\s*\\selectfont/g, '');
  cleaned = cleaned.replace(/\\color\{[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\normalfont/g, '');
  cleaned = cleaned.replace(/\\scshape/g, '');
  cleaned = cleaned.replace(/\\textbf\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\textit\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\emph\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\underline\{([^}]*)\}/g, '$1');
  cleaned = cleaned.replace(/\\small/g, '');
  cleaned = cleaned.replace(/\\footnotesize/g, '');
  cleaned = cleaned.replace(/\\large/g, '');
  cleaned = cleaned.replace(/\\Large/g, '');
  cleaned = cleaned.replace(/\\noindent/g, '');
  cleaned = cleaned.replace(/\\par/g, '\n');
  return unescapeLatex(cleaned);
}

/**
 * Splits LaTeX content into sections based on \section{...}
 */
function extractSections(latex: string): Map<string, string> {
  const sections = new Map<string, string>();
  const sectionRegex = /\\section\*?\{([^}]+)\}([\s\S]*?)(?=(?:\\section\*?\{|\\end\{document\}|$))/gi;
  let match;
  while ((match = sectionRegex.exec(latex)) !== null) {
    const title = match[1].trim().toLowerCase();
    const content = match[2].trim();
    sections.set(title, content);
  }
  return sections;
}

/**
 * Parses LaTeX source code and maps updates back into the CVDocument structure.
 * Robust and fault-tolerant: preserves existing data if a section is not found or fails to parse.
 */
export function parseLatexSource(latex: string, baseDoc: CVDocument): CVDocument {
  if (!latex || typeof latex !== 'string') return baseDoc;

  const updated: CVDocument = JSON.parse(JSON.stringify(baseDoc));
  updated.lastModified = new Date().toISOString();
  updated.latexSource = latex;
  updated.isCustomLatex = true;

  // 1. Parse Header / Personal Info
  try {
    const centerMatch = latex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/i);
    const headerBlock = centerMatch ? centerMatch[1] : latex.slice(0, 1500);

    // Full name
    const nameMatch = headerBlock.match(/\\textbf\{([^}]+)\}/);
    if (nameMatch) {
      updated.personalInfo.fullName = stripMacros(nameMatch[1]).trim();
    }

    // Title
    const titleMatch = headerBlock.match(/\\textit\{([^}]+)\}/);
    if (titleMatch) {
      updated.personalInfo.title = stripMacros(titleMatch[1]).trim();
    }

    // Email
    const emailMatch = headerBlock.match(/\\href\{mailto:([^}]+)\}/i) || headerBlock.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      updated.personalInfo.email = emailMatch[1].trim();
    }

    // Phone
    const phoneMatch = headerBlock.match(/(\+?\d[\d\s().-]{7,}\d)/);
    if (phoneMatch) {
      updated.personalInfo.phone = phoneMatch[1].trim();
    }

    // LinkedIn
    const linkedinMatch = headerBlock.match(/\\href\{https?:\/\/(?:www\.)?(linkedin\.com\/in\/[^}]+)\}/i) || headerBlock.match(/(linkedin\.com\/in\/[^\s\\}]+)/i);
    if (linkedinMatch) {
      updated.personalInfo.linkedin = linkedinMatch[1].trim();
    }

    // Website
    const websiteMatch = headerBlock.match(/\\href\{https?:\/\/([^}]+)\}\{([^}]+)\}/i);
    if (websiteMatch && !websiteMatch[1].includes('linkedin') && !websiteMatch[1].includes('mailto')) {
      updated.personalInfo.website = websiteMatch[2].trim() || websiteMatch[1].trim();
    }

    // Location: usually before email or bullet
    const locationLine = headerBlock.match(/\{\\small[\s\S]*?([A-Za-z\s,]+?)(?:\s*(?:\\;\$\s*\\cdot\s*\$|\\cdot|•|\\href))/);
    if (locationLine && locationLine[1].trim().length > 3) {
      updated.personalInfo.location = stripMacros(locationLine[1]).trim();
    }
  } catch (err) {
    console.warn('Error parsing header from LaTeX:', err);
  }

  // 2. Extract Sections
  const sections = extractSections(latex);

  // 3. Parse Executive Summary
  for (const [title, content] of sections.entries()) {
    if (title.includes('summary')) {
      const cleaned = stripMacros(content)
        .replace(/\{|\}/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned) {
        updated.summary = cleaned;
      }
      break;
    }
  }

  // 4. Parse Professional Experience
  for (const [title, content] of sections.entries()) {
    if (title.includes('experience') || title.includes('employment') || title.includes('work history')) {
      try {
        const rawBlocks = content.split(/\\noindent/i).map(b => b.trim()).filter(Boolean);
        const parsedExps: WorkExperience[] = [];

        rawBlocks.forEach((block, idx) => {
          // Role: \textbf{Role}
          const roleMatch = block.match(/\\textbf\{([^}]+)\}/);
          if (!roleMatch) return;
          const role = stripMacros(roleMatch[1]).trim();

          // Date range: \hfill {\footnotesize\color{...}2022 -- Present}
          const dateMatch = block.match(/\\hfill\s*\{[^}]*?(\d{4}[^}\\]*)\}/);
          let startDate = '';
          let endDate = 'Present';
          let current = true;
          if (dateMatch) {
            const rawDates = dateMatch[1].replace(/--|–/g, '-');
            const parts = rawDates.split('-').map(s => s.trim());
            startDate = parts[0] || '';
            endDate = parts[1] || 'Present';
            current = endDate.toLowerCase().includes('present');
          }

          // Company: \textit{Company}
          const companyMatch = block.match(/\\textit\{([^}]+)\}/);
          const company = companyMatch ? stripMacros(companyMatch[1]).trim() : '';

          // Location: second \hfill or after company
          const locMatch = block.match(/\\textit\{[^}]*\}\s*(?:\\hfill\s*\{[^}]*?([A-Za-z\s,]+)\})?/);
          const location = locMatch && locMatch[1] ? stripMacros(locMatch[1]).trim() : (baseDoc.experience[idx]?.location || '');

          // Achievements in \begin{itemize}
          const achievements: string[] = [];
          const itemizeMatch = block.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/i);
          if (itemizeMatch) {
            const items = itemizeMatch[1].split(/\\item\s+/i).map(it => stripMacros(it).replace(/\n/g, ' ').trim()).filter(Boolean);
            achievements.push(...items);
          }

          // Optional Description
          let description = '';
          const descMatch = block.match(/\\textit\{[^}]*\}[\s\S]*?\\vspace\{[^}]*\}([\s\S]*?)\\begin\{itemize\}/i);
          if (descMatch) {
            description = stripMacros(descMatch[1]).trim();
          }

          parsedExps.push({
            id: baseDoc.experience[idx]?.id || `exp-${idx + 1}`,
            role,
            company,
            location,
            startDate: startDate || baseDoc.experience[idx]?.startDate || '2020',
            endDate: endDate || baseDoc.experience[idx]?.endDate || 'Present',
            current,
            description: description || baseDoc.experience[idx]?.description || '',
            achievements: achievements.length > 0 ? achievements : (baseDoc.experience[idx]?.achievements || [])
          });
        });

        if (parsedExps.length > 0) {
          updated.experience = parsedExps;
        }
      } catch (err) {
        console.warn('Error parsing experience from LaTeX:', err);
      }
      break;
    }
  }

  // 5. Parse Education
  for (const [title, content] of sections.entries()) {
    if (title.includes('education') || title.includes('academic')) {
      try {
        const rawBlocks = content.split(/\\noindent/i).map(b => b.trim()).filter(Boolean);
        const parsedEdus: Education[] = [];

        rawBlocks.forEach((block, idx) => {
          // School: \textbf{School}
          const schoolMatch = block.match(/\\textbf\{([^}]+)\}/);
          if (!schoolMatch) return;
          const school = stripMacros(schoolMatch[1]).trim();

          // Dates: \hfill {\footnotesize\color{...}2012 -- 2014}
          const dateMatch = block.match(/\\hfill\s*\{[^}]*?(\d{4}[^}\\]*)\}/);
          let startDate = '';
          let endDate = '';
          if (dateMatch) {
            const rawDates = dateMatch[1].replace(/--|–/g, '-');
            const parts = rawDates.split('-').map(s => s.trim());
            startDate = parts[0] || '';
            endDate = parts[1] || '';
          }

          // Degree & Field: \textit{Degree, Field}
          const degMatch = block.match(/\\textit\{([^}]+)\}/);
          let degree = '';
          let field = '';
          if (degMatch) {
            const degFull = stripMacros(degMatch[1]).trim();
            const commaIdx = degFull.lastIndexOf(',');
            if (commaIdx !== -1) {
              degree = degFull.slice(0, commaIdx).trim();
              field = degFull.slice(commaIdx + 1).trim();
            } else {
              degree = degFull;
            }
          }

          // Location: second \hfill or after degree
          const locMatch = block.match(/\\textit\{[^}]*\}\s*\\hfill\s*\{[^}]*?([A-Za-z\s,]+)\}/);
          const location = locMatch ? stripMacros(locMatch[1]).trim() : (baseDoc.education[idx]?.location || '');

          // Honors: \textbullet\; Honors
          const honorsMatch = block.match(/(?:\\textbullet\\;|•)\s*([^}\n]+)/);
          const honors = honorsMatch ? stripMacros(honorsMatch[1]).replace(/\}|\{/g, '').trim() : '';

          parsedEdus.push({
            id: baseDoc.education[idx]?.id || `edu-${idx + 1}`,
            school,
            degree: degree || baseDoc.education[idx]?.degree || 'Bachelor of Science',
            field: field || baseDoc.education[idx]?.field || '',
            location,
            startDate: startDate || baseDoc.education[idx]?.startDate || '2016',
            endDate: endDate || baseDoc.education[idx]?.endDate || '2020',
            gpa: baseDoc.education[idx]?.gpa || '',
            honors: honors || baseDoc.education[idx]?.honors || ''
          });
        });

        if (parsedEdus.length > 0) {
          updated.education = parsedEdus;
        }
      } catch (err) {
        console.warn('Error parsing education from LaTeX:', err);
      }
      break;
    }
  }

  // 6. Parse Areas of Expertise / Skills
  for (const [title, content] of sections.entries()) {
    if (title.includes('expertise') || title.includes('skill') || title.includes('competenc')) {
      try {
        const itemizeMatch = content.match(/\\begin\{itemize\}[^]*?([\s\S]*?)\\end\{itemize\}/i);
        const itemsBlock = itemizeMatch ? itemizeMatch[1] : content;
        const rawItems = itemsBlock.split(/\\item\s+/i).map(s => s.trim()).filter(Boolean);

        const parsedSkills: SkillCategory[] = [];

        rawItems.forEach((raw, idx) => {
          // Category in \textbf{Category:}
          const catMatch = raw.match(/\\textbf\{([^}:]+):?\}/);
          let category = '';
          let rest = raw;
          if (catMatch) {
            category = stripMacros(catMatch[1]).trim();
            rest = raw.replace(/\\textbf\{[^}]*\}:?/, '').trim();
          } else {
            category = `Skill Group ${idx + 1}`;
          }

          // Split items by $\cdot$ or \cdot or • or comma
          const cleanedItems = stripMacros(rest)
            .split(/•|\\cdot|\$\s*\\cdot\s*\$|,/)
            .map(i => i.trim())
            .filter(i => i.length > 0);

          if (category || cleanedItems.length > 0) {
            parsedSkills.push({
              id: baseDoc.skills[idx]?.id || `sk-${idx + 1}`,
              category: category || (baseDoc.skills[idx]?.category || 'General Skills'),
              items: cleanedItems.length > 0 ? cleanedItems : (baseDoc.skills[idx]?.items || [])
            });
          }
        });

        if (parsedSkills.length > 0) {
          updated.skills = parsedSkills;
        }
      } catch (err) {
        console.warn('Error parsing skills from LaTeX:', err);
      }
      break;
    }
  }

  // 7. Parse Projects
  for (const [title, content] of sections.entries()) {
    if (title.includes('project') || title.includes('initiative') || title.includes('architecture')) {
      try {
        const rawBlocks = content.split(/\\noindent/i).map(b => b.trim()).filter(Boolean);
        const parsedProjects: Project[] = [];

        rawBlocks.forEach((block, idx) => {
          const titleMatch = block.match(/\\textbf\{([^}]+)\}/);
          if (!titleMatch) return;
          const projTitle = stripMacros(titleMatch[1]).trim();

          const dateMatch = block.match(/\\hfill\s*\{[^}]*?(\d{4}[^}\\]*)\}/);
          let startDate = '';
          let endDate = '';
          if (dateMatch) {
            const rawDates = dateMatch[1].replace(/--|–/g, '-');
            const parts = rawDates.split('-').map(s => s.trim());
            startDate = parts[0] || '';
            endDate = parts[1] || '';
          }

          const roleMatch = block.match(/\\textit\{([^}]+)\}/);
          const role = roleMatch ? stripMacros(roleMatch[1]).trim() : '';

          // Tech stack from brackets [Rust, gRPC...]
          const techMatch = block.match(/\[([^\]]+)\]/);
          const techStack = techMatch
            ? techMatch[1].split(',').map(t => stripMacros(t).trim()).filter(Boolean)
            : (baseDoc.projects[idx]?.techStack || []);

          const highlights: string[] = [];
          const itemizeMatch = block.match(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/i);
          if (itemizeMatch) {
            const items = itemizeMatch[1].split(/\\item\s+/i).map(it => stripMacros(it).replace(/\n/g, ' ').trim()).filter(Boolean);
            highlights.push(...items);
          }

          parsedProjects.push({
            id: baseDoc.projects[idx]?.id || `proj-${idx + 1}`,
            title: projTitle,
            role: role || (baseDoc.projects[idx]?.role || 'Lead Engineer'),
            startDate: startDate || (baseDoc.projects[idx]?.startDate || '2023'),
            endDate: endDate || (baseDoc.projects[idx]?.endDate || 'Present'),
            description: baseDoc.projects[idx]?.description || '',
            techStack,
            highlights: highlights.length > 0 ? highlights : (baseDoc.projects[idx]?.highlights || [])
          });
        });

        if (parsedProjects.length > 0) {
          updated.projects = parsedProjects;
        }
      } catch (err) {
        console.warn('Error parsing projects from LaTeX:', err);
      }
      break;
    }
  }

  // 8. Parse Certifications
  for (const [title, content] of sections.entries()) {
    if (title.includes('certification') || title.includes('accreditation')) {
      try {
        const itemizeMatch = content.match(/\\begin\{itemize\}[^]*?([\s\S]*?)\\end\{itemize\}/i);
        const itemsBlock = itemizeMatch ? itemizeMatch[1] : content;
        const rawItems = itemsBlock.split(/\\item\s+/i).map(s => s.trim()).filter(Boolean);

        const parsedCerts: Certification[] = [];

        rawItems.forEach((raw, idx) => {
          const nameMatch = raw.match(/\\textbf\{([^}]+)\}/);
          const issuerMatch = raw.match(/\\textit\{([^}]+)\}/);
          const dateMatch = raw.match(/\(([^)]+)\)/);

          if (nameMatch) {
            parsedCerts.push({
              id: baseDoc.certifications[idx]?.id || `cert-${idx + 1}`,
              name: stripMacros(nameMatch[1]).trim(),
              issuer: issuerMatch ? stripMacros(issuerMatch[1]).trim() : (baseDoc.certifications[idx]?.issuer || ''),
              date: dateMatch ? stripMacros(dateMatch[1]).trim() : (baseDoc.certifications[idx]?.date || '')
            });
          }
        });

        if (parsedCerts.length > 0) {
          updated.certifications = parsedCerts;
        }
      } catch (err) {
        console.warn('Error parsing certifications from LaTeX:', err);
      }
      break;
    }
  }

  return updated;
}
