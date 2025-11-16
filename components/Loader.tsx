import React, { useState, useEffect } from 'react';

interface LoaderProps {
  progress: number;
}

const loadingMessages = [
  "ADJUSTING TRACKING...",
  "REWINDING TAPE...",
  "CALIBRATING HEADS...",
  "PROCESSING CHROMA...",
  "APPLYING ANALOG WARMTH...",
  "RENDERING SCANLINES...",
  "PLEASE BE KIND, REWIND...",
  "TURBO MODE ACTIVATED!",
  "MAXIMUM OVERDRIVE!",
  "ENGAGING HYPER-SPEED PROCESSING...",
  "BOOSTING TO 200% SPEED!",
];

export const Loader: React.FC<LoaderProps> = ({ progress }) => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-8 space-y-4">
      <h2 className="text-3xl text-yellow-300 animate-pulse">{message}</h2>
      <div className="w-full bg-[#222] border-2 border-[#444]">
        <div
          className="bg-gradient-to-r from-pink-500 to-cyan-400 h-8"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-2xl text-white">{Math.round(progress)}% COMPLETE</p>
    </div>
  );
};
