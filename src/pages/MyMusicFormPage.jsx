import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { Button, ChipButton } from '../components/Button';
import { Input } from '../components/Input';
import { LangSelector } from '../components/LangSelector';
import { submitMyMusicRequest } from '../utils/api';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

const MBTI_OPTIONS_BASE = [
  { group: 'EI', options: ['E', 'I'] },
  { group: 'NS', options: ['N', 'S'] },
  { group: 'FT', options: ['F', 'T'] },
  { group: 'PJ', options: ['P', 'J'] },
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const INITIAL_DATA = {
  artistName: '',
  songTitle: '',
  moods: [],
  mbti: ['', '', '', ''],
  email: '',
};

export function MyMusicFormPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const T = translations[lang]?.myMusic;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [customMood, setCustomMood] = useState('');
  const TOTAL_STEPS = 3;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const toggleMood = (mood) => {
    const current = formData.moods || [];
    handleChange('moods', current.includes(mood)
      ? current.filter(m => m !== mood)
      : [...current, mood]);
  };

  const addCustomMood = () => {
    const trimmed = customMood.trim();
    if (!trimmed) return;
    const current = formData.moods || [];
    if (!current.includes(trimmed)) handleChange('moods', [...current, trimmed]);
    setCustomMood('');
  };

  const handleMbtiSelect = (groupIndex, letter) => {
    const current = [...(formData.mbti || ['', '', '', ''])];
    current[groupIndex] = current[groupIndex] === letter ? '' : letter;
    handleChange('mbti', current);
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.artistName.trim()) errs.artistName = true;
      if (!formData.songTitle.trim()) errs.songTitle = true;
      if (!formData.moods || formData.moods.length === 0) errs.moods = true;
    }
    if (step === 2) {
      if (!formData.email.trim()) errs.email = true;
      else if (!isValidEmail(formData.email)) errs.email = true;
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(currentStep);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const mbtiString = formData.mbti.every(Boolean) ? formData.mbti.join('') : '';
      const payload = {
        artistName: formData.artistName.trim(),
        songTitle: formData.songTitle.trim(),
        moods: formData.moods.join(', '),
        mbti: mbtiString,
        email: formData.email.trim(),
        language: lang,
      };
      const result = await submitMyMusicRequest(payload);
      navigate('/my-music-complete', {
        state: { myId: result.myId, email: formData.email },
      });
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || T.form.submitError);
      setIsSubmitting(false);
    }
  };

  if (!T) return null;

  const mbti = formData.mbti || ['', '', '', ''];
  const mbtiString = mbti.join('');
  const mbtiComplete = mbti.every(Boolean);
  const mbtiPartial = mbti.some(Boolean) && !mbtiComplete;
  const config = T.steps[currentStep - 1];

  // 진행 바용 labels override
  const progressLabels = T.progressLabels;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F14' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(15,15,20,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="font-display text-lg font-bold" style={{ color: '#F0F0F5' }}>
              Music for U
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: '#5A5A70' }}>{T.form.timeNote}</span>
              <LangSelector />
            </div>
          </div>
          {/* 진행 바 직접 렌더 */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium" style={{ color: '#9090A8' }}>
                <span className="font-bold" style={{ color: '#6BA3D6' }}>{currentStep}</span> / {TOTAL_STEPS}
              </span>
              <span className="text-xs" style={{ color: '#9090A8' }}>{progressLabels[currentStep - 1]}</span>
            </div>
            <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%`, backgroundColor: '#6BA3D6' }} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-1.5" style={{ color: '#F0F0F5' }}>{config.title}</h1>
          <p className="text-sm" style={{ color: '#9090A8' }}>{config.subtitle}</p>
        </div>

        {/* Step 1: 음악 취향 */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-7 animate-fade-in-up">
            <Input id="artistName" label={T.step1.artistLabel} value={formData.artistName}
              onChange={e => handleChange('artistName', e.target.value)}
              placeholder={T.step1.artistPlaceholder} helpText={T.step1.artistHelp}
              errorMessage={errors.artistName ? T.step1.errors.artist : ''} required autoComplete="off" />

            <Input id="songTitle" label={T.step1.songLabel} value={formData.songTitle}
              onChange={e => handleChange('songTitle', e.target.value)}
              placeholder={T.step1.songPlaceholder} helpText={T.step1.songHelp}
              errorMessage={errors.songTitle ? T.step1.errors.song : ''} required autoComplete="off" />

            {/* 분위기 */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
                {T.step1.moodLabel}
                <span className="ml-1" style={{ color: '#6BA3D6' }}>*</span>
              </label>
              <p className="text-xs -mt-1" style={{ color: '#9090A8' }}>{T.step1.moodMultiple}</p>
              <div className="flex flex-wrap gap-2">
                {T.step1.moods.map(mood => (
                  <ChipButton key={mood} label={mood}
                    selected={(formData.moods || []).includes(mood)}
                    onClick={() => toggleMood(mood)} />
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input type="text" value={customMood} onChange={e => setCustomMood(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomMood())}
                  placeholder={T.step1.moodCustomPlaceholder}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm focus:outline-none"
                  style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0F5' }} />
                <button type="button" onClick={addCustomMood}
                  className="px-4 py-3 rounded-2xl text-sm font-medium"
                  style={{ backgroundColor: 'rgba(107,163,214,0.12)', color: '#6BA3D6' }}>
                  {T.step1.moodCustomAdd}
                </button>
              </div>
              {errors.moods && (
                <p role="alert" className="text-xs flex items-center gap-1" style={{ color: '#FF6B6B' }}>
                  ⚠️ {T.step1.errors.moods}
                </p>
              )}
            </div>

            {/* MBTI */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: '#F0F0F5' }}>{T.step1.mbtiLabel}</label>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1A1A24', color: '#5A5A70' }}>
                  {T.step1.mbtiOptional}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#9090A8' }}>{T.step1.mbtiHelp}</p>
              <div className="flex flex-col gap-3">
                {MBTI_OPTIONS_BASE.map((group, groupIndex) => (
                  <div key={group.group} className="flex items-center gap-3">
                    <span className="text-xs w-16 flex-shrink-0" style={{ color: '#5A5A70' }}>
                      {T.step1.mbtiGroups[groupIndex]}
                    </span>
                    <div className="flex gap-2">
                      {group.options.map(letter => (
                        <button key={letter} type="button"
                          onClick={() => handleMbtiSelect(groupIndex, letter)}
                          aria-pressed={mbti[groupIndex] === letter}
                          className="w-12 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer border active:scale-95"
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
                  <span className="font-display text-2xl font-bold tracking-widest" style={{ color: '#6BA3D6' }}>
                    {mbtiString}
                  </span>
                  <span className="text-xs" style={{ color: '#9090A8' }}>{T.step1.mbtiSaved}</span>
                </div>
              )}
              {mbtiPartial && (
                <p className="text-xs" style={{ color: '#C9A96E' }}>{T.step1.mbtiPartial}</p>
              )}
            </div>

            <div className="rounded-2xl p-4 text-xs leading-relaxed"
              style={{ backgroundColor: 'rgba(107,163,214,0.08)', border: '1px solid rgba(107,163,214,0.12)', color: '#9090A8' }}>
              {T.step1.moodTip}
            </div>
          </div>
        )}

        {/* Step 2: 이메일 */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-7 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <Input id="email" label={T.step2.emailLabel} value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder={T.step2.emailPlaceholder} helpText={T.step2.emailHelp}
                errorMessage={errors.email ? (formData.email ? T.step2.errors.emailInvalid : T.step2.errors.emailRequired) : ''}
                required type="email" autoComplete="email" />
              <p className="text-xs px-1" style={{ color: '#5A5A70' }}>{T.step2.emailPrivacy}</p>
            </div>
          </div>
        )}

        {/* Step 3: 확인 */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            <p className="text-sm text-center" style={{ color: '#9090A8' }}>{T.step3.intro}</p>

            {[
              { label: T.step3.labels.artist, value: formData.artistName, step: 1 },
              { label: T.step3.labels.song, value: formData.songTitle, step: 1 },
              { label: T.step3.labels.moods, value: (formData.moods || []).join(', '), step: 1 },
              { label: T.step3.labels.mbti, value: mbtiComplete ? mbtiString : T.step3.labels.mbtiEmpty, step: 1 },
              { label: T.step3.labels.email, value: formData.email, step: 2 },
            ].reduce((acc, curr, idx, arr) => {
              const sectionEnd = [1, 3, 4];
              const rows = [...acc.rows, curr];
              if (sectionEnd.includes(idx) || idx === arr.length - 1) {
                acc.sections.push(rows);
                acc.rows = [];
              } else {
                acc.rows = rows;
              }
              return acc;
            }, { sections: [], rows: [] }).sections.map((section, si) => (
              <div key={si} className="rounded-2xl px-5 py-1"
                style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.06)' }}>
                {section.map(({ label, value, step }) => (
                  <div key={label} className="flex items-start justify-between py-3.5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-sm w-28 flex-shrink-0" style={{ color: '#9090A8' }}>{label}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm text-right flex-1 break-words" style={{ color: '#F0F0F5' }}>{value || '-'}</span>
                      <button type="button" onClick={() => { setCurrentStep(step); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-xs flex-shrink-0 underline underline-offset-2" style={{ color: '#6BA3D6' }}>
                        {T.step3.edit}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <p className="text-xs text-center" style={{ color: '#5A5A70' }}>{T.step3.privacy}</p>
          </div>
        )}

        {submitError && (
          <div role="alert" className="mt-5 p-4 rounded-2xl text-sm flex items-start gap-2"
            style={{ backgroundColor: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
            ⚠️ {submitError}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {currentStep < TOTAL_STEPS
            ? <Button onClick={handleNext} fullWidth size="lg">{T.form.next}</Button>
            : <Button onClick={handleSubmit} fullWidth size="lg" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? T.form.submitting : T.form.submit}
              </Button>
          }
          {currentStep > 1 && (
            <Button onClick={handleBack} fullWidth variant="ghost" size="md" disabled={isSubmitting}>
              {T.form.back}
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: '#5A5A70' }}>{T.form.privacyNote}</p>
      </main>
    </div>
  );
}
