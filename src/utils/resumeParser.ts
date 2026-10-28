import { CVDocument, WorkExperience, Education, SkillCategory, Project, Certification, Publication } from '../types/cv';
import { INITIAL_CV } from '../data/mockCV';
import { parseLatexSource } from './latexParser';

export interface ParsingStats {
  confidenceScore: number; // 0 - 100
  detectedFormat: string;
  sectionsFound: string[];
  itemCounts: {
    experience: number;
    education: number;
    skills: number;
    projects: number;
    certifications: number;
  };
}

export interface ParsedResumeResult {
  document: CVDocument;
  stats: ParsingStats;
  rawText: string;
}

// Common section header patterns
const SECTION_HEADERS = {
  summary: /^(?:executive\s+|professional\s+)?(?:summary|profile|about(?:\s+me)?|biography|objective|career\s+objective)$/i,
  experience: /^(?:professional\s+|work\s+|career\s+|relevant\s+)?(?:experience|employment(?:\s+history)?|work\s+history|positions\s+held)$/i,
  education: /^(?:academic\s+|educational\s+)?(?:education|qualifications|academic\s+background|academic\s+credentials|degrees)$/i,
  skills: /^(?:technical\s+|core\s+)?(?:skills|competencies|areas\s+of\s+expertise|proficiencies|technologies|technical\s+proficiencies|key\s+skills)$/i,
  projects: /^(?:key\s+|strategic\s+|technical\s+|personal\s+)?(?:projects|initiatives|portfolio(?:\s+projects)?)$/i,
  certifications: /^(?:certifications|licenses|credentials|accreditations|certifications\s+&\s+licenses)$/i,
  publications: /^(?:publications|research|patents|published\s+works)$/i,
  awards: /^(?:awards|honors|distinctions|recognition)$/i
};

// Date range regex
const DATE_RANGE_REGEX = /(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\b(?:19|20)\d{2}\b\s*(?:–|-|to|—)\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\b(?:19|20)\d{2}\b|present|current)\b|\b(?:19|20)\d{2}\s*(?:–|-|to|—)\s*(?:(?:19|20)\d{2}|present|current)\b)/i;

/**
 * Parses raw text extracted from any resume (PDF, Word DOCX, TXT, JSON, LaTeX)
 * into a structured, production-ready Atelier CVDocument.
 */
