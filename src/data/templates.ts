import { TemplateDefinition } from '../types/cv';

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    subtitle: 'Timeless Harvard & Fortune 500 standard',
    description: 'An authoritative single-column layout with traditional serif hierarchy, optimized for Fortune 500 leadership, finance, banking, and legal roles with 100% ATS readability.',
    category: 'Corporate',
    atsScore: '99% ATS Compliant',
    fontPairing: 'Cormorant Garamond + Plus Jakarta Sans',
    recommendedFor: 'Banking, Investment, Legal, Corporate Strategy, Operations Directors',
    tags: ['Single Column', 'High ATS', 'Classic Serif', 'Clean Dividers']
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    subtitle: 'Refined geometric simplicity for modern industry',
    description: 'Balanced visual cadence with subtle warm-stone rules, modern sans-serif typography, and structured modular sections for technology and product executives.',
    category: 'Corporate',
    atsScore: '97% ATS Compliant',
    fontPairing: 'Plus Jakarta Sans',
    recommendedFor: 'Product Managers, Engineering Leaders, Brand Directors, Operations',
    tags: ['Minimalist', 'High Readability', 'Modern Sans', 'Balanced Grid']
  },
  {
    id: 'executive',
    name: 'Executive',
    subtitle: 'Editorial gravitas for C-suite and board members',
    description: 'A distinguished executive dossier featuring a prominent letterhead header, core competencies grid, governance highlights, and strategic transformation metrics.',
    category: 'Executive',
    atsScore: '95% ATS Compliant',
    fontPairing: 'Cormorant Garamond (Editorial) + Sans',
    recommendedFor: 'Chief Executives, VP / EVP, Managing Directors, Board Advisors',
    tags: ['Board Ready', 'Competency Grid', 'Editorial Letterhead', 'Executive Summary']
  },
  {
    id: 'technical-resume',
    name: 'Technical Resume',
    subtitle: 'High-density systems architecture & engineering format',
    description: 'Precision-engineered for Staff/Principal Software Engineers, AI Researchers, and Engineering Directors. Features strict skill categorization and quantified impact metrics.',
    category: 'Technology',
    atsScore: '98% ATS Compliant',
    fontPairing: 'Plus Jakarta Sans + JetBrains Mono',
    recommendedFor: 'Staff/Principal Engineers, AI/ML Scientists, Tech Leads, Cloud Architects',
    tags: ['High Density', 'Tech Stack Badges', 'System Metrics', 'Mono Accents']
  },
  {
    id: 'consulting',
    name: 'Consulting',
    subtitle: 'McKinsey, BCG & Bain engagement case structure',
    description: 'Crafted around the structured Hypothesis-Impact-Outcome framework. Emphasizes client leadership, revenue acceleration, cost optimizations, and cross-functional steerco impact.',
    category: 'Consulting',
    atsScore: '98% ATS Compliant',
    fontPairing: 'Cormorant Garamond + Plus Jakarta Sans',
    recommendedFor: 'Strategy Consultants, Management Advisors, Private Equity, Growth Leads',
    tags: ['Case-Driven', 'Financial Metrics', 'Structured Impact', 'Clean Headers']
  },
  {
    id: 'academic-cv',
    name: 'Academic CV',
    subtitle: 'Scholarly curriculum vitae for research and faculty',
    description: 'Rigorous multi-page format highlighting peer-reviewed publications, teaching appointments, federal research grants, international colloquia, and academic honors.',
    category: 'Academic',
    atsScore: '96% ATS Compliant',
    fontPairing: 'Cormorant Garamond (Scholarly)',
    recommendedFor: 'Professors, Postdoctoral Researchers, Fellows, Ph.D. Candidates',
    tags: ['Multi-Page', 'Citation Formats', 'Grant Tracking', 'Faculty Standard']
  }
];
