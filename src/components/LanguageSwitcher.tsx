import { useTranslation } from 'react-i18next';
import { updateCurrentUser } from '../api/users';
import { useAuth } from '../hooks/useAuth';

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ro', label: 'RO', flag: '🇷🇴' },
];

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const currentLang = i18n.language?.slice(0, 2) || 'en';
  const current = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="absolute left-2.5 text-base leading-none pointer-events-none select-none">{current.flag}</span>
      <select
        value={currentLang}
        onChange={e => {
          const lang = e.target.value;
          i18n.changeLanguage(lang);
          if (isAuthenticated) updateCurrentUser({ language: lang }).catch(() => {});
        }}
        aria-label="Select language"
        className="pl-8 pr-7 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container transition-colors text-xs font-bold font-label text-on-surface-variant hover:text-primary active:scale-95 duration-150 appearance-none cursor-pointer border-none outline-none focus:ring-2 focus:ring-primary/20"
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <span className="absolute right-1.5 pointer-events-none text-on-surface-variant">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </div>
  );
}
