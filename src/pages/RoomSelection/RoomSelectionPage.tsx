import { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, getHolds, createHold } from '../../api/rooms';
import { getCampers } from '../../api/campers';
import { getBookings, cancelBooking } from '../../api/bookings';
import { useToast } from '../../components/ToastProvider';
import AppHeader from '../../components/AppHeader';

import Countdown from '../../components/Countdown';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import { SkeletonList } from '../../components/Skeleton';

function getAge(dob: string): number {
  const b = new Date(dob), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
  return a;
}



export default function RoomSelectionPage() {
  const { camperId } = useParams<{ camperId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { buildingId, buildingName } = (location.state as { buildingId?: string; buildingName?: string }) || {};
  const { data: campers } = useQuery({ queryKey: ['campers'], queryFn: getCampers });
  const camper = campers?.find(c => c.id === camperId);
  const camperAge = camper ? getAge(camper.dateOfBirth) : 0;

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', camper?.gender, camperAge, buildingId],
    queryFn: () => getRooms(camper!.gender, camperAge, buildingId),
    enabled: !!camper && !!buildingId,
    refetchInterval: 15_000,
  });

  const { data: holds } = useQuery({ queryKey: ['holds'], queryFn: getHolds, refetchInterval: 15_000 });
  const existingHold = holds?.find(h => h.camperId === camperId);

  const quotes = t('roomSelection.quotes', { returnObjects: true }) as string[];
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [quotes]);

  const holdMut = useMutation({
    mutationFn: (roomId: string) => createHold(roomId, { camperId: camperId! }),
    onSuccess: async () => {
      try {
        const existing = await getBookings();
        await Promise.all(existing.filter(b => b.status === 'PENDING').map(p => cancelBooking(p.id)));
      } catch (e) { console.error(e); }
      queryClient.invalidateQueries({ queryKey: ['holds'] });
      queryClient.invalidateQueries({ queryKey: ['campers'] });
      showToast(t('roomSelection.toasts.selected'));
      navigate('/campers');
    },
    onError: () => showToast(t('roomSelection.toasts.failed'), 'error'),
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader title={t('roomSelection.pickingFor', { name: camper?.firstName || '...' })} />
      <main className="pt-20 px-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-primary leading-tight tracking-tight mb-3 font-headline">
            {t('roomSelection.headline', { name: camper?.firstName || '...' })}
          </h2>
          <p className="text-on-surface-variant font-medium text-sm">{quote}</p>
          {buildingName && <p className="text-secondary text-xs font-bold mt-1 uppercase tracking-wide">{buildingName}</p>}
        </div>

        {existingHold && (
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-outline text-xs font-bold uppercase tracking-widest">{t('roomSelection.reservedFor')}</p>
              <Countdown expiresAt={existingHold.expiresAt} className="text-2xl text-primary" />
            </div>
          </div>
        )}

        {isLoading ? <SkeletonList count={3} /> : (
          <div className="space-y-6">
            {rooms?.map(room => {
              const available = room.capacity - room.assignments.length - room.holds.length;
              const isFull = available <= 0;
              const isDisabled = isFull || !!room.leaderRoom;
              const isSelected = selectedRoomId === room.id;
              const assignments = room.assignments.map(a => ({ ...a, isHold: false }));
              const holds = room.holds.map(h => ({ ...h, isHold: true }));
              const occupants = [...assignments, ...holds];
              return (
                <div key={room.id} onClick={() => !isDisabled && setSelectedRoomId(room.id)}
                  className={`group relative bg-surface-container-lowest rounded-[1.5rem] overflow-hidden ambient-shadow transition-all duration-300 ${isDisabled ? 'opacity-60 cursor-not-allowed grayscale-[30%]' : 'hover:translate-y-[-4px] active:scale-[0.98] cursor-pointer'} ${isSelected ? 'outline outline-2 outline-offset-2 outline-primary shadow-xl translate-y-[-4px]' : 'outline-none'}`}>
                  <div className="relative h-48 overflow-hidden">
                    {room.imageUrl ? (
                      <img src={room.imageUrl} alt={room.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-tertiary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>bed</span>
                      </div>
                    )}
                    {isFull ? (
                      <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-error text-on-error px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-lg">
                          {t('roomSelection.full')}
                        </span>
                      </div>
                    ) : room.leaderRoom ? (
                      <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                          {t('roomSelection.leadersRoom')}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary font-headline">{room.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-secondary text-xs font-bold uppercase tracking-wider">
                            {isFull ? t('roomSelection.full') : t('roomSelection.available', { available, capacity: room.capacity })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-5 border-t border-outline-variant/10">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-3">{t('roomSelection.roommates')}</p>
                      {occupants.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                          {occupants.map(o => (
                            o.isLeader ? (
                              <div key={o.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                <span className="text-xs font-bold text-primary">{t('roomSelection.leader')}</span>
                              </div>
                            ) : (
                              <div key={o.id} className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-sm ${o.isHold ? 'bg-surface-container opacity-60 border border-dashed border-outline-variant/50 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.02)_4px,rgba(0,0,0,0.02)_8px)]' : 'bg-surface-container-low'}`}>
                                <Avatar firstName={o.firstName} lastName={o.lastName} size="sm" />
                                <span className="text-xs font-bold text-on-surface">{o.firstName} {o.lastName.charAt(0)}.</span>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-outline opacity-80 italic">{t('roomSelection.noRoommates')}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md rounded-t-[2rem] shadow-[0_-12px_32px_rgba(25,28,30,0.06)]">
        <div className="flex flex-col items-center justify-center p-6 pb-8 w-full gap-2 max-w-2xl mx-auto">
          <Button fullWidth disabled={!selectedRoomId} loading={holdMut.isPending} onClick={() => selectedRoomId && holdMut.mutate(selectedRoomId)} icon="arrow_forward">
            {t('roomSelection.selectButton')}
          </Button>
        </div>
      </nav>
      <AppFooter />
    </div>
  );
}
