import React from 'react';
import { CVDocument } from '../../../types/cv';

export const AcademicCVTemplate: React.FC<{ doc: CVDocument }> = ({ doc }) => {
  const { personalInfo, summary, experience, education, publications, awards, skills, projects } = doc;

  return (
    <div className="text-[#0A0A0A] font-serif text-[10.5pt] leading-[1.5] p-[44pt] bg-white min-h-full">
      {/* Academic Header */}
      <header className="text-center pb-4 mb-5 border-b border-[#0A0A0A]">
        <h1 className="text-[23pt] font-normal tracking-[0.04em] uppercase text-[#0A0A0A] mb-1">
          {personalInfo.fullName}
        </h1>
        <p className="text-[11pt] italic text-[#4A4845] mb-2">
          {personalInfo.title}
        </p>
        <div className="text-[9pt] text-[#4A4845] space-y-0.5">
          <div>{personalInfo.location}</div>
          <div className="flex justify-center items-center gap-2">
            <a href={`mailto:${personalInfo.email}`} className="text-[#0A0A0A] underline">{personalInfo.email}</a>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            {personalInfo.website && (
              <>
                <span>•</span>
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Research Statement / Overview */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#0A0A0A]">
            Research Focus
          </h2>
          <p className="text-[9.5pt] text-[#2A2927] leading-[1.6] text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#0A0A0A]">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map(edu => (
              <div key={edu.id} className="grid grid-cols-[80px_1fr] items-baseline">
                <span className="text-[9pt] text-[#666]">{edu.endDate}</span>
                <div>
                  <div className="font-semibold text-[#0A0A0A]">{edu.degree}, {edu.field}</div>
                  <div className="italic text-[#444] text-[9.5pt]">{edu.school}, {edu.location}</div>
                  {edu.honors && <div className="text-[8.5pt] text-[#666] mt-0.5">{edu.honors}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Appointments & Industry Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#0A0A0A]">
            Appointments &amp; Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-[100px_1fr] items-baseline">
                <span className="text-[8.5pt] text-[#666]">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
                <div>
                  <div className="font-semibold text-[#0A0A0A]">{exp.role}</div>
                  <div className="italic text-[#444] text-[9pt] mb-1">{exp.company}, {exp.location}</div>
                  {exp.description && <p className="text-[8.5pt] text-[#333] mb-1">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[8.5pt] text-[#333]">
                      {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Peer-Reviewed Publications */}
      {publications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] pb-0.5 mb-2 border-b border-[#0A0A0A]">
            Peer-Reviewed Publications
          </h2>
          <ol className="list-decimal list-outside ml-4 space-y-2 text-[9pt] text-[#222]">
            {publications.map(pub => (
              <li key={pub.id} className="pl-1">
                <span>{pub.authors} ({pub.date}). &ldquo;{pub.title}&rdquo;. </span>
                <span className="italic">{pub.publisher}</span>.
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Grants & Honors */}
      {awards.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#0A0A0A]">
            Grants, Fellowships &amp; Honors
          </h2>
          <div className="space-y-1.5 text-[9pt]">
            {awards.map(aw => (
              <div key={aw.id} className="grid grid-cols-[60px_1fr] items-baseline">
                <span className="text-[8.5pt] text-[#666]">{aw.date}</span>
                <div>
                  <span className="font-semibold text-[#0A0A0A]">{aw.title}</span>, {aw.organization}
                  {aw.summary && <div className="text-[8.5pt] text-[#555]">{aw.summary}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Technical & Research Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11pt] font-semibold tracking-[0.06em] uppercase text-[#0A0A0A] pb-0.5 mb-1.5 border-b border-[#0A0A0A]">
            Research Projects &amp; Systems Architecture
          </h2>
          <div className="space-y-2 text-[8.5pt]">
            {projects.map(p => (
              <div key={p.id}>
                <div className="font-semibold text-[#0A0A0A]">{p.title} ({p.startDate} – {p.endDate})</div>
                <p className="text-[#333]">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scholarly Fields */}
      {skills.length > 0 && (
        <section className="pt-2 border-t border-[#E5E3DF] text-[8.5pt]">
          <span className="font-semibold text-[#0A0A0A]">Fields of Specialization: </span>
          <span className="text-[#444]">
            {skills.map(s => s.items.join(', ')).join(' • ')}
          </span>
        </section>
      )}
    </div>
  );
};
