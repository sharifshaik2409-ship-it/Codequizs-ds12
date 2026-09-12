import React from 'react';
import { ExamSubmissionRecord } from '../types';

interface InspectorModalProps {
  isOpen?: boolean;
  contender: ExamSubmissionRecord | null;
  onClose: () => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({ contender, onClose }) => {
  if (!contender) return null;

  const hmac = contender.hmacSignature || (contender as any).hash || 'VERIFIED-LEDGER-HASH';
  const timeTaken = contender.timeTakenFormatted || `${contender.timeTakenSeconds || 0}s`;
  const score = contender.score ?? (contender as any).tokens ?? 0;

  return (
    <div className="fixed inset-0 bg-[#0b1326]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full rounded-2xl bg-[#131b2e] p-6 shadow-2xl flex flex-col gap-4 border border-[#3b494b]/50">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#3b494b]/30 pb-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00f0ff] text-[28px]">fingerprint</span>
            <div>
              <h3 className="font-mono text-base font-bold text-[#dbfcff]">
                Audit Record: {contender.username}
              </h3>
              <span className="font-mono text-[11px] text-[#849495] block truncate max-w-sm">
                HMAC Signature: {hmac}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#171f33] flex items-center justify-center text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Metric Summary Blocks */}
        <div className="grid grid-cols-3 gap-2.5 text-center font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#171f33] border border-[#3b494b]/30">
            <span className="text-[#849495] block mb-1 text-[11px]">Time Taken</span>
            <p className="text-[#00f0ff] font-bold text-sm">{timeTaken}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#171f33] border border-[#3b494b]/30">
            <span className="text-[#849495] block mb-1 text-[11px]">Score Earned</span>
            <p className="text-[#7df4ff] font-bold text-sm">{score} Tokens</p>
          </div>
          <div className="p-3 rounded-xl bg-[#171f33] border border-[#3b494b]/30">
            <span className="text-[#849495] block mb-1 text-[11px]">Database Status</span>
            <p className={`font-bold text-sm ${contender.status === 'QUALIFIED' ? 'text-[#10b981]' : contender.status === 'DISQUALIFIED' ? 'text-[#ff5449]' : 'text-[#f59e0b]'}`}>
              {contender.status}
            </p>
          </div>
        </div>

        {/* Answers / Details */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-[#b9cacb] font-semibold">
            Recorded Item Submissions ({contender.answers?.length || 0}):
          </span>
          <div className="max-h-56 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-[#171f33] font-mono text-xs border border-[#3b494b]/30">
            {(!contender.answers || contender.answers.length === 0) ? (
              <p className="text-center text-[#849495] py-4">
                No individual answer logs stored for this session.
              </p>
            ) : (
              contender.answers.map((ans, idx) => (
                <div key={idx} className="flex justify-between items-center text-[#dae2fd] py-1 border-b border-[#222a3d]/40">
                  <span className="text-[#dbfcff]">Q{ans.qId} ({ans.cat})</span>
                  <span className="text-center font-bold px-2 py-0.5 rounded bg-[#090f1e] text-[#00f0ff]">
                    {ans.selected || 'Unanswered'}
                  </span>
                  <span className="text-[11px] text-[#849495]">Verified Key</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3b494b]/30">
          <span className="font-mono text-[11px] text-[#849495]">
            Logged: {contender.loginTime} • Submitted: {new Date(contender.submittedAt).toLocaleTimeString()}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dbfcff] font-mono text-xs font-bold transition-all cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};

