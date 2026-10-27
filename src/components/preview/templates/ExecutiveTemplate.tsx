import React from 'react';
import { CVDocument } from '../../../types/cv';

export const ExecutiveTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, awards } = doc;

  return (
    <div className="text-[#0A0A0A] font-serif text-[10pt] leading-[1.45] tracking-[0.01em] p-[44pt] bg-white min-h-full">
      {/* Executive Letterhead Header */}
      <header className="pb-4 mb-4 border-b-2 border-[#0A0A0A]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[28pt] font-semibold tracking-[-0.02em] text-[#0A0A0A] uppercase leading-none">
              {personalInfo.fullName}
            </h1>
            <p className="text-[12pt] italic text-[#8C8172] font-serif mt-1">
              {personalInfo.title}
            </p>
          </div>
          <div className="text-right text-[8.5pt] font-sans text-[#4A4845] space-y-0.5">
            <div className="font-medium text-[#0A0A0A]">{personalInfo.location}</div>
            <div>{personalInfo.email}</div>
            <div>{personalInfo.phone}</div>
            {personalInfo.linkedin && <div className="text-[#8C8172]">{personalInfo.linkedin}</div>}
          </div>
        </div>
      </header>

      {/* Executive Summary with Pull-Quote Style */}
      {summary && (
        <section className="mb-4 pl-4 border-l-2 border-[#8C8172] py-1 bg-[#FBFBFA]">
          <p className="text-[9.5pt] text-[#2A2927] leading-[1.5] italic font-serif">
            &ldquo;{summary}&rdquo;
          </p>
        </section>
      )}

      {/* Core Competencies Matrix */}
      {skills.length > 0 && (
        <section className="mb-4">
          <div className="text-[10pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
            Executive Core Competencies & Governance
          </div>
          <div className="grid grid-cols-3 gap-3 font-sans text-[8.5pt] bg-[#F5F5F3] p-3 rounded-sm border border-[#E5E3DF]">
            {skills.map(sk => (
              <div key={sk.id}>
                <div className="font-semibold text-[#0A0A0A] border-b border-[#D1CECA] pb-0.5 mb-1.5 text-[8.5pt]">
                  {sk.category}
                </div>
                <ul className="space-y-1 text-[#333]">
                  {sk.items.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-1 h-1 rounded-full bg-[#8C8172] mr-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Executive Career History */}
      {experience.length > 0 && (
        <section className="mb-4">
          <div className="text-[10pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
            Executive Career History & P&amp;L Leadership
          </div>
          <div className="space-y-3.5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[11pt] text-[#0A0A0A]">{exp.role}</span>
                  <span className="text-[9pt] font-sans font-medium text-[#4A4845]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1 text-[9.5pt]">
                  <span className="italic font-serif text-[#8C8172]">{exp.company}</span>
                  <span className="text-[8.5pt] font-sans text-[#807D7A]">{exp.location}</span>
                </div>
                {exp.description && (
                  <p className="text-[9pt] font-sans text-[#333] mb-1 leading-snug">
                    {exp.description}
                  </p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[8.5pt] font-sans text-[#1A1A1A]">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Strategic Initiatives */}
      {projects.length > 0 && (
        <section className="mb-4">
          <div className="text-[10pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
            Transformational Programs & Architecture
          </div>
          <div className="space-y-2">
            {projects.map(proj => (
              <div key={proj.id} className="text-[8.5pt] font-sans">
                <div className="flex justify-between font-semibold text-[#0A0A0A]">
                  <span>{proj.title} <span className="font-normal italic text-[#8C8172]">({proj.role})</span></span>
                  <span className="text-[8pt] text-[#807D7A]">{proj.startDate} – {proj.endDate}</span>
                </div>
                <p className="text-[#333] my-0.5">{proj.description}</p>
                {proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[8pt] text-[#444]">
                    {proj.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Honors */}
      {education.length > 0 && (
        <section className="mb-3">
          <div className="text-[10pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-1.5 border-b border-[#E5E3DF]">
            Education &amp; Academic Distinctions
          </div>
          <div className="grid grid-cols-2 gap-4 text-[9pt] font-sans">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="font-semibold text-[#0A0A0A]">{edu.school}</div>
                <div className="text-[#4A4845]">{edu.degree}, {edu.field}</div>
                <div className="text-[8pt] text-[#807D7A]">{edu.location} • {edu.startDate} – {edu.endDate}</div>
                {edu.honors && <div className="text-[8pt] text-[#8C8172] mt-0.5">{edu.honors}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Board & Awards */}
      {awards.length > 0 && (
        <section className="pt-2 border-t border-[#E5E3DF] text-[8.5pt] font-sans text-[#4A4845]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0A0A0A]">Distinctions:</span>
            {awards.map(a => (
              <span key={a.id}>{a.title} ({a.organization})</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