export function parseResumeText(rawText: string, formatHint = 'text'): ParsedResumeResult {
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // 1. JSON Resume / Atelier JSON Handler
  if (formatHint === 'json' || (text.startsWith('{') && text.endsWith('}'))) {
    try {
      const parsedJson = JSON.parse(text);
      // If it's already an Atelier CVDocument
      if (parsedJson.personalInfo && parsedJson.experience && parsedJson.education) {
        return {
          document: {
            ...INITIAL_CV,
            ...parsedJson,
            id: `doc-${Date.now()}`,
            title: parsedJson.title || `Imported CV — ${parsedJson.personalInfo?.fullName || 'Candidate'}`
          },
          stats: {
            confidenceScore: 100,
            detectedFormat: 'JSON (Atelier Schema)',
            sectionsFound: ['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'],
            itemCounts: {
              experience: parsedJson.experience?.length || 0,
              education: parsedJson.education?.length || 0,
              skills: parsedJson.skills?.reduce((a: number, s: any) => a + (s.items?.length || 0), 0) || 0,
              projects: parsedJson.projects?.length || 0,
              certifications: parsedJson.certifications?.length || 0
            }
          },
          rawText
        };
      }

      // If it's standard JSONResume schema
      if (parsedJson.basics) {
        const doc = mapJsonResumeToAtelier(parsedJson);
        return {
          document: doc,
          stats: {
            confidenceScore: 98,
            detectedFormat: 'JSONResume Schema',
            sectionsFound: ['Personal Info', 'Summary', 'Experience', 'Education', 'Skills'],
            itemCounts: {
              experience: doc.experience.length,
              education: doc.education.length,
              skills: doc.skills.reduce((a, s) => a + s.items.length, 0),
              projects: doc.projects.length,
              certifications: doc.certifications.length
            }
          },
          rawText
        };
      }
    } catch (e) {
      // Fall through to plain text analysis if json parse failed
    }
  }

  // 2. LaTeX Source Handler
  if (formatHint === 'latex' || text.includes('\\begin{document}')) {
    const doc = parseLatexSource(text, INITIAL_CV);
    doc.id = `doc-${Date.now()}`;
    doc.title = `Imported TeX — ${doc.personalInfo.fullName || 'Candidate'}`;
    return {
      document: doc,
      stats: {
        confidenceScore: 95,
        detectedFormat: 'LaTeX Source (.tex)',
        sectionsFound: ['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'],
        itemCounts: {
          experience: doc.experience.length,
          education: doc.education.length,
          skills: doc.skills.reduce((a, s) => a + s.items.length, 0),
          projects: doc.projects.length,
          certifications: doc.certifications.length
        }
      },
      rawText
    };
  }

  // 3. Natural Language & Text Parsing Pipeline (PDF, DOCX, TXT, Clipboard)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Clone base doc
  const doc: CVDocument = JSON.parse(JSON.stringify(INITIAL_CV));
  doc.id = `doc-${Date.now()}`;
  doc.createdAt = new Date().toISOString();
  doc.lastModified = new Date().toISOString();
  doc.isCustomLatex = false;

  const sectionsFound: string[] = [];

  // --- Step 1: Extract Contact Details ---
  // Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i);
  if (emailMatch) {
    doc.personalInfo.email = emailMatch[0].trim();
  }

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}(?:[-.\s]?\d{1,4})?/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
    doc.personalInfo.phone = phoneMatch[0].trim();
  }

  // LinkedIn
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    doc.personalInfo.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
  }

  // GitHub
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    doc.personalInfo.github = `github.com/${githubMatch[1]}`;
  }

  // Website / Portfolio
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:io|me|dev|tech|app|com|org))(?:\/[^\s,]*)?/i);
  if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github') && !websiteMatch[0].includes('@')) {
    doc.personalInfo.website = websiteMatch[0].replace(/^https?:\/\//i, '').trim();
  }

  // Name & Title from Header (first 5 lines)
  const headerLines = lines.slice(0, 6);
  for (let i = 0; i < headerLines.length; i++) {
    const line = headerLines[i];
    // Skip if it contains email, phone, or website
    if (line.includes('@') || line.includes('http') || line.includes('linkedin') || line.match(/\d{4,}/)) {
      continue;
    }
    // Check if looks like a name (2-4 words, capitalized, < 40 chars)
    if (!doc.personalInfo.fullName || doc.personalInfo.fullName === 'Julian Thorne') {
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 5 && line.length < 40 && !line.match(/curriculum|resume|page/i)) {
        doc.personalInfo.fullName = line.replace(/[^a-zA-Z\s.'-]/g, '').trim();
        // Check next line for potential title
        if (i + 1 < headerLines.length) {
          const nextLine = headerLines[i + 1];
          if (!nextLine.includes('@') && !nextLine.includes('http') && nextLine.length < 60) {
            doc.personalInfo.title = nextLine.trim();
          }
        }
        break;
      }
    }
  }

  // Location from Header
  const locRegex = /([A-Za-z\s.-]+,\s*(?:[A-Z]{2}|[A-Za-z\s]+))/;
  for (const hLine of headerLines) {
    const lm = hLine.match(locRegex);
    if (lm && !lm[1].includes('@') && lm[1].length > 4 && lm[1].length < 45) {
      doc.personalInfo.location = lm[1].trim();
      break;
    }
  }

  if (doc.personalInfo.fullName) {
    doc.title = `CV — ${doc.personalInfo.fullName}`;
    sectionsFound.push('Personal Info');
  }

  // --- Step 2: Segment Text into Sections ---
  type SectionKey = keyof typeof SECTION_HEADERS;
  const sectionContent: { [key in SectionKey]?: string[] } = {};

  let currentSection: SectionKey | null = null;

  for (const line of lines) {
    const clean = line.replace(/^[#*_\-•\s]+|[#*_\-•\s]+$/g, '').trim();
    
    // Check if line matches a known section header
    let matchedSection: SectionKey | null = null;
    for (const [key, regex] of Object.entries(SECTION_HEADERS)) {
      if (regex.test(clean) || (clean.length < 35 && clean.toUpperCase() === clean && clean.toLowerCase().includes(key))) {
        matchedSection = key as SectionKey;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      if (!sectionContent[currentSection]) {
        sectionContent[currentSection] = [];
      }
    } else if (currentSection) {
      sectionContent[currentSection]!.push(line);
    }
  }

  // --- Step 3: Parse Summary ---
  if (sectionContent.summary && sectionContent.summary.length > 0) {
    const summaryText = sectionContent.summary.join(' ').replace(/\s+/g, ' ').trim();
    if (summaryText.length > 25) {
      doc.summary = summaryText;
      sectionsFound.push('Summary');
    }
  }

  // --- Step 4: Parse Work Experience ---
  if (sectionContent.experience && sectionContent.experience.length > 0) {
    const expLines = sectionContent.experience;
    const experiences: WorkExperience[] = [];
    let currentExp: Partial<WorkExperience> | null = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const hasDate = DATE_RANGE_REGEX.test(line);

      // New experience entry indicator: has date or looks like a title
      if (hasDate) {
        if (currentExp && (currentExp.role || currentExp.company)) {
          experiences.push(finalizeExperience(currentExp, experiences.length));
        }

        const dateMatch = line.match(DATE_RANGE_REGEX);
        const dateStr = dateMatch ? dateMatch[0] : '';
        const rawDateParts = dateStr.replace(/–|—/g, '-').split('-');
        const startDate = rawDateParts[0]?.trim() || '2020';
        const endDate = rawDateParts[1]?.trim() || 'Present';
        const current = endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current');

        // Extract role/company from the line before or same line
        let role = '';
        let company = '';
        let location = '';

        const textWithoutDate = line.replace(DATE_RANGE_REGEX, '').replace(/•|\||–|—/g, ' ').trim();
        if (textWithoutDate.length > 3) {
          const parts = textWithoutDate.split(/\s{2,}|,\s*|\bat\b|\b-\b/i).map(s => s.trim()).filter(Boolean);
          role = parts[0] || 'Executive Role';
          company = parts[1] || parts[0] || 'Enterprise Corp';
          location = parts[2] || '';
        } else if (i > 0 && expLines[i - 1].length < 60) {
          role = expLines[i - 1].trim();
        }

        currentExp = {
          role: role || 'Senior Professional',
          company: company || 'Organization',
          location,
          startDate,
          endDate,
          current,
          achievements: []
        };
      } else if (currentExp) {
        // Check for bullet achievements
        const isBullet = /^[\s•·*\-–—]\s*/.test(line) || /^\d+\.\s*/.test(line);
        const cleanBullet = line.replace(/^[\s•·*\-–—\d.]+\s*/, '').trim();

        if (isBullet && cleanBullet.length > 10) {
          currentExp.achievements = currentExp.achievements || [];
          currentExp.achievements.push(cleanBullet);
        } else if (!currentExp.company && line.length < 50 && !line.includes('.')) {
          currentExp.company = line.trim();
        } else if (!currentExp.description && line.length > 20 && !isBullet) {
          currentExp.description = line.trim();
        } else if (cleanBullet.length > 15) {
          currentExp.achievements = currentExp.achievements || [];
          currentExp.achievements.push(cleanBullet);
        }
      }
    }

    if (currentExp && (currentExp.role || currentExp.company)) {
      experiences.push(finalizeExperience(currentExp, experiences.length));
    }

    if (experiences.length > 0) {
      doc.experience = experiences;
      sectionsFound.push(`Experience (${experiences.length})`);
    }
  }

  // --- Step 5: Parse Education ---
  if (sectionContent.education && sectionContent.education.length > 0) {
    const eduLines = sectionContent.education;
    const educations: Education[] = [];
    let currentEdu: Partial<Education> | null = null;

    const DEGREE_REGEX = /(?:bachelor|master|doctor|b\.s\.|b\.a\.|m\.s\.|m\.b\.a\.|mba|ph\.d\.|b\.tech|m\.tech|associate|diploma)/i;
    const SCHOOL_REGEX = /(?:university|college|institute|school|academy|polytechnic)/i;

    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i];
      const hasDate = DATE_RANGE_REGEX.test(line) || /\b(19|20)\d{2}\b/.test(line);
      const hasSchool = SCHOOL_REGEX.test(line);
      const hasDegree = DEGREE_REGEX.test(line);

      if (hasSchool || (hasDegree && hasDate)) {
        if (currentEdu && currentEdu.school) {
          educations.push(finalizeEducation(currentEdu, educations.length));
        }

        const dateMatch = line.match(DATE_RANGE_REGEX) || line.match(/\b(19|20)\d{2}\b/);
        const dateStr = dateMatch ? dateMatch[0] : '';
        const parts = dateStr.split(/–|-/);
        const startDate = parts[0]?.trim() || '';
        const endDate = parts[1]?.trim() || parts[0]?.trim() || '2020';

        currentEdu = {
          school: hasSchool ? line.replace(DATE_RANGE_REGEX, '').replace(/•|\|/g, '').trim() : 'University',
          degree: hasDegree ? line.trim() : 'Bachelor of Science',
          field: '',
          location: '',
          startDate,
          endDate
        };
      } else if (currentEdu) {
        if (hasDegree && !currentEdu.degree) {
          currentEdu.degree = line.trim();
        } else if (hasSchool && (!currentEdu.school || currentEdu.school === 'University')) {
          currentEdu.school = line.trim();
        } else if (/honors|gpa|cum laude|dean/i.test(line)) {
          currentEdu.honors = line.trim();
        } else if (!currentEdu.field && line.length < 50) {
          currentEdu.field = line.trim();
        }
      }
    }

    if (currentEdu && currentEdu.school) {
      educations.push(finalizeEducation(currentEdu, educations.length));
    }

    if (educations.length > 0) {
      doc.education = educations;
      sectionsFound.push(`Education (${educations.length})`);
    }
  }

  // --- Step 6: Parse Skills ---
  if (sectionContent.skills && sectionContent.skills.length > 0) {
    const skillLines = sectionContent.skills;
    const categories: SkillCategory[] = [];

    for (const line of skillLines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1 && colonIdx < 40) {
        const catName = line.slice(0, colonIdx).replace(/^[\s•·*\-–—]+/, '').trim();
        const itemsStr = line.slice(colonIdx + 1).trim();
        const items = itemsStr.split(/[,•·|/]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 35);
        if (items.length > 0) {
          categories.push({
            id: `sk-${categories.length + 1}`,
            category: catName || 'Technical Capabilities',
            items
          });
        }
      } else {
        const items = line.split(/[,•·|/]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 35);
        if (items.length > 2) {
          categories.push({
            id: `sk-${categories.length + 1}`,
            category: `Competencies Group ${categories.length + 1}`,
            items
          });
        }
      }
    }

    if (categories.length > 0) {
      doc.skills = categories;
      sectionsFound.push(`Skills (${categories.reduce((a, c) => a + c.items.length, 0)})`);
    }
  }

  // --- Step 7: Parse Projects ---
  if (sectionContent.projects && sectionContent.projects.length > 0) {
    const projLines = sectionContent.projects;
    const projects: Project[] = [];
    let currentProj: Partial<Project> | null = null;

    for (const line of projLines) {
      const isBullet = /^[\s•·*\-–—]/.test(line);
      const hasDate = DATE_RANGE_REGEX.test(line);

      if (!isBullet && (hasDate || line.length < 50)) {
        if (currentProj && currentProj.title) {
          projects.push(finalizeProject(currentProj, projects.length));
        }
        currentProj = {
          title: line.replace(DATE_RANGE_REGEX, '').trim() || 'Strategic Initiative',
          role: 'Lead Architect',
          startDate: '2023',
          endDate: '2024',
          description: '',
          highlights: [],
          techStack: []
        };
      } else if (currentProj) {
        const clean = line.replace(/^[\s•·*\-–—]+/, '').trim();
        if (clean.length > 10) {
          currentProj.highlights = currentProj.highlights || [];
          currentProj.highlights.push(clean);
        }
      }
    }

    if (currentProj && currentProj.title) {
      projects.push(finalizeProject(currentProj, projects.length));
    }

    if (projects.length > 0) {
      doc.projects = projects;
      sectionsFound.push(`Projects (${projects.length})`);
    }
  }

  // --- Step 8: Parse Certifications ---
  if (sectionContent.certifications && sectionContent.certifications.length > 0) {
    const certs: Certification[] = [];
    for (const line of sectionContent.certifications) {
      const clean = line.replace(/^[\s•·*\-–—]+/, '').trim();
      if (clean.length > 5) {
        certs.push({
          id: `cert-${certs.length + 1}`,
          name: clean,
          issuer: 'Accredited Authority',
          date: 'Active'
        });
      }
    }
    if (certs.length > 0) {
      doc.certifications = certs;
      sectionsFound.push(`Certifications (${certs.length})`);
    }
  }

  // Confidence calculation
  let score = 50;
  if (doc.personalInfo.fullName && doc.personalInfo.fullName !== 'Julian Thorne') score += 15;
  if (doc.personalInfo.email) score += 10;
  if (doc.experience.length > 0) score += 15;
  if (doc.education.length > 0) score += 10;

  return {
    document: doc,
    stats: {
      confidenceScore: Math.min(99, score),
      detectedFormat: formatHint.toUpperCase(),
      sectionsFound,
      itemCounts: {
        experience: doc.experience.length,
        education: doc.education.length,
        skills: doc.skills.reduce((a, s) => a + s.items.length, 0),
        projects: doc.projects.length,
        certifications: doc.certifications.length
      }
    },
    rawText
  };
}

