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

// Section Header matching patterns
const SECTION_PATTERNS: { key: string; regex: RegExp }[] = [
  { key: 'summary', regex: /^(?:executive\s+|professional\s+)?(?:summary|profile|about(?:\s+me)?|biography|objective|career\s+objective)$/i },
  { key: 'experience', regex: /^(?:professional\s+|work\s+|career\s+|relevant\s+)?(?:experience|employment(?:\s+history)?|work\s+history|positions\s+held)$/i },
  { key: 'education', regex: /^(?:academic\s+|educational\s+)?(?:education|qualifications|academic\s+background|academic\s+credentials|degrees)(?:\s*&\s*(?:certifications|training))?$/i },
  { key: 'certifications', regex: /^(?:certifications|licenses|credentials|accreditations|certificates)(?:\s*&\s*licenses)?$/i },
  { key: 'skills', regex: /^(?:technical\s+|core\s+|professional\s+)?(?:skills|competencies|areas\s+of\s+expertise|proficiencies|technologies|key\s+skills)$/i },
  { key: 'projects', regex: /^(?:key\s+|strategic\s+|technical\s+|personal\s+)?(?:projects|initiatives|portfolio(?:\s+projects)?)$/i },
  { key: 'publications', regex: /^(?:publications|research|patents|published\s+works)$/i }
];

// Comprehensive date range pattern matching "August 2026 – Present", "2018 - 2022", "06/2021 - Present", etc.
const DATE_RANGE_REGEX = /(?:(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?,?\s+)?\b(?:19|20)\d{2}\b\s*(?:–|-|to|—)\s*(?:(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?,?\s+)?\b(?:19|20)\d{2}\b|present|current)\b|\b(?:19|20)\d{2}\s*(?:–|-|to|—)\s*(?:(?:19|20)\d{2}|present|current)\b)/i;

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/**
 * Normalizes section headers by removing markdown/symbols and healing PDF small-caps
 * letter gaps (e.g., "P ROFESSIONAL S UMMARY" -> "PROFESSIONAL SUMMARY").
 */
