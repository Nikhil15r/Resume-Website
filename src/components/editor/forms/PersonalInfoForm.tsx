import React from 'react';
import { useCV } from '../../../context/CVContext';

export const PersonalInfoForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { personalInfo } = currentDoc;

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    updateField('personalInfo', {
      ...personalInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
          Personal Information
        </h3>
        <p className="text-xs text-[#807D7A]">
          Your executive identity and direct contact channels.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. Julian Thorne"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            Executive Title
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={e => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. Vice President of Engineering"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={e => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. julian.thorne@alum.mit.edu"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            Direct Telephone
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. +1 (415) 890-4321"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            Location &amp; Mobility
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={e => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. San Francisco, CA & Zurich, Switzerland"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            LinkedIn Profile
          </label>
          <input
            type="text"
            value={personalInfo.linkedin || ''}
            onChange={e => handleChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. linkedin.com/in/julian-thorne"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            Website or Portfolio
          </label>
          <input
            type="text"
            value={personalInfo.website || ''}
            onChange={e => handleChange('website', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. julianthorne.io"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-medium text-[#4A4845] mb-1.5">
            GitHub / Technical Profile (Optional)
          </label>
          <input
            type="text"
            value={personalInfo.github || ''}
            onChange={e => handleChange('github', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] transition-colors"
            placeholder="e.g. github.com/julianthorne"
          />
        </div>
      </div>
    </div>
  );
};
