import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, ArrowRight, Eye, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { TEMPLATES } from '../data/templates';
import { TemplateId, TemplateDefinition } from '../types/cv';
import { CVDocumentRenderer } from '../components/preview/CVDocumentRenderer';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDoc, createNewDoc } = useCV();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateDefinition | null>(null);

  const categories = ['All', 'Corporate', 'Technology', 'Executive', 'Consulting', 'Academic'];

  const filteredTemplates = TEMPLATES.filter(tpl => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: TemplateId) => {
    const newId = createNewDoc(templateId);
    navigate(`/editor/${newId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#0A0A0A] py-10 sm:py-16 selection:bg-[#8C8172] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFEEEA] border border-[#E5E3DF] rounded-full text-[11px] font-sans tracking-[0.16em] uppercase text-[#807D7A] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C8172]"></span>
            Authentic Typography &amp; Typesetting
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#0A0A0A] tracking-tight mb-4">
            Executive Template Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#807D7A] font-sans max-w-2xl mx-auto">
            Six disciplined document architectures crafted for high-stakes corporate applications, institutional boards, and technical leadership scrutiny.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E5E3DF]">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.1em] font-medium rounded-sm transition-luxury ${
                  selectedCategory === cat
                    ? 'bg-[#0A0A0A] text-white shadow-subtle'
                    : 'bg-white text-[#807D7A] hover:text-[#0A0A0A] border border-[#E5E3DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#807D7A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates or roles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs focus:outline-none focus:border-[#8C8172] transition-colors"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(tpl => {
            // Virtual document with this template layout
            const sampleDoc = {
              ...currentDoc,
              settings: {
                ...currentDoc.settings,
                templateId: tpl.id
              }
            };

            return (
              <div
                key={tpl.id}
                className="group bg-white border border-[#E5E3DF] hover:border-[#8C8172] rounded-sm p-5 transition-luxury flex flex-col justify-between shadow-subtle hover:shadow-paper-lg"
              >
                <div>
                  {/* Live Rendered Document Preview Thumbnail */}
                  <div 
                    onClick={() => setPreviewingTemplate(tpl)}
                    className="w-full h-72 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm overflow-hidden mb-5 relative cursor-pointer group-hover:bg-[#EFEEEA] transition-colors flex justify-center items-start pt-3"
                  >
                    <div className="transform scale-[0.32] origin-top pointer-events-none select-none shadow-md">
                      <CVDocumentRenderer doc={sampleDoc} zoom={1} showPageBorders={false} />
                    </div>

                    {/* Quick View Pill */}
                    <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs uppercase tracking-widest font-medium">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Preview</span>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex gap-1 pointer-events-none">
                      <span className="bg-white/95 backdrop-blur-sm border border-[#E5E3DF] px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase text-[#8C8172]">
                        {tpl.category}
                      </span>
                    </div>
                  </div>

                  {/* Template Meta */}
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-serif text-2xl font-medium text-[#0A0A0A] group-hover:text-[#8C8172] transition-colors">
                      {tpl.name}
                    </h3>
                    <span className="text-[10px] text-emerald-800 font-medium font-sans">
                      {tpl.atsScore}
                    </span>
                  </div>

                  <p className="text-xs text-[#807D7A] italic mb-3 font-serif">
                    {tpl.subtitle}
                  </p>

                  <p className="text-xs text-[#4A4845] leading-relaxed mb-4">
                    {tpl.description}
                  </p>

                  {/* Attributes list */}
                  <div className="pt-3 border-t border-[#E5E3DF] space-y-1.5 text-[11px] text-[#807D7A] mb-5">
                    <div>
                      <span className="font-medium text-[#0A0A0A]">Target Candidates: </span>
                      <span>{tpl.recommendedFor}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#0A0A0A]">Typography: </span>
                      <span>{tpl.fontPairing}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#E5E3DF]">
                  <button
                    onClick={() => handleUseTemplate(tpl.id)}
                    className="flex-1 py-2.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-[#F5F5F3] text-xs uppercase tracking-[0.14em] font-medium rounded-sm transition-luxury flex items-center justify-center gap-2 shadow-subtle group/btn"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setPreviewingTemplate(tpl)}
                    className="p-2.5 border border-[#E5E3DF] hover:bg-[#EFEEEA] rounded-sm text-[#807D7A] hover:text-[#0A0A0A]"
                    title="Fullscreen Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Modal Preview Drawer */}
      {previewingTemplate && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#F5F5F3] rounded-sm border border-[#E5E3DF] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E3DF]">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#0A0A0A]">
                  {previewingTemplate.name}
                </h3>
                <p className="text-xs text-[#807D7A]">
                  {previewingTemplate.subtitle} • {previewingTemplate.atsScore}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUseTemplate(previewingTemplate.id)}
                  className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors"
                >
                  Create With This Template
                </button>
                <button
                  onClick={() => setPreviewingTemplate(null)}
                  className="p-2 rounded-sm hover:bg-[#EFEEEA] text-[#807D7A] hover:text-[#0A0A0A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Document Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-[#EFEEEA]/60">
              <div className="transform scale-[0.8] sm:scale-[0.9] origin-top">
                <CVDocumentRenderer
                  doc={{
                    ...currentDoc,
                    settings: {
                      ...currentDoc.settings,
                      templateId: previewingTemplate.id
                    }
                  }}
                  zoom={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
