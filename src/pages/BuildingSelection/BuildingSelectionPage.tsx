import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getBuildings } from '../../api/buildings';
import { getCampers } from '../../api/campers';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import AppHeader from '../../components/AppHeader';

import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';
import { SkeletonList } from '../../components/Skeleton';

function getAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function BuildingSelectionPage() {
  const { camperId } = useParams<{ camperId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'ro' ? 'ro' : 'en';
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const { data: campers } = useQuery({ queryKey: ['campers'], queryFn: getCampers });
  const camper = campers?.find(c => c.id === camperId);
  const camperAge = camper ? getAge(camper.dateOfBirth) : 0;

  const { data: buildings, isLoading } = useQuery({
    queryKey: ['buildings', camper?.gender, camperAge],
    queryFn: () => getBuildings(camper!.gender, camperAge),
    enabled: !!camper,
  });

  const handleContinue = () => {
    const building = buildings?.find(b => b.id === selectedId);
    if (building && camperId && !building.isFull) {
      navigate(`/campers/${camperId}/room`, { state: { buildingId: building.id, buildingName: building.name, camperId } });
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      <AppHeader title={t('buildingSelection.selectingFor', { name: camper?.firstName || '...' })} />
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <p className="text-secondary font-medium text-sm mb-2 tracking-wide uppercase">{t('buildingSelection.badge')}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight font-headline">
            {t('buildingSelection.headline', { name: camper?.firstName || '...' })}
          </h2>
        </div>

        {isLoading ? <SkeletonList count={3} /> : (
          <div className="space-y-6">
            {buildings?.map((building) => {
              const isSelected = selectedId === building.id;
              return (
                <div key={building.id} onClick={() => { if (!building.isFull) setSelectedId(building.id); }}
                  className={`group relative bg-surface-container-lowest rounded-[1.5rem] overflow-hidden ambient-shadow transition-all duration-300 ${building.isFull ? 'opacity-60 cursor-not-allowed grayscale-[30%]' : 'hover:translate-y-[-4px] active:scale-[0.98] cursor-pointer'} ${isSelected ? 'ring-4 ring-primary shadow-xl translate-y-[-4px]' : ''}`}>
                  <div className="relative h-48 overflow-hidden">
                    {building.imageUrl ? (
                      <img src={building.imageUrl} alt={building.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-primary/30" style={{ fontVariationSettings: "'FILL' 1" }}>cabin</span>
                      </div>
                    )}
                    {building.isFull ? (
                      <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-error text-on-error px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-lg">
                          {t('buildingSelection.full')}
                        </span>
                      </div>
                    ) : building.tier.memberDiscount && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> {t('buildingSelection.memberRate')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-secondary font-bold text-sm uppercase tracking-wide mb-1">{building.tier.name}</p>
                        <h3 className="text-2xl font-bold text-primary font-headline">{building.name}</h3>
                      </div>
                      <div className="text-right">
                        {user?.member && building.tier.memberDiscount ? (
                          <>
                            <span className="block text-sm text-outline line-through leading-none mb-1">
                              {building.tier.basePrice.toFixed(0)} {building.tier.currency}
                            </span>
                            <span className="block text-2xl font-extrabold text-primary leading-none">
                              {building.tier.discountPrice.toFixed(0)} {building.tier.currency}
                            </span>
                          </>
                        ) : (
                          <span className="block text-2xl font-extrabold text-primary">
                            {building.tier.basePrice.toFixed(0)} {building.tier.currency}
                          </span>
                        )}
                      </div>
                    </div>


                    <p className="mt-3 text-sm text-on-surface-variant leading-relaxed opacity-80 line-clamp-2">
                      {building.description[currentLang]}
                    </p>

                    <ul className="mt-5 space-y-3 text-sm text-on-surface-variant">
                      {(building.highlights[currentLang] || []).map((h, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[20px] text-secondary">
                            {h.icon === 'users' ? 'group' : (h.icon || 'check_circle')}
                          </span>
                          <span className="font-medium">{h.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md rounded-t-[2rem] shadow-[0_-12px_32px_rgba(25,28,30,0.06)]">
        <div className="flex flex-col items-center justify-center p-6 pb-8 w-full gap-2 max-w-2xl mx-auto">
          <Button fullWidth disabled={!selectedId} onClick={handleContinue} icon="arrow_forward">{t('buildingSelection.continueButton')}</Button>
        </div>
      </nav>
      <AppFooter />
    </div>
  );
}
