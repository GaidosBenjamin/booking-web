import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';

export default function ContactPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AppHeader title={t('contact.title')} rightAction={<div />} />
      <main className="pt-24 px-6 max-w-2xl mx-auto pb-16 text-on-surface flex-grow">
        <h1 className="font-headline font-bold text-3xl text-primary mb-6">{t('contact.title')}</h1>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-6 w-full">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary text-2xl">mail</span>
            <div>
              <h3 className="font-bold text-on-surface">{t('contact.emailLabel')}</h3>
              <p className="text-on-surface-variant text-sm mt-1">support@bbso.dev</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary text-2xl">phone</span>
            <div>
              <h3 className="font-bold text-on-surface">{t('contact.phoneLabel')}</h3>
              <p className="text-on-surface-variant text-sm mt-1">0751879836</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">
            {t('common.back')}
          </button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