// Helpers to guarantee valid models
function finalizeExperience(exp: Partial<WorkExperience>, index: number): WorkExperience {
  return {
    id: `exp-${index + 1}`,
    role: exp.role || 'Executive Role',
    company: exp.company || 'Enterprise Corporation',
    location: exp.location || '',
    startDate: exp.startDate || '2020',
    endDate: exp.endDate || 'Present',
    current: exp.current ?? true,
    description: exp.description || '',
    achievements: exp.achievements && exp.achievements.length > 0 ? exp.achievements : ['Spearheaded strategic execution and delivered high-impact initiatives.']
  };
}

function finalizeEducation(edu: Partial<Education>, index: number): Education {
  return {
    id: `edu-${index + 1}`,
    school: edu.school || 'University',
    degree: edu.degree || 'Bachelor of Science',
    field: edu.field || '',
    location: edu.location || '',
    startDate: edu.startDate || '2016',
    endDate: edu.endDate || '2020',
    honors: edu.honors || ''
  };
}

function finalizeProject(proj: Partial<Project>, index: number): Project {
  return {
    id: `proj-${index + 1}`,
    title: proj.title || 'Key Architectural Initiative',
    role: proj.role || 'Lead Architect',
    startDate: proj.startDate || '2023',
    endDate: proj.endDate || '2024',
    description: proj.description || '',
    highlights: proj.highlights && proj.highlights.length > 0 ? proj.highlights : ['Delivered resilient architecture milestone with measurable outcomes.'],
    techStack: proj.techStack || ['Architecture', 'Strategy', 'Execution']
  };
}

