import React from 'react';
import { CVDocument } from '../../../types/cv';

export const ModernProfessionalTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, publications, settings } = doc;

  const isA4 = settings.paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9;
  const heightMm = isA4 ? 297 : 279.4;

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* -------------------- PAGE 1 -------------------- */}
      <div
        id="cv-page-1"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-sans text-[9.5pt] leading-[1.5] tracking-[-0.01em] p-[40pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Modern Header */}
        <header className="pb-4 mb-4 border-b border-[#E5E3DF]">
          <div className="flex justify-between items-end gap-3">
            <div>
              <h1 className="text-[26pt] font-semibold tracking-[-0.03em] text-[#0A0A0A] leading-none mb-1.5">
                {personalInfo.fullName}
              </h1>
              <p className="text-[11pt] font-medium text-[#8C8172] tracking-[0.02em]">
                {personalInfo.title}
              </p>
            </div>
            <div className="text-right text-[8.5pt] text-[#807D7A] space-y-0.5">
              <div>{personalInfo.location}</div>
              <div>
                <a href={`mailto:${personalInfo.email}`} className="text-[#0A0A0A] hover:underline font-medium">
                  {personalInfo.email}
                </a>
                <span className="mx-1.5 text-[#D1CECA]">/</span>
                <span>{personalInfo.phone}</span>
              </div>
              {(personalInfo.linkedin || personalInfo.website) && (
                <div className="text-[#8C8172]">
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                  {personalInfo.linkedin && personalInfo.website && <span className="mx-1.5 text-[#D1CECA]">/</span>}
                  {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-4">
            <p className="text-[9.2pt] text-[#4A4845] leading-[1.55]">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-2">
            <h2 className="text-[9pt] font-semibold uppercase tracking-[0.14em] text-[#8C8172] mb-3">
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-3 border-l-2 border-[#E5E3DF]">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-[10pt] text-[#0A0A0A]">{exp.role}</h3>
                    <span className="text-[8.5pt] text-[#807D7A] font-medium">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[8.8pt] font-medium text-[#8C8172] mb-1">
                    {exp.company} <span className="text-[#D1CECA] font-normal">•</span> <span className="text-[#807D7A] font-normal">{exp.location}</span>
                  </div>
                  {exp.description && (
                    <p className="text-[8.5pt] text-[#4A4845] mb-1">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.length > 0 && (
                    <div className="space-y-1 text-[8.5pt] text-[#2A2927]">
                      {exp.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-start text-left gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8C8172] mt-1.5 shrink-0 select-none"></span>
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

        <div className="absolute bottom-4 right-8 text-[8pt] text-[#807D7A]">
          Page 1 of 2
        </div>
      </div>

      {/* -------------------- PAGE 2 -------------------- */}
      <div
        id="cv-page-2"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-sans text-[9.5pt] leading-[1.5] tracking-[-0.01em] p-[40pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Running Header */}
        <div className="flex justify-between items-baseline pb-2.5 mb-4 border-b border-[#E5E3DF] text-[8.5pt] text-[#807D7A]">
          <span className="font-semibold text-[#0A0A0A] tracking-tight">{personalInfo.fullName}</span>
          <span className="text-[#8C8172]">{personalInfo.title}</span>
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {education.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-semibold uppercase tracking-[0.14em] text-[#8C8172] mb-2.5">
                Education
              </h2>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-semibold text-[9.5pt] text-[#0A0A0A]">{edu.school}</div>
                    <div className="text-[8.8pt] text-[#4A4845]">{edu.degree}, {edu.field}</div>
                    <div className="flex justify-between text-[8pt] text-[#807D7A] mt-0.5">
                      <span>{edu.location}</span>
                      <span>{edu.startDate} – {edu.endDate}</span>
                    </div>
                    {edu.honors && (
                      <div className="text-[8pt] text-[#8C8172] mt-0.5">{edu.honors}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-semibold uppercase tracking-[0.14em] text-[#8C8172] mb-2.5">
                Core Capabilities
              </h2>
              <div className="space-y-2.5">
                {skills.map(sk => (
                  <div key={sk.id}>
                    <div className="text-[8.5pt] font-semibold text-[#0A0A0A] mb-1">{sk.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {sk.items.map((item, i) => (
                        <span key={i} className="text-[8pt] px-2 py-0.5 bg-[#EFEEEA] text-[#0A0A0A] rounded-sm border border-[#E5E3DF]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[9pt] font-semibold uppercase tracking-[0.14em] text-[#8C8172] mb-2.5">
              Key Strategic Initiatives
            </h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id} className="p-2.5 bg-[#FAFAF8] rounded border border-[#E5E3DF]">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-[9.5pt] text-[#0A0A0A]">{proj.title}</h3>
                    <span className="text-[8pt] text-[#807D7A]">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  <div className="text-[8.5pt] text-[#8C8172] mb-1">{proj.role}</div>
                  <p className="text-[8.5pt] text-[#4A4845] mb-1">{proj.description}</p>
                  {proj.highlights.length > 0 && (
                    <div className="space-y-0.5 text-[8pt] text-[#2A2927]">
                      {proj.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-[#8C8172] select-none">›</span>
                          <span className="flex-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Publications */}
        {(certifications.length > 0 || publications.length > 0) && (
          <section className="pt-2 border-t border-[#E5E3DF]">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[8pt] text-[#807D7A]">
              {certifications.map(c => (
                <div key={c.id}>
                  <span className="font-medium text-[#0A0A0A]">{c.name}</span> ({c.issuer})
                </div>
              ))}
              {publications.map(p => (
                <div key={p.id}>
                  <span className="italic text-[#0A0A0A]">&ldquo;{p.title}&rdquo;</span> — {p.publisher}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="absolute bottom-4 right-8 text-[8pt] text-[#807D7A]">
          Page 2 of 2
        </div>
      </div>
    </div>
  );
};
