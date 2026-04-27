import { useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { cancelBooking } from '../../api/bookings';
import { useToast } from '../../components/ToastProvider';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function BookingFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || sessionStorage.getItem('bookingId') || '';
  const { showToast } = useToast();
  const { t } = useTranslation();

  const retryMut = useMutation({
    mutationFn: async () => {
      if (bookingId) await cancelBooking(bookingId);
    },
    onSuccess: () => navigate('/checkout'),
    onError: () => showToast(t('bookingFailed.toasts.retryFailed'), 'error'),
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
        {/* Error Icon */}
        <div className="w-28 h-28 rounded-full bg-error-container flex items-center justify-center mb-8 shadow-card relative animate-scale-in">
          <div className="absolute inset-0 rounded-full border-4 border-surface-container-lowest/50 scale-110 opacity-50" />
          <span className="material-symbols-outlined text-[56px] text-on-error-container" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
        </div>

        {/* Headline */}
        <div className="text-center mb-12 w-full">
          <h1 className="font-display text-4xl font-extrabold text-on-surface mb-4 tracking-tight">{t('bookingFailed.title')}</h1>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-[280px] mx-auto"
            dangerouslySetInnerHTML={{ __html: t('bookingFailed.subtitle') }} />
        </div>

        {/* Reason Card */}
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-8 mb-12 shadow-card flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-error-container/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="mt-0.5 shrink-0 text-error">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card_off</span>
            </div>
            <div className="flex-1">
              <h3 className="font-label font-semibold text-sm text-on-surface mb-1">{t('bookingFailed.reasonTitle')}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{t('bookingFailed.reasonBody')}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-4">
          <Button fullWidth loading={retryMut.isPending} onClick={() => retryMut.mutate()} icon="refresh" iconPosition="left">
            {t('bookingFailed.tryAgain')}
          </Button>
          <Button fullWidth variant="secondary" onClick={() => navigate('/contact')} icon="support_agent" iconPosition="left">
            {t('bookingFailed.contactSupport')}
          </Button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