function normalizeHeaderLine(line: string): string {
  let clean = line.replace(/^[#*_\-•=\s]+|[#*_\-•=\s]+$/g, '').trim();
  // Fix PDF small-caps spacing between initial capital and following capitals
  clean = clean.replace(/\b([A-Z])\s+([A-Z]{2,})\b/g, '$1$2');
  return clean;
}

/**
 * Splits document text into categorized section blocks.
 */
function segmentSections(lines: string[]): { [key: string]: string[] } {
  const sections: { [key: string]: string[] } = {};
  let currentSec = 'header';
  sections[currentSec] = [];

  for (const line of lines) {
    const clean = normalizeHeaderLine(line);
    let matchedSec: string | null = null;

    if (clean.length < 50) {
      for (const { key, regex } of SECTION_PATTERNS) {
        if (regex.test(clean)) {
          matchedSec = key;
          break;
        }
      }
    }

    if (matchedSec) {
      currentSec = matchedSec;
      if (!sections[currentSec]) {
        sections[currentSec] = [];
      }
    } else {
      sections[currentSec].push(line);
    }
  }

  return sections;
}

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
    } catch {
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
        confidenceScore: 96,
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
  const sections = segmentSections(lines);
  const sectionsFound: string[] = [];

  // --- Step 3A: Parse Summary ---
  let summary = '';
  if (sections.summary && sections.summary.length > 0) {
    summary = sections.summary.join(' ').replace(/\s+/g, ' ').trim();
    if (summary.length > 20) {
      sectionsFound.push('Summary');
    }
  }

  // --- Step 3B: Parse Work Experience ---
  const experiences = parseWorkExperiences(sections.experience || []);
  if (experiences.length > 0) {
    sectionsFound.push(`Experience (${experiences.length})`);
  }

  // --- Step 3C: Parse Education ---
  const education = parseEducation(sections.education || []);
  if (education.length > 0) {
    sectionsFound.push(`Education (${education.length})`);
  }

  // --- Step 3D: Parse Skills ---
  const skills = parseSkills(sections.skills || []);
  if (skills.length > 0) {
    sectionsFound.push(`Skills (${skills.reduce((a, s) => a + s.items.length, 0)})`);
  }

  // --- Step 3E: Parse Projects ---
  const projects = parseProjects(sections.projects || []);
  if (projects.length > 0) {
    sectionsFound.push(`Projects (${projects.length})`);
  }

  // --- Step 3F: Parse Certifications ---
  const certifications = parseCertifications(sections.certifications || []);
  if (certifications.length > 0) {
    sectionsFound.push(`Certifications (${certifications.length})`);
  }

  // --- Step 3G: Parse Header & Personal Information ---
  const personalInfo = parseHeader(
    sections.header || lines.slice(0, 8),
    text,
    summary,
    experiences[0]?.role
  );
  if (personalInfo.fullName && personalInfo.fullName !== 'Candidate Name') {
    sectionsFound.unshift('Personal Info');
  }

  // Build clean Atelier CVDocument without pre-filling Julian Thorne mock text
  const doc: CVDocument = {
    id: `doc-${Date.now()}`,
    title: personalInfo.fullName ? `CV — ${personalInfo.fullName}` : 'Imported CV',
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isCustomLatex: false,
    personalInfo,
    summary: summary || '',
    experience: experiences,
    education: education,
    skills: skills,
    projects: projects,
    certifications: certifications,
    publications: [],
    awards: [],
    customSections: [],
    settings: {
      templateId: 'corporate-classic',
      paperSize: 'a4',
      primaryColor: '#0A0A0A',
      accentColor: '#8C8172',
      fontFamily: 'serif',
      fontSize: 'normal',
      margins: 'normal',
      lineSpacing: 'normal',
      showBorders: true
    }
  };

  // Real-time confidence score calculation
  let score = 30;
  if (personalInfo.fullName && personalInfo.fullName !== 'Candidate Name') score += 15;
  if (personalInfo.email) score += 10;
  if (personalInfo.phone) score += 5;
  if (personalInfo.location) score += 5;
  if (summary.length > 20) score += 10;
  if (experiences.length > 0) score += 15;
  if (education.length > 0) score += 5;
  if (skills.length > 0) score += 5;

  return {
    document: doc,
    stats: {
      confidenceScore: Math.min(99, Math.max(50, score)),
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

/**
 * Extracts personal contact info, links, location, name, and determines title.
 */
function parseHeader(
  headerLines: string[],
  fullText: string,
  summaryText: string,
  firstExpRole?: string
) {
  let fullName = '';
  let title = '';
  let email = '';
  let phone = '';
  let location = '';
  let website = '';
  let linkedin = '';
  let github = '';

  // 1. Regex search across full text for email & phone
  const emailMatch = fullText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i);
  if (emailMatch) email = emailMatch[0].trim();

  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}(?:[-.\s]?\d{1,4})?/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
    phone = phoneMatch[0].trim();
  }

  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) linkedin = `linkedin.com/in/${linkedinMatch[1]}`;

  const githubMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) github = `github.com/${githubMatch[1]}`;

  const websiteMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:io|me|dev|tech|app|com|org))(?:\/[^\s,]*)?/i);
  if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github') && !websiteMatch[0].includes('@')) {
    website = websiteMatch[0].replace(/^https?:\/\//i, '').trim();
  }

  // 2. Parse candidate name from first header lines
  for (let i = 0; i < headerLines.length; i++) {
    const line = headerLines[i];
    if (line.includes('@') || line.includes('http') || line.match(/\d{4,}/)) continue;

    const clean = line.replace(/[^\w\s.'-]/g, '').trim();
    const words = clean.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && clean.length < 40 && !clean.match(/resume|curriculum|cv|page/i)) {
      fullName = clean.toUpperCase() === clean ? toTitleCase(clean) : clean;
      // If there is an immediate second line without contact info, it might be an explicit job title
      if (i + 1 < headerLines.length) {
        const nextLine = headerLines[i + 1];
        if (!nextLine.includes('@') && !nextLine.includes('http') && !nextLine.match(/\d{4,}/) && nextLine.length < 50 && !nextLine.includes('·')) {
          title = nextLine.trim();
        }
      }
      break;
    }
  }

  // 3. Location from contact line (e.g. "Gurugram, Haryana · nikhiljaiswal084@gmail.com")
  const locRegex = /([A-Za-z\s.-]+,\s*[A-Za-z\s]+)/;
  for (const hLine of headerLines) {
    const parts = hLine.split(/[·|•\t]/);
    for (const part of parts) {
      const p = part.trim();
      if (!p.includes('@') && !p.match(/\d{5,}/) && !p.match(/portfolio|linkedin|github/i)) {
        const lm = p.match(locRegex);
        if (lm && lm[1].length > 4 && lm[1].length < 40) {
          location = lm[1].trim();
          break;
        }
      }
    }
    if (location) break;
  }

  // 4. Intelligently determine professional title if not in header
  if (!title && summaryText) {
    const sumMatch = summaryText.match(/^([A-Za-z\s]{3,35}?)\s+(?:with\b|has\b|offering\b|specializing\b|skilled\b)/i);
    if (sumMatch && sumMatch[1].trim().length > 4) {
      title = sumMatch[1].trim();
    }
  }
  if (!title && firstExpRole) {
    title = firstExpRole;
  }

  return {
    fullName: fullName || 'Candidate Name',
    title: title || 'Professional',
    email,
    phone,
    location,
    website,
    linkedin,
    github
  };
}

