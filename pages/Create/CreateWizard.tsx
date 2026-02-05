import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Step1Details from './Step1Details';
import Step2Design from './Step2Design';
import Step3Review from './Step3Review';
import { ProposalData } from '../../types';
import { BACKGROUNDS } from '../../constants';
import { createLink } from '../../api';
import LoadingScreen from '../../components/LoadingScreen';
import usePageReady from '../../hooks/usePageReady';

const CreateWizard: React.FC = () => {
  const navigate = useNavigate();
  const isReady = usePageReady();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProposalData>({
    senderName: '',
    receiverName: '',
    photoUrl: null,
    backgroundId: BACKGROUNDS[0].id,
    message: '',
    buttonStyle: 'standard',
    template: '',
  });

  const updateData = (fields: Partial<ProposalData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createLink(data);
      navigate('/created', { state: { data, slug: result.slug, shareUrl: result.shareUrl } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Details', component: Step1Details },
    { num: 2, label: 'Design', component: Step2Design },
    { num: 3, label: 'Review', component: Step3Review },
  ];

  const CurrentStepComponent = steps[step - 1].component;

  const getProgressWidth = () => {
      if (step === 1) return '33%';
      if (step === 2) return '66%';
      return '100%';
  };

  if (!isReady) {
    return <LoadingScreen message="Loading editor..." />;
  }

  return (
    <Layout variant="full" className="bg-[#f0ebf0] md:flex md:items-center md:justify-center md:py-10">
      <div className="w-full h-screen md:h-[800px] md:max-w-5xl md:bg-white md:rounded-[2.5rem] md:shadow-2xl md:overflow-hidden flex flex-col relative bg-white transition-all duration-300">
        
        {/* Header - Sticky on Mobile, Regular on Desktop */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 md:bg-white md:pt-4">
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <div 
                className="text-primary flex size-10 shrink-0 items-center justify-start cursor-pointer hover:bg-gray-50 rounded-full transition-colors" 
                onClick={() => step > 1 ? prevStep() : navigate('/')}
              >
                <span className="material-symbols-outlined">arrow_back_ios</span>
              </div>
              <h2 className="text-[#181114] text-lg font-bold leading-tight">Create Proposal</h2>
              <div className="w-10"></div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-1 w-full bg-gray-100">
              <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out" style={{ width: getProgressWidth() }}></div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-center gap-12 py-3 border-b border-gray-50 md:border-none">
              {steps.map((s) => (
                  <div key={s.num} className="flex flex-col items-center gap-1">
                      <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= s.num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {step > s.num ? <span className="material-symbols-outlined text-sm">check</span> : s.num}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${step >= s.num ? 'text-primary' : 'text-gray-300'}`}>{s.label}</span>
                  </div>
              ))}
            </div>
        </div>

        {/* Content Area - Flex Grow to fill remaining space */}
        <div className="flex-grow overflow-hidden flex flex-col relative">
          <CurrentStepComponent 
            data={data} 
            updateData={updateData} 
            onNext={step === 3 ? handleFinish : nextStep} 
            onBack={prevStep}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateWizard;
