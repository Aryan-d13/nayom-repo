'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../lib/audio';

export default function AudioEffects() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('.interactive-sound')
      ) {
        soundFx.playHover();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('.interactive-sound')
      ) {
        soundFx.playClick();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const toggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playTransmission();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
      <button
        onClick={toggleSound}
        type="button"
        aria-label={muted ? 'Enable tactical audio feedback' : 'Disable tactical audio feedback'}
        className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border transition-all duration-150 rounded-pill ${
          muted
            ? 'bg-[#050505] text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.2)] hover:border-[#FFE600] hover:text-[#FFE600]'
            : 'bg-[#050505] text-[#FFE600] border-[#FFE600] shadow-[0_0_15px_rgba(255,230,0,0.2)]'
        }`}
      >
        {muted ? (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AUDIO: MUTED</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#FFE600] animate-pulse" />
            <span className="hidden sm:inline">AUDIO: LIVE</span>
          </>
        )}
      </button>
    </div>
  );
}
