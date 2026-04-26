import { useNavigate } from 'react-router';
import LanguageSwitcher from './LanguageSwitcher';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function AppHeader({ title, showBack = true, onBack, rightAction }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 glass-panel">
      <div className="flex items-center justify-between px-6 h-16 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 min-w-0">
          {showBack && (
            <button
              onClick={() => onBack ? onBack() : navigate(-1)}
              className="hover:opacity-80 transition-opacity active:scale-95 duration-200 flex items-center justify-center shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
          )}
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          {rightAction && <div>{rightAction}</div>}
        </div>
      </div>
    </header>
  );
}
