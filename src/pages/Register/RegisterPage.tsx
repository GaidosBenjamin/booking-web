import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { register as apiRegister, login as apiLogin } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ToastProvider';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const orgSlug = import.meta.env.VITE_ORG_SLUG as string;

  const registerSchema = z
    .object({
      firstName: z.string().min(1, t('register.errors.firstNameRequired')),
      lastName: z.string().min(1, t('register.errors.lastNameRequired')),
      email: z.string().email(t('register.errors.emailInvalid')),
      phone: z.string().min(1, t('register.errors.phoneRequired')),
      password: z.string().min(6, t('register.errors.passwordMin')),
      confirmPassword: z.string().min(1, t('register.errors.confirmRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('register.errors.passwordMismatch'),
      path: ['confirmPassword'],
    });

  type RegisterForm = z.infer<typeof registerSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await apiRegister({ organizationSlug: orgSlug, email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName, phone: data.phone });
      try {
        const response = await apiLogin({ organizationSlug: orgSlug, email: data.email, password: data.password });
        login(response);
        navigate('/campers');
      } catch {
        showToast(t('register.toasts.success'), 'success');
        navigate('/login');
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string; detail?: string } } };
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes('already') ||
        error.response?.data?.detail?.includes('already registered')
      ) {
        showToast(t('register.errors.emailExists'), 'error');
      } else if (error.response?.data?.detail?.includes('only members')) {
        showToast(t('register.errors.membersOnly'), 'error');
      } else if (
        error.response?.status === 503 ||
        error.response?.data?.detail?.toLowerCase().includes('closed')
      ) {
        showToast(t('register.errors.registrationsClosed'), 'error');
      } else {
        showToast(t('register.errors.generic'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 w-full z-50 glass-panel">
        <div className="flex items-center justify-between px-6 h-16 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="hover:opacity-80 transition-opacity active:scale-95">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <span className="font-headline font-bold tracking-tight text-xl text-primary">{t('common.appName')}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="mb-12">
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-primary leading-tight mb-6">{t('register.title')}</h1>
          </div>
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm mb-12 hidden lg:block">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 flex items-center justify-center">
              <div className="text-center p-8">
                <span className="material-symbols-outlined text-primary text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
                <p className="font-headline font-bold text-xl text-primary leading-tight">{t('register.quote')}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-surface-container-low rounded-3xl p-8 md:p-12 h-fit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input required label={t('register.firstName')} placeholder={t('register.firstNamePlaceholder')} error={errors.firstName?.message} {...register('firstName')} />
              <Input required label={t('register.lastName')} placeholder={t('register.lastNamePlaceholder')} error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input required label={t('register.email')} type="email" icon="mail" placeholder={t('register.emailPlaceholder')} error={errors.email?.message} {...register('email')} />
            <Input required label={t('register.phone')} type="tel" icon="phone" placeholder={t('register.phonePlaceholder')} error={errors.phone?.message} {...register('phone')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input required label={t('register.password')} type="password" icon="lock" placeholder={t('register.passwordPlaceholder')} showPasswordToggle error={errors.password?.message} {...register('password')} />
              <Input required label={t('register.confirmPassword')} type="password" icon="lock_reset" placeholder={t('register.confirmPasswordPlaceholder')} showPasswordToggle error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            </div>
            <div className="pt-4">
              <Button type="submit" fullWidth loading={loading} icon="arrow_forward" className="h-16 text-lg">{t('register.createAccount')}</Button>
              <p className="mt-6 text-center text-sm text-on-surface-variant">
                {t('register.alreadyHaveAccount')}{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-secondary font-bold hover:underline">{t('register.loginLink')}</button>
              </p>
            </div>
          </form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
