export type TemplateId = 
  | 'corporate-classic'
  | 'modern-professional'
  | 'executive'
  | 'technical-resume'
  | 'consulting'
  | 'academic-cv';

export type PaperSize = 'a4' | 'letter';

export type FontFamilyChoice = 'serif' | 'sans' | 'hybrid';

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  role: string;
  link?: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  techStack?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  summary: string;
}

export interface CVStyleSettings {
  templateId: TemplateId;
  paperSize: PaperSize;
  primaryColor: string; // e.g. '#0A0A0A', '#1C2833', '#8C8172', '#1E3A8A'
  accentColor: string;
  fontFamily: FontFamilyChoice;
  fontSize: 'compact' | 'normal' | 'spacious';
  margins: 'compact' | 'normal' | 'generous';
  lineSpacing: 'tight' | 'normal' | 'relaxed';
  showBorders: boolean;
}

export interface CVDocument {
  id: string;
  title: string;
  lastModified: string;
  createdAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  publications: Publication[];
  awards: Award[];
  customSections: {
    id: string;
    title: string;
    content: string;
  }[];
  settings: CVStyleSettings;
  latexSource?: string;
  isCustomLatex?: boolean;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  subtitle: string;
  description: string;
  category: 'Corporate' | 'Technology' | 'Executive' | 'Consulting' | 'Academic';
  atsScore: string; // e.g. '98% ATS Optimal'
  fontPairing: string;
  recommendedFor: string;
  tags: string[];
}

export interface CoverLetterDocument {
  id: string;
  title: string;
  lastModified: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signoff: string;
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
  templateId: TemplateId;
}
