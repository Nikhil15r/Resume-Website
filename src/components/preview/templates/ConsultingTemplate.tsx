import React from 'react';
import { CVDocument } from '../../../types/cv';

const ConsultingSectionHeader: React.FC<{ title: string; className?: string }> = ({ title, className = 'mb-2.5' }) => (
  <div className={`pb-1 border-b border-[#8C8172] ${className}`}>
    <h2 className="text-[10pt] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] leading-normal select-none">
      {title}
    </h2>
  </div>
);

export const ConsultingTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, awards, settings } = doc;

  const isA4 = settings.paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9;
  const heightMm = isA4 ? 297 : 279.4;

  const contactItems = [
    personalInfo.location,
    personalInfo.email,
    personalInfo.phone,
    personalInfo.linkedin
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* -------------------- PAGE 1 -------------------- */}
      <div
        id="cv-page-1"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-serif text-[10pt] leading-[1.45] p-[40pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <header className="text-center pb-3.5 mb-4 border-b border-[#0A0A0A]">
          <h1 className="text-[25pt] font-semibold tracking-[-0.01em] uppercase text-[#0A0A0A] leading-none mb-1">
            {personalInfo.fullName}
          </h1>
          <div className="text-[10pt] font-sans text-[#8C8172] font-medium tracking-[0.05em] uppercase mt-1 mb-2">
            {personalInfo.title}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-y-1 text-[8.5pt] font-sans text-[#4A4845]">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2 text-[#807D7A] select-none">|</span>}
                {item?.includes('@') ? (
                  <a href={`mailto:${item}`} className="text-[#0A0A0A] hover:underline font-medium">
                    {item}
                  </a>
                ) : (
                  <span>{item}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Strategic Profile */}
        {summary && (
          <section className="mb-4">
            <ConsultingSectionHeader title="Strategic Profile & Practice Focus" />
            <p className="text-[9pt] font-sans text-[#2A2927] leading-[1.5] text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Management & Advisory Engagements */}
        {experience.length > 0 && (
          <section className="mb-2">
            <ConsultingSectionHeader title="Management & Advisory Engagements" />
            <div className="space-y-3.5">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline leading-tight">
                    <span className="font-bold text-[10.5pt] text-[#0A0A0A] font-serif">{exp.role}</span>
                    <span className="text-[8.5pt] font-sans text-[#4A4845]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1 text-[9pt] font-sans mt-0.5">
                    <span className="font-semibold text-[#8C8172]">{exp.company}</span>
                    <span className="text-[#807D7A]">{exp.location}</span>
                  </div>
                  {exp.description && (
                    <p className="text-[8.5pt] font-sans italic text-[#4A4845] mb-1.5 leading-relaxed">
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

        <div className="absolute bottom-4 right-8 text-[8pt] font-serif text-[#807D7A] select-none">
          Page 1 of 2
        </div>
      </div>

      {/* -------------------- PAGE 2 -------------------- */}
      <div
        id="cv-page-2"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-serif text-[10pt] leading-[1.45] p-[40pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Running Header */}
        <div className="flex justify-between items-baseline pb-2 mb-4 border-b border-[#0A0A0A] text-[9pt] font-sans text-[#666]">
          <span className="font-serif font-semibold text-[#0A0A0A] uppercase tracking-wider">
            {personalInfo.fullName}
          </span>
          <span className="italic font-serif">{personalInfo.title}</span>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-4">
            <ConsultingSectionHeader title="Education & Credentials" />
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline leading-tight">
                    <span className="font-bold text-[10pt] text-[#0A0A0A] font-serif">{edu.school}</span>
                    <span className="text-[8.5pt] font-sans text-[#4A4845]">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9pt] font-sans text-[#333] mt-0.5">
                    <span>{edu.degree}, {edu.field}</span>
                    <span className="text-[#807D7A]">{edu.location}</span>
                  </div>
                  {edu.honors && (
                    <div className="text-[8pt] font-sans text-[#8C8172] mt-0.5">• {edu.honors}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Competencies & Advisory Domains */}
        {skills.length > 0 && (
          <section className="mb-4">
            <ConsultingSectionHeader title="Advisory Domains & Functional Expertise" />
            <div className="space-y-1.5 font-sans text-[8.5pt]">
              {skills.map(sk => (
                <div key={sk.id} className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-[#0A0A0A] shrink-0">{sk.category}:</span>
                  <span className="text-[#333]">{sk.items.join('  •  ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Engagement Cases */}
        {projects.length > 0 && (
          <section className="mb-4">
            <ConsultingSectionHeader title="Featured Engagement Cases & Initiatives" />
            <div className="space-y-2.5">
              {projects.map(proj => (
                <div key={proj.id} className="text-[8.5pt] font-sans">
                  <div className="flex justify-between font-bold text-[#0A0A0A] leading-tight">
                    <span>{proj.title}</span>
                    <span className="text-[#807D7A] font-normal">{proj.startDate} – {proj.endDate}</span>
                  </div>
                  <div className="text-[#8C8172] text-[8pt] italic mt-0.5 mb-1">{proj.role}</div>
                  <p className="text-[#333] leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {awards.length > 0 && (
          <div className="pt-2 border-t border-[#E5E3DF] text-[8pt] font-sans text-[#807D7A]">
            {awards.map(a => (
              <span key={a.id}>
                {a.title} — {a.organization}
              </span>
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-8 text-[8pt] font-serif text-[#807D7A] select-none">
          Page 2 of 2
        </div>
      </div>
    </div>
  );
};
