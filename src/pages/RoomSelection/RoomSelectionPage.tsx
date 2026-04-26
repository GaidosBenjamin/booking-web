import { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
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

const funQuotes = [
  'Rooms are assigned by availability.',
  'Your camper will love their bunkmates!',
  'First come, first served.',
];

export default function RoomSelectionPage() {
  const { camperId } = useParams<{ camperId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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
  });

  const { data: holds } = useQuery({ queryKey: ['holds'], queryFn: getHolds });
  const existingHold = holds?.find(h => h.camperId === camperId);

  const quote = useMemo(() => funQuotes[Math.floor(Math.random() * funQuotes.length)], []);

  const holdMut = useMutation({
    mutationFn: (roomId: string) => createHold(roomId, { camperId: camperId! }),
    onSuccess: async () => {
      try {
        const existing = await getBookings();
        await Promise.all(existing.filter(b => b.status === 'PENDING').map(p => cancelBooking(p.id)));
      } catch (e) { console.error(e); }
      queryClient.invalidateQueries({ queryKey: ['holds'] });
      queryClient.invalidateQueries({ queryKey: ['campers'] });
      showToast('Room selected!');
      navigate('/campers');
    },
    onError: () => showToast('Failed to hold room. Please try again.', 'error'),
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader title={`Picking a Bed for ${camper?.firstName || '...'}`} />
      <main className="pt-20 px-6 max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-primary leading-tight tracking-tight mb-3 font-headline">
            Choose {camper?.firstName}'s Cabin Room
          </h2>
          <p className="text-on-surface-variant font-medium text-sm">{quote}</p>
          {buildingName && <p className="text-secondary text-xs font-bold mt-1 uppercase tracking-wide">{buildingName}</p>}
        </div>

        {existingHold && (
          <div className="bg-tertiary-container/30 rounded-xl p-4 mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            <div>
              <p className="text-on-tertiary-container text-xs font-bold">Room reserved for <Countdown expiresAt={existingHold.expiresAt} /></p>
            </div>
          </div>
        )}

        {isLoading ? <SkeletonList count={3} /> : (
          <div className="space-y-6">
            {rooms?.map(room => {
              const available = room.capacity - room.assignments.length - room.holds.length;
              const isFull = available <= 0;
              const isSelected = selectedRoomId === room.id;
              const assignments = room.assignments.map(a => ({ ...a, isHold: false }));
              const holds = room.holds.map(h => ({ ...h, isHold: true }));
              const occupants = [...assignments, ...holds];
              return (
                <div key={room.id} onClick={() => !isFull && setSelectedRoomId(room.id)}
                  className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-card transition-all ${isFull ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'ring-2 ring-secondary ring-offset-2' : ''}`}>
                  <div className="h-48 w-full relative">
                    {room.imageUrl ? (
                      <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-tertiary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>bed</span>
                      </div>
                    )}
                    {room.leaderRoom && (
                      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-white text-[12px]">workspace_premium</span>
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Leaders Room</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary font-headline">{room.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-secondary text-xs font-bold uppercase tracking-wider">
                            {isFull ? 'Full' : `${available} of ${room.capacity} beds available`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/20">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Current Roommates</p>
                      {occupants.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {occupants.map(o => (
                            <div key={o.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${o.isHold ? 'bg-surface-container opacity-60 border border-dashed border-outline-variant/50 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.02)_4px,rgba(0,0,0,0.02)_8px)]' : 'bg-surface-container-low'}`}>
                              <Avatar firstName={o.firstName} lastName={o.lastName} size="sm" />
                              <span className="text-xs font-semibold text-on-surface">{o.firstName} {o.lastName.charAt(0)}.</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-outline italic">No roommates yet. Be the first!</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-6 pb-8 pt-6 bg-white/90 backdrop-blur-md rounded-t-[2rem] shadow-[0_-12px_32px_rgba(25,28,30,0.06)]">
        <Button fullWidth disabled={!selectedRoomId} loading={holdMut.isPending} onClick={() => selectedRoomId && holdMut.mutate(selectedRoomId)} className="max-w-md">
          Select Room
        </Button>
      </nav>
      <AppFooter />
    </div>
  );
}
