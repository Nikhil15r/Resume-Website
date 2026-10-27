import React from 'react';
import { CVDocument } from '../../../types/cv';

export const ExecutiveTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, awards, settings } = doc;

  const isA4 = settings.paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9;
  const heightMm = isA4 ? 297 : 279.4;

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* -------------------- PAGE 1 -------------------- */}
      <div
        id="cv-page-1"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-serif text-[10pt] leading-[1.45] tracking-[0.01em] p-[40pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Executive Letterhead Header */}
        <header className="pb-3.5 mb-3.5 border-b-2 border-[#0A0A0A]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[26pt] font-semibold tracking-[-0.02em] text-[#0A0A0A] uppercase leading-none">
                {personalInfo.fullName}
              </h1>
              <p className="text-[11.5pt] italic text-[#8C8172] font-serif mt-1">
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
          <section className="mb-3.5 pl-3.5 border-l-2 border-[#8C8172] py-1 bg-[#FBFBFA]">
            <p className="text-[9.2pt] text-[#2A2927] leading-[1.5] italic font-serif">
              &ldquo;{summary}&rdquo;
            </p>
          </section>
        )}

        {/* Core Competencies Matrix */}
        {skills.length > 0 && (
          <section className="mb-3.5">
            <div className="text-[9.5pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
              Executive Core Competencies &amp; Governance
            </div>
            <div className="grid grid-cols-3 gap-3 font-sans text-[8.2pt] bg-[#F5F5F3] p-3 rounded-sm border border-[#E5E3DF]">
              {skills.map(sk => (
                <div key={sk.id}>
                  <div className="font-semibold text-[#0A0A0A] border-b border-[#D1CECA] pb-0.5 mb-1.5 text-[8.2pt]">
                    {sk.category}
                  </div>
                  <div className="space-y-1 text-[#333]">
                    {sk.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#8C8172] shrink-0 select-none"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executive Career History (First Roles) */}
        {experience.length > 0 && (
          <section className="mb-2">
            <div className="text-[9.5pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
              Executive Career History &amp; P&amp;L Leadership
            </div>
            <div className="space-y-3.5">
              {experience.slice(0, 2).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[10.5pt] text-[#0A0A0A]">{exp.role}</span>
                    <span className="text-[8.5pt] font-sans font-medium text-[#4A4845]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1 text-[9pt]">
                    <span className="italic font-serif text-[#8C8172]">{exp.company}</span>
                    <span className="text-[8.5pt] font-sans text-[#807D7A]">{exp.location}</span>
                  </div>
                  {exp.description && (
                    <p className="text-[8.8pt] font-sans text-[#333] mb-1 leading-snug">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.length > 0 && (
                    <div className="space-y-1 text-[8.5pt] font-sans text-[#1A1A1A] ml-0.5">
                      {exp.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-start text-left gap-2.5">
                          <span className="w-2.5 shrink-0 text-center select-none text-[#0A0A0A] font-serif text-[11pt] leading-[1.25]">
                            •
                          </span>
                          <span className="leading-relaxed flex-1">{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="absolute bottom-4 right-8 text-[8pt] font-serif text-[#807D7A]">
          Page 1 of 2
        </div>
      </div>

      {/* -------------------- PAGE 2 -------------------- */}
      <div
        id="cv-page-2"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-serif text-[10pt] leading-[1.45] tracking-[0.01em] p-[40pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Running Header */}
        <div className="flex justify-between items-baseline pb-2.5 mb-4 border-b border-[#0A0A0A] text-[9pt] font-sans text-[#666]">
          <span className="font-serif font-semibold text-[#0A0A0A] uppercase tracking-wider">
            {personalInfo.fullName}
          </span>
          <span className="italic font-serif">{personalInfo.title}</span>
        </div>

        {/* Remaining Experience */}
        {experience.length > 2 && (
          <section className="mb-4">
            <div className="text-[9.5pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
              Career History (Continued)
            </div>
            <div className="space-y-3">
              {experience.slice(2).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[10.5pt] text-[#0A0A0A]">{exp.role}</span>
                    <span className="text-[8.5pt] font-sans font-medium text-[#4A4845]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1 text-[9pt]">
                    <span className="italic font-serif text-[#8C8172]">{exp.company}</span>
                    <span className="text-[8.5pt] font-sans text-[#807D7A]">{exp.location}</span>
                  </div>
                  {exp.achievements.length > 0 && (
                    <div className="space-y-1 text-[8.5pt] font-sans text-[#1A1A1A] ml-0.5">
                      {exp.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-start text-left gap-2.5">
                          <span className="w-2.5 shrink-0 text-center select-none text-[#0A0A0A] font-serif text-[11pt] leading-[1.25]">
                            •
                          </span>
                          <span className="leading-relaxed flex-1">{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transformational Programs & Architecture */}
        {projects.length > 0 && (
          <section className="mb-4">
            <div className="text-[9.5pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
              Transformational Programs &amp; Architecture
            </div>
            <div className="space-y-2.5">
              {projects.map(proj => (
                <div key={proj.id} className="text-[8.5pt] font-sans">
                  <div className="flex justify-between font-semibold text-[#0A0A0A]">
                    <span>
                      {proj.title} <span className="font-normal italic text-[#8C8172]">({proj.role})</span>
                    </span>
                    <span className="text-[8pt] text-[#807D7A]">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  <p className="text-[#333] my-0.5">{proj.description}</p>
                  {proj.highlights.length > 0 && (
                    <div className="space-y-0.5 text-[8pt] text-[#444] ml-0.5">
                      {proj.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-2 shrink-0 text-center select-none text-[#0A0A0A] font-serif">•</span>
                          <span className="flex-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Academic Distinctions */}
        {education.length > 0 && (
          <section className="mb-4">
            <div className="text-[9.5pt] font-bold uppercase tracking-[0.12em] text-[#0A0A0A] pb-1 mb-2 border-b border-[#E5E3DF]">
              Education &amp; Academic Distinctions
            </div>
            <div className="grid grid-cols-2 gap-4 text-[8.8pt] font-sans">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="font-semibold text-[#0A0A0A]">{edu.school}</div>
                  <div className="text-[#4A4845]">{edu.degree}, {edu.field}</div>
                  <div className="text-[8pt] text-[#807D7A]">
                    {edu.location} • {edu.startDate} – {edu.endDate}
                  </div>
                  {edu.honors && <div className="text-[8pt] text-[#8C8172] mt-0.5">{edu.honors}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Board & Awards */}
        {(awards.length > 0 || certifications.length > 0) && (
          <section className="pt-2 border-t border-[#E5E3DF] text-[8.2pt] font-sans text-[#4A4845]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-[#0A0A0A]">Distinctions &amp; Accreditations:</span>
              {awards.map(a => (
                <span key={a.id}>
                  {a.title} ({a.organization})
                </span>
              ))}
              {certifications.map(c => (
                <span key={c.id}>
                  {c.name} — {c.issuer}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="absolute bottom-4 right-8 text-[8pt] font-serif text-[#807D7A]">
          Page 2 of 2
        </div>
      </div>
    </div>
  );
};
