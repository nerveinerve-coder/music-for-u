import { useState } from 'react';
import { ChipButton } from '../Button';
import { Input } from '../Input';
import { useLang } from '../../hooks/useLang';
import { translations } from '../../utils/i18n';

export function Step3({ data, errors, onChange }) {
  const { lang } = useLang();
  const T = translations[lang].step3;
  const [customMood, setCustomMood] = useState('');

  const toggleMood = (mood) => {
    const current = data.moods || [];
    onChange('moods', current.includes(mood) ? current.filter(m => m !== mood) : [...current, mood]);
  };

  const addCustomMood = () => {
    const trimmed = customMood.trim();
    if (!trimmed) return;
    const current = data.moods || [];
    if (!current.includes(trimmed)) onChange('moods', [...current, trimmed]);
    setCustomMood('');
  };

  const selectedMoods = data.moods || [];

  return (
    <div className="flex flex-col gap-7 animate-fade-in-up">
      <Input id="artistName" label={T.artistLabel} value={data.artistName}
        onChange={e => onChange('artistName', e.target.value)}
        placeholder={T.artistPlaceholder} helpText={T.artistHelp}
        errorMessage={errors.artistName ? T.errors.artist : ''} required autoComplete="off" />
      <Input id="songTitle" label={T.songLabel} value={data.songTitle}
        onChange={e => onChange('songTitle', e.target.value)}
        placeholder={T.songPlaceholder} helpText={T.songHelp}
        errorMessage={errors.songTitle ? T.errors.song : ''} required autoComplete="off" />
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
          {T.moodLabel}
          <span className="ml-1" style={{ color: '#6BA3D6' }}>*</span>
        </label>
        <p className="text-xs -mt-1" style={{ color: '#9090A8' }}>{T.moodMultiple}</p>
        <div className="flex flex-wrap gap-2" role="group">
          {T.moods.map(mood => (
            <ChipButton key={mood} label={mood} selected={selectedMoods.includes(mood)} onClick={() => toggleMood(mood)} />
          ))}
        </div>
        <div className="flex gap-2 mt-1">
          <input type="text" value={customMood} onChange={e => setCustomMood(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomMood())}
            placeholder={T.moodCustomPlaceholder}
            className="flex-1 px-4 py-3 rounded-2xl text-sm focus:outline-none"
            style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0F5' }} />
          <button type="button" onClick={addCustomMood}
            className="px-4 py-3 rounded-2xl text-sm font-medium"
            style={{ backgroundColor: 'rgba(107,163,214,0.12)', color: '#6BA3D6' }}>
            {T.moodCustomAdd}
          </button>
        </div>
        {errors.moods && (
          <p role="alert" className="text-xs flex items-center gap-1" style={{ color: '#FF6B6B' }}>
            ⚠️ {T.errors.moods}
          </p>
        )}
      </div>
      <div className="rounded-2xl p-4 text-xs leading-relaxed"
        style={{ backgroundColor: 'rgba(107,163,214,0.08)', border: '1px solid rgba(107,163,214,0.12)', color: '#9090A8' }}>
        {T.moodTip}
      </div>
    </div>
  );
}
