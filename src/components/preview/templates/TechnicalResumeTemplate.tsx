import React from 'react';
import { CVDocument } from '../../../types/cv';

const TechnicalSectionHeader: React.FC<{ title: string; className?: string }> = ({ title, className = 'mb-2.5' }) => (
  <div className={`pb-1 border-b border-[#0A0A0A] ${className}`}>
    <h2 className="text-[9pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] leading-normal select-none">
      {title}
    </h2>
  </div>
);

export const TechnicalResumeTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, settings } = doc;

  const isA4 = settings.paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9;
  const heightMm = isA4 ? 297 : 279.4;

  const contactItems = [
    personalInfo.location,
    personalInfo.email,
    personalInfo.phone,
    personalInfo.github,
    personalInfo.linkedin
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* -------------------- PAGE 1 -------------------- */}
      <div
        id="cv-page-1"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-sans text-[9pt] leading-[1.4] p-[38pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <header className="pb-3 mb-3 border-b-2 border-[#0A0A0A]">
          <div className="flex justify-between items-baseline">
            <h1 className="text-[22pt] font-bold tracking-tight text-[#0A0A0A]">
              {personalInfo.fullName}
            </h1>
            <span className="font-mono text-[9pt] text-[#4A4845]">
              {personalInfo.title}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-y-1 text-[8pt] font-mono text-[#4A4845] mt-1">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2 text-[#807D7A] select-none">•</span>}
                {item?.includes('@') ? (
                  <a href={`mailto:${item}`} className="text-[#0A0A0A] underline">
                    {item}
                  </a>
                ) : (
                  <span>{item}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Technical Summary */}
        {summary && (
          <section className="mb-3.5">
            <p className="text-[8.8pt] text-[#2A2927] leading-[1.45]">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Proficiencies */}
        {skills.length > 0 && (
          <section className="mb-4">
            <TechnicalSectionHeader title="Technical Proficiencies & Architecture" />
            <div className="space-y-1.5 text-[8.5pt]">
              {skills.map(sk => (
                <div key={sk.id} className="grid grid-cols-[160px_1fr] items-baseline">
                  <span className="font-semibold text-[#0A0A0A]">{sk.category}:</span>
                  <span className="font-mono text-[8pt] text-[#333]">
                    {sk.items.join('  •  ')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-2">
            <TechnicalSectionHeader title="Engineering & Systems Experience" />
            <div className="space-y-3.5">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline leading-tight">
                    <div className="font-bold text-[9.5pt] text-[#0A0A0A]">
                      {exp.role} <span className="font-normal text-[#666]">at</span> {exp.company}
                    </div>
                    <div className="font-mono text-[8pt] text-[#4A4845]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div className="text-[8pt] text-[#807D7A] font-mono mt-0.5 mb-1">
                    {exp.location}
                  </div>
                  {exp.achievements.length > 0 && (
                    <div className="space-y-1 text-[8.5pt] text-[#1A1A1A] ml-0.5">
                      {exp.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-start text-left gap-2.5">
                          <span className="w-2.5 shrink-0 text-center select-none text-[#0A0A0A] font-mono text-[9pt] leading-[1.3]">
                            ▪
                          </span>
                          <span className="leading-snug flex-1">{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="absolute bottom-4 right-8 text-[8pt] font-mono text-[#807D7A] select-none">
          Page 1 of 2
        </div>
      </div>

      {/* -------------------- PAGE 2 -------------------- */}
      <div
        id="cv-page-2"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-sans text-[9pt] leading-[1.4] p-[38pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Running Header */}
        <div className="flex justify-between items-baseline pb-2 mb-3.5 border-b border-[#0A0A0A] text-[8.5pt] font-mono text-[#666]">
          <span className="font-bold text-[#0A0A0A]">{personalInfo.fullName}</span>
          <span>{personalInfo.title}</span>
        </div>

        {/* Architectural Systems & Projects */}
        {projects.length > 0 && (
          <section className="mb-4">
            <TechnicalSectionHeader title="Architectural Systems & Open Source" />
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline leading-tight">
                    <span className="font-bold text-[9pt] text-[#0A0A0A]">
                      {proj.title}
                    </span>
                    <span className="font-mono text-[8pt] text-[#4A4845]">
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 mb-1">
                    <span className="text-[8pt] italic text-[#4A4845]">{proj.role}</span>
                    {proj.techStack && (
                      <span className="font-mono text-[7.5pt] text-[#8C8172] bg-[#F5F5F3] px-1.5 py-0.2 rounded border border-[#E5E3DF]">
                        {proj.techStack.join(', ')}
                      </span>
                    )}
                  </div>
                  <p className="text-[8.5pt] text-[#333] mb-1.5 leading-relaxed">{proj.description}</p>
                  {proj.highlights.length > 0 && (
                    <div className="space-y-0.5 text-[8pt] text-[#222] ml-0.5">
                      {proj.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-2.5 shrink-0 text-center select-none text-[#0A0A0A] font-mono">▪</span>
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

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-4">
            <TechnicalSectionHeader title="Education & Honors" />
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline text-[8.5pt] leading-tight">
                  <div>
                    <span className="font-bold text-[#0A0A0A]">{edu.school}</span> — <span>{edu.degree}, {edu.field}</span>
                    {edu.gpa && <span className="text-[#666] font-mono text-[8pt] ml-1.5">[{edu.gpa}]</span>}
                    {edu.honors && <div className="text-[8pt] text-[#666] mt-0.5">• {edu.honors}</div>}
                  </div>
                  <span className="font-mono text-[8pt] text-[#4A4845]">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="pt-2 border-t border-[#D1CECA] text-[8pt] font-mono text-[#4A4845] flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#0A0A0A]">CERTIFICATIONS:</span>
            {certifications.map(c => (
              <span key={c.id}>
                {c.name} ({c.issuer})
              </span>
            ))}
          </section>
        )}

        <div className="absolute bottom-4 right-8 text-[8pt] font-mono text-[#807D7A] select-none">
          Page 2 of 2
        </div>
      </div>
    </div>
  );
};
