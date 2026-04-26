import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { verifyEmail, resendVerification } from '../../api/auth';
import { useToast } from '../../components/ToastProvider';
import Button from '../../components/Button';

import AppFooter from '../../components/AppFooter';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const email = (location.state as { email?: string })?.email || '';
  const orgSlug = (location.state as { organizationSlug?: string })?.organizationSlug || (import.meta.env.VITE_ORG_SLUG as string);
  const maskedEmail = email ? email.replace(/(.{2}).+(@.+)/, '$1***$2') : '';

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await verifyEmail({ organizationSlug: orgSlug, email, code });
      showToast(t('verifyEmail.toasts.success'));
      navigate('/login');
    } catch {
      showToast(t('verifyEmail.toasts.invalidCode'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification({ organizationSlug: orgSlug, email });
      showToast(t('verifyEmail.toasts.resendSuccess'));
      setResendCooldown(60);
    } catch {
      showToast(t('verifyEmail.toasts.resendFailed'), 'error');
    }
  };

  if (!email) { navigate('/register', { replace: true }); return null; }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="glass-panel sticky top-0 z-40 w-full pt-4 pb-4 px-6 flex justify-between items-center">
        <h2 className="font-headline text-lg font-bold text-primary tracking-tight">{t('common.appName')}</h2>
        <LanguageSwitcher />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-8 pb-16 w-full max-w-md mx-auto">
        <div className="text-center mb-10 space-y-4">
          <h1 className="font-headline text-4xl font-extrabold text-primary leading-tight tracking-tight">{t('verifyEmail.title')}</h1>
          <p className="font-body text-on-surface-variant text-base leading-relaxed px-4"
            dangerouslySetInnerHTML={{ __html: t('verifyEmail.subtitle', { email: maskedEmail }) }} />
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full bg-surface-container-low rounded-xl p-8 mb-8 ambient-shadow relative overflow-hidden">
            <div className="relative z-10 space-y-8 flex flex-col items-center">
              <div className="w-full">
                <label className="block font-label text-sm font-semibold text-primary mb-2 text-center" htmlFor="verification-code">
                  {t('verifyEmail.codeLabel')}
                </label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[0-9]*"
                  placeholder={t('verifyEmail.codePlaceholder')}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full h-16 text-center font-headline text-3xl font-bold tracking-[0.5em] text-on-surface bg-surface-container-highest rounded-lg ghost-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-300 placeholder:text-outline-variant placeholder:font-light"
                />
              </div>
              <Button type="submit" fullWidth loading={loading} disabled={code.length !== 6}>
                {t('verifyEmail.verifyButton')}
              </Button>
            </div>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="font-label text-sm font-medium text-secondary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('verifyEmail.resendText')}{' '}
            <span className="font-bold underline decoration-2 underline-offset-4">
              {resendCooldown > 0 ? t('verifyEmail.resendCooldown', { seconds: resendCooldown }) : t('verifyEmail.resendLink')}
            </span>
          </button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
