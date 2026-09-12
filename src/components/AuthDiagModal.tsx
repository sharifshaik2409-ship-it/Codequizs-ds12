import React from 'react';

interface AuthDiagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthDiagModal: React.FC<AuthDiagModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0b1326]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full rounded-xl bg-[#131b2e] p-6 shadow-2xl flex flex-col gap-4 border border-[#3b494b]/50">
        <div className="flex items-center justify-between border-b border-[#3b494b]/30 pb-3">
          <div className="flex items-center gap-2 text-[#dbfcff]">
            <span className="material-symbols-outlined text-[24px] text-[#00f0ff]">shield</span>
            <h3 className="font-headline-sm text-headline-sm font-bold">Security Ledger Headers</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#171f33] flex items-center justify-center text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="font-telemetry-sm text-telemetry-sm space-y-2.5 text-[#b9cacb]">
          <div className="p-3 rounded bg-[#171f33] border border-[#222a3d]">
            <span className="text-[#7df4ff] font-bold block mb-1">Cookie Policy:</span>
            <code>__Host-Admin-Token; Secure; HttpOnly; SameSite=Strict</code>
          </div>
          <div className="p-3 rounded bg-[#171f33] border border-[#222a3d]">
            <span className="text-[#7df4ff] font-bold block mb-1">CSRF Header:</span>
            <code>X-CSRF-Token: 9e32a498b...d01 (Matched with memory store)</code>
          </div>
          <div className="p-3 rounded bg-[#171f33] border border-[#222a3d]">
            <span className="text-[#7df4ff] font-bold block mb-1">Privileged Roles:</span>
            <code>[Datascience3, saisrinivas] authenticated on server.</code>
          </div>
          <div className="p-3 rounded bg-[#171f33] border border-[#93000a]/40 text-[#ffb4ab]">
            <span className="text-[#ffb4ab] font-bold block mb-1">Unauthorized Check:</span>
            <span>Role mismatch returns HTTP 403 Forbidden with kernel drop.</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="py-2.5 rounded bg-[#00f0ff] text-[#00363a] font-headline-sm text-body-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-90 transition-all cursor-pointer mt-2"
        >
          Acknowledge Zero-Trust State
        </button>
      </div>
    </div>
  );
};
