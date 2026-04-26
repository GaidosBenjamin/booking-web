import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { login as apiLogin } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ToastProvider';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/campers" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const orgSlug = import.meta.env.VITE_ORG_SLUG || 'bbso';

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await apiLogin({ organizationSlug: orgSlug, email: data.email, password: data.password });
      login(response);
      navigate('/campers');
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) showToast(t('login.errors.invalidCredentials'), 'error');
      else if (error.response?.status === 403) showToast(t('login.errors.verifyEmail'), 'error');
      else showToast(t('login.errors.generic'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-mesh flex flex-col">
      <nav className="fixed top-0 w-full z-50 glass-panel flex items-center justify-between px-6 h-16">
        <span className="text-xl font-bold text-primary font-headline tracking-tight">{t('common.appName')}</span>
        <LanguageSwitcher />
      </nav>

      <main className="flex-1 pt-32 pb-12 px-6 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight leading-tight">{t('login.title')}</h1>
            <p className="mt-3 text-on-surface-variant text-lg">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label={t('login.email')} type="email" placeholder={t('login.emailPlaceholder')} error={errors.email?.message} {...register('email')} />
            <Input label={t('login.password')} type="password" placeholder={t('login.passwordPlaceholder')} showPasswordToggle error={errors.password?.message} {...register('password')} />

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" fullWidth loading={loading} icon="login">{t('login.loginButton')}</Button>
              <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/register')}>{t('login.registerButton')}</Button>
            </div>

            <div className="pt-2 text-center">
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-secondary font-medium text-sm hover:underline">
                {t('login.forgotPassword')}
              </button>
            </div>
          </form>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
