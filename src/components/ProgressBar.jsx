import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

export function ProgressBar({ currentStep, totalSteps = 5 }) {
  const { lang } = useLang();
  const labels = translations[lang].progressLabels;
  const percent = (currentStep / totalSteps) * 100;
  const label = labels[currentStep - 1] || '';

  return (
    <div className="w-full" role="progressbar" aria-valuenow={currentStep} aria-valuemax={totalSteps}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium" style={{ color: '#9090A8' }}>
          <span className="font-bold" style={{ color: '#6BA3D6' }}>{currentStep}</span> / {totalSteps}
        </span>
        <span className="text-xs" style={{ color: '#9090A8' }}>{label}</span>
      </div>
      <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${percent}%`, backgroundColor: '#6BA3D6' }} />
      </div>
    </div>
  );
}
