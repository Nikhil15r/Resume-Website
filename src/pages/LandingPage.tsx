import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Code2, CheckCircle2, Sliders, ShieldCheck, Download, Sparkles, BookOpen, Upload } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { TEMPLATES } from '../data/templates';
import { CVDocumentRenderer } from '../components/preview/CVDocumentRenderer';
import { TemplateId } from '../types/cv';
import { ResumeParserModal } from '../components/parser/ResumeParserModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDoc, createNewDoc, setTemplate } = useCV();
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<TemplateId>('corporate-classic');
  const [previewZoom, setPreviewZoom] = useState<number>(0.72);
  const [isParserOpen, setIsParserOpen] = useState(false);

  // Document clone for the live interactive hero preview
  const previewDoc = {
    ...currentDoc,
    settings: {
      ...currentDoc.settings,
      templateId: selectedPreviewTemplate
    }
  };

  const handleCreateNew = (templateId: TemplateId = 'corporate-classic') => {
    const id = createNewDoc(templateId);
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#0A0A0A] flex flex-col selection:bg-[#8C8172] selection:text-white">
      {/* 1. Hero Section: Editorial & Restrained */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E3DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            {/* Supertitle badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFEEEA] border border-[#E5E3DF] rounded-full text-[11px] font-sans tracking-[0.16em] uppercase text-[#807D7A] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C8172]"></span>
              The Minimalist Executive Studio
            </div>

            {/* Editorial Heading */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.02em] text-[#0A0A0A] leading-[1.08] mb-6">
              The Architecture of <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#8C8172]">Executive Distinction</span>
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-base sm:text-lg text-[#807D7A] font-sans font-normal leading-relaxed max-w-2xl mx-auto mb-8">
              Rethought from typography to typesetting. Craft curriculum vitae and leadership dossiers designed for corporate governance, multinational scrutiny, and Fortune 500 boards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => handleCreateNew('corporate-classic')}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-[#F5F5F3] text-xs uppercase tracking-[0.14em] font-medium rounded-sm transition-luxury shadow-subtle flex items-center justify-center gap-2 group"
              >
                <span>Create Your CV</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsParserOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#EFEEEA] text-[#0A0A0A] text-xs uppercase tracking-[0.14em] font-medium rounded-sm border border-[#D1CECA] transition-luxury flex items-center justify-center gap-2 shadow-2xs"
                title="Upload or paste any existing resume to parse"
              >
                <Upload className="w-4 h-4 text-[#8C8172]" />
                <span>Import / Parse CV</span>
              </button>

              <Link
                to="/templates"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#EFEEEA] hover:bg-[#E5E3DF] text-[#0A0A0A] text-xs uppercase tracking-[0.14em] font-medium rounded-sm border border-[#E5E3DF] transition-luxury flex items-center justify-center gap-2"
              >
                <span>Explore Templates</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Document Showcase */}
          <div className="max-w-5xl mx-auto bg-[#EFEEEA]/60 border border-[#E5E3DF] rounded-sm p-4 sm:p-8 backdrop-blur-sm shadow-floating">
            {/* Interactive Showcase Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-[#E5E3DF] gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.14em] text-[#807D7A] font-medium mr-2">
                  Live Preview Engine:
                </span>
                <div className="flex flex-wrap gap-1">
                  {TEMPLATES.slice(0, 3).map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedPreviewTemplate(tpl.id)}
                      className={`px-3 py-1 text-xs rounded-sm transition-luxury ${
                        selectedPreviewTemplate === tpl.id
                          ? 'bg-[#0A0A0A] text-white font-medium'
                          : 'bg-white text-[#807D7A] hover:text-[#0A0A0A] border border-[#E5E3DF]'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-[#807D7A]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>A4 Proportions • Real-Time Vector Render</span>
                </div>
                <button
                  onClick={() => handleCreateNew(selectedPreviewTemplate)}
                  className="px-3 py-1 bg-[#8C8172] hover:bg-[#786E60] text-white text-xs uppercase tracking-[0.1em] font-medium rounded-sm transition-colors"
                >
                  Edit This Design
                </button>
              </div>
            </div>

            {/* Document Canvas with Authentic Paper Shadow */}
            <div className="flex justify-center overflow-x-auto py-4 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm p-2 sm:p-6">
              <div className="transform scale-[0.68] sm:scale-[0.82] md:scale-[0.9] origin-top transition-all duration-300">
                <CVDocumentRenderer doc={previewDoc} zoom={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Template Showcase */}
      <section className="py-20 md:py-28 border-b border-[#E5E3DF] bg-[#F5F5F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#8C8172] font-semibold block mb-2">
                Disciplined Architecture
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0A0A0A] tracking-tight">
                Curated Executive Templates
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-[#807D7A] max-w-md">
              Six deliberate layouts calibrated for institutional review, ATS parsing engines, and multinational hiring standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                className="group bg-white border border-[#E5E3DF] hover:border-[#8C8172] rounded-sm p-6 transition-luxury flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C8172] bg-[#EFEEEA] px-2 py-0.5 rounded-sm">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium font-sans">
                      {tpl.atsScore}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#0A0A0A] group-hover:text-[#8C8172] transition-colors mb-1">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-[#807D7A] italic mb-3 font-serif">
                    {tpl.subtitle}
                  </p>
                  <p className="text-xs text-[#4A4845] leading-relaxed mb-4">
                    {tpl.description}
                  </p>
                  <div className="pt-3 border-t border-[#E5E3DF] text-[11px] text-[#807D7A] space-y-1 mb-5">
                    <div><span className="font-medium text-[#0A0A0A]">Ideal For:</span> {tpl.recommendedFor}</div>
                    <div><span className="font-medium text-[#0A0A0A]">Typography:</span> {tpl.fontPairing}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={() => handleCreateNew(tpl.id)}
                    className="flex-1 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-[0.12em] font-medium rounded-sm transition-colors text-center"
                  >
                    Use Template
                  </button>
                  <Link
                    to="/templates"
                    className="p-2 border border-[#E5E3DF] hover:bg-[#EFEEEA] rounded-sm text-[#0A0A0A] text-xs"
                    title="Inspect details"
                  >
                    <BookOpen className="w-4 h-4 text-[#807D7A]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Dual Engine Philosophy: Visual vs. LaTeX */}
      <section className="py-20 md:py-28 border-b border-[#E5E3DF] bg-[#EFEEEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#8C8172] font-semibold block mb-2">
              Uncompromising Dual-Engine Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0A0A0A] tracking-tight mb-4">
              Structured Simplicity Meets Raw LaTeX Power
            </h2>
            <p className="text-sm sm:text-base text-[#807D7A] leading-relaxed">
              Never choose between the convenience of visual forms and the absolute typographical authority of LaTeX. Atelier CV seamlessly synchronizes both in a single studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Visual Editor Column */}
            <div className="bg-white border border-[#E5E3DF] p-8 rounded-sm">
              <div className="w-10 h-10 rounded-sm bg-[#EFEEEA] flex items-center justify-center text-[#0A0A0A] mb-5">
                <FileText className="w-5 h-5 text-[#8C8172]" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#0A0A0A] mb-2">
                Executive Visual Suite
              </h3>
              <p className="text-xs text-[#807D7A] mb-6">
                Designed for speed, clarity, and zero cognitive overhead.
              </p>
              <ul className="space-y-3 text-xs text-[#3A3937] font-sans">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Structured form fields with instant live-sync preview.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Integrated executive action verbiage and bullet polishers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>One-click formatting, paper size switching, and style presets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Automatic background synchronization into pure LaTeX code.</span>
                </li>
              </ul>
            </div>

            {/* LaTeX Studio Column */}
            <div className="bg-[#0A0A0A] text-[#F5F5F3] p-8 rounded-sm">
              <div className="w-10 h-10 rounded-sm bg-[#222] flex items-center justify-center text-[#8C8172] mb-5">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-white mb-2">
                Full LaTeX Studio
              </h3>
              <p className="text-xs text-[#807D7A] mb-6">
                For researchers, engineers, and typography purists.
              </p>
              <ul className="space-y-3 text-xs text-[#D1CECA] font-sans">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Dedicated code editor with syntax highlighting and line numbers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Realistic TeX compilation engine with comprehensive diagnostics and logs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Non-destructive editing: your custom TeX source is never overwritten.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C8172] shrink-0 mt-0.5" />
                  <span>Direct .tex download and complete Overleaf-ready ZIP packaging.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section className="py-20 md:py-28 border-b border-[#E5E3DF] bg-[#F5F5F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 bg-white border border-[#E5E3DF] rounded-sm">
              <ShieldCheck className="w-6 h-6 text-[#8C8172] mb-4" />
              <h4 className="font-serif text-lg font-medium text-[#0A0A0A] mb-2">
                Strict ATS Compliance
              </h4>
              <p className="text-xs text-[#807D7A] leading-relaxed">
                Clean semantic hierarchies and standard text encodings pass enterprise applicant tracking systems without parse degradation.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E5E3DF] rounded-sm">
              <Sliders className="w-6 h-6 text-[#8C8172] mb-4" />
              <h4 className="font-serif text-lg font-medium text-[#0A0A0A] mb-2">
                A4 &amp; US Letter Precision
              </h4>
              <p className="text-xs text-[#807D7A] leading-relaxed">
                Accurate physical dimensions ensure your exported documents match on-screen previews with zero unexpected page breaks.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E5E3DF] rounded-sm">
              <Download className="w-6 h-6 text-[#8C8172] mb-4" />
              <h4 className="font-serif text-lg font-medium text-[#0A0A0A] mb-2">
                True 1:1 Vector Export
              </h4>
              <p className="text-xs text-[#807D7A] leading-relaxed">
                Export crystalline vector PDFs, raw LaTeX packages, or structured JSON backups with a single stroke.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E5E3DF] rounded-sm">
              <Sparkles className="w-6 h-6 text-[#8C8172] mb-4" />
              <h4 className="font-serif text-lg font-medium text-[#0A0A0A] mb-2">
                Quiet Distinction
              </h4>
              <p className="text-xs text-[#807D7A] leading-relaxed">
                Free of garish skill-rating bars, childish emojis, and decorative clutter. Only serious typographic authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Luxury Footer */}
      <footer className="py-12 bg-[#0A0A0A] text-[#807D7A] border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#222]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-sm bg-white text-[#0A0A0A] flex items-center justify-center font-serif font-bold text-xs">
                A
              </div>
              <span className="font-serif text-lg tracking-wider text-white">ATELIER CV</span>
              <span className="text-[10px] font-mono tracking-widest text-[#8C8172] ml-2">EDITION 2026</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#807D7A]">
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
              <Link to="/latex" className="hover:text-white transition-colors">LaTeX Studio</Link>
              <Link to="/cover-letters" className="hover:text-white transition-colors">Cover Letters</Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#666] gap-4">
            <div>
              &copy; {new Date().getFullYear()} Atelier CV Studio. Crafted for senior executives, researchers, and leaders.
            </div>
            <div className="font-mono text-[10px] text-[#8C8172]">
              PROPORTIONS: A4 / LETTER • STANDARDS: HARVARD / MIT / MCKINSEY
            </div>
          </div>
        </div>
      </footer>

      {/* Universal Resume Parser Modal */}
      <ResumeParserModal
        isOpen={isParserOpen}
        onClose={() => setIsParserOpen(false)}
        targetMode="new"
      />
    </div>
  );
};