/**
 * Parses work experience entries, companies, locations, dates, and bullet achievements.
 */
function parseWorkExperiences(lines: string[]): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  let currentExp: WorkExperience | null = null;
  let pendingCompany = '';
  let pendingLocation = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[\s•·*\-–—]/.test(line) || /^\d+\.\s*/.test(line);
    const hasDate = DATE_RANGE_REGEX.test(line);
    const nextLineHasDate = i + 1 < lines.length && DATE_RANGE_REGEX.test(lines[i + 1]);

    if (!hasDate && !isBullet && nextLineHasDate) {
      // Company & Location line preceding a role with dates
      if (line.includes('\t')) {
        const parts = line.split('\t').map(s => s.trim()).filter(Boolean);
        pendingCompany = parts[0] || '';
        pendingLocation = parts[1] || '';
      } else {
        const locMatch = line.match(/\b([A-Za-z\s.-]+,\s*[A-Za-z\s]+|\bRemote\b|\bHybrid\b|\bOn-site\b)$/i);
        if (locMatch) {
          pendingLocation = locMatch[0].trim();
          pendingCompany = line.slice(0, line.length - locMatch[0].length).replace(/[,|–—\s]+$/, '').trim();
        } else {
          pendingCompany = line;
        }
      }
      continue;
    }

    if (hasDate) {
      if (currentExp && (currentExp.role || currentExp.company)) {
        experiences.push(currentExp);
      }

      const dateMatch = line.match(DATE_RANGE_REGEX);
      const dateStr = dateMatch ? dateMatch[0] : '';
      const parts = dateStr.replace(/–|—/g, '-').split('-');
      const startDate = parts[0]?.trim() || '';
      const endDate = parts[1]?.trim() || 'Present';
      const current = endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current');

      let roleText = '';
      if (line.includes('\t')) {
        const segs = line.split('\t').map(s => s.trim()).filter(Boolean);
        roleText = segs[0].replace(DATE_RANGE_REGEX, '').trim();
      } else {
        roleText = line.replace(DATE_RANGE_REGEX, '').replace(/•|\|/g, ' ').trim();
      }

      let company = pendingCompany;
      let location = pendingLocation;

      // Promotion / Sub-role at previous company
      if (!company && experiences.length > 0) {
        company = experiences[experiences.length - 1].company;
        location = experiences[experiences.length - 1].location;
      }
      pendingCompany = '';
      pendingLocation = '';

      currentExp = {
        id: `exp-${experiences.length + 1}`,
        role: roleText || 'Software Developer',
        company: company || 'Organization',
        location: location || '',
        startDate,
        endDate,
        current,
        description: '',
        achievements: []
      };
    } else if (currentExp) {
      const clean = line.replace(/^[\s•·*\-–—\d.]+\s*/, '').trim();
      if (isBullet) {
        if (clean.length > 3) {
          currentExp.achievements.push(clean);
        }
      } else if (clean.length > 0) {
        // Multi-line continuation of previous bullet
        if (currentExp.achievements.length > 0) {
          currentExp.achievements[currentExp.achievements.length - 1] += ' ' + clean;
        } else if (!currentExp.description) {
          currentExp.description = clean;
        }
      }
    }
  }

  if (currentExp && (currentExp.role || currentExp.company)) {
    experiences.push(currentExp);
  }

  // Ensure every experience has at least one valid achievement
  return experiences.map(exp => {
    if (!exp.achievements || exp.achievements.length === 0) {
      exp.achievements = [`Contributed as ${exp.role} at ${exp.company}, executing core project requirements and technical deliverables.`];
    }
    return exp;
  });
}

