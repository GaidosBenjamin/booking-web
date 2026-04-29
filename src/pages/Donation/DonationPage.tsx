import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createDonation } from '../../api/donations';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ToastProvider';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import disciples from '../../assets/disciples.jpg';

const PRESET_AMOUNTS = [100, 250, 500, 1000] as const;
const ORG_SLUG = import.meta.env.VITE_ORG_SLUG as string;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default function DonationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`${API_BASE_URL}/actuator/health`, { method: 'HEAD' }).catch(() => {});
  }, []);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const canDonate = !!effectiveAmount && effectiveAmount > 0 && !isSubmitting;

  const handleDonate = async () => {
    if (!effectiveAmount) return;
    setIsSubmitting(true);
    try {
      const donation = await createDonation({
        amount: effectiveAmount,
        currency: 'RON',
        ...(name.trim() && { name: name.trim() }),
        orgSlug: ORG_SLUG,
      });
      if (donation.checkoutUrl) {
        window.open(donation.checkoutUrl, '_self');
      } else {
        showToast(t('donation.toasts.createFailed'), 'error');
        setIsSubmitting(false);
      }
    } catch {
      showToast(t('donation.toasts.createFailed'), 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AppHeader
        title={t('common.appName')}
        onBack={() => navigate(isAuthenticated ? '/campers' : '/login')}
      />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col md:flex-row gap-12 lg:gap-24 items-start">
        {/* Left — Editorial */}
        <div className="w-full md:w-1/2 flex flex-col gap-8 md:sticky md:top-32">
          <div className="flex flex-col gap-4">
            <span className="font-label text-secondary font-bold tracking-widest uppercase text-sm">{t('donation.badge')}</span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight">
              {t('donation.headline')}
            </h1>
          </div>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            {t('donation.body')}
          </p>
          <div className="h-64 md:h-80 w-full rounded-[2rem] overflow-hidden ambient-shadow relative group">
            <img
              src={disciples}
              alt={t('donation.headline')}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right — Donation Form */}
        <div className="w-full md:w-1/2 bg-surface/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-[0_24px_48px_rgba(0,58,99,0.08)] border-4 border-white/50 relative">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
          </div>

          <h2 className="font-headline text-2xl font-bold text-primary mb-8 relative z-10">{t('donation.selectAmount')}</h2>

          {/* Preset amounts */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {PRESET_AMOUNTS.map((amount) => {
              const isSelected = selectedAmount === amount && !customAmount;
              return (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                  className={`py-6 rounded-xl font-headline font-bold text-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-xl'
                      : 'bg-surface-container-lowest text-primary border border-transparent hover:border-outline-variant/20 ambient-shadow'
                  }`}
                >
                  {amount} {t('donation.currency')}
                  <span className={`font-body text-xs font-normal transition-colors ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                    {t(`donation.amounts.${amount}`)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom amount */}
          <div className="mb-6">
            <label className="font-label text-sm font-semibold text-on-surface-variant mb-2 block" htmlFor="custom-amount">
              {t('donation.customAmount')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline font-bold text-lg pointer-events-none">
                {t('donation.currency')}
              </span>
              <input
                id="custom-amount"
                type="number"
                min="1"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                placeholder={t('donation.customAmountPlaceholder')}
                className="w-full h-14 bg-surface-container-high border-none rounded-xl pl-16 pr-4 text-base font-headline font-semibold text-primary focus:ring-2 focus:ring-secondary/50 placeholder:text-outline"
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-10">
            <label className="font-label text-sm font-semibold text-on-surface-variant mb-2 block" htmlFor="donor-name">
              {t('donation.name')}
            </label>
            <input
              id="donor-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('donation.namePlaceholder')}
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-base text-primary font-medium focus:ring-2 focus:ring-secondary/50 placeholder:text-outline"
            />
          </div>

          {/* Stripe CTA */}
          <button
            disabled={!canDonate}
            onClick={handleDonate}
            className="w-full flex items-center justify-between p-5 bg-[#635BFF] hover:bg-[#5851E0] text-white rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="text-left">
                <p className="font-headline font-bold text-lg">{t('donation.donateWithStripe')}</p>
                <p className="text-xs text-white/80">{t('donation.stripeSubtitle')}</p>
              </div>
            </div>
            {isSubmitting
              ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
              : <span className="material-symbols-outlined">open_in_new</span>
            }
          </button>
          <p className="text-center font-body text-xs text-outline mt-4">{t('donation.disclaimer')}</p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
