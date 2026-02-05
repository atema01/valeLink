import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { CreatedLinkState } from '../types';
import { BACKGROUNDS } from '../constants';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CreatedLinkState | null;

  // Ideally show a loader or redirect if no data
  if (!state?.data || !state.slug) {
    return (
        <Layout className="items-center justify-center">
             <Button onClick={() => navigate('/create')}>Create a Proposal</Button>
        </Layout>
    )
  }

  const { data, slug } = state;
  const background = BACKGROUNDS.find(b => b.id === data.backgroundId) || BACKGROUNDS[0];
  const shareUrl = state.shareUrl || `${window.location.origin}/p/${slug}`;
  const shareUrlDisplay = shareUrl.replace(/^https?:\/\//, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ValenLink',
          text: `A special message for ${data.receiverName}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // fall back to copy
      }
    }

    handleCopy();
  };

  return (
    <Layout className="pb-20">
      <div className="flex items-center bg-white p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="text-primary flex size-12 shrink-0 items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-[#181114] text-lg font-bold leading-tight flex-1 text-center">Your Proposal</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex size-12 cursor-pointer items-center justify-center text-primary">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-8 flex flex-col items-center text-center">
        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary animate-bounce">
          <span className="material-symbols-outlined text-[48px] fill-1">celebration</span>
        </div>
        <h1 className="text-[#181114] tracking-tight text-3xl font-extrabold leading-tight">Link Generated!</h1>
        <p className="text-[#181114]/60 text-base mt-2">Your romantic surprise is ready to be shared</p>
      </div>

      <div className="px-4 mb-8">
        <div className="bg-white border border-primary/20 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.1em] mb-2 px-1">Unique Proposal Link</p>
          <div className="flex items-center gap-3 bg-background-light rounded-xl p-3 border border-dashed border-primary/30">
            <span className="material-symbols-outlined text-primary text-xl">link</span>
            <p className="flex-1 text-sm font-medium truncate text-[#181114]">{shareUrlDisplay}</p>
            <button 
                onClick={handleCopy}
                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-dark active:scale-95 transition-all"
            >
                Copy
            </button>
          </div>
        </div>
      </div>


      <div className="mt-8 sticky bottom-0 bg-white/80 backdrop-blur-md p-4 border-t border-[#181114]/5">
         <div className="flex gap-3">
             <Button variant="secondary" onClick={() => navigate('/create')} className="flex-1" icon={<span className="material-symbols-outlined">edit</span>}>Edit</Button>
             <Button onClick={handleShare} className="flex-[2]" icon={<span className="material-symbols-outlined">share</span>}>Share Link</Button>
         </div>
      </div>

    </Layout>
  );
};

export default Success;
