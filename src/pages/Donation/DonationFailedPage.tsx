import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getDonation } from '../../api/donations';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';

export default function DonationFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const donationId = searchParams.get('donationId') || '';

  const { data: donation } = useQuery({
    queryKey: ['donation', donationId],
    queryFn: () => getDonation(donationId),
    enabled: !!donationId,
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-x-hidden">
      {/* Atmospheric blurs */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-error-container/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-error/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 w-full max-w-lg mx-auto relative z-10">
        {/* Card */}
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-card flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-error-container/10 to-transparent pointer-events-none" />

          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center mb-8 relative animate-scale-in">
            <div className="absolute inset-0 rounded-full border-4 border-surface-container-lowest/50 scale-110 opacity-50" />
            <span className="material-symbols-outlined text-[48px] text-on-error-container relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
              credit_card_off
            </span>
          </div>

          {/* Text */}
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-4 tracking-tight relative z-10">
            {t('donationFailed.title')}
          </h1>
          {donation && (
            <p className="font-headline text-2xl font-bold text-on-surface-variant mb-3 relative z-10">
              {donation.amount.toFixed(0)} {donation.currency}
            </p>
          )}
          <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-10 max-w-[280px] relative z-10">
            {t('donationFailed.subtitle')}
          </p>

          {/* Actions */}
          <div className="w-full flex flex-col gap-4 relative z-10">
            <Button fullWidth onClick={() => navigate('/donation')} icon="refresh" iconPosition="left">
              {t('donationFailed.tryAgain')}
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate('/contact')} icon="support_agent" iconPosition="left">
              {t('donationFailed.contactSupport')}
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate(isAuthenticated ? '/campers' : '/login')} icon="home" iconPosition="left">
              {t('donationFailed.backHome')}
            </Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
