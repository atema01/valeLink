import React from 'react';
import { StepProps } from '../../types';
import Button from '../../components/Button';
import { DEFAULT_PHOTO } from '../../constants';

const Step3Review: React.FC<StepProps> = ({ data, onNext, onBack, isSubmitting, error }) => {
  
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-100 md:px-10 md:py-6 md:border-none">
          <h2 className="text-[#181114] tracking-tight text-xl font-bold leading-tight text-center md:text-left md:text-3xl">Preview Link</h2>
          <p className="text-[#181114]/60 text-center text-xs mt-1 md:text-left md:text-base">This is exactly what they will see.</p>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-50 p-4 md:bg-white md:px-10 md:grid md:grid-cols-[1.2fr_1fr] md:gap-10 md:items-start md:overflow-hidden">
            
            {/* Phone Container Preview */}
            <div className="flex flex-col items-center justify-center md:h-full md:bg-gray-50 md:rounded-3xl md:p-8">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white mx-auto w-full max-w-[320px] relative pointer-events-none transform md:scale-100 transition-transform">
                    {/* Status Bar Simulation */}
                    <div className="h-6 bg-white w-full flex justify-between items-center px-4">
                        <span className="text-[10px] font-bold text-gray-400">9:41</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>

                    {/* Simulated Proposal Page Content */}
                    <div className="bg-[#f8f6f7] font-display flex flex-col min-h-[500px]">
                        {/* Header */}
                        <div className="flex items-center bg-white/80 backdrop-blur-md p-3 justify-between sticky top-0 z-10 border-b border-gray-100">
                            <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                            <h2 className="text-[#181114] text-sm font-bold leading-tight text-center truncate px-2">For {data.receiverName}</h2>
                            <div className="w-5"></div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center p-4 relative">
                            <div className="w-full mb-4">
                                <div 
                                    className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-2xl aspect-square shadow-md" 
                                    style={{ backgroundImage: `url(${data.photoUrl || DEFAULT_PHOTO})` }}
                                ></div>
                            </div>

                            <div className="w-full text-center mb-6">
                                <h1 className="text-[#181114] text-xl font-extrabold leading-tight mb-2">
                                    Will you be my Valentine?
                                </h1>
                                <p className="text-[#181114]/70 text-xs font-medium leading-relaxed px-2">
                                "{data.message}"
                                </p>
                            </div>

                            {/* Fake Buttons */}
                            <div className="w-full flex flex-col gap-3 items-center mt-auto pb-4">
                                <div className="flex w-full items-center justify-center rounded-xl h-10 px-6 bg-primary text-white text-sm font-black shadow-md">
                                    YES!
                                </div>
                                <div className="flex w-full items-center justify-center rounded-xl h-10 px-6 bg-white border border-gray-200 text-gray-500 text-sm font-bold shadow-sm">
                                    No, thank you
                                </div>
                            </div>
                            
                            {/* Decor */}
                            <div className="absolute bottom-10 left-2 text-primary opacity-20 rotate-12">
                                <span className="material-symbols-outlined text-2xl">favorite</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Side Panel info */}
            <div className="text-center mt-6 md:mt-0 md:text-left md:h-full md:flex md:flex-col md:justify-center">
                <div className="hidden md:block mb-8">
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-4">
                        <span className="material-symbols-outlined text-lg">smartphone</span>
                        Mobile Preview
                     </div>
                     <h3 className="text-2xl font-bold text-[#181114] mb-3">Ready to Ask?</h3>
                     <p className="text-gray-500 mb-6 max-w-sm">
                        Check the preview on the left. This is how the magic will look on their phone. If everything is perfect, click the button below!
                     </p>
                </div>

                <button onClick={onBack} className="bg-white px-4 py-2 rounded-full shadow-sm text-primary text-sm font-bold flex items-center justify-center gap-2 mx-auto md:mx-0 hover:bg-gray-50 transition-colors border border-gray-100 md:w-fit">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit Details</span>
                </button>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-4 border-t border-[#181114]/5 z-10 md:static md:bg-white md:border-t-0 md:p-8 md:justify-end">
             <div className="max-w-[480px] mx-auto md:max-w-none md:flex md:justify-end">
                <div className="md:w-64">
                    <Button onClick={onNext} fullWidth icon={<span className="material-symbols-outlined">bolt</span>} disabled={isSubmitting}>
                        {isSubmitting ? 'Generating...' : 'Generate Link'}
                    </Button>
                    {error ? (
                      <p className="text-xs text-red-500 font-semibold mt-3 text-center md:text-left">{error}</p>
                    ) : null}
                </div>
             </div>
        </div>
      </div>
    </>
  );
};

export default Step3Review;
