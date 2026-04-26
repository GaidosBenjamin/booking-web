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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-primary hover:opacity-80 transition-opacity active:scale-95 p-2 -ml-2 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold text-lg text-primary text-center flex-1 pr-10">{t('checkout.title')}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto pt-24 pb-32 px-6 flex flex-col justify-center relative z-10">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-error-container/50 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-error-container opacity-50 animate-pulse" />
            <span className="material-symbols-outlined text-error text-5xl relative z-10" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>error</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-4 tracking-tight">{t('bookingFailed.title')}</h2>
          <p className="font-body text-on-surface-variant text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t('bookingFailed.subtitle') }} />
        </div>

        {/* Reason Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 mb-8 flex items-start gap-4 ambient-shadow">
          <div className="mt-0.5 text-error">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card_off</span>
          </div>
          <div className="flex-1">
            <h3 className="font-headline font-semibold text-sm text-on-surface mb-1">{t('bookingFailed.reasonTitle')}</h3>
            <p className="font-body text-sm text-on-surface-variant">{t('bookingFailed.reasonBody')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-auto">
          <Button fullWidth loading={retryMut.isPending} onClick={() => retryMut.mutate()} icon="refresh" iconPosition="left">
            {t('bookingFailed.tryAgain')}
          </Button>
          <button className="w-full bg-surface-container-lowest text-primary border border-outline-variant/30 font-label font-semibold text-base py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98]">
            <span className="material-symbols-outlined text-xl">support_agent</span>
            {t('bookingFailed.contactSupport')}
          </button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
