import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { ProposalData } from '../types';
import { DEFAULT_PHOTO } from '../constants';
import { fetchLink, submitAnswer } from '../api';

const Proposal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { width, height } = useWindowSize();
  const localData = location.state as ProposalData | null;

  const [remoteData, setRemoteData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'accepted' | 'rejected' | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  
  useEffect(() => {
    if (localData || !id) return;

    let isMounted = true;
    setLoading(true);
    setLoadError(null);

    fetchLink(id)
      .then(result => {
        if (!isMounted) return;
        setRemoteData(result.link);
        if (result.link.answer === 'accepted' || result.link.answer === 'rejected') {
          setAnswerState(result.link.answer);
          setAnswerLocked(true);
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load link');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, localData]);

  const data = localData || remoteData;

  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [isMoved, setIsMoved] = useState(false);
  
  // Decoy state: 'initial' -> 'moving' (runs away once) -> 'overlay' (covers YES)
  const [decoyState, setDecoyState] = useState<'initial' | 'moving' | 'overlay'>('initial');

  if (!data) {
    if (loading) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background-light font-display text-[#181114]">
          <div className="text-center">
            <div className="text-primary text-3xl font-extrabold mb-2">Loading your link...</div>
            <p className="text-[#181114]/60 text-sm">Hang tight, your surprise is on the way.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background-light font-display text-[#181114]">
        <div className="text-center max-w-sm px-6">
          <div className="text-primary text-3xl font-extrabold mb-2">Link not found</div>
          <p className="text-[#181114]/60 text-sm mb-6">{loadError || 'That link might be expired or mistyped.'}</p>
          <button 
            onClick={() => navigate('/create')}
            className="bg-primary text-white font-bold px-6 py-3 rounded-full shadow-lg"
          >
            Create a Proposal
          </button>
        </div>
      </div>
    );
  }

  const moveNoButton = () => {
      if (data.buttonStyle === 'standard') return;
      
      // Decoy Logic
      if (data.buttonStyle === 'decoy') {
        if (decoyState === 'initial') {
            // First run away
            const range = 100;
            const newX = (Math.random() - 0.5) * range; 
            const newY = (Math.random() - 0.5) * range;
            setNoButtonPos({ x: newX, y: newY });
            setIsMoved(true);
            setDecoyState('moving');
        } else if (decoyState === 'moving') {
            // Next interaction: Move to overlay YES button
            setDecoyState('overlay');
            // Reset transforms so absolute positioning takes over cleanly
            setNoButtonPos({ x: 0, y: 0 });
            setNoButtonScale(1); 
            setIsMoved(false);
        }
        return;
      }

      // Persistent Logic
      const range = 150; // Movement range
      const newX = (Math.random() - 0.5) * range; 
      const newY = (Math.random() - 0.5) * range;
      setNoButtonPos({ x: newX, y: newY });
      setNoButtonScale(prev => Math.max(0.5, prev - 0.1)); // Shrink it
      setIsMoved(true);
  };

  const handleNoClick = () => {
    if (data.buttonStyle === 'decoy' && decoyState === 'overlay') {
        handleAnswer('accepted');
        return;
    }

    if (data.buttonStyle === 'standard') {
      handleAnswer('rejected');
    } else {
      moveNoButton();
    }
  };

  // Styles for the No button when in Overlay mode
  const getNoButtonStyle = () => {
      if (data.buttonStyle === 'decoy' && decoyState === 'overlay') {
          return {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4rem', // Match h-16 (16 * 0.25rem = 4rem)
              zIndex: 30,
              transform: 'none',
              // Visual adjustments to look like the No button but behave like Yes
          } as React.CSSProperties;
      }

      return {
          transform: isMoved ? `translate(${noButtonPos.x}px, ${noButtonPos.y}px) scale(${noButtonScale})` : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: isMoved ? 'absolute' : 'relative',
          zIndex: 10
      } as React.CSSProperties;
  };

  const handleAnswer = async (answer: 'accepted' | 'rejected') => {
    if (!id || answerLocked || isSavingAnswer) return;
    setAnswerError(null);
    setIsSavingAnswer(true);

    try {
      const result = await submitAnswer(id, answer);
      if (result.answer === 'accepted') {
        setAccepted(true);
      } else {
        setRejected(true);
      }
      setAnswerState(result.answer as 'accepted' | 'rejected');
      setAnswerLocked(true);
    } catch (err) {
      const status = (err as Error & { status?: number; data?: any }).status;
      const data = (err as Error & { status?: number; data?: any }).data;
      if (status === 409 && data?.answer) {
        setAnswerState(data.answer);
        setAnswerLocked(true);
      } else {
        setAnswerError(err instanceof Error ? err.message : 'Failed to save answer');
      }
    } finally {
      setIsSavingAnswer(false);
    }
  };

  if (answerState === 'accepted' || accepted) {
      return (
          <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pink-50 text-center p-6 overflow-hidden relative">
              <Confetti width={width} height={height} numberOfPieces={500} gravity={0.15} />
              <div className="z-10 bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl border-4 border-pink-200 animate-[bounce_1s_infinite] max-w-md w-full">
                  <span className="material-symbols-outlined text-7xl md:text-8xl text-primary mb-4 block">favorite</span>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-2">YAAAY!</h1>
                  <p className="text-lg md:text-2xl text-gray-700 font-medium">Best Decision Ever! ❤️</p>
                  <p className="mt-6 text-gray-500 font-medium">Love, {data.senderName}</p>
              </div>
               <div className="absolute inset-0 pointer-events-none opacity-20" style={{backgroundImage: 'radial-gradient(#ee2b7c 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
          </div>
      )
  }

  if (answerState === 'rejected' || rejected) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-center p-6 relative overflow-hidden">
        <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 max-w-md w-full animate-pulse-slow">
            <span className="material-symbols-outlined text-8xl text-gray-400 mb-6 block">heart_broken</span>
            <h1 className="text-3xl font-extrabold text-white mb-3">Heartbroken... 💔</h1>
            <p className="text-lg text-white/70 font-medium mb-8">
              But my heart will keep waiting for you, {data.receiverName}.
            </p>
            
            <button 
              onClick={() => {
                if (answerLocked) return;
                setRejected(false);
              }}
              className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">undo</span>
              {answerLocked ? 'Answer Locked' : 'Wait, I changed my mind!'}
            </button>
        </div>
        
        {/* Sad Rain Effect CSS */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
             }}>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display antialiased min-h-screen flex flex-col">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden md:max-w-[600px] md:mx-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center bg-white/80 backdrop-blur-md p-4 pb-2 justify-between sticky top-0 z-10">
            <div className="text-primary flex size-12 shrink-0 items-center justify-center">
                <span className="material-symbols-outlined text-3xl fill-1">favorite</span>
            </div>
            <h2 className="text-[#181114] text-lg font-bold leading-tight flex-1 text-center pr-12">For {data.receiverName}</h2>
        </div>

        <div className="fixed inset-0 pointer-events-none opacity-10" style={{backgroundImage: 'radial-gradient(#ee2b7c 0.5px, transparent 0.5px)', backgroundSize: '24px 24px'}}></div>

        <main className="flex-1 flex flex-col items-center justify-start pb-6 md:pb-10 relative">
            <div className="w-full p-4 md:p-6">
                <div 
                    className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-[2rem] aspect-square md:aspect-[4/3] shadow-xl relative transition-all" 
                    style={{ backgroundImage: `url(${data.photoUrl || DEFAULT_PHOTO})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                </div>
            </div>

            <div className="w-full px-6 pt-2 text-center">
                <h1 className="text-[#181114] tracking-tight text-3xl md:text-4xl font-extrabold leading-tight pb-3">
                    Will you be my Valentine?
                </h1>
                <p className="text-[#181114]/70 text-base md:text-lg font-medium leading-relaxed pb-4 px-2 max-w-md mx-auto">
                   "{data.message}"
                </p>
            </div>

            <div className="w-full flex justify-center mt-auto relative px-6 py-6 min-h-[160px] items-start">
                <div className="flex flex-col gap-4 w-full max-w-[320px] items-center relative">
                    <button 
                        onClick={() => handleAnswer('accepted')}
                        disabled={answerLocked || isSavingAnswer}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-8 bg-primary text-white text-xl font-black leading-normal tracking-[0.05em] shadow-[0_4px_20px_rgba(238,43,124,0.4)] active:scale-95 transition-all hover:bg-primary-dark hover:-translate-y-1 z-20"
                    >
                        <span className="truncate">{isSavingAnswer ? 'Saving...' : 'YES!'}</span>
                    </button>
                    
                    <button 
                        onClick={handleNoClick}
                        onMouseEnter={moveNoButton}
                        onTouchStart={moveNoButton}
                        style={getNoButtonStyle()}
                        disabled={answerLocked || isSavingAnswer}
                        className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-6 bg-white border-2 border-gray-100 text-gray-500 text-base font-bold leading-normal active:scale-95 shadow-sm hover:bg-gray-50 ${isMoved && data.buttonStyle !== 'decoy' ? 'bg-red-50 border-red-100 text-red-400' : ''} ${decoyState === 'overlay' ? 'bg-primary text-white border-primary !shadow-xl !font-black !text-xl opacity-90' : ''} ${answerLocked || isSavingAnswer ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span className="truncate">{decoyState === 'overlay' ? 'YES!' : 'No, thank you'}</span>
                    </button>
                </div>
            </div>

            {answerError ? (
              <div className="px-6 pb-6 text-center text-xs font-semibold text-red-500">
                {answerError}
              </div>
            ) : null}

            {/* Decor */}
            <div className="absolute bottom-4 left-4 text-primary opacity-20 rotate-12 animate-float pointer-events-none">
                <span className="material-symbols-outlined text-4xl">favorite</span>
            </div>
            <div className="absolute bottom-20 right-8 text-primary opacity-20 -rotate-12 animate-float pointer-events-none" style={{animationDelay: '1.5s'}}>
                <span className="material-symbols-outlined text-5xl">favorite</span>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Proposal;
