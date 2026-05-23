import { ChipButton } from '../Button';
import { Textarea } from '../Input';
import { useLang } from '../../hooks/useLang';
import { translations } from '../../utils/i18n';

export function Step2({ data, errors, onChange }) {
  const { lang } = useLang();
  const T = translations[lang].step2;

  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
          {T.purposeLabel}
          <span className="ml-1" style={{ color: '#6BA3D6' }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2" role="group">
          {T.purposes.map(purpose => (
            <ChipButton key={purpose.value} label={purpose.label} emoji={purpose.emoji}
              selected={data.giftPurpose === purpose.value}
              onClick={() => onChange('giftPurpose', purpose.value)} />
          ))}
        </div>
        {errors.giftPurpose && (
          <p role="alert" className="text-xs flex items-center gap-1" style={{ color: '#FF6B6B' }}>
            ⚠️ {T.errors.purpose}
          </p>
        )}
      </div>
      <Textarea id="message" label={T.messageLabel} value={data.message}
        onChange={e => onChange('message', e.target.value)}
        placeholder={T.messagePlaceholder} helpText={T.messageHelp}
        errorMessage={errors.message ? T.errors.message : ''} required rows={3} maxLength={1000} />
      <div className="rounded-2xl p-4 text-xs leading-relaxed"
        style={{ backgroundColor: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.12)', color: '#9090A8' }}>
        {T.messageTip}
      </div>
    </div>
  );
}
