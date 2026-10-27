import React from 'react';
import { CVDocument } from '../../../types/cv';

export const CorporateClassicTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, publications, awards } = doc;

  return (
    <div className="text-[#0A0A0A] font-serif text-[10.5pt] leading-[1.45] tracking-[0.01em] p-[42pt] bg-white min-h-full">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b border-[#0A0A0A]">
        <h1 className="text-[24pt] font-semibold tracking-[-0.01em] text-[#0A0A0A] uppercase mb-1">
          {personalInfo.fullName}
        </h1>
        <p className="text-[11pt] italic text-[#4A4845] font-sans tracking-wide mb-2">
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-2.5 text-[9pt] font-sans text-[#4A4845]">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <a href={`mailto:${personalInfo.email}`} className="text-[#0A0A0A] hover:underline">{personalInfo.email}</a>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span className="text-[#0A0A0A]">{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span>•</span>
              <span className="text-[#0A0A0A]">{personalInfo.website}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#D1CECA]">
            Executive Summary
          </h2>
          <p className="text-[9.5pt] text-[#2A2927] leading-[1.5] text-justify font-sans">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
            Professional Experience
          </h2>
          <div className="space-y-3">
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
                  <p className="text-[9pt] font-sans text-[#3A3937] mb-1 italic">
                    {exp.description}
                  </p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[9pt] font-sans text-[#1A1A1A]">
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
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
            Education
          </h2>
          <div className="space-y-2">
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

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#D1CECA]">
            Areas of Expertise
          </h2>
          <div className="space-y-1 font-sans text-[9pt]">
            {skills.map(sk => (
              <div key={sk.id} className="flex flex-wrap items-baseline gap-1">
                <span className="font-semibold text-[#0A0A0A]">{sk.category}:</span>
                <span className="text-[#333]">{sk.items.join(' • ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#D1CECA]">
            Strategic Projects & Architecture
          </h2>
          <div className="space-y-2.5">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[10pt] text-[#0A0A0A]">{proj.title}</span>
                  <span className="text-[9pt] font-sans text-[#4A4845]">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                <div className="text-[9pt] italic font-serif text-[#4A4845] mb-1">
                  {proj.role}
                </div>
                <p className="text-[9pt] font-sans text-[#222] mb-1">{proj.description}</p>
                {proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[8.5pt] font-sans text-[#333]">
                    {proj.highlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Publications */}
      {(certifications.length > 0 || publications.length > 0 || awards.length > 0) && (
        <section>
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#D1CECA]">
            Accreditations & Publications
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
    </div>
  );
};
