import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getDonation } from '../../api/donations';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';

export default function DonationSuccessPage() {
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
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 w-full max-w-lg mx-auto relative z-10">
        {/* Card */}
        <div className="w-full bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-card">
          {/* Gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-secondary-container via-secondary to-secondary-container opacity-50" />

          <div className="p-8 md:p-12 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-secondary-container/30 flex items-center justify-center mb-8 relative animate-scale-in">
              <div className="absolute inset-0 rounded-full bg-secondary-container opacity-20 blur-xl" />
              <span className="material-symbols-outlined text-[48px] text-secondary relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                volunteer_activism
              </span>
            </div>

            {/* Headlines */}
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary mb-3 tracking-tight">
              {t('donationSuccess.title')}
            </h1>
            {donation && (
              <p className="font-headline text-2xl md:text-3xl font-bold text-secondary mb-8">
                {donation.amount.toFixed(0)} {donation.currency}
              </p>
            )}

            {/* Impact message */}
            <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-10 max-w-sm">
              {t('donationSuccess.subtitle')}
            </p>

            {/* Transaction ID */}
            {donationId && (
              <div className="bg-surface-container-low w-full rounded-2xl p-5 mb-10 flex flex-col items-center">
                <span className="font-label text-xs font-semibold text-outline tracking-[0.15em] uppercase mb-1">
                  {t('donationSuccess.transactionId')}
                </span>
                <span className="font-body text-sm font-medium text-on-surface font-mono">
                  #{donationId.slice(-8).toUpperCase()}
                </span>
              </div>
            )}

            {/* CTA */}
            <Button fullWidth onClick={() => navigate(isAuthenticated ? '/campers' : '/login')}>
              {t('donationSuccess.returnHome')}
            </Button>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