function mapJsonResumeToAtelier(json: any): CVDocument {
  const b = json.basics || {};
  return {
    ...INITIAL_CV,
    id: `doc-${Date.now()}`,
    title: `Imported Resume — ${b.name || 'Candidate'}`,
    personalInfo: {
      fullName: b.name || 'Candidate Name',
      title: b.label || 'Executive Leader',
      email: b.email || '',
      phone: b.phone || '',
      location: b.location?.city ? `${b.location.city}, ${b.location.region || b.location.countryCode || ''}` : '',
      website: b.url ? b.url.replace(/^https?:\/\//i, '') : '',
      linkedin: b.profiles?.find((p: any) => p.network?.toLowerCase().includes('linkedin'))?.url || '',
      github: b.profiles?.find((p: any) => p.network?.toLowerCase().includes('github'))?.url || ''
    },
    summary: b.summary || '',
    experience: (json.work || []).map((w: any, idx: number) => ({
      id: `exp-${idx + 1}`,
      role: w.position || 'Professional Role',
      company: w.name || 'Organization',
      location: w.location || '',
      startDate: w.startDate ? w.startDate.slice(0, 4) : '2020',
      endDate: w.endDate ? w.endDate.slice(0, 4) : 'Present',
      current: !w.endDate || w.endDate.toLowerCase().includes('present'),
      description: w.summary || '',
      achievements: w.highlights || []
    })),
    education: (json.education || []).map((e: any, idx: number) => ({
      id: `edu-${idx + 1}`,
      school: e.institution || 'University',
      degree: e.studyType || 'Bachelor of Science',
      field: e.area || '',
      location: '',
      startDate: e.startDate ? e.startDate.slice(0, 4) : '2016',
      endDate: e.endDate ? e.endDate.slice(0, 4) : '2020',
      gpa: e.score || '',
      honors: (e.courses || []).join(', ')
    })),
    skills: (json.skills || []).map((s: any, idx: number) => ({
      id: `sk-${idx + 1}`,
      category: s.name || `Skill Group ${idx + 1}`,
      items: s.keywords || []
    })),
    projects: (json.projects || []).map((p: any, idx: number) => ({
      id: `proj-${idx + 1}`,
      title: p.name || 'Project',
      role: p.roles ? p.roles.join(', ') : 'Lead',
      startDate: p.startDate ? p.startDate.slice(0, 4) : '2023',
      endDate: p.endDate ? p.endDate.slice(0, 4) : 'Present',
      description: p.description || '',
      highlights: p.highlights || [],
      techStack: p.keywords || []
    }))
  };
}
