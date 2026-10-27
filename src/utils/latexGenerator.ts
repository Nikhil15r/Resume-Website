import { CVDocument } from '../types/cv';

export function generateLatexSource(doc: CVDocument): string {
  const { personalInfo, summary, experience, education, skills, projects, certifications, publications, awards, settings } = doc;
  const paper = settings.paperSize === 'letter' ? 'letterpaper' : 'a4paper';
  const margin = settings.margins === 'compact' ? '0.5in' : settings.margins === 'generous' ? '0.85in' : '0.7in';

  // Escape special LaTeX characters
  const esc = (text: string | undefined): string => {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/([&%$#_{}])/g, '\\$1')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  };

  return `% ==============================================================================
% ATELIER CV — Executive Curriculum Vitae
% Template: ${doc.settings.templateId.toUpperCase()}
% Generated: ${new Date().toISOString().split('T')[0]}
% ==============================================================================

\\documentclass[10pt,${paper}]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=${margin},top=${margin},bottom=${margin}]{geometry}
\\usepackage{charter} % Premium corporate serif
\\usepackage{microtype}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage[hidelinks]{hyperref}
\\usepackage{titlesec}

% Atelier Color Palette
\\definecolor{primaryText}{HTML}{0A0A0A}
\\definecolor{secondaryText}{HTML}{4A4845}
\\definecolor{accentColor}{HTML}{8C8172}
\\definecolor{ruleColor}{HTML}{D1CECA}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

% Section Heading Formatting
\\titleformat{\\section}
  {\\normalfont\\large\\scshape\\color{primaryText}}
  {}{0em}
  {}
  [{\\vspace{1.5pt}\\titlerule[0.6pt]}]

\\titlespacing*{\\section}{0pt}{11pt}{6pt}

% Tight lists
\\setlist[itemize]{leftmargin=1.2em, itemsep=2.5pt, topsep=2pt, parsep=0pt}

\\begin{document}

% ------------------------------------------------------------------------------
% HEADER / LETTERHEAD
% ------------------------------------------------------------------------------
\\begin{center}
  {\\fontsize{22}{26}\\selectfont\\textbf{${esc(personalInfo.fullName)}}}\\\\[3pt]
  {\\color{secondaryText}\\fontsize{10.5}{13}\\selectfont\\textit{${esc(personalInfo.title)}}}\\\\[5pt]
  {\\small\\color{secondaryText}
    ${esc(personalInfo.location)} \\;$\\cdot$\\; 
    \\href{mailto:${esc(personalInfo.email)}}{${esc(personalInfo.email)}} \\;$\\cdot$\\; 
    ${esc(personalInfo.phone)}
    ${personalInfo.linkedin ? ` \\;$\\cdot$\\; \\href{https://${esc(personalInfo.linkedin)}}{${esc(personalInfo.linkedin)}}` : ''}
    ${personalInfo.website ? ` \\;$\\cdot$\\; \\href{https://${esc(personalInfo.website)}}{${esc(personalInfo.website)}}` : ''}
  }
\\end{center}

\\vspace{4pt}

% ------------------------------------------------------------------------------
% EXECUTIVE SUMMARY
% ------------------------------------------------------------------------------
\\section{Executive Summary}
{\\color{secondaryText}\\fontsize{9.5}{13.5}\\selectfont
${esc(summary)}
}

% ------------------------------------------------------------------------------
% PROFESSIONAL EXPERIENCE
% ------------------------------------------------------------------------------
\\section{Professional Experience}

${experience.map(exp => `
\\noindent
\\textbf{${esc(exp.role)}} \\hfill {\\footnotesize\\color{secondaryText}${esc(exp.startDate)} -- ${exp.current ? 'Present' : esc(exp.endDate)}}\\\\
{\\textit{${esc(exp.company)}} \\hfill {\\footnotesize\\color{secondaryText}${esc(exp.location)}}}
\\vspace{1pt}
\\begin{itemize}
${exp.achievements.map(ach => `  \\item ${esc(ach)}`).join('\n')}
\\end{itemize}
\\vspace{3pt}
`).join('\n')}

% ------------------------------------------------------------------------------
% EDUCATION
% ------------------------------------------------------------------------------
\\section{Education}

${education.map(edu => `
\\noindent
\\textbf{${esc(edu.school)}} \\hfill {\\footnotesize\\color{secondaryText}${esc(edu.startDate)} -- ${esc(edu.endDate)}}\\\\
{\\textit{${esc(edu.degree)}, ${esc(edu.field)}}} \\hfill {\\footnotesize\\color{secondaryText}${esc(edu.location)}}
${edu.honors ? `\\\\{\\footnotesize\\color{secondaryText}\\textbullet\\; ${esc(edu.honors)}}` : ''}
\\vspace{3pt}
`).join('\n')}

% ------------------------------------------------------------------------------
% CORE COMPETENCIES & EXPERTISE
% ------------------------------------------------------------------------------
\\section{Areas of Expertise}
\\begin{itemize}[leftmargin=0pt, label={}]
${skills.map(sk => `  \\item \\textbf{${esc(sk.category)}:} ${sk.items.map(i => esc(i)).join(' $\\cdot$ ')}`).join('\n')}
\\end{itemize}

${projects.length > 0 ? `
% ------------------------------------------------------------------------------
% KEY ARCHITECTURAL PROJECTS
% ------------------------------------------------------------------------------
\\section{Strategic Initiatives \\& Architecture}

${projects.map(proj => `
\\noindent
\\textbf{${esc(proj.title)}} \\hfill {\\footnotesize\\color{secondaryText}${esc(proj.startDate)} -- ${esc(proj.endDate)}}\\\\
{\\textit{${esc(proj.role)}} ${proj.techStack ? `\\hfill {\\footnotesize\\color{accentColor}[${proj.techStack.map(t => esc(t)).join(', ')}]}` : ''}}
\\vspace{1pt}
\\begin{itemize}
${proj.highlights.map(hl => `  \\item ${esc(hl)}`).join('\n')}
\\end{itemize}
\\vspace{3pt}
`).join('\n')}
` : ''}

${publications.length > 0 ? `
% ------------------------------------------------------------------------------
% PUBLICATIONS & RESEARCH
% ------------------------------------------------------------------------------
\\section{Publications \\& Research}
\\begin{itemize}
${publications.map(pub => `  \\item \\textbf{${esc(pub.title)}}, {\\textit{${esc(pub.publisher)}}}, ${esc(pub.date)}. (${esc(pub.authors)})`).join('\n')}
\\end{itemize}
` : ''}

${certifications.length > 0 ? `
% ------------------------------------------------------------------------------
% CERTIFICATIONS & ACCREDITATIONS
% ------------------------------------------------------------------------------
\\section{Certifications}
\\begin{itemize}[leftmargin=1.2em, itemsep=1.5pt]
${certifications.map(cert => `  \\item \\textbf{${esc(cert.name)}} -- {\\textit{${esc(cert.issuer)}}} (${esc(cert.date)})`).join('\n')}
\\end{itemize}
` : ''}

\\end{document}
`;
}
