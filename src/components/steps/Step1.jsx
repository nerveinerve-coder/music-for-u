import { ChipButton } from '../Button';
import { Input } from '../Input';
import { useLang } from '../../hooks/useLang';
import { translations } from '../../utils/i18n';

export function Step1({ data, errors, onChange }) {
  const { lang } = useLang();
  const T = translations[lang].step1;

  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
          {T.targetLabel}
          <span className="ml-1" style={{ color: '#6BA3D6' }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2" role="group">
          {T.targets.map(target => (
            <ChipButton key={target.value} label={target.label} emoji={target.emoji}
              selected={data.giftTarget === target.value}
              onClick={() => onChange('giftTarget', target.value)} />
          ))}
        </div>
        {errors.giftTarget && (
          <p role="alert" className="text-xs flex items-center gap-1" style={{ color: '#FF6B6B' }}>
            ⚠️ {T.errors.target}
          </p>
        )}
      </div>
      <Input id="receiverName" label={T.receiverLabel} value={data.receiverName}
        onChange={e => onChange('receiverName', e.target.value)}
        placeholder={T.receiverPlaceholder} helpText={T.receiverHelp}
        errorMessage={errors.receiverName ? T.errors.receiver : ''} required autoComplete="off" />
      <Input id="senderName" label={T.senderLabel} value={data.senderName}
        onChange={e => onChange('senderName', e.target.value)}
        placeholder={T.senderPlaceholder} helpText={T.senderHelp}
        errorMessage={errors.senderName ? T.errors.sender : ''} required autoComplete="off" />
    </div>
  );
}
