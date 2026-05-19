import { Input } from '../Input';
import { useLang } from '../../hooks/useLang';
import { translations } from '../../utils/i18n';

const MBTI_OPTIONS_BASE = [
  { group: 'EI', options: ['E', 'I'] },
  { group: 'NS', options: ['N', 'S'] },
  { group: 'FT', options: ['F', 'T'] },
  { group: 'PJ', options: ['P', 'J'] },
];

export function Step4({ data, errors, onChange }) {
  const { lang } = useLang();
  const T = translations[lang].step4;

  const handleMbtiSelect = (groupIndex, letter) => {
    const current = data.mbti || ['', '', '', ''];
    const updated = [...current];
    updated[groupIndex] = updated[groupIndex] === letter ? '' : letter;
    onChange('mbti', updated);
  };

  const mbti = data.mbti || ['', '', '', ''];
  const mbtiString = mbti.join('');
  const mbtiComplete = mbti.every(Boolean);
  const mbtiPartial = mbti.some(Boolean) && !mbtiComplete;

  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <Input id="email" label={T.emailLabel} value={data.email}
          onChange={e => onChange('email', e.target.value)}
          placeholder={T.emailPlaceholder} helpText={T.emailHelp}
          errorMessage={errors.email ? (data.email ? T.errors.emailInvalid : T.errors.emailRequired) : ''}
          required type="email" autoComplete="email" />
        <p className="text-xs px-1" style={{ color: '#5A5A70' }}>{T.emailPrivacy}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" style={{ color: '#F0F0F5' }}>{T.mbtiLabel}</label>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1A1A24', color: '#5A5A70' }}>
            {T.mbtiOptional}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#9090A8' }}>{T.mbtiHelp}</p>
        <div className="flex flex-col gap-3">
          {MBTI_OPTIONS_BASE.map((group, groupIndex) => (
            <div key={group.group} className="flex items-center gap-3">
              <span className="text-xs w-16 flex-shrink-0" style={{ color: '#5A5A70' }}>{T.mbtiGroups[groupIndex]}</span>
              <div className="flex gap-2" role="group">
                {group.options.map(letter => (
                  <button key={letter} type="button"
                    onClick={() => handleMbtiSelect(groupIndex, letter)}
                    aria-pressed={mbti[groupIndex] === letter}
                    className="w-12 h-10 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border active:scale-95"
                    style={mbti[groupIndex] === letter
                      ? { backgroundColor: '#6BA3D6', color: '#0F0F14', borderColor: '#6BA3D6' }
                      : { backgroundColor: '#1A1A24', color: '#9090A8', borderColor: 'rgba(255,255,255,0.08)' }}>
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {mbtiComplete && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ backgroundColor: 'rgba(107,163,214,0.1)', border: '1px solid rgba(107,163,214,0.2)' }}>
            <span className="font-display text-2xl font-bold tracking-widest" style={{ color: '#6BA3D6' }}>{mbtiString}</span>
            <span className="text-xs" style={{ color: '#9090A8' }}>{T.mbtiSaved}</span>
          </div>
        )}
        {mbtiPartial && (
          <p className="text-xs flex items-center gap-1" style={{ color: '#C9A96E' }}>{T.mbtiPartial}</p>
        )}
      </div>
    </div>
  );
}
