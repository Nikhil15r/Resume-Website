import { TemplateDefinition } from '../types/cv';

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    subtitle: 'Timeless single-column corporate standard',
    description: 'An authoritative single-column layout with traditional serif hierarchy. Optimized for finance, corporate strategy, operations, business analysis, and general industry applications.',
    category: 'Corporate',
    atsScore: 'Single-Column ATS Standard',
    fontPairing: 'Cormorant Garamond + Plus Jakarta Sans',
    recommendedFor: 'Business Analysts, Finance, Operations, Project Managers, Corporate Professionals',
    tags: ['Single Column', 'ATS Standard', 'Classic Serif', 'Clean Dividers']
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    subtitle: 'Refined geometric simplicity for modern industry',
    description: 'Balanced visual cadence with subtle warm-stone rules, modern sans-serif typography, and structured modular sections for technology, product, and cross-functional teams.',
    category: 'Corporate',
    atsScore: 'High-Readability Sans',
    fontPairing: 'Plus Jakarta Sans',
    recommendedFor: 'Product Managers, Designers, Marketing, Operations, Technology Specialists',
    tags: ['Minimalist', 'High Readability', 'Modern Sans', 'Balanced Grid']
  },
  {
    id: 'executive',
    name: 'Executive',
    subtitle: 'Editorial gravitas for senior leadership and directors',
    description: 'A distinguished dossier featuring a prominent letterhead header, core competencies grid, governance highlights, and strategic transformation metrics.',
    category: 'Executive',
    atsScore: 'Leadership Layout',
    fontPairing: 'Cormorant Garamond (Editorial) + Sans',
    recommendedFor: 'Directors, Vice Presidents, Senior Managers, Department Heads, Strategy Leads',
    tags: ['Leadership', 'Competency Grid', 'Editorial Letterhead', 'Executive Summary']
  },
  {
    id: 'technical-resume',
    name: 'Technical Resume',
    subtitle: 'High-density systems architecture & engineering format',
    description: 'Precision-engineered for Software Developers, DevOps/Cloud Engineers, Data Scientists, and Engineering Leads. Features strict skill categorization and quantified impact metrics.',
    category: 'Technology',
    atsScore: 'Tech Keyword Optimized',
    fontPairing: 'Plus Jakarta Sans + JetBrains Mono',
    recommendedFor: 'Software Developers, Full Stack Engineers, DevOps, Data Scientists, Architects',
    tags: ['High Density', 'Tech Stack Badges', 'System Metrics', 'Mono Accents']
  },
  {
    id: 'consulting',
    name: 'Consulting',
    subtitle: 'Structured engagement & outcome framework',
    description: 'Crafted around the structured Hypothesis-Impact-Outcome framework. Emphasizes client deliverables, project velocity, optimizations, and cross-functional teamwork.',
    category: 'Consulting',
    atsScore: 'Impact-Driven Layout',
    fontPairing: 'Cormorant Garamond + Plus Jakarta Sans',
    recommendedFor: 'Strategy Consultants, Management Advisors, Analysts, Growth Specialists',
    tags: ['Case-Driven', 'Financial Metrics', 'Structured Impact', 'Clean Headers']
  },
  {
    id: 'academic-cv',
    name: 'Academic CV',
    subtitle: 'Scholarly curriculum vitae for research and faculty',
    description: 'Rigorous multi-page format highlighting peer-reviewed publications, teaching appointments, research grants, colloquia, and academic credentials.',
    category: 'Academic',
    atsScore: 'Scholarly Publication Format',
    fontPairing: 'Cormorant Garamond (Scholarly)',
    recommendedFor: 'Professors, Postdoctoral Researchers, Fellows, Graduate Students, Scientists',
    tags: ['Multi-Page', 'Citation Formats', 'Grant Tracking', 'Faculty Standard']
  }
];