/**
 * Parses education institutions, degrees, fields of study, and date ranges.
 */
function parseEducation(lines: string[]): Education[] {
  const educations: Education[] = [];
  let currentEdu: Education | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasDate = DATE_RANGE_REGEX.test(line) || /\b(19|20)\d{2}\b/.test(line);
    const hasSchool = /(?:university|college|institute|school|academy|polytechnic)/i.test(line);
    const hasDegree = /(?:bachelor|master|doctor|b\.s|b\.a|m\.s|m\.b\.a|mba|ph\.d|b\.tech|m\.tech|bachelor of|course|diploma)/i.test(line);

    if (hasSchool) {
      if (currentEdu) {
        educations.push(currentEdu);
      }
      let school = '';
      let location = '';
      if (line.includes('\t')) {
        const parts = line.split('\t').map(s => s.trim()).filter(Boolean);
        school = parts[0] || '';
        location = parts[1] || '';
      } else {
        const locMatch = line.match(/\b([A-Za-z\s.-]+,\s*[A-Za-z\s]+|\bRemote\b)$/i);
        if (locMatch) {
          location = locMatch[0].trim();
          school = line.slice(0, line.length - locMatch[0].length).replace(/[,|–—\s]+$/, '').trim();
        } else {
          school = line;
        }
      }
      currentEdu = {
        id: `edu-${educations.length + 1}`,
        school: school || 'Educational Institution',
        degree: '',
        field: '',
        location,
        startDate: '',
        endDate: '',
        honors: ''
      };
    } else if (hasDegree || hasDate) {
      if (!currentEdu || currentEdu.degree) {
        if (currentEdu) {
          educations.push(currentEdu);
        }
        currentEdu = {
          id: `edu-${educations.length + 1}`,
          school: 'Educational Institution',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          honors: ''
        };
      }

      const dateMatch = line.match(DATE_RANGE_REGEX) || line.match(/\b(19|20)\d{2}\b/);
      if (dateMatch) {
        const parts = dateMatch[0].replace(/–|—/g, '-').split('-');
        currentEdu.startDate = parts[0]?.trim() || '';
        currentEdu.endDate = parts[1]?.trim() || parts[0]?.trim() || '';
      }

      let degreeStr = '';
      if (line.includes('\t')) {
        degreeStr = line.split('\t')[0].replace(DATE_RANGE_REGEX, '').trim();
      } else {
        degreeStr = line.replace(DATE_RANGE_REGEX, '').trim();
      }

      const inMatch = degreeStr.match(/(.*?)\s+\bin\b\s+(.*)/i);
      if (inMatch) {
        currentEdu.degree = inMatch[1].trim();
        currentEdu.field = inMatch[2].trim();
      } else {
        currentEdu.degree = degreeStr;
      }
    } else if (currentEdu) {
      if (!currentEdu.field) {
        currentEdu.field = line.trim();
      } else {
        currentEdu.honors = line.trim();
      }
    }
  }

  if (currentEdu) {
    educations.push(currentEdu);
  }

  return educations.map(edu => {
    if (!edu.degree) edu.degree = 'Degree Program';
    return edu;
  });
}

/**
 * Parses categorized technical capabilities and competencies.
 */
