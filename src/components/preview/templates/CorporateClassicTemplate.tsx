import React from 'react';
import { CVDocument } from '../../../types/cv';

export const CorporateClassicTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, publications, awards, settings } = doc;

  const isA4 = settings.paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9;
  const heightMm = isA4 ? 297 : 279.4;

  const contactItems = [
    personalInfo.location,
    personalInfo.email,
    personalInfo.phone,
    personalInfo.linkedin,
    personalInfo.website
  ].filter(Boolean);

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
        {/* Header */}
        <header className="text-center pb-3.5 mb-4 border-b border-[#0A0A0A]">
          <h1 className="text-[25pt] font-semibold tracking-[-0.01em] text-[#0A0A0A] uppercase mb-1">
            {personalInfo.fullName}
          </h1>
          <p className="text-[11pt] italic text-[#4A4845] font-sans tracking-wide mb-2">
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-y-1 text-[8.5pt] font-sans text-[#4A4845]">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2 text-[#807D7A] select-none">•</span>}
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

        {/* Executive Summary */}
        {summary && (
          <section className="mb-4">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#D1CECA]">
              Executive Summary
            </h2>
            <p className="text-[9.2pt] text-[#2A2927] leading-[1.5] text-justify font-sans">
              {summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <section className="mb-2">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2.5 border-b border-[#D1CECA]">
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[10.5pt] text-[#0A0A0A]">{exp.role}</span>
                    <span className="text-[9pt] font-sans text-[#4A4845]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1 text-[9.5pt]">
                    <span className="italic text-[#333] font-serif">{exp.company}</span>
                    <span className="text-[9pt] font-sans text-[#666]">{exp.location}</span>
                  </div>
                  {exp.description && (
                    <p className="text-[8.8pt] font-sans text-[#3A3937] mb-1 italic">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.length > 0 && (
                    <div className="space-y-1 text-[8.8pt] font-sans text-[#1A1A1A] ml-0.5">
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

        {/* Page Footer (Page number only) */}
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
        {/* Running Header on Page 2 */}
        <div className="flex justify-between items-baseline pb-2.5 mb-4 border-b border-[#0A0A0A] text-[9pt] font-sans text-[#666]">
          <span className="font-serif font-semibold text-[#0A0A0A] uppercase tracking-wider">
            {personalInfo.fullName}
          </span>
          <span className="italic font-serif">{personalInfo.title}</span>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
              Education &amp; Academic Credentials
            </h2>
            <div className="space-y-2.5">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[10pt] text-[#0A0A0A]">{edu.school}</span>
                    <span className="text-[9pt] font-sans text-[#4A4845]">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[9.5pt]">
                    <span className="italic text-[#333]">{edu.degree}, {edu.field}</span>
                    <span className="text-[9pt] font-sans text-[#666]">{edu.location}</span>
                  </div>
                  {edu.honors && (
                    <p className="text-[8.5pt] font-sans text-[#4A4845] mt-0.5">
                      • {edu.honors}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Areas of Expertise / Skills */}
        {skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
              Areas of Expertise &amp; Core Competencies
            </h2>
            <div className="space-y-1.5 font-sans text-[8.8pt]">
              {skills.map(sk => (
                <div key={sk.id} className="flex flex-wrap items-baseline gap-1.5">
                  <span className="font-semibold text-[#0A0A0A]">{sk.category}:</span>
                  <span className="text-[#333]">{sk.items.join(' • ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strategic Projects & Architecture */}
        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
              Strategic Projects &amp; Architecture
            </h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[10pt] text-[#0A0A0A]">{proj.title}</span>
                    <span className="text-[9pt] font-sans text-[#4A4845]">
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className="text-[9pt] italic font-serif text-[#4A4845] mb-1">
                    {proj.role}{' '}
                    {proj.techStack && (
                      <span className="font-sans font-normal text-[8pt] text-[#8C8172]">
                        [{proj.techStack.join(', ')}]
                      </span>
                    )}
                  </div>
                  <p className="text-[8.8pt] font-sans text-[#222] mb-1">{proj.description}</p>
                  {proj.highlights.length > 0 && (
                    <div className="space-y-1 text-[8.5pt] font-sans text-[#333] ml-0.5">
                      {proj.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-2.5 shrink-0 text-center select-none text-[#0A0A0A] font-serif text-[10pt] leading-[1.25]">
                            •
                          </span>
                          <span className="leading-snug flex-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Accreditations & Publications */}
        {(certifications.length > 0 || publications.length > 0 || awards.length > 0) && (
          <section>
            <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
              Accreditations, Publications &amp; Honors
            </h2>
            <div className="space-y-1 font-sans text-[8.5pt] text-[#222]">
              {certifications.map(c => (
                <div key={c.id}>
                  <span className="font-medium text-[#0A0A0A]">• {c.name}</span> — {c.issuer} ({c.date})
                </div>
              ))}
              {publications.map(p => (
                <div key={p.id}>
                  <span className="font-medium text-[#0A0A0A]">• &ldquo;{p.title}&rdquo;</span>, {p.publisher}, {p.date}
                </div>
              ))}
              {awards.map(a => (
                <div key={a.id}>
                  <span className="font-medium text-[#0A0A0A]">• {a.title}</span>, {a.organization} ({a.date})
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Page Footer (Page number only) */}
        <div className="absolute bottom-4 right-8 text-[8pt] font-serif text-[#807D7A]">
          Page 2 of 2
        </div>
      </div>
    </div>
  );
};
