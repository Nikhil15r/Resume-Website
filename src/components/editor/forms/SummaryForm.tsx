import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { useCV } from '../../../context/CVContext';

export const SummaryForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();

  const handlePolishTone = (tone: 'executive' | 'technical' | 'consulting') => {
    let enhanced = currentDoc.summary;
    if (tone === 'executive') {
      enhanced = `Strategic and transformational technology executive with 15+ years orchestrating global enterprise architecture, multi-region cloud resilience, and cross-functional engineering organizations (180+ staff). Proven track record driving $45M+ modernization programs, optimizing operational EBITDA by 34%, and governing mission-critical systems with 99.995% availability.`;
    } else if (tone === 'technical') {
      enhanced = `Principal distributed systems architect and technical leader with deep domain mastery in high-throughput transactional infrastructure, Kubernetes orchestration, and event-driven data streaming. Co-author of 3 US patents in consensus algorithms; led architecture scaling to 450,000 req/sec at sub-millisecond P99 latency.`;
    } else if (tone === 'consulting') {
      enhanced = `High-impact advisory leader specializing in digital business transformation, cloud CapEx/OpEx rationalization, and M&A technical due diligence. Steered Fortune 100 enterprise consolidation initiatives generating $6.2M in recurring annual COGS savings while mitigating critical security and governance risks.`;
    }
    updateField('summary', enhanced);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Executive Summary
          </h3>
          <p className="text-xs text-[#807D7A]">
            A high-level synthesis of your strategic leadership, mandate scope, and core career value.
          </p>
        </div>

        {/* Tone Polishers */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8172] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8C8172]" /> Tone Assist:
          </span>
          <button
            type="button"
            onClick={() => handlePolishTone('executive')}
            className="px-2 py-1 bg-white hover:bg-[#EFEEEA] border border-[#E5E3DF] text-[10px] text-[#0A0A0A] rounded-sm transition-colors"
          >
            Executive
          </button>
          <button
            type="button"
            onClick={() => handlePolishTone('technical')}
            className="px-2 py-1 bg-white hover:bg-[#EFEEEA] border border-[#E5E3DF] text-[10px] text-[#0A0A0A] rounded-sm transition-colors"
          >
            Technical
          </button>
          <button
            type="button"
            onClick={() => handlePolishTone('consulting')}
            className="px-2 py-1 bg-white hover:bg-[#EFEEEA] border border-[#E5E3DF] text-[10px] text-[#0A0A0A] rounded-sm transition-colors"
          >
            Advisory
          </button>
        </div>
      </div>

      <div>
        <textarea
          rows={7}
          value={currentDoc.summary}
          onChange={e => updateField('summary', e.target.value)}
          className="w-full p-3.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] leading-relaxed focus:outline-none focus:border-[#8C8172] transition-colors"
          placeholder="Craft a concise 3-4 sentence overview highlighting your executive pedigree..."
        />
        <div className="flex justify-between items-center text-[11px] text-[#807D7A] mt-1.5">
          <span>Target length: 50–90 words for optimal ATS and readability balance.</span>
          <span>{currentDoc.summary.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>
    </div>
  );
};
