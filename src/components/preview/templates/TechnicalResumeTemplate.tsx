import React from 'react';
import { CVDocument } from '../../../types/cv';

export const TechnicalResumeTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = doc;

  return (
    <div className="text-[#0A0A0A] font-sans text-[9.5pt] leading-[1.4] p-[38pt] bg-white min-h-full">
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
        <div className="flex flex-wrap items-center gap-x-3 text-[8.5pt] font-mono text-[#4A4845] mt-1">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <a href={`mailto:${personalInfo.email}`} className="text-[#0A0A0A] underline">{personalInfo.email}</a>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.github && (
            <>
              <span>•</span>
              <span className="text-[#0A0A0A]">{personalInfo.github}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span className="text-[#0A0A0A]">{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Technical Summary */}
      {summary && (
        <section className="mb-3">
          <p className="text-[9pt] text-[#2A2927] leading-[1.45]">
            {summary}
          </p>
        </section>
      )}

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#0A0A0A]">
            Technical Proficiencies &amp; Architecture
          </h2>
          <div className="space-y-1 text-[8.5pt]">
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
        <section className="mb-3.5">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#0A0A0A]">
            Engineering &amp; Systems Experience
          </h2>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-[9.5pt] text-[#0A0A0A]">
                    {exp.role} <span className="font-normal text-[#666]">at</span> {exp.company}
                  </div>
                  <div className="font-mono text-[8pt] text-[#4A4845]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <div className="text-[8pt] text-[#807D7A] font-mono mb-1">
                  {exp.location}
                </div>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[8.5pt] text-[#1A1A1A]">
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

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#0A0A0A]">
            Architectural Systems &amp; Open Source
          </h2>
          <div className="space-y-2.5">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[9pt] text-[#0A0A0A]">
                    {proj.title}
                  </span>
                  <span className="font-mono text-[8pt] text-[#4A4845]">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8pt] italic text-[#4A4845]">{proj.role}</span>
                  {proj.techStack && (
                    <span className="font-mono text-[7.5pt] text-[#8C8172] bg-[#F5F5F3] px-1.5 py-0.2 rounded border border-[#E5E3DF]">
                      {proj.techStack.join(', ')}
                    </span>
                  )}
                </div>
                <p className="text-[8.5pt] text-[#333] mb-1">{proj.description}</p>
                {proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[8pt] text-[#222] space-y-0.5">
                    {proj.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#0A0A0A]">
            Education
          </h2>
          <div className="space-y-1.5">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline text-[8.5pt]">
                <div>
                  <span className="font-bold text-[#0A0A0A]">{edu.school}</span> — <span>{edu.degree}, {edu.field}</span>
                  {edu.gpa && <span className="text-[#666] font-mono text-[8pt] ml-1.5">[{edu.gpa}]</span>}
                </div>
                <span className="font-mono text-[8pt] text-[#4A4845]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="pt-1.5 border-t border-[#D1CECA] text-[8pt] font-mono text-[#4A4845] flex items-center gap-3">
          <span className="font-bold text-[#0A0A0A]">CERTIFICATIONS:</span>
          {certifications.map(c => (
            <span key={c.id}>{c.name} ({c.issuer})</span>
          ))}
        </section>
      )}
    </div>
  );
};
