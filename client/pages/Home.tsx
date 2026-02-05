import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { fetchLinkStatus } from '../api';
import LoadingScreen from '../components/LoadingScreen';
import usePageReady from '../hooks/usePageReady';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isReady = usePageReady();
  const [lookupValue, setLookupValue] = useState('');
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'loading' | 'answered' | 'pending' | 'error'>('idle');
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const extractSlug = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      const url = new URL(trimmed);
      const path = url.pathname.split('/').filter(Boolean);
      const hashPath = url.hash.replace(/^#/, '').split('/').filter(Boolean);
      const candidates = [...hashPath, ...path];
      const pIndex = candidates.lastIndexOf('p');
      if (pIndex >= 0 && candidates[pIndex + 1]) {
        return candidates[pIndex + 1];
      }
      return candidates[candidates.length - 1] || null;
    } catch {
      return trimmed;
    }
  };

  const handleLookup = async () => {
    const slug = extractSlug(lookupValue);
    if (!slug) {
      setLookupStatus('error');
      setLookupMessage('Paste a link or slug first.');
      return;
    }

    setLookupStatus('loading');
    setLookupMessage(null);

    try {
      const result = await fetchLinkStatus(slug);
      if (result.answer) {
        const answeredAt = result.answeredAt ? new Date(result.answeredAt).toLocaleString() : '';
        const label = result.answer === 'accepted' ? 'Yes' : 'No';
        setLookupStatus('answered');
        setLookupMessage(`Answer: ${label}${answeredAt ? ` (answered ${answeredAt})` : ''}`);
      } else {
        setLookupStatus('pending');
        setLookupMessage('No answer yet. Share the link and wait for a response.');
      }
    } catch (err) {
      setLookupStatus('error');
      setLookupMessage(err instanceof Error ? err.message : 'Failed to check link');
    }
  };

  if (!isReady) {
    return <LoadingScreen message="Loading home..." />;
  }

  return (
    <Layout variant="full">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <span className="material-symbols-outlined text-primary text-2xl">favorite</span>
            </div>
            <span className="font-extrabold text-primary text-lg tracking-tight">ValenLink</span>
          </div>
          <button className="text-primary font-semibold text-sm hover:underline">Login</button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-radial from-[#fff1f6] to-white pt-12 pb-20 md:pt-32 md:pb-32">
          {/* Animated Background Icons - Adjusted for responsiveness */}
          <div className="absolute top-0 right-0 w-full h-full opacity-50 pointer-events-none overflow-hidden">
             <span className="material-symbols-outlined absolute -top-4 -left-4 text-primary/10 text-8xl rotate-12 animate-float md:text-9xl md:left-20 md:top-20">favorite</span>
             <span className="material-symbols-outlined absolute top-20 -right-6 text-primary/10 text-6xl -rotate-12 animate-float md:text-8xl md:right-32 md:top-40" style={{animationDelay: '1s'}}>favorite</span>
             <span className="material-symbols-outlined absolute bottom-20 left-10 text-primary/5 text-7xl rotate-45 animate-float hidden md:block" style={{animationDelay: '2s'}}>heart_plus</span>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight text-[#181114] mb-6">
              Ask Your <span className="text-primary">Valentine</span> <br className="hidden md:block" />in a Special Way
            </h1>
            <p className="text-[#181114]/60 text-lg md:text-2xl mb-10 max-w-[280px] md:max-w-2xl mx-auto">
              Create a personalized, interactive proposal page that they'll never forget.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-sm md:max-w-none mx-auto">
              <div className="w-full md:w-auto">
                <Button onClick={() => navigate('/create')} fullWidth icon={<span className="material-symbols-outlined">arrow_forward</span>}>
                  Start Creating
                </Button>
              </div>
              <p className="text-xs text-primary/60 font-medium md:hidden">No signup required to start</p>
            </div>
          </div>
        </section>

        {/* Answer Lookup */}
        <section className="py-12 md:py-16 bg-[#fff9fb] border-y border-primary/5">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#181114] mb-3">Check a response</h2>
            <p className="text-[#181114]/60 mb-6">Paste a shared link or slug to see if they answered.</p>

            <div className="flex flex-col md:flex-row gap-3 items-center">
              <input
                type="text"
                value={lookupValue}
                onChange={(event) => setLookupValue(event.target.value)}
                placeholder="Paste link or slug"
                className="w-full md:flex-1 h-12 px-4 rounded-full border border-primary/20 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleLookup}
                className="h-12 px-6 rounded-full bg-primary text-white font-bold shadow-lg hover:bg-primary-dark transition-colors"
              >
                {lookupStatus === 'loading' ? 'Checking...' : 'Check'}
              </button>
            </div>

            {lookupMessage ? (
              <div
                className={`mt-4 text-sm font-semibold ${
                  lookupStatus === 'answered'
                    ? 'text-green-600'
                    : lookupStatus === 'pending'
                    ? 'text-primary'
                    : 'text-red-500'
                }`}
              >
                {lookupMessage}
              </div>
            ) : null}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center text-[#181114]">How it works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-soft-pink/30 transition-colors">
                <div className="bg-soft-pink w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl">photo_library</span>
                </div>
                <h3 className="font-bold text-xl mb-3">1. Pick a photo</h3>
                <p className="text-[#181114]/60">Upload a cute memory or choose from our romantic library to set the mood.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-soft-pink/30 transition-colors">
                <div className="bg-soft-pink w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>
                <h3 className="font-bold text-xl mb-3">2. Write a message</h3>
                <p className="text-[#181114]/60">Express your feelings or use our heartfelt templates to find the right words.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-soft-pink/30 transition-colors">
                <div className="bg-soft-pink w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl">share</span>
                </div>
                <h3 className="font-bold text-xl mb-3">3. Share the link</h3>
                <p className="text-[#181114]/60">Send your unique link and wait for the "Yes!" (It's hard to say no!)</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-primary/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="bg-primary/10 p-1.5 rounded-full">
               <span className="material-symbols-outlined text-primary text-xl">favorite</span>
            </div>
            <span className="font-bold text-[#181114]">ValenLink</span>
          </div>
          <p className="text-[#181114]/40 text-sm mb-6">© 2024 ValenLink. Spread the love.</p>
          <div className="flex justify-center gap-6 text-primary/60">
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">favorite</span>
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">heart_plus</span>
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">volunteer_activism</span>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Home;
