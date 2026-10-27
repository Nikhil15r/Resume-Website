import React from 'react';
import { CVDocument } from '../../../types/cv';

export const ConsultingTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, awards } = doc;

  return (
    <div className="text-[#0A0A0A] font-serif text-[10pt] leading-[1.45] p-[42pt] bg-white min-h-full">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b border-[#0A0A0A]">
        <h1 className="text-[25pt] font-semibold tracking-[-0.01em] uppercase text-[#0A0A0A]">
          {personalInfo.fullName}
        </h1>
        <div className="text-[10pt] font-sans text-[#8C8172] font-medium tracking-[0.05em] uppercase mb-1.5">
          {personalInfo.title}
        </div>
        <div className="flex justify-center items-center gap-2 text-[8.5pt] font-sans text-[#4A4845]">
          <span>{personalInfo.location}</span>
          <span>|</span>
          <a href={`mailto:${personalInfo.email}`} className="text-[#0A0A0A] hover:underline">{personalInfo.email}</a>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <span className="text-[#0A0A0A]">{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Strategic Profile */}
      {summary && (
        <section className="mb-4">
          <div className="text-[10pt] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#8C8172]">
            Strategic Profile & Practice Focus
          </div>
          <p className="text-[9pt] font-sans text-[#2A2927] leading-[1.5] text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience / Client Engagements */}
      {experience.length > 0 && (
        <section className="mb-4">
          <div className="text-[10pt] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#8C8172]">
            Management &amp; Advisory Engagements
          </div>
          <div className="space-y-3.5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10.5pt] text-[#0A0A0A] font-serif">{exp.role}</span>
                  <span className="text-[8.5pt] font-sans text-[#4A4845]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1 text-[9pt] font-sans">
                  <span className="font-semibold text-[#8C8172]">{exp.company}</span>
                  <span className="text-[#807D7A]">{exp.location}</span>
                </div>
                {exp.description && (
                  <p className="text-[8.5pt] font-sans italic text-[#4A4845] mb-1">
                    {exp.description}
                  </p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[8.5pt] font-sans text-[#1A1A1A]">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-snug">
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

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <div className="text-[10pt] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#8C8172]">
            Education &amp; Credentials
          </div>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10pt] text-[#0A0A0A] font-serif">{edu.school}</span>
                  <span className="text-[8.5pt] font-sans text-[#4A4845]">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-[9pt] font-sans text-[#333]">
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
          <div className="text-[10pt] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#8C8172]">
            Advisory Domains & Functional Expertise
          </div>
          <div className="space-y-1 font-sans text-[8.5pt]">
            {skills.map(sk => (
              <div key={sk.id} className="flex items-baseline gap-1">
                <span className="font-semibold text-[#0A0A0A]">{sk.category}:</span>
                <span className="text-[#333]">{sk.items.join('  •  ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Strategic Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <div className="text-[10pt] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#8C8172]">
            Featured Engagement Cases
          </div>
          <div className="space-y-2">
            {projects.map(proj => (
              <div key={proj.id} className="text-[8.5pt] font-sans">
                <div className="flex justify-between font-bold text-[#0A0A0A]">
                  <span>{proj.title}</span>
                  <span className="text-[#807D7A] font-normal">{proj.startDate} – {proj.endDate}</span>
                </div>
                <div className="text-[#8C8172] text-[8pt] italic">{proj.role}</div>
                <p className="text-[#333] mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {awards.length > 0 && (
        <div className="pt-2 border-t border-[#E5E3DF] text-[8pt] font-sans text-[#807D7A]">
          {awards.map(a => <span key={a.id}>{a.title} — {a.organization}</span>)}
        </div>
      )}
    </div>
  );
};
