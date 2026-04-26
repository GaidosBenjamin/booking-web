import { useTranslation } from 'react-i18next';
import type { CamperStatus } from '../types/camper';

interface StatusChipProps {
  status: CamperStatus;
}

const statusConfig: Record<CamperStatus, { icon: string; colorClass: string }> = {
  NEEDS_BED:       { icon: 'error',        colorClass: 'text-error' },
  NEEDS_PAYMENT:   { icon: 'hourglass_top', colorClass: 'text-tertiary' },
  PAYMENT_SUCCESS: { icon: 'check_circle',  colorClass: 'text-secondary' },
  PAYMENT_FAILED:  { icon: 'error',         colorClass: 'text-error' },
};

export default function StatusChip({ status }: StatusChipProps) {
  const { t } = useTranslation();
  const config = statusConfig[status];

  return (
    <span className={`${config.colorClass} text-xs font-semibold flex items-center gap-1`}>
      <span
        className="material-symbols-outlined text-sm"
        style={{ fontVariationSettings: status === 'PAYMENT_SUCCESS' ? "'FILL' 1" : "'FILL' 0" }}
      >
        {config.icon}
      </span>
      {t(`status.${status}`)}
    </span>
  );
}
