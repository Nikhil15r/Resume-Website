import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  X, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { CVDocument } from '../../types/cv';

interface ATSHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: CVDocument;
}

interface AuditCriterion {
  id: string;
  category: 'Contact' | 'Content' | 'Impact' | 'Structure';
  title: string;
  status: 'pass' | 'warn' | 'fail';
  score: number;
  maxScore: number;
  message: string;
  suggestion?: string;
}

export const ATSHealthCheckModal: React.FC<ATSHealthCheckModalProps> = ({
  isOpen,
  onClose,
  doc
}) => {
  if (!isOpen) return null;

  const { personalInfo, summary, experience, education, skills } = doc;

  // Run Real Audit Criteria
  const criteria: AuditCriterion[] = [];

  // 1. Contact Information
  const hasName = Boolean(personalInfo.fullName && personalInfo.fullName !== 'Candidate Name');
  const hasEmail = Boolean(personalInfo.email && personalInfo.email.includes('@'));
  const hasPhone = Boolean(personalInfo.phone && personalInfo.phone.replace(/\D/g, '').length >= 10);
  const hasLocation = Boolean(personalInfo.location && personalInfo.location.length >= 4);

  const contactScore = (hasName ? 5 : 0) + (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0) + (hasLocation ? 5 : 0);
  criteria.push({
    id: 'contact-completeness',
    category: 'Contact',
    title: 'Essential Contact Information',
    status: contactScore === 20 ? 'pass' : contactScore >= 10 ? 'warn' : 'fail',
    score: contactScore,
    maxScore: 20,
    message: contactScore === 20 
      ? 'All essential contact data (Name, Email, Phone, Location) are clearly specified.'
      : 'Missing key contact fields. ATS systems require complete contact headers.',
    suggestion: !hasLocation ? 'Add a location (City, State) to pass regional filters.' : undefined
  });

  // 2. Professional Summary
  const summaryWords = summary ? summary.trim().split(/\s+/).length : 0;
  const isSummaryOptimal = summaryWords >= 25 && summaryWords <= 120;
  const summaryScore = isSummaryOptimal ? 15 : summaryWords > 0 ? 8 : 0;
  criteria.push({
    id: 'summary-optimization',
    category: 'Content',
    title: 'Executive / Professional Summary',
    status: isSummaryOptimal ? 'pass' : summaryWords > 0 ? 'warn' : 'fail',
    score: summaryScore,
    maxScore: 15,
    message: isSummaryOptimal
      ? `Optimal summary length (${summaryWords} words) providing immediate candidate context.`
      : summaryWords === 0
      ? 'No professional summary found. An opening statement improves initial ranking.'
      : `Summary is ${summaryWords < 25 ? 'too short' : 'too long'} (${summaryWords} words). Aim for 30–80 words.`,
    suggestion: summaryWords < 25 ? 'Expand summary with your core specialization and years of experience.' : undefined
  });

  // 3. Work Experience & Date Ranges
  const hasExperience = experience.length > 0;
  const allHaveDates = hasExperience && experience.every(e => e.startDate && (e.endDate || e.current));
  const expScore = hasExperience ? (allHaveDates ? 20 : 12) : 0;
  criteria.push({
    id: 'experience-structure',
    category: 'Structure',
    title: 'Chronological Work History',
    status: expScore === 20 ? 'pass' : hasExperience ? 'warn' : 'fail',
    score: expScore,
    maxScore: 20,
    message: expScore === 20
      ? `${experience.length} work experience entries with valid chronological dates detected.`
      : 'Work history is missing or has incomplete employment dates.',
    suggestion: !allHaveDates ? 'Ensure all roles specify both start and end dates (e.g. 2022 – Present).' : undefined
  });

  // 4. Quantifiable Impact & Metrics
  let metricsCount = 0;
  let totalBullets = 0;
  const metricRegex = /\b\d+(?:\.\d+)?%|\$\d+(?:,\d{3})*(?:\.\d+)?|\b\d+\+?\s*(?:projects|teams|users|clients|engineers|millions|billions|k|x)\b/i;

  for (const exp of experience) {
    for (const ach of exp.achievements) {
      totalBullets++;
      if (metricRegex.test(ach) || /\b\d{2,}\b/.test(ach)) {
        metricsCount++;
      }
    }
  }

  const metricRatio = totalBullets > 0 ? metricsCount / totalBullets : 0;
  const impactScore = metricRatio >= 0.35 ? 20 : metricRatio > 0 ? 12 : 5;
  criteria.push({
    id: 'quantifiable-metrics',
    category: 'Impact',
    title: 'Measurable Metrics & Achievements',
    status: impactScore === 20 ? 'pass' : 'warn',
    score: impactScore,
    maxScore: 20,
    message: impactScore === 20
      ? `Strong quantifiable impact: ${metricsCount} of ${totalBullets} bullets feature measurable figures or KPIs.`
      : `${metricsCount} bullet points contain numbers or metrics. High-scoring ATS resumes quantify outcomes.`,
    suggestion: impactScore < 20 ? 'Add concrete numbers (e.g. "reduced latency by 30%", "managed $2M budget").' : undefined
  });

  // 5. Technical & Core Skills
  const totalSkillTags = skills.reduce((acc, cat) => acc + cat.items.length, 0);
  const isSkillsGood = totalSkillTags >= 8 && skills.length >= 2;
  const skillScore = isSkillsGood ? 15 : totalSkillTags > 0 ? 8 : 0;
  criteria.push({
    id: 'skills-categorization',
    category: 'Structure',
    title: 'Categorized Competencies & Skills',
    status: isSkillsGood ? 'pass' : totalSkillTags > 0 ? 'warn' : 'fail',
    score: skillScore,
    maxScore: 15,
    message: isSkillsGood
      ? `${totalSkillTags} skills organized into ${skills.length} distinct categories for keyword parsers.`
      : 'Insufficient skill keywords or uncategorized competencies.',
    suggestion: totalSkillTags < 8 ? 'Add 8+ relevant technical skills grouped by category.' : undefined
  });

  // 6. Education Credentials
  const hasEducation = education.length > 0 && education.every(e => e.school && e.degree);
  const eduScore = hasEducation ? 10 : education.length > 0 ? 5 : 0;
  criteria.push({
    id: 'education-credentials',
    category: 'Content',
    title: 'Academic Degrees & Education',
    status: hasEducation ? 'pass' : 'warn',
    score: eduScore,
    maxScore: 10,
    message: hasEducation
      ? `${education.length} verified degree program(s) with institution and credentials.`
      : 'Education section is missing or lacks institution/degree details.'
  });

  // Total Score Calculation
  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxPossible = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = Math.round((totalScore / maxPossible) * 100);

  const getScoreColor = (p: number) => {
    if (p >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (p >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-sm shadow-2xl border border-[#E5E3DF] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E3DF] flex items-center justify-between bg-[#F5F5F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#8C8172]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0A0A0A]">
                ATS Health &amp; Readiness Audit
              </h2>
              <p className="text-xs text-[#807D7A]">
                Automated document parsing diagnostics for corporate applicant tracking systems
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-[#E5E3DF] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Banner */}
          <div className={`p-5 rounded-sm border flex items-center justify-between ${getScoreColor(percentage)}`}>
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                Overall ATS Compatibility Score
              </div>
              <div className="font-serif text-3xl font-bold">
                {percentage}%
              </div>
              <div className="text-xs font-sans opacity-90">
                {percentage >= 85
                  ? 'Excellent structure. Resume contains clear headers, quantifiable outcomes, and complete metadata.'
                  : percentage >= 70
                  ? 'Good foundation. Address the suggested items below to maximize parsing accuracy.'
                  : 'Needs improvement. Key contact data, metrics, or sections are incomplete.'}
              </div>
            </div>

            <div className="text-right shrink-0 pl-4 border-l border-current/20">
              <div className="font-mono text-2xl font-bold">{totalScore}/{maxPossible}</div>
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-75">Points Earned</div>
            </div>
          </div>

          {/* Criteria Checklist */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#807D7A] font-semibold">
              Diagnostic Audit Breakdown
            </h3>

            <div className="space-y-2.5">
              {criteria.map(c => (
                <div 
                  key={c.id}
                  className="p-3.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm flex items-start gap-3 transition-colors hover:border-[#D1CECA]"
                >
                  <div className="mt-0.5 shrink-0">
                    {c.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {c.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {c.status === 'fail' && <XCircle className="w-4 h-4 text-red-600" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-xs text-[#0A0A0A]">
                        {c.title}
                      </div>
                      <div className="font-mono text-[11px] text-[#807D7A]">
                        {c.score}/{c.maxScore} pts
                      </div>
                    </div>

                    <p className="text-xs text-[#4A4845] leading-relaxed">
                      {c.message}
                    </p>

                    {c.suggestion && (
                      <div className="text-[11px] font-sans text-[#8C8172] bg-white px-2 py-1 rounded border border-[#E5E3DF] inline-flex items-center gap-1.5 mt-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span><strong>Recommendation:</strong> {c.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Compliance Notes */}
          <div className="p-4 bg-[#EFEEEA] border border-[#E5E3DF] rounded-sm text-xs text-[#4A4845] space-y-1.5">
            <div className="font-medium text-[#0A0A0A] flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
              <FileCheck className="w-3.5 h-3.5 text-[#8C8172]" />
              <span>ATS Technical Guarantees</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[#666]">
              <li>Single-column semantic hierarchy readable by Workday, Taleo, Greenhouse, and Lever.</li>
              <li>Standard character encoding without special unmapped glyphs or clipping.</li>
              <li>Clean chronological layout matching global corporate recruitment standards.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E5E3DF] bg-[#F5F5F3] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs font-mono uppercase tracking-wider font-medium rounded-sm transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
