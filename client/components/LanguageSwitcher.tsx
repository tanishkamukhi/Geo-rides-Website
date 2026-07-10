import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'en-CA', name: 'English (Canada)', flag: '🇨🇦' },
    { code: 'fr-CA', name: 'Français (Canada)', flag: '🇨🇦' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-geo-red" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {languages.find(l => l.code === i18n.language)?.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center space-x-3 ${i18n.language === lang.code
                  ? 'bg-geo-red bg-opacity-10 text-geo-red'
                  : 'text-gray-700'
                } first:rounded-t-lg last:rounded-b-lg`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto text-geo-red">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
