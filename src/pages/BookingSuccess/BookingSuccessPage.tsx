import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getBooking } from '../../api/bookings';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const bookingId = searchParams.get('bookingId') || sessionStorage.getItem('bookingId') || '';
  const { data: user } = useCurrentUser();
  const { data: booking } = useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => getBooking(bookingId),
    enabled: !!bookingId,
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-x-hidden">
      {/* Atmospheric blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-secondary-fixed/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 w-full max-w-lg mx-auto relative z-10">
        {/* Checkmark */}
        <div className="w-28 h-28 rounded-full bg-secondary-fixed flex items-center justify-center mb-8 shadow-card relative animate-scale-in">
          <div className="absolute inset-0 rounded-full border-4 border-surface-container-lowest/50 scale-110 opacity-50" />
          <span className="material-symbols-outlined text-[56px] text-on-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>

        {/* Headline */}
        <div className="text-center mb-12 w-full">
          <h1 className="font-display text-4xl font-extrabold text-primary mb-4 tracking-tight">{t('bookingSuccess.title')}</h1>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-[280px] mx-auto">
            {t('bookingSuccess.subtitle')}
          </p>
        </div>

        {/* Summary Card */}
        <div className="w-full bg-surface-container-lowest rounded-[2rem] p-8 mb-12 shadow-card flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-fixed/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-label text-xs font-semibold uppercase tracking-widest text-outline mb-2">{t('bookingSuccess.orderId')}</p>
                <p className="font-body text-on-surface font-semibold text-lg font-mono">{bookingId ? `#${bookingId.slice(0, 8).toUpperCase()}` : '—'}</p>
              </div>
              <div className="text-right">
                <p className="font-label text-xs font-semibold uppercase tracking-widest text-outline mb-2">{t('bookingSuccess.totalPaid')}</p>
                <p className="font-display text-primary font-bold text-3xl">
                  ${booking?.amountTotal?.toFixed(0) || '—'}<span className="text-xl text-primary/70">.{((booking?.amountTotal || 0) % 1 * 100).toFixed(0).padStart(2, '0')}</span>
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {t('bookingSuccess.emailConfirmation', { email: user?.email || 'your registered address' })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-4">
          <Button fullWidth onClick={() => navigate('/campers')}>{t('bookingSuccess.viewRoster')}</Button>
          <Button fullWidth variant="secondary" onClick={() => navigate('/')}>{t('bookingSuccess.backHome')}</Button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
