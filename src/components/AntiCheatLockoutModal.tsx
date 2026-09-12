import React, { useState, useEffect } from 'react';

interface AntiCheatLockoutModalProps {
  isOpen: boolean;
  username: string;
  reason?: string;
  onLockoutComplete: () => void;
}

export const AntiCheatLockoutModal: React.FC<AntiCheatLockoutModalProps> = ({
  isOpen,
  username,
  reason = 'Unauthorized button click during locked exam.',
  onLockoutComplete,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(60);
      return;
    }

    setSecondsRemaining(60);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = ((60 - secondsRemaining) / 60) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#110c14] border-2 border-[#ff5449] p-6 sm:p-8 shadow-[0_0_60px_rgba(255,84,73,0.5)] flex flex-col items-center text-center animate-pulse">
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-[#ff5449]/20 border-2 border-[#ff5449] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,84,73,0.6)]">
          <span className="material-symbols-outlined text-[#ff5449] text-5xl">
            gavel
          </span>
        </div>

        <span className="px-3 py-1 rounded bg-[#ff5449]/20 text-[#ffb4ab] font-telemetry-sm text-telemetry-sm uppercase tracking-widest font-bold border border-[#ff5449]/50 mb-3">
          SECURITY BREACH DETECTED // PROTOCOL 403
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#ffb4ab] mb-2 tracking-tight">
          CANDIDATE DISQUALIFIED
        </h2>

        <p className="text-sm sm:text-base text-[#dae2fd]/80 max-w-md mb-6">
          <strong className="text-[#ff5449]">{username}</strong>, you attempted to click an unauthorized navigation/interface button during a strictly locked exam.
        </p>

        <div className="w-full p-4 rounded-xl bg-[#1b121e] border border-[#ff5449]/30 text-left mb-6 font-mono text-xs text-[#ffb4ab] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#849495]">VIOLATION:</span>
            <span className="font-bold text-[#ff5449]">UNAUTHORIZED BUTTON CLICK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#849495]">OFFICIAL STATUS:</span>
            <span className="font-bold text-[#ff5449]">DISQUALIFIED (0 TOKENS)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#849495]">PENALTY:</span>
            <span className="text-[#dae2fd]">MANDATORY 1-MINUTE ACCOUNT LOCKOUT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#849495]">DETAILS:</span>
            <span className="text-[#dae2fd] truncate max-w-[260px]">{reason}</span>
          </div>
        </div>

        {/* Lockout Countdown Timer */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-xs text-[#849495] tracking-widest uppercase mb-1 font-mono">
            LOCKOUT PENALTY REMAINING
          </span>
          <div className="text-5xl sm:text-6xl font-black text-[#ff5449] font-mono tracking-wider drop-shadow-[0_0_20px_rgba(255,84,73,0.8)]">
            {secondsRemaining > 0 ? `${secondsRemaining}s` : '00s'}
          </div>
          <span className="text-xs text-[#ffb4ab]/70 mt-1">
            {secondsRemaining > 0
              ? 'All controls blocked. Please wait for the lockout timer to expire.'
              : 'Lockout penalty completed.'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#2a1720] h-2.5 rounded-full overflow-hidden mb-6 border border-[#ff5449]/30">
          <div
            className="bg-[#ff5449] h-full transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(255,84,73,0.9)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Proceed button (active only when 60s completes) */}
        <button
          disabled={secondsRemaining > 0}
          onClick={onLockoutComplete}
          className={`w-full py-3.5 px-6 rounded-xl font-bold tracking-wider text-sm transition-all ${
            secondsRemaining > 0
              ? 'bg-[#2a1720] text-[#849495] cursor-not-allowed border border-[#ff5449]/20'
              : 'bg-[#ff5449] hover:bg-[#ff3b2f] text-[#2d0001] cursor-pointer shadow-[0_0_25px_rgba(255,84,73,0.6)]'
          }`}
        >
          {secondsRemaining > 0
            ? `BLOCKED (${secondsRemaining}s REMAINING)`
            : 'CONTINUE TO LEADERBOARD DASHBOARD'}
        </button>
      </div>
    </div>
  );
};
