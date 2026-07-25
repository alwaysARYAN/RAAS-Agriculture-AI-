import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/80 hover:border-emerald-300/60 transition-all shadow-sm"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-sm font-semibold text-slate-900">{currentLanguage.name}</span>
        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div className="dropdown-glass absolute right-0 mt-2 w-48 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`dropdown-item-glass w-full flex items-center gap-3 ${
                  i18n.language === lang.code ? 'bg-emerald-50' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-semibold">{lang.name}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto text-emerald-600 font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
