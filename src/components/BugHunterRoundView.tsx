import React, { useState } from 'react';
import { BUG_HUNTER_CHALLENGES } from '../data/bugHunterQuestions';
import { PlayerSession } from '../types';

interface BugHunterRoundViewProps {
  playerSession: PlayerSession;
  onPassed?: (challengeId: number) => void;
}

export const BugHunterRoundView: React.FC<BugHunterRoundViewProps> = ({
  playerSession,
  onPassed,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [codeDraft, setCodeDraft] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    BUG_HUNTER_CHALLENGES.forEach((c) => {
      map[c.id] = c.buggyCode;
    });
    return map;
  });
  const [passedChallenges, setPassedChallenges] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const current = BUG_HUNTER_CHALLENGES[activeIdx];
  const currentCode = codeDraft[current.id] ?? current.buggyCode;
  const isPassed = passedChallenges[current.id];

  const handleTestFix = () => {
    // Normalization check: check if candidate fixed the key bug
    const normalizedDraft = currentCode.replace(/\s+/g, ' ').trim();
    let correct = false;

    if (current.id === 1) {
      correct =
        normalizedDraft.includes('range(len(items))') ||
        normalizedDraft.includes('range(0, len(items))') ||
        (normalizedDraft.includes('for item in items') && !normalizedDraft.includes('len(items) + 1'));
    } else if (current.id === 2) {
      correct =
        normalizedDraft.includes('ptr == NULL') ||
        normalizedDraft.includes('!ptr') ||
        normalizedDraft.includes('ptr != NULL');
    } else if (current.id === 3) {
      correct =
        normalizedDraft.toLowerCase().includes('group by department') ||
        normalizedDraft.toLowerCase().includes('group by employees.department');
    }

    if (correct) {
      setPassedChallenges((prev) => ({ ...prev, [current.id]: true }));
      setStatusFeedback('SUCCESS: Bug isolated and fixed! Code passes all boundary sanity checks.');
      if (onPassed) onPassed(current.id);
    } else {
      setStatusFeedback('FAILED: The bug is still present in the snippet. Examine the error details and try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#f59e0b]/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
            <span className="material-symbols-outlined text-2xl">pest_control</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#f59e0b] text-[#000] font-mono font-bold uppercase">
                ROUND 2
              </span>
              <h2 className="text-lg font-bold text-[#dbfcff]">Bug Hunter Circuit</h2>
            </div>
            <p className="text-xs text-[#b9cacb] mt-0.5">
              Inspect faulty production code, identify architectural defect, and patch the snippet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1527] p-1.5 rounded-xl border border-[#3b494b]/40">
          {BUG_HUNTER_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                setActiveIdx(idx);
                setShowHint(false);
                setStatusFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeIdx === idx
                  ? 'bg-[#f59e0b] text-[#000]'
                  : passedChallenges[ch.id]
                  ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                  : 'bg-[#171f33] text-[#849495] hover:text-[#dbfcff]'
              }`}
            >
              <span>Bug #{idx + 1}</span>
              {passedChallenges[ch.id] && <span className="material-symbols-outlined text-[14px]">check</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#0266ff]/20 text-[#7df4ff] text-xs font-mono font-bold">
                {current.language}
              </span>
              <span className="text-xs font-mono text-[#849495]">Challenge {activeIdx + 1} / 3</span>
            </div>

            <h3 className="text-lg font-bold text-[#dbfcff]">{current.title}</h3>
            <p className="text-xs text-[#b9cacb] leading-relaxed">{current.description}</p>

            <div className="p-3 rounded-xl bg-[#ff5449]/10 border border-[#ff5449]/30 text-xs font-mono text-[#ffb4ab]">
              <strong className="block text-[#ff5449] mb-1">Reported Defect:</strong>
              {current.bugDescription}
            </div>

            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-mono text-[#00f0ff] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>{showHint ? 'Hide Hint' : 'View Architectural Hint'}</span>
              </button>
              {showHint && (
                <ul className="list-disc list-inside text-xs text-[#b9cacb] mt-2 font-mono space-y-1">
                  {current.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#849495]">Live Code Patch Editor</span>
              <button
                onClick={() => setCodeDraft((prev) => ({ ...prev, [current.id]: current.buggyCode }))}
                className="text-xs font-mono text-[#849495] hover:text-[#dbfcff] cursor-pointer"
              >
                Reset Snippet
              </button>
            </div>

            <textarea
              value={currentCode}
              onChange={(e) => setCodeDraft((prev) => ({ ...prev, [current.id]: e.target.value }))}
              rows={12}
              spellCheck={false}
              className="w-full bg-[#090f1e] text-[#7df4ff] font-mono text-xs sm:text-sm p-4 rounded-xl border border-[#2d3449] outline-none leading-relaxed"
            />

            {statusFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-mono border ${
                  isPassed
                    ? 'bg-[#10b981]/15 text-[#a7f3d0] border-[#10b981]/40'
                    : 'bg-[#ff5449]/15 text-[#ffb4ab] border-[#ff5449]/40'
                }`}
              >
                {statusFeedback}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTestFix}
                className="px-5 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs font-mono uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                Test Code Patch
              </button>

              {activeIdx < BUG_HUNTER_CHALLENGES.length - 1 ? (
                <button
                  onClick={() => {
                    setActiveIdx((prev) => prev + 1);
                    setShowHint(false);
                    setStatusFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#dbfcff] text-xs font-mono font-bold cursor-pointer"
                >
                  Next Bug &rarr;
                </button>
              ) : (
                <span className="text-xs font-mono text-[#10b981]">
                  All Bug Challenges Available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