function parseSkills(lines: string[]): SkillCategory[] {
  const categories: SkillCategory[] = [];
  let currentCat: SkillCategory | null = null;

  for (const line of lines) {
    const isBullet = /^[\s•·*\-–—]/.test(line);
    const colonIdx = line.indexOf(':');

    if (colonIdx !== -1 && colonIdx < 40) {
      const catName = line.slice(0, colonIdx).replace(/^[\s•·*\-–—]+/, '').trim();
      const itemsStr = line.slice(colonIdx + 1).trim();
      const items = itemsStr.split(/[,•·|/]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40);
      currentCat = {
        id: `sk-${categories.length + 1}`,
        category: catName || 'Technical Capabilities',
        items
      };
      categories.push(currentCat);
    } else if (currentCat && !isBullet) {
      // Continuation line for previous skill category
      const items = line.split(/[,•·|/]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40);
      currentCat.items.push(...items);
    } else {
      const items = line.replace(/^[\s•·*\-–—]+/, '').split(/[,•·|/]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40);
      if (items.length > 1) {
        currentCat = {
          id: `sk-${categories.length + 1}`,
          category: `Competencies ${categories.length + 1}`,
          items
        };
        categories.push(currentCat);
      }
    }
  }

  return categories;
}

/**
 * Parses projects and technical initiatives.
 */
function parseProjects(lines: string[]): Project[] {
  const projects: Project[] = [];
  let currentProj: Project | null = null;

  for (const line of lines) {
    const isBullet = /^[\s•·*\-–—]/.test(line);
    const hasDate = DATE_RANGE_REGEX.test(line);

    if (!isBullet && (hasDate || line.length < 50)) {
      if (currentProj && currentProj.title) {
        projects.push(currentProj);
      }
      currentProj = {
        id: `proj-${projects.length + 1}`,
        title: line.replace(DATE_RANGE_REGEX, '').trim() || 'Technical Project',
        role: 'Project Lead',
        startDate: '2023',
        endDate: '2024',
        description: '',
        highlights: [],
        techStack: []
      };
    } else if (currentProj) {
      const clean = line.replace(/^[\s•·*\-–—]+/, '').trim();
      if (clean.length > 5) {
        currentProj.highlights.push(clean);
      }
    }
  }

  if (currentProj && currentProj.title) {
    projects.push(currentProj);
  }

  return projects;
}

/**
 * Parses certifications and accredited credentials.
 */
function parseCertifications(lines: string[]): Certification[] {
  const certs: Certification[] = [];
  for (const line of lines) {
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
  return certs;
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
      location: b.location?.city ? `${b.location.city}, ${b.location.region || ''}` : '',
      website: b.url || '',
      linkedin: b.profiles?.find((p: any) => p.network?.toLowerCase().includes('linkedin'))?.url || '',
      github: b.profiles?.find((p: any) => p.network?.toLowerCase().includes('github'))?.url || ''
    },
    summary: b.summary || '',
    experience: (json.work || []).map((w: any, idx: number) => ({
      id: `exp-${idx + 1}`,
      role: w.position || 'Professional Role',
      company: w.name || 'Organization',
      location: w.location || '',
      startDate: w.startDate || '2020',
      endDate: w.endDate || 'Present',
      current: !w.endDate || w.endDate.toLowerCase().includes('present'),
      description: w.summary || '',
      achievements: w.highlights || []
    })),
    education: (json.education || []).map((e: any, idx: number) => ({
      id: `edu-${idx + 1}`,
      school: e.institution || 'University',
      degree: e.studyType || 'Bachelor',
      field: e.area || '',
      location: '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      honors: e.score || ''
    })),
    skills: (json.skills || []).map((s: any, idx: number) => ({
      id: `sk-${idx + 1}`,
      category: s.name || 'Technical Skills',
      items: s.keywords || []
    })),
    projects: (json.projects || []).map((p: any, idx: number) => ({
      id: `proj-${idx + 1}`,
      title: p.name || 'Project',
      role: 'Contributor',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      description: p.description || '',
      highlights: p.highlights || [],
      techStack: []
    })),
    certifications: (json.certificates || []).map((c: any, idx: number) => ({
      id: `cert-${idx + 1}`,
      name: c.name || 'Certificate',
      issuer: c.issuer || '',
      date: c.date || ''
    })),
    publications: []
  };
}
