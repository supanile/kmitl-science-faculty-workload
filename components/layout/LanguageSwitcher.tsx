'use client';

import * as React from "react";
import { createPortal } from "react-dom";
import { Globe, Check } from "lucide-react";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/routing';
import { useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, right: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Languages');

  const languages = [
    { code: 'en', name: 'English', label: t('english') },
    { code: 'th', name: 'ภาษาไทย', label: t('thai') },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[1];

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (langCode: string) => {
    router.replace(pathname, { locale: langCode });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 transition-colors text-sm text-gray-600 dark:text-gray-400"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLanguage.label}</span>
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9998"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="fixed w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-9999"
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
          >
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {t('language')}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span>{lang.label}</span>
                  {locale === lang.code && (
                    <Check className="w-4 h-4 text-orange-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
