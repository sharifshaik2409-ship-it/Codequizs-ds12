import React from 'react';

interface DisengageModalProps {
  isOpen: boolean;
  onResume: () => void;
  onForfeit: () => void;
}

export const DisengageModal: React.FC<DisengageModalProps> = ({
  isOpen,
  onResume,
  onForfeit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#222a3d] p-8 rounded-xl shadow-2xl flex flex-col gap-4 border border-[#ffb4ab]/40">
        <div className="flex items-center gap-3 text-[#ffb4ab]">
          <span className="material-symbols-outlined text-[32px]">warning</span>
          <h4 className="font-headline-sm text-headline-sm font-bold">CRITICAL WARNING</h4>
        </div>

        <p className="font-body-md text-body-md text-[#dae2fd] leading-relaxed">
          Your race is currently active. Leaving will forfeit progress, invalidate your token buffer, and terminate arbitration session lock!
        </p>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            onClick={onResume}
            className="px-4 py-2 bg-[#171f33] hover:bg-[#31394d] text-[#dae2fd] font-headline-sm text-body-md font-bold rounded transition-all cursor-pointer"
          >
            RESUME RACE
          </button>
          <button
            onClick={onForfeit}
            className="px-4 py-2 bg-[#93000a] hover:bg-[#ffb4ab] text-[#ffdad6] hover:text-[#002022] font-headline-sm text-body-md font-bold rounded transition-all cursor-pointer"
          >
            FORFEIT SESSION
          </button>
        </div>
      </div>
    </div>
  );
};
