import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getCampers, createCamper, updateCamper, deleteCamper } from '../../api/campers';
import { getBookings, cancelBooking } from '../../api/bookings';
import type { CamperResponse, CreateCamperRequest } from '../../types/camper';
import { useToast } from '../../components/ToastProvider';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import StatusChip from '../../components/StatusChip';
import Button from '../../components/Button';
import { SkeletonList } from '../../components/Skeleton';
import Countdown from '../../components/Countdown';
import AppFooter from '../../components/AppFooter';

function getAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

interface CamperFormData {
  firstName: string; lastName: string; dateOfBirth: string;
  grade: string; gender: 'male' | 'female'; specialRequirements: string;
}

const emptyForm: CamperFormData = { firstName: '', lastName: '', dateOfBirth: '', grade: '', gender: 'male', specialRequirements: '' };

export default function CampersPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newCamperOpen, setNewCamperOpen] = useState(false);
  const [formData, setFormData] = useState<CamperFormData>(emptyForm);

  const { data: campers, isLoading } = useQuery({ queryKey: ['campers'], queryFn: getCampers });

  const createMut = useMutation({
    mutationFn: (data: CreateCamperRequest) => createCamper(data),
    onSuccess: async () => { 
      try {
        const existing = await getBookings();
        await Promise.all(existing.filter(b => b.status === 'PENDING').map(p => cancelBooking(p.id)));
      } catch (e) { console.error(e); }
      queryClient.invalidateQueries({ queryKey: ['campers'] }); 
      setNewCamperOpen(false); 
      setFormData(emptyForm); 
      showToast(t('campers.toasts.added')); 
    },
    onError: () => showToast(t('campers.toasts.addFailed'), 'error'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CamperFormData> }) => updateCamper(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['campers'] }); setExpandedId(null); showToast(t('campers.toasts.updated')); },
    onError: () => showToast(t('campers.toasts.updateFailed'), 'error'),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      try {
        const existing = await getBookings();
        await Promise.all(existing.filter(b => b.status === 'PENDING').map(p => cancelBooking(p.id)));
      } catch (e) { console.error(e); }
      return deleteCamper(id);
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['campers'] }); 
      showToast(t('campers.toasts.removed')); 
    },
    onError: () => showToast(t('campers.toasts.removeFailed'), 'error'),
  });

  const allReady = campers?.every(c => c.status !== 'NEEDS_BED') && (campers?.length ?? 0) > 0;

  const handleSaveNew = () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.grade) {
      showToast(t('campers.toasts.fillRequired'), 'error'); return;
    }
    createMut.mutate({ ...formData, specialRequirements: formData.specialRequirements || undefined });
  };

  const handleSaveEdit = (camper: CamperResponse) => {
    updateMut.mutate({ id: camper.id, data: formData });
  };

  const startEdit = (camper: CamperResponse) => {
    setFormData({ firstName: camper.firstName, lastName: camper.lastName, dateOfBirth: camper.dateOfBirth, grade: camper.grade, gender: camper.gender, specialRequirements: camper.specialRequirements || '' });
    setExpandedId(camper.id);
    setNewCamperOpen(false);
  };

  const renderForm = (onSave: () => void, onRemove?: () => void) => (
    <div className="px-6 pb-8 pt-2 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">{t('campers.form.firstName')}</label>
          <input value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} className="w-full h-12 bg-surface-container-high border-none rounded-lg px-3 text-base text-primary font-medium focus:ring-2 focus:ring-secondary/20" />
        </div>
        <div className="space-y-1.5">
          <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">{t('campers.form.lastName')}</label>
          <input value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} className="w-full h-12 bg-surface-container-high border-none rounded-lg px-3 text-base text-primary font-medium focus:ring-2 focus:ring-secondary/20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">{t('campers.form.dateOfBirth')}</label>
          <input type="date" value={formData.dateOfBirth} onChange={e => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))} className="w-full min-w-0 h-12 bg-surface-container-high border-none rounded-lg px-3 text-base text-primary font-medium focus:ring-2 focus:ring-secondary/20" />
        </div>
        <div className="space-y-1.5">
          <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">{t('campers.form.grade')}</label>
          <div className="relative">
            <select value={formData.grade} onChange={e => setFormData(p => ({ ...p, grade: e.target.value }))} className="w-full h-12 bg-surface-container-high border-none rounded-lg px-3 text-base text-primary font-medium focus:ring-2 focus:ring-secondary/20 appearance-none pr-10">
              <option value="" disabled>{t('campers.form.gradePlaceholder')}</option>
              <option value="1">{t('campers.form.gradeOptions.1')}</option>
              <option value="2">{t('campers.form.gradeOptions.2')}</option>
              <option value="3">{t('campers.form.gradeOptions.3')}</option>
              <option value="4">{t('campers.form.gradeOptions.4')}</option>
              <option value="5">{t('campers.form.gradeOptions.5')}</option>
              <option value="6">{t('campers.form.gradeOptions.6')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">{t('campers.form.gender')}</label>
        <div className="flex bg-surface-container-high p-1 rounded-xl w-full">
          <button type="button" onClick={() => setFormData(p => ({ ...p, gender: 'male' }))} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.gender === 'male' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>{t('campers.form.boy')}</button>
          <button type="button" onClick={() => setFormData(p => ({ ...p, gender: 'female' }))} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.gender === 'female' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>{t('campers.form.girl')}</button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">{t('campers.form.specialRequirements')}</label>
        <textarea value={formData.specialRequirements} onChange={e => setFormData(p => ({ ...p, specialRequirements: e.target.value }))} placeholder={t('campers.form.specialRequirementsPlaceholder')} className="w-full bg-surface-container-high border-none rounded-lg p-3 text-base text-primary font-medium focus:ring-2 focus:ring-secondary/20 h-24" />
      </div>
      <div className="pt-4 flex items-center justify-between gap-3">
        {onRemove && <button onClick={onRemove} className="flex-1 px-4 py-2 border border-outline text-primary font-semibold text-sm rounded-xl hover:bg-surface-container-low transition-colors">{t('common.remove')}</button>}
        <button onClick={onSave} className="flex-1 px-6 py-2 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">{t('common.save')}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pb-32 flex flex-col">
      <AppHeader
        title={t('campers.title')}
        showBack={false}
        rightAction={
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center"
            title={t('common.logout')}
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        }
      />
      <main className="pt-24 px-6 max-w-2xl mx-auto flex-grow">
        <section className="mb-8">
          <h2 className="font-headline text-3xl font-extrabold text-primary mb-2">{t('campers.headline')}</h2>
          <p className="text-on-surface-variant font-light leading-relaxed">{t('campers.subtitle')}</p>
        </section>

        {isLoading ? <SkeletonList count={2} /> : (
          <div className="space-y-4">
            {campers?.map(camper => (
              <div key={camper.id} className={`bg-surface-container-lowest rounded-xl shadow-card overflow-hidden border-l-4 ${camper.status === 'PAYMENT_SUCCESS' ? 'border-secondary' : camper.status === 'NEEDS_BED' ? 'border-error' : 'border-tertiary'}`}>
                <div 
                  onClick={() => expandedId === camper.id ? setExpandedId(null) : startEdit(camper)} 
                  className="p-5 flex justify-between items-start cursor-pointer hover:bg-surface-container/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${camper.status === 'NEEDS_BED' ? 'bg-error-container' : 'bg-secondary-container'}`}>
                      <span className="material-symbols-outlined text-on-secondary-container">child_care</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-lg text-primary">{camper.firstName} {camper.lastName.charAt(0)}.</h3>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{t('campers.age', { age: getAge(String(camper.dateOfBirth)) })}</span>
                        <StatusChip status={camper.status} />
                      </div>
                      {camper.roomHold?.holdExpiresAt && new Date(camper.roomHold.holdExpiresAt).getTime() > Date.now() && (
                        <div className="text-xs text-secondary font-medium mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          {t('campers.room.reservedFor')} <Countdown expiresAt={new Date(camper.roomHold.holdExpiresAt).toISOString()} onExpired={() => queryClient.invalidateQueries({ queryKey: ['campers'] })} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">{expandedId === camper.id ? 'expand_less' : 'edit'}</span>
                  </div>
                </div>
                {/* Bed action */}
                {expandedId !== camper.id && (
                  <div className="px-5 pb-4">
                    {camper.status === 'NEEDS_BED' ? (
                      <button
                        onClick={() => navigate(`/campers/${camper.id}/building`)}
                        disabled={camper.roomsAvailable === false}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors border ${camper.roomsAvailable === false ? 'bg-surface-container-high border-outline-variant cursor-not-allowed opacity-70' : 'bg-error-container/20 border-error/20 hover:bg-error-container/30'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${camper.roomsAvailable === false ? 'bg-outline-variant text-surface' : 'bg-error-container text-on-error-container'}`}>
                            <span className="material-symbols-outlined">bed</span>
                          </div>
                          <div className="text-left">
                            <p className={`text-sm font-bold ${camper.roomsAvailable === false ? 'text-on-surface-variant' : 'text-error'}`}>
                              {t('campers.room.pickRoom')}
                            </p>
                            <p className={`text-[11px] ${camper.roomsAvailable === false ? 'text-error font-semibold' : 'text-on-error-container/70'}`}>
                              {camper.roomsAvailable === false ? t('campers.room.noRoomsAvailable') : t('campers.room.noRoom')}
                            </p>
                          </div>
                        </div>
                        <span className={`material-symbols-outlined ${camper.roomsAvailable === false ? 'text-on-surface-variant' : 'text-error'}`}>
                          {camper.roomsAvailable === false ? 'block' : 'chevron_right'}
                        </span>
                      </button>
                    ) : camper.status === 'PAYMENT_SUCCESS' ? (
                      <div className="w-full flex items-center justify-between p-3 bg-secondary-container/20 border border-secondary/20 rounded-lg opacity-70 cursor-not-allowed">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden flex items-center justify-center text-on-secondary-container">
                            {camper.roomAssignment?.imageUrl ? (
                              <img src={camper.roomAssignment.imageUrl} alt={camper.roomAssignment.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined">bed</span>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-secondary">{t('campers.room.confirmed')}</p>
                            <p className="text-[11px] text-on-secondary-container/70">
                              {camper.roomAssignment ? `${camper.roomAssignment.buildingName} - ${camper.roomAssignment.name}` : t('campers.room.pickRoom')}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-secondary">lock</span>
                      </div>
                    ) : (
                      <button onClick={() => navigate(`/campers/${camper.id}/building`)} className="w-full flex items-center justify-between p-3 bg-secondary-container/20 border border-secondary/20 rounded-lg hover:bg-secondary-container/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden flex items-center justify-center text-on-secondary-container">
                            {camper.roomHold?.imageUrl ? (
                              <img src={camper.roomHold.imageUrl} alt={camper.roomHold.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined">bed</span>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-secondary">{t('campers.room.changeRoom')}</p>
                            <p className="text-[11px] text-on-secondary-container/70">
                              {camper.roomHold ? `${camper.roomHold.buildingName} - ${camper.roomHold.name}` : t('campers.room.pickRoom')}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-secondary">edit</span>
                      </button>
                    )}
                  </div>
                )}
                {expandedId === camper.id && renderForm(() => handleSaveEdit(camper), () => deleteMut.mutate(camper.id))}
              </div>
            ))}

            {/* New camper form */}
            {newCamperOpen && (
              <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden border-l-4 border-primary">
                <div className="p-5"><h3 className="font-headline font-bold text-lg text-primary">{t('campers.newCamper')}</h3></div>
                {renderForm(handleSaveNew)}
              </div>
            )}

            {/* Add another — only shown when at least one camper exists */}
            {campers && campers.length > 0 && <button onClick={() => { setNewCamperOpen(true); setExpandedId(null); setFormData(emptyForm); }} className="w-full py-6 mt-6 border-2 border-dashed border-outline-variant hover:border-secondary hover:bg-secondary/5 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <span className="font-headline font-bold text-primary group-hover:text-secondary">{t('campers.addAnother')}</span>
            </button>}

            {(!campers || campers.length === 0) && !newCamperOpen && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                <p className="text-on-surface-variant text-lg font-medium mb-4">{t('campers.noCampers')}</p>
                <Button onClick={() => { setNewCamperOpen(true); setFormData(emptyForm); }} icon="person_add">{t('campers.addFirst')}</Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky CTA */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md rounded-t-[2rem] shadow-[0_-12px_32px_rgba(25,28,30,0.06)]">
        <div className="flex flex-col items-center justify-center p-6 pb-8 w-full gap-2 max-w-2xl mx-auto">
          <Button fullWidth disabled={!allReady} onClick={() => navigate('/code-of-conduct')} icon="arrow_forward">
            {t('campers.proceedCheckout')}
          </Button>
          {!allReady && campers && campers.length > 0 && (
            <p className="text-center text-xs text-on-surface-variant">{t('campers.selectRoomFirst')}</p>
          )}
        </div>
      </nav>

      <div className="flex justify-center pb-4 mt-20">
        <button
          type="button"
          onClick={() => navigate('/donation')}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-primary text-primary font-headline font-semibold text-base hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>volunteer_activism</span>
          {t('login.donateButton')}
        </button>
      </div>

      <AppFooter />
    </div>
  );
}
