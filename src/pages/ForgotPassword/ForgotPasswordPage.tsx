import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '../../api/auth';
import { useToast } from '../../components/ToastProvider';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const orgSlug = import.meta.env.VITE_ORG_SLUG as string;

  const forgotSchema = z.object({ email: z.string().email(t('forgotPassword.errors.emailInvalid')) });
  type ForgotForm = z.infer<typeof forgotSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      await forgotPassword({ organizationSlug: orgSlug, email: data.email });
      navigate('/reset-password', { state: { email: data.email } });
    } catch {
      showToast(t('forgotPassword.errors.generic'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-container-low flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[24px] p-8 ambient-shadow flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-headline font-bold text-2xl text-primary tracking-tight">{t('common.appName')}</h1>
          <LanguageSwitcher />
        </div>
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-3 tracking-tight leading-tight">{t('forgotPassword.title')}</h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">{t('forgotPassword.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input label={t('forgotPassword.email')} type="email" icon="mail" placeholder={t('forgotPassword.emailPlaceholder')} error={errors.email?.message} {...register('email')} />
          <Button type="submit" fullWidth loading={loading} className="mt-4">{t('forgotPassword.sendButton')}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {t('forgotPassword.rememberPassword')}{' '}
          <button onClick={() => navigate('/login')} className="text-secondary font-bold hover:underline">{t('forgotPassword.loginLink')}</button>
        </p>
      </div>
      <AppFooter />
    </div>
  );
}
