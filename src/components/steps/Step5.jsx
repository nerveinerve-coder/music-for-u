import { useLang } from '../../hooks/useLang';
import { translations } from '../../utils/i18n';

export function Step5({ data, onGoToStep }) {
  const { lang } = useLang();
  const T = translations[lang].step5;
  const mbti = data.mbti || [];
  const mbtiString = mbti.every(Boolean) ? mbti.join('') : null;

  const ReviewRow = ({ label, value, stepNum }) => (
    <div className="flex items-start justify-between py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-sm w-28 flex-shrink-0" style={{ color: '#9090A8' }}>{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm text-right flex-1 break-words" style={{ color: '#F0F0F5' }}>{value || '-'}</span>
        <button type="button" onClick={() => onGoToStep(stepNum)}
          className="text-xs flex-shrink-0 underline underline-offset-2" style={{ color: '#6BA3D6' }}>
          {T.edit}
        </button>
      </div>
    </div>
  );

  const Section = ({ children }) => (
    <div className="rounded-2xl px-5 py-1" style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.06)' }}>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <p className="text-sm text-center" style={{ color: '#9090A8' }}>{T.intro}</p>
      <Section>
        <ReviewRow label={T.labels.target} value={data.giftTarget} stepNum={1} />
        <ReviewRow label={T.labels.receiver} value={data.receiverName} stepNum={1} />
        <ReviewRow label={T.labels.sender} value={data.senderName} stepNum={1} />
      </Section>
      <Section>
        <ReviewRow label={T.labels.purpose} value={data.giftPurpose} stepNum={2} />
        <ReviewRow label={T.labels.message} value={data.message} stepNum={2} />
      </Section>
      <Section>
        <ReviewRow label={T.labels.artist} value={data.artistName} stepNum={3} />
        <ReviewRow label={T.labels.song} value={data.songTitle} stepNum={3} />
        <ReviewRow label={T.labels.moods} value={(data.moods || []).join(', ')} stepNum={3} />
      </Section>
      <Section>
        <ReviewRow label={T.labels.email} value={data.email} stepNum={4} />
        <ReviewRow label={T.labels.mbti} value={mbtiString || T.labels.mbtiEmpty} stepNum={4} />
      </Section>
      <p className="text-xs text-center leading-relaxed" style={{ color: '#5A5A70' }}>{T.privacy}</p>
    </div>
  );
}
