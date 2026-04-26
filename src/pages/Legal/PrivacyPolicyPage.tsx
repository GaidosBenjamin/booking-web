import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-surface">
      <AppHeader title={t('privacyPolicy.title')} rightAction={<div />} />
      <main className="pt-24 px-6 max-w-2xl mx-auto pb-16 text-on-surface">
        <h1 className="font-headline font-bold text-3xl text-primary mb-6">{t('privacyPolicy.title')}</h1>
        <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant">
          <p>{t('privacyPolicy.lastUpdated', { date: new Date().toLocaleDateString() })}</p>
          <h2 className="font-headline font-bold text-lg text-on-surface mt-6">{t('privacyPolicy.section1Title')}</h2>
          <p>{t('privacyPolicy.section1Body')}</p>
          <h2 className="font-headline font-bold text-lg text-on-surface mt-6">{t('privacyPolicy.section2Title')}</h2>
          <p>{t('privacyPolicy.section2Body')}</p>
          <h2 className="font-headline font-bold text-lg text-on-surface mt-6">{t('privacyPolicy.section3Title')}</h2>
          <p>{t('privacyPolicy.section3Body')}</p>
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
