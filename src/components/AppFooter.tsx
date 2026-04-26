import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full py-8 px-6 mt-auto relative z-10">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/privacy-policy" className="font-body text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">{t('common.privacyPolicy')}</Link>
          <Link to="/terms-of-service" className="font-body text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">{t('common.termsOfService')}</Link>
          <Link to="/contact" className="font-body text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">{t('common.contactUs')}</Link>
        </div>
        <p className="font-body text-xs text-outline font-light">{t('common.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
