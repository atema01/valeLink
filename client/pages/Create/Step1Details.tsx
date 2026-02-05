import React, { useEffect } from 'react';
import { StepProps } from '../../types';
import Button from '../../components/Button';
import { COVER_IMAGES } from '../../constants';

const Step1Details: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  
  // Set default photo if none selected
  useEffect(() => {
    if (!data.photoUrl) {
      updateData({ photoUrl: COVER_IMAGES[0] });
    }
  }, []);

  const isValid = data.senderName.trim() !== '' && data.receiverName.trim() !== '' && !!data.photoUrl;

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 md:px-10 md:pt-8">
          <h1 className="text-2xl font-extrabold text-[#181114] mb-1">Tell us the basics</h1>
          <p className="text-sm text-[#181114]/60">Start by personalizing your proposal details.</p>
        </div>

        <div className="px-6 flex-grow pb-28 overflow-y-auto md:px-10 md:grid md:grid-cols-2 md:gap-12 md:content-start">
          
          {/* Left Column: Inputs */}
          <div className="space-y-6 md:py-2">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1" htmlFor="your-name">Your Name</label>
                <input 
                  className="w-full h-14 bg-white border-2 border-gray-100 focus:border-primary focus:ring-0 rounded-2xl px-4 text-base font-medium shadow-sm transition-all outline-none" 
                  id="your-name" 
                  placeholder="Enter your name" 
                  type="text"
                  value={data.senderName}
                  onChange={(e) => updateData({ senderName: e.target.value })}
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1" htmlFor="receiver-name">Receiver's Name</label>
                <input 
                  className="w-full h-14 bg-white border-2 border-gray-100 focus:border-primary focus:ring-0 rounded-2xl px-4 text-base font-medium shadow-sm transition-all outline-none" 
                  id="receiver-name" 
                  placeholder="Who's the lucky person?" 
                  type="text"
                  value={data.receiverName}
                  onChange={(e) => updateData({ receiverName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="hidden md:block bg-blue-50 p-4 rounded-2xl border border-blue-100 mt-6">
               <div className="flex gap-3">
                 <span className="material-symbols-outlined text-blue-500">info</span>
                 <p className="text-sm text-blue-800">Your names will appear on the final page exactly as you type them here.</p>
               </div>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="space-y-2 mt-6 md:mt-0">
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">Choose a Cover Image</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {COVER_IMAGES.map((url, index) => (
                <div 
                  key={index}
                  onClick={() => updateData({ photoUrl: url })}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all group ${data.photoUrl === url ? 'border-primary shadow-lg scale-95' : 'border-transparent hover:border-primary/30'}`}
                >
                  <img 
                    src={url} 
                    alt={`Cover option ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {data.photoUrl === url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2 shadow-sm animate-bounce">
                        <span className="material-symbols-outlined text-primary text-xl">check</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 border-t border-[#181114]/5 z-10 md:static md:bg-white md:border-t-0 md:p-8">
          <div className="max-w-[480px] mx-auto md:max-w-none md:flex md:justify-end">
             <div className="md:w-1/3">
                <Button onClick={onNext} fullWidth disabled={!isValid} icon={<span className="material-symbols-outlined text-xl">arrow_forward</span>}>
                Next Step
                </Button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1Details;