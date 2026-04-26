import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getCodeOfConduct, getAgreements, createAgreement } from '../../api/coc';
import { useToast } from '../../components/ToastProvider';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import AppFooter from '../../components/AppFooter';

export default function CodeOfConductPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: cocList } = useQuery({ queryKey: ['coc'], queryFn: getCodeOfConduct });
  const { data: agreements } = useQuery({ queryKey: ['coc-agreements'], queryFn: getAgreements });

  const activeCoc = cocList?.find((c) => c.active);

  // Skip logic
  useEffect(() => {
    if (activeCoc && agreements) {
      const alreadyAgreed = agreements.some((a) => a.codeOfConductId === activeCoc.id);
      if (alreadyAgreed) navigate('/checkout', { replace: true });
    }
  }, [activeCoc, agreements, navigate]);

  const agreeMutation = useMutation({
    mutationFn: () => createAgreement({ codeOfConductId: activeCoc!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coc-agreements'] });
      navigate('/checkout');
    },
    onError: () => showToast(t('coc.toasts.failed'), 'error'),
  });

  const handleAgree = async () => {
    if (!activeCoc) return;
    setLoading(true);
    await agreeMutation.mutateAsync();
    setLoading(false);
  };

  type CocContent = {
    title?: string;
    introduction?: string;
    rules?: Array<{
      icon?: string;
      title?: string;
      number?: string;
      description?: string;
      bulletPoints?: string[];
    }>;
  };
  const content = activeCoc?.content as CocContent | undefined;

  return (
    <div className="min-h-screen bg-surface pb-32">
      <AppHeader title={t('coc.badge')} />
      <main className="pt-24 pb-48 px-6 max-w-2xl mx-auto">
        <section className="mb-12">
          <span className="text-secondary font-headline font-bold text-sm tracking-widest uppercase mb-2 block">{t('coc.badge')}</span>
          <h2 className="text-4xl font-extrabold text-primary mb-6 leading-tight font-headline">
            {content?.title || 'Code of Conduct'}
          </h2>
          {content?.introduction && (
            <p className="text-on-surface-variant leading-relaxed text-lg mb-8">
              {content.introduction}
            </p>
          )}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/30 text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
          </div>
        </section>

        {/* Rules */}
        <div className="grid grid-cols-1 gap-6">
          {content?.rules?.map((rule, i) => (
            <div key={i} className={`${i % 2 === 0 ? 'bg-surface-container-lowest ambient-shadow' : 'bg-surface-container-low'} p-8 rounded-xl`}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-full">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {rule.icon || ['handshake', 'shield_with_heart', 'forest', 'groups', 'eco'][i % 5]}
                  </span>
                </div>
                <span className="font-headline font-extrabold text-surface-variant text-5xl opacity-50 italic">
                  {rule.number || String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4 font-headline">{rule.title}</h3>
              <p className="text-on-surface-variant leading-relaxed mb-4">{rule.description}</p>
              {rule.bulletPoints && rule.bulletPoints.length > 0 && (
                <ul className="space-y-3">
                  {rule.bulletPoints.map((bullet, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Sticky footer */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-12px_32px_rgba(25,28,30,0.06)] z-50">
        <div className="flex flex-col items-center justify-center p-6 w-full gap-4 max-w-2xl mx-auto">
          <Button fullWidth loading={loading} onClick={handleAgree} icon="check_circle">
            {t('coc.acceptButton')}
          </Button>
        </div>
      </footer>
      <AppFooter />
    </div>
  );
}
