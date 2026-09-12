import React from 'react';

interface ResultModalProps {
  isOpen: boolean;
  qualified: boolean;
  correctCount: number;
  tokensEarned: number;
  onAdvanceOrRetry: () => void;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  qualified,
  correctCount,
  tokensEarned,
  onAdvanceOrRetry,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/90 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#222a3d] p-8 rounded-xl shadow-2xl flex flex-col gap-6 text-center relative overflow-hidden border border-[#3b494b]/50">
        <div
          className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            qualified ? 'bg-[#00f0ff]/20' : 'bg-[#93000a]/30'
          }`}
        ></div>

        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-[36px] mb-2 shadow-lg ${
              qualified
                ? 'bg-[#00f0ff] text-[#00363a]'
                : 'bg-[#93000a] text-[#ffdad6]'
            }`}
          >
            <span className="material-symbols-outlined text-[36px]">
              {qualified ? 'emoji_events' : 'cancel'}
            </span>
          </div>

          <h3
            className={`font-headline-lg text-headline-lg font-bold ${
              qualified ? 'text-[#dbfcff]' : 'text-[#ffb4ab]'
            }`}
          >
            {qualified ? 'ROUND CLEARED!' : 'RACE STOPPED'}
          </h3>

          <p className="font-body-lg text-body-lg text-[#b9cacb] max-w-sm">
            {qualified
              ? `Outstanding precision! ${correctCount}/5 Correct | ${tokensEarned} Tokens Earned | Checkpoint 1 (Bridge of Logic) Unlocked!`
              : `Insufficient accuracy: ${correctCount}/5 Correct. Qualification requires at least 4/5 (32+ Tokens). Checkpoint remains locked.`}
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 bg-[#171f33] p-4 rounded border border-[#3b494b]/30">
          <div className="flex flex-col">
            <span className="font-telemetry-sm text-telemetry-sm text-[#849495]">ACCURACY</span>
            <span className="font-telemetry-lg text-telemetry-lg text-[#dbfcff] font-bold">
              {correctCount}/5
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-telemetry-sm text-telemetry-sm text-[#849495]">TOKENS</span>
            <span className="font-telemetry-lg text-telemetry-lg text-[#b3c5ff] font-bold">
              {tokensEarned}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-telemetry-sm text-telemetry-sm text-[#849495]">STATUS</span>
            <span
              className={`font-telemetry-lg text-telemetry-lg font-bold ${
                qualified ? 'text-[#00f0ff]' : 'text-[#ffb4ab]'
              }`}
            >
              {qualified ? 'QUALIFIED' : 'FAILED'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onAdvanceOrRetry}
            className={`w-full py-3 px-6 font-headline-sm text-body-md font-bold uppercase rounded shadow-lg transition-all cursor-pointer ${
              qualified
                ? 'bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] shadow-[0_0_16px_rgba(0,240,255,0.4)]'
                : 'bg-[#171f33] hover:bg-[#31394d] text-[#dae2fd]'
            }`}
          >
            {qualified ? 'ADVANCE TO CHECKPOINT 1' : 'RETRY ROUND 1 POOL'}
          </button>
        </div>
      </div>
    </div>
  );
};
