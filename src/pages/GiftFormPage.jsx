import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { LangSelector } from '../components/LangSelector';
import { Step1 } from '../components/steps/Step1';
import { Step2 } from '../components/steps/Step2';
import { Step3 } from '../components/steps/Step3';
import { Step4 } from '../components/steps/Step4';
import { Step5 } from '../components/steps/Step5';
import { submitGiftRequest } from '../utils/api';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateStep(step, data, T) {
  const errors = {};
  if (step === 1) {
    if (!data.giftTarget) errors.giftTarget = true;
    if (!data.receiverName.trim()) errors.receiverName = true;
    if (!data.senderName.trim()) errors.senderName = true;
  }
  if (step === 2) {
    if (!data.giftPurpose) errors.giftPurpose = true;
    if (!data.message.trim()) errors.message = true;
  }
  if (step === 3) {
    if (!data.artistName.trim()) errors.artistName = true;
    if (!data.songTitle.trim()) errors.songTitle = true;
    if (!data.moods || data.moods.length === 0) errors.moods = true;
  }
  if (step === 4) {
    if (!data.email.trim()) errors.email = true;
    else if (!isValidEmail(data.email)) errors.email = true;
  }
  return errors;
}

const INITIAL_DATA = {
  giftTarget: '', receiverName: '', senderName: '',
  giftPurpose: '', message: '', artistName: '',
  songTitle: '', moods: [], email: '', mbti: ['', '', '', ''],
};

export function GiftFormPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const T = translations[lang];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const TOTAL_STEPS = 5;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData, T);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => { setCurrentStep(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleGoToStep = (step) => { setCurrentStep(step); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const mbtiString = formData.mbti.every(Boolean) ? formData.mbti.join('') : '';
      const payload = {
        giftTarget: formData.giftTarget, receiverName: formData.receiverName.trim(),
        senderName: formData.senderName.trim(), giftPurpose: formData.giftPurpose,
        message: formData.message.trim(), artistName: formData.artistName.trim(),
        songTitle: formData.songTitle.trim(), moods: formData.moods.join(', '),
        email: formData.email.trim(), mbti: mbtiString, language: lang, type: "gift",
      };
      const result = await submitGiftRequest(payload);
      navigate('/complete', { state: { giftId: result.giftId, receiverName: formData.receiverName, email: formData.email } });
    } catch (error) {
      console.error(error);
      setSubmitError(T.form.submitError);
      setIsSubmitting(false);
    }
  };

  const config = T.steps[currentStep - 1];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F14' }}>
      <header className="sticky top-0 z-10 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(15,15,20,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <a href="/" className="font-display text-lg font-bold" style={{ color: '#F0F0F5' }}>Music for U</a>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: '#5A5A70' }}>{T.form.timeNote}</span>
              <LangSelector />
            </div>
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-1.5" style={{ color: '#F0F0F5' }}>{config.title}</h1>
          <p className="text-sm" style={{ color: '#9090A8' }}>{config.subtitle}</p>
        </div>

        {currentStep === 1 && <Step1 data={formData} errors={errors} onChange={handleChange} />}
        {currentStep === 2 && <Step2 data={formData} errors={errors} onChange={handleChange} />}
        {currentStep === 3 && <Step3 data={formData} errors={errors} onChange={handleChange} />}
        {currentStep === 4 && <Step4 data={formData} errors={errors} onChange={handleChange} />}
        {currentStep === 5 && <Step5 data={formData} onGoToStep={handleGoToStep} />}

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
