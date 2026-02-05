import React from 'react';

type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-light font-display text-[#181114]">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="size-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </div>
        <div className="text-primary text-xl font-extrabold">{message}</div>
        <p className="text-[#181114]/60 text-sm mt-2">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
