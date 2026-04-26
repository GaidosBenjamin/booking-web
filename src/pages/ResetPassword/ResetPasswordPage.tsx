import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../../api/auth';
import { useToast } from '../../components/ToastProvider';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const email = (location.state as { email?: string })?.email || '';
  const orgSlug = import.meta.env.VITE_ORG_SLUG as string;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { showToast(t('resetPassword.toasts.mismatch'), 'error'); return; }
    setLoading(true);
    try {
      await resetPassword({ organizationSlug: orgSlug, email, code, newPassword: password });
      showToast(t('resetPassword.toasts.success'));
      navigate('/login');
    } catch { showToast(t('resetPassword.toasts.failed'), 'error'); }
    finally { setLoading(false); }
  };

  if (!email) { navigate('/forgot-password', { replace: true }); return null; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-container-low flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[24px] p-8 ambient-shadow">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-headline font-bold text-2xl text-primary tracking-tight">{t('common.appName')}</h1>
          <LanguageSwitcher />
        </div>
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-3 tracking-tight leading-tight">{t('resetPassword.title')}</h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">{t('resetPassword.subtitle')}</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label font-semibold text-sm text-on-surface ml-1">{t('resetPassword.codeLabel')}</label>
            <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" maxLength={6} placeholder="000000" className="w-full h-14 px-4 rounded-lg bg-surface-container-highest ghost-border focus:ring-2 focus:ring-primary/20 font-body text-lg text-center tracking-[0.5em] text-on-surface placeholder:text-outline placeholder:tracking-normal transition-colors" />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label className="font-label font-semibold text-sm text-on-surface ml-1">{t('resetPassword.newPassword')}</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t('resetPassword.newPasswordPlaceholder')} className="w-full h-14 pl-4 pr-12 rounded-lg bg-surface-container-highest ghost-border focus:ring-2 focus:ring-primary/20 font-body text-base text-on-surface placeholder:text-outline transition-colors" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-xl">{showPw ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label font-semibold text-sm text-on-surface ml-1">{t('resetPassword.confirmPassword')}</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('resetPassword.confirmPasswordPlaceholder')} className="w-full h-14 pl-4 pr-4 rounded-lg bg-surface-container-highest ghost-border focus:ring-2 focus:ring-primary/20 font-body text-base text-on-surface placeholder:text-outline transition-colors" />
          </div>
          <Button type="submit" fullWidth loading={loading} className="mt-4">{t('resetPassword.resetButton')}</Button>
        </form>
      </div>
      <AppFooter />
    </div>
  );
}
