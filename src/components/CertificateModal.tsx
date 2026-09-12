import React from 'react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  totalScore: number;
  completedAt: string;
  certificateId: string;
  hmacSignature: string;
  matchedQuestionsCount: number;
  totalQuestionsCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  totalScore,
  completedAt,
  certificateId,
  hmacSignature,
  matchedQuestionsCount,
  totalQuestionsCount,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const certData = {
      title: 'Data Science Algorithmic Assessment - Official Certificate of Excellence',
      candidateUsername: candidateName,
      certificateId,
      issuedBy: 'DataScience Examination & Integrity Board',
      totalScore,
      verificationResult: '100% DATABASE TEST DATA MATCH',
      questionsMatched: `${matchedQuestionsCount} / ${totalQuestionsCount}`,
      completedAt,
      hmacSignature,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${candidateName}_${certificateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="certificate-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="flex flex-col gap-4 max-w-4xl w-full my-auto">
        {/* Action Header: Close & Print */}
        <div className="flex items-center justify-between px-2 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>OFFICIAL DATASCIENCE CERTIFICATE VERIFIED &amp; UNLOCKED</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#17233f] hover:bg-[#203056] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-1.5 rounded-lg bg-[#17233f] hover:bg-[#203056] border border-[#10b981]/40 text-[#10b981] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download Audit JSON</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#17233f] hover:bg-[#ff5449]/20 text-[#849495] hover:text-[#ff5449] flex items-center justify-center cursor-pointer transition-all border border-[#3b494b]/40"
              title="Close Certificate"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        <div
          id="official-certificate-canvas"
          className="relative bg-gradient-to-br from-[#0c1425] via-[#09101f] to-[#0d172e] border-8 border-double border-[#00f0ff]/50 rounded-2xl p-8 sm:p-12 shadow-[0_0_60px_rgba(0,240,255,0.25)] text-center overflow-hidden print:border-black print:bg-white print:text-black print:shadow-none"
        >
          {/* Subtle Guilloche Corner Accents */}
          <div className="absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2 border-[#00f0ff]/60 pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 border-[#00f0ff]/60 pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-16 h-16 border-b-2 border-l-2 border-[#00f0ff]/60 pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-16 h-16 border-b-2 border-r-2 border-[#00f0ff]/60 pointer-events-none"></div>

          {/* Background Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[380px]">workspace_premium</span>
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff] flex items-center justify-center text-[#00f0ff] mb-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#00f0ff] font-bold">
              DATASCIENCE &bull; CODE ASSESSMENT ARENA
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#dbfcff] uppercase tracking-wider font-serif">
              Certificate of Excellence
            </h1>
            <p className="text-xs font-mono text-[#849495] tracking-widest uppercase">
              Algorithmic Arena &bull; Round 3 Database Verification
            </p>
          </div>

          {/* Certificate Body */}
          <div className="max-w-2xl mx-auto flex flex-col gap-4 my-6">
            <p className="text-xs sm:text-sm text-[#b9cacb] font-light">
              This is officially awarded and certified to
            </p>

            {/* Candidate Name */}
            <div className="py-2 border-b-2 border-[#00f0ff]/40 inline-block mx-auto min-w-[280px]">
              <h2 className="text-2xl sm:text-4xl font-black text-[#00f0ff] tracking-tight font-mono">
                {candidateName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#dae2fd] leading-relaxed pt-2">
              for demonstrating algorithmic mastery and successfully matching all required test
              vectors against the official database specifications in{' '}
              <strong className="text-[#dbfcff]">Round 3 Algorithmic Coding Arena</strong>.
            </p>

            {/* Assessment Highlights Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 pt-2">
              <div className="p-3 rounded-xl bg-[#131d33] border border-[#3b494b]/40 font-mono">
                <span className="text-[10px] text-[#849495] block uppercase">Verification</span>
                <span className="text-xs font-bold text-[#10b981] flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  100% MATCHED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#131d33] border border-[#3b494b]/40 font-mono">
                <span className="text-[10px] text-[#849495] block uppercase">Vectors Cleared</span>
                <span className="text-xs font-bold text-[#00f0ff]">
                  {matchedQuestionsCount} / {totalQuestionsCount} Challenges
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#131d33] border border-[#3b494b]/40 font-mono">
                <span className="text-[10px] text-[#849495] block uppercase">Score Awarded</span>
                <span className="text-xs font-bold text-[#f59e0b]">
                  +{totalScore} Tokens
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#131d33] border border-[#3b494b]/40 font-mono">
                <span className="text-[10px] text-[#849495] block uppercase">Data Audit</span>
                <span className="text-xs font-bold text-[#7df4ff]">
                  APPROVED
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Footer / Signatures & HMAC */}
          <div className="pt-6 border-t border-[#3b494b]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="flex flex-col gap-1 font-mono text-[10px] text-[#849495]">
              <div>
                <strong className="text-[#b9cacb]">Certificate ID:</strong> {certificateId}
              </div>
              <div>
                <strong className="text-[#b9cacb]">Issued Date:</strong> {completedAt}
              </div>
              <div className="max-w-xs truncate">
                <strong className="text-[#b9cacb]">HMAC Digest:</strong> {hmacSignature}
              </div>
            </div>

            {/* Official Digital Seal & Signature */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00f0ff]/50 flex flex-col items-center justify-center text-center p-1 text-[8px] font-mono text-[#00f0ff] uppercase">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>DataScience</span>
                <span className="text-[7px] text-[#10b981]">VERIFIED</span>
              </div>

              <div className="text-center">
                <div className="h-9 flex items-end justify-center font-serif italic text-lg text-[#dbfcff] border-b border-[#3b494b]/60 px-4">
                  Datascience Board
                </div>
                <span className="text-[9px] font-mono uppercase text-[#849495] block mt-1">
                  Examination &amp; Verification Director
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
