import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createBooking, getBookings, cancelBooking, confirmBooking } from '../../api/bookings';
import { getCampers } from '../../api/campers';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useToast } from '../../components/ToastProvider';
import AppHeader from '../../components/AppHeader';
import Countdown from '../../components/Countdown';
import AppFooter from '../../components/AppFooter';
import Button from '../../components/Button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: campers } = useQuery({ queryKey: ['campers'], queryFn: getCampers });
  const [booking, setBooking] = useState<Awaited<ReturnType<typeof getBookings>>[0] | null>(null);
  const [expired, setExpired] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    if (!campers || !initializing || initRef.current) return;
    initRef.current = true;
    (async () => {
      try {
        const existing = await getBookings();
        const pendingBookings = existing.filter(b => b.status === 'PENDING');
        const latestPending = pendingBookings[pendingBookings.length - 1];

        if (latestPending?.checkoutUrl) {
          setBooking(latestPending);
        } else if (latestPending?.status === 'PENDING' && latestPending.amountTotal === 0) {
          setBooking(latestPending);
        } else {
          await Promise.all(pendingBookings.map(b => cancelBooking(b.id)));
          const camperIds = campers.filter(c => c.status === 'NEEDS_PAYMENT').map(c => c.id);
          if (camperIds.length === 0) {
            showToast(t('checkout.toasts.createFailed'), 'error');
            return;
          }
          const created = await createBooking({ camperIds });
          setBooking(created);
        }
      } catch {
        showToast(t('checkout.toasts.createFailed'), 'error');
      } finally {
        setInitializing(false);
      }
    })();
  }, [campers, initializing]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelMut = useMutation({
    mutationFn: () => cancelBooking(booking!.id),
    onSuccess: () => { showToast(t('checkout.toasts.cancelSuccess')); navigate('/campers'); },
    onError: () => showToast(t('checkout.toasts.cancelFailed'), 'error'),
  });

  const confirmMut = useMutation({
    mutationFn: () => confirmBooking(booking!.id),
    onSuccess: (confirmed) => {
      queryClient.invalidateQueries({ queryKey: ['campers'] });
      showToast(t('checkout.toasts.confirmSuccess'));
      navigate(`/booking/success?bookingId=${confirmed.id}`);
    },
    onError: () => showToast(t('checkout.toasts.confirmFailed'), 'error'),
  });

  const subtotal = booking?.items.reduce((sum, i) => sum + i.price, 0) || 0;
  const baseSubtotal = booking?.items.reduce((sum, i) => sum + i.tier.basePrice, 0) || 0;
  const isFreeCheckout = booking?.status === 'PENDING' && (booking.amountTotal ?? subtotal) === 0;

  if (initializing) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader
        title={t('checkout.title')}
        rightAction={
          <button onClick={() => navigate('/contact')} className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center hover:bg-secondary-container/80 transition-colors">
            <span className="material-symbols-outlined text-on-secondary-container text-sm">support_agent</span>
          </button>
        }
      />

      <main className="pt-20 px-4 max-w-md mx-auto pb-32">
        {expired && (
          <div className="mt-4 mb-8 bg-error-container rounded-2xl p-4 text-center">
            <p className="text-on-error-container font-bold">{t('checkout.expired')}</p>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-headline font-bold text-xl text-primary">{t('checkout.familySummary')}</h2>
            <span className="text-xs font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase tracking-wider">
              {t(`checkout.camperCount`, { count: booking?.items.length || 0 })}
            </span>
          </div>
          {booking?.items.map((item, idx) => {
            const camper = item.camper;
            const isFreeItem = item.price === 0;
            return (
              <div key={`${item.camper.id}-${idx}`} className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-variant/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface">{camper?.firstName} {camper?.lastName}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">bed</span>
                        {t('checkout.roomAssigned')}
                      </p>
                      {item.holdExpiresAt && new Date(item.holdExpiresAt).getTime() > Date.now() && (
                        <p className="text-xs text-secondary font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          {t('checkout.reservedFor')} <Countdown
                            expiresAt={new Date(item.holdExpiresAt).toISOString()}
                            onExpired={() => {
                              setExpired(true);
                              showToast(t('checkout.expired'), 'error');
                              cancelMut.mutate();
                            }}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {isFreeItem ? (
                      <span className="font-headline font-bold text-primary text-xl">{t('checkout.free')}</span>
                    ) : user?.member && item.tier.basePrice > item.price ? (
                      <>
                        <span className="block text-xs text-outline line-through leading-none mb-1.5 font-bold opacity-60">
                          {item.tier.basePrice.toFixed(0)} {booking?.currency}
                        </span>
                        <span className="block font-headline font-bold text-primary text-xl leading-none">
                          {item.price.toFixed(0)} {booking?.currency}
                        </span>
                      </>
                    ) : (
                      <span className="font-headline font-bold text-primary text-xl">
                        {item.price.toFixed(0)} {booking?.currency}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-8 bg-surface-container-low rounded-2xl p-6 border border-surface-variant/20">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-on-surface-variant">
              <span>{t('checkout.subtotal')}</span>
              <div className="text-right">
                {isFreeCheckout ? (
                  <span className="font-medium">{t('checkout.free')}</span>
                ) : user?.member && baseSubtotal > subtotal ? (
                  <>
                    <span className="block text-xs text-outline line-through opacity-60 font-bold leading-none mb-1">
                      {baseSubtotal.toFixed(0)} {booking?.currency}
                    </span>
                    <span className="font-bold text-primary">
                      {subtotal.toFixed(0)} {booking?.currency}
                    </span>
                  </>
                ) : (
                  <span className="font-medium">{subtotal.toFixed(0)} {booking?.currency}</span>
                )}
              </div>
            </div>
            {user?.member && !isFreeCheckout && (
              <div className="flex justify-between text-sm text-secondary">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px]">verified</span>{t('checkout.memberDiscount')}
                </span>
              </div>
            )}
            <div className="pt-4 mt-2 border-t border-outline-variant/30 flex justify-between items-center">
              <span className="font-headline font-bold text-lg text-on-surface">{t('checkout.grandTotal')}</span>
              <span className="font-headline font-extrabold text-2xl text-primary">
                {isFreeCheckout ? t('checkout.free') : `${(booking?.amountTotal ?? subtotal).toFixed(0)} ${booking?.currency}`}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <h2 className="font-headline font-bold text-xl text-primary px-1">
            {isFreeCheckout ? t('checkout.confirmation') : t('checkout.paymentMethod')}
          </h2>
          {isFreeCheckout ? (
            <>
              <Button
                fullWidth
                disabled={expired || !booking || confirmMut.isPending}
                loading={confirmMut.isPending}
                onClick={() => confirmMut.mutate()}
                icon="check_circle"
              >
                {t('checkout.confirmBooking')}
              </Button>
              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">info</span>
                <p className="text-[11px] leading-relaxed text-on-surface-variant">{t('checkout.confirmDisclaimer')}</p>
              </div>
            </>
          ) : (
            <>
              <button
                disabled={expired || !booking?.checkoutUrl}
                onClick={() => booking?.checkoutUrl && window.open(booking.checkoutUrl, '_self')}
                className="w-full flex items-center justify-between p-5 bg-[#635BFF] hover:bg-[#5851E0] text-white rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-lg"><span className="material-symbols-outlined">lock</span></div>
                  <div className="text-left">
                    <p className="font-headline font-bold text-lg">{t('checkout.payWithStripe')}</p>
                    <p className="text-xs text-white/80">{t('checkout.stripeSubtitle')}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined">open_in_new</span>
              </button>
              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">shield</span>
                <p className="text-[11px] leading-relaxed text-on-surface-variant">{t('checkout.stripeDisclaimer')}</p>
              </div>
            </>
          )}
        </section>

        <div className="mt-8 text-center">
          <button onClick={() => cancelMut.mutate()} className="text-sm text-on-surface-variant hover:text-error font-medium transition-colors">
            {t('checkout.cancelBooking')}
          </button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
