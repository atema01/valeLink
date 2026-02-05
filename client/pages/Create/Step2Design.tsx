import React from 'react';
import { StepProps } from '../../types';
import Button from '../../components/Button';
import { TEMPLATES } from '../../constants';

const Step2Design: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = TEMPLATES.find(t => t.value === e.target.value);
    if (selected) {
      updateData({ template: selected.value, message: selected.text });
    } else {
        updateData({ template: '', message: '' });
    }
  };

  const isValid = data.message.trim() !== '';

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 md:px-10 md:pt-8">
          <h1 className="text-2xl font-extrabold text-[#181114] mb-1">Design Your Moment</h1>
          <p className="text-sm text-[#181114]/60">Craft a special message for your special someone.</p>
        </div>

        <div className="flex-grow overflow-y-auto px-4 pb-28 md:px-10 md:grid md:grid-cols-2 md:gap-12 md:content-start">
            
            {/* Left: Message */}
            <div className="mb-8 px-2 md:mb-0 md:px-0">
                <h3 className="text-[#181114] text-sm font-bold uppercase tracking-wider mb-3">1. Write a Heartfelt Message</h3>
                <div className="space-y-4">
                    <div className="relative group">
                        <select 
                            value={data.template} 
                            onChange={handleTemplateChange}
                            className="w-full h-14 appearance-none bg-white border-2 border-primary focus:border-primary rounded-2xl px-4 pr-10 text-sm font-medium text-[#181114] shadow-sm cursor-pointer outline-none transition-all"
                        >
                            <option value="" disabled>Select a mood / template...</option>
                            {TEMPLATES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>

                    <textarea 
                    
                        value={data.message}
                        onChange={(e) => updateData({ message: e.target.value })}
                        className="w-full min-h-[200px] rounded-2xl border-2 border-gray-100 bg-white p-5 text-[#181114] focus:border-primary focus:ring-0 shadow-sm text-lg placeholder:text-[#181114]/30 resize-none outline-none transition-all leading-relaxed "
                        placeholder="choose template/mood..."
                        readonly="true"
                    ></textarea>
                </div>
            </div>

            {/* Right: Button Style */}
            <div className="mb-4 px-2 md:mb-0 md:px-0">
                <h3 className="text-[#181114] text-sm font-bold uppercase tracking-wider mb-3">2. Choose Interaction Style</h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <button 
                        onClick={() => updateData({ buttonStyle: 'standard' })}
                        className={`flex items-center justify-between p-5 rounded-2xl bg-white border-2 shadow-sm text-left transition-all hover:shadow-md ${data.buttonStyle === 'standard' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/30'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 text-primary">
                            <span className="material-symbols-outlined">touch_app</span>
                            </div>
                            <div>
                                <p className="font-bold text-[#181114] text-base">Standard</p>
                                <p className="text-sm text-[#181114]/60 mt-0.5">Simple "Yes" and "No" buttons.</p>
                            </div>
                        </div>
                        <div className={`size-6 rounded-full flex items-center justify-center shrink-0 transition-all ${data.buttonStyle === 'standard' ? 'bg-primary' : 'border-2 border-gray-200'}`}>
                            {data.buttonStyle === 'standard' && <div className="size-2 bg-white rounded-full"></div>}
                        </div>
                    </button>

                    <button 
                        onClick={() => updateData({ buttonStyle: 'persistent' })}
                        className={`flex items-center justify-between p-5 rounded-2xl bg-white border-2 shadow-sm text-left transition-all hover:shadow-md ${data.buttonStyle === 'persistent' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/30'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 text-primary">
                            <span className="material-symbols-outlined">directions_run</span>
                            </div>
                            <div>
                                <p className="font-bold text-[#181114] text-base">Playful Runaway</p>
                                <p className="text-sm text-[#181114]/60 mt-0.5">The "No" button runs away.</p>
                            </div>
                        </div>
                        <div className={`size-6 rounded-full flex items-center justify-center shrink-0 transition-all ${data.buttonStyle === 'persistent' ? 'bg-primary' : 'border-2 border-gray-200'}`}>
                            {data.buttonStyle === 'persistent' && <div className="size-2 bg-white rounded-full"></div>}
                        </div>
                    </button>

                    <button 
                        onClick={() => updateData({ buttonStyle: 'decoy' })}
                        className={`flex items-center justify-between p-5 rounded-2xl bg-white border-2 shadow-sm text-left transition-all hover:shadow-md ${data.buttonStyle === 'decoy' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/30'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 text-primary">
                            <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div>
                                <p className="font-bold text-[#181114] text-base">The Decoy</p>
                                <p className="text-sm text-[#181114]/60 mt-0.5">Tricky! "No" becomes "Yes".</p>
                            </div>
                        </div>
                        <div className={`size-6 rounded-full flex items-center justify-center shrink-0 transition-all ${data.buttonStyle === 'decoy' ? 'bg-primary' : 'border-2 border-gray-200'}`}>
                            {data.buttonStyle === 'decoy' && <div className="size-2 bg-white rounded-full"></div>}
                        </div>
                    </button>
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 border-t border-[#181114]/5 flex gap-3 z-10 md:static md:bg-white md:border-t-0 md:p-8 md:justify-end">
            <div className="flex gap-4 w-full max-w-[480px] mx-auto md:max-w-none md:mx-0 md:w-auto">
                <Button variant="secondary" onClick={onBack} className="flex-1 md:w-32 md:flex-none">Back</Button>
                <Button onClick={onNext} className="flex-[2] md:w-48 md:flex-none" disabled={!isValid} icon={<span className="material-symbols-outlined text-sm">arrow_forward</span>}>
                    Review
                </Button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Step2Design;