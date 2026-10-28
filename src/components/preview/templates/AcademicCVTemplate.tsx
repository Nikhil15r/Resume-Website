import React from 'react';
import { CVDocument } from '../../../types/cv';
import { getContactElements } from '../../../utils/contactUtils';

const AcademicSectionHeader: React.FC<{ title: string; className?: string }> = ({ title, className = 'mb-2.5' }) => (
  <div className={`pb-1 border-b border-[#0A0A0A] ${className}`}>
    <h2 className="text-[10pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] leading-normal select-none">
      {title}
    </h2>
  </div>
);

export const AcademicCVTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, publications, awards, skills, projects, settings } = doc;

  const isA4 = settings.paperSize === 'a4';
  const widthMm = isA4 ? 210 : 215.9;
  const heightMm = isA4 ? 297 : 279.4;

  const contactItems = getContactElements(personalInfo);

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* -------------------- PAGE 1 -------------------- */}
      <div
        id="cv-page-1"
        className="cv-page-sheet relative bg-white text-[#0A0A0A] font-serif text-[10pt] leading-[1.5] p-[42pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
        style={{
          width: `${widthMm}mm`,
          minHeight: `${heightMm}mm`,
          boxSizing: 'border-box'
        }}
      >
        {/* Academic Header */}
        <header className="text-center pb-3.5 mb-4 border-b border-[#0A0A0A]">
          <h1 className="text-[23pt] font-normal tracking-[0.04em] uppercase text-[#0A0A0A] leading-none mb-1">
            {personalInfo.fullName}
          </h1>
          <p className="text-[11pt] italic text-[#4A4845] mt-1 mb-2">
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-y-1 text-[8.5pt] text-[#4A4845]">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2 text-[#807D7A] select-none">•</span>}
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-[#0A0A0A] underline hover:text-[#8C8172] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Research Statement */}
        {summary && (
          <section className="mb-4">
            <AcademicSectionHeader title="Research Focus & Scholarly Profile" />
            <p className="text-[9.2pt] text-[#2A2927] leading-[1.6] text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-4">
            <AcademicSectionHeader title="Education" />
            <div className="space-y-2.5">
              {education.map(edu => (
                <div key={edu.id} className="grid grid-cols-[80px_1fr] items-baseline leading-tight">
                  <span className="text-[8.5pt] text-[#666]">{edu.endDate}</span>
                  <div>
                    <div className="font-semibold text-[#0A0A0A]">{edu.degree}, {edu.field}</div>
                    <div className="italic text-[#444] text-[9pt] mt-0.5">{edu.school}, {edu.location}</div>
                    {edu.honors && <div className="text-[8pt] text-[#666] mt-0.5">• {edu.honors}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Appointments & Experience */}
        {experience.length > 0 && (
          <section className="mb-2">
            <AcademicSectionHeader title="Appointments & Professional Experience" />
            <div className="space-y-3">
              {experience.map(exp => (
                <div key={exp.id} className="grid grid-cols-[90px_1fr] items-baseline">
                  <span className="text-[8pt] text-[#666]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                  <div>
                    <div className="font-semibold text-[#0A0A0A] leading-tight">{exp.role}</div>
                    <div className="italic text-[#444] text-[8.8pt] mt-0.5 mb-1">{exp.company}, {exp.location}</div>
                    {exp.description && <p className="text-[8.5pt] text-[#333] mb-1 leading-relaxed">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <div className="space-y-0.5 text-[8.2pt] text-[#333] ml-0.5">
                        {exp.achievements.map((a, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-2 shrink-0 text-center select-none text-[#0A0A0A]">•</span>
                            <span className="flex-1">{a}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* -------------------- PAGE 2 -------------------- */}
      {(education.length > 0 || skills.length > 0 || (publications && publications.length > 0) || (awards && awards.length > 0)) && (
        <div
          id="cv-page-2"
          className="cv-page-sheet relative bg-white text-[#0A0A0A] font-serif text-[10pt] leading-[1.5] p-[42pt] border border-[#E5E3DF] shadow-paper hover:shadow-paper-lg transition-shadow text-left"
          style={{
            width: `${widthMm}mm`,
            minHeight: `${heightMm}mm`,
            boxSizing: 'border-box'
          }}
        >
        {/* Running Header */}
        <div className="flex justify-between items-baseline pb-2 mb-4 border-b border-[#0A0A0A] text-[9pt] font-sans text-[#666]">
          <span className="font-serif font-semibold text-[#0A0A0A] uppercase tracking-wider">
            {personalInfo.fullName}
          </span>
          <span className="italic font-serif">{personalInfo.title}</span>
        </div>

        {/* Peer-Reviewed Publications */}
        {publications.length > 0 && (
          <section className="mb-4">
            <AcademicSectionHeader title="Peer-Reviewed Publications & Proceedings" />
            <div className="space-y-2 text-[8.8pt] text-[#222]">
              {publications.map((pub, idx) => (
                <div key={pub.id} className="flex items-start gap-2">
                  <span className="w-4 shrink-0 text-right font-mono text-[8pt] text-[#666]">[{idx + 1}]</span>
                  <div className="flex-1 leading-snug">
                    <span>{pub.authors} ({pub.date}). &ldquo;{pub.title}&rdquo;. </span>
                    <span className="italic">{pub.publisher}</span>.
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grants, Fellowships & Honors */}
        {awards.length > 0 && (
          <section className="mb-4">
            <AcademicSectionHeader title="Grants, Fellowships & Honors" />
            <div className="space-y-1.5 text-[8.8pt]">
              {awards.map(aw => (
                <div key={aw.id} className="grid grid-cols-[60px_1fr] items-baseline">
                  <span className="text-[8pt] text-[#666]">{aw.date}</span>
                  <div>
                    <span className="font-semibold text-[#0A0A0A]">{aw.title}</span>, {aw.organization}
                    {aw.summary && <div className="text-[8pt] text-[#555]">{aw.summary}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Selected Research Projects */}
        {projects.length > 0 && (
          <section className="mb-4">
            <AcademicSectionHeader title="Research Initiatives & Distributed Protocols" />
            <div className="space-y-2 text-[8.5pt]">
              {projects.map(p => (
                <div key={p.id}>
                  <div className="font-semibold text-[#0A0A0A]">
                    {p.title} <span className="font-normal italic text-[#666]">({p.startDate} – {p.endDate})</span>
                  </div>
                  <p className="text-[#333] leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fields of Specialization */}
        {skills.length > 0 && (
          <section className="pt-2 border-t border-[#E5E3DF] text-[8.5pt]">
            <span className="font-semibold text-[#0A0A0A]">Fields of Specialization: </span>
            <span className="text-[#444]">
              {skills.map(s => s.items.join(', ')).join(' • ')}
            </span>
          </section>
        )}

        </div>
      )}
    </div>
  );
};
