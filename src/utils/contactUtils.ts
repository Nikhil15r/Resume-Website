import { PersonalInfo } from '../types/cv';

export interface ContactElement {
  label: string;
  href?: string;
  isExternal?: boolean;
}

/**
 * Ensures a valid web protocol for external links (LinkedIn, GitHub, Portfolio).
 */
export function formatExternalUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Builds a standardized list of contact items for resume headers.
 * Shows clean, clickable labels (e.g. "LinkedIn", "GitHub", "Portfolio") instead of raw URLs.
 */
export function getContactElements(personalInfo: PersonalInfo): ContactElement[] {
  const elements: ContactElement[] = [];

  if (personalInfo.location?.trim()) {
    elements.push({ label: personalInfo.location.trim() });
  }

  if (personalInfo.email?.trim()) {
    const email = personalInfo.email.trim();
    elements.push({ label: email, href: `mailto:${email}` });
  }

  if (personalInfo.phone?.trim()) {
    const phone = personalInfo.phone.trim();
    elements.push({ label: phone, href: `tel:${phone.replace(/\s+/g, '')}` });
  }

  if (personalInfo.linkedin?.trim()) {
    elements.push({
      label: 'LinkedIn',
      href: formatExternalUrl(personalInfo.linkedin),
      isExternal: true
    });
  }

  if (personalInfo.github?.trim()) {
    elements.push({
      label: 'GitHub',
      href: formatExternalUrl(personalInfo.github),
      isExternal: true
    });
  }

  if (personalInfo.website?.trim()) {
    elements.push({
      label: 'Portfolio',
      href: formatExternalUrl(personalInfo.website),
      isExternal: true
    });
  }

  return elements;
}
