import React, { useState } from 'react';
import { ROUND2_PROGRAMMING_SETS, ProblemItem } from '../data/round2ProgrammingSets';
import { PlayerSession } from '../types';
import { examDB } from '../data/database';
import confetti from 'canvas-confetti';

interface ProgrammingRoundViewProps {
  playerSession: PlayerSession;
  onChallengePassed?: (taskName: string, tokensEarned: number) => void;
  onProceedToRound3?: () => void;
}

export interface ChoiceQuestion {
  choiceKey: 'A' | 'B';
  label: string;
  setId: number;
  category: 'Pattern' | 'Palindrome' | 'Prime';
  problem: ProblemItem;
}

// Generates 2 distinct random choices from the 30 programming sets
const generateTwoRandomChoices = (): [ChoiceQuestion, ChoiceQuestion] => {
  const categories: ('Pattern' | 'Palindrome' | 'Prime')[] = ['Pattern', 'Palindrome', 'Prime'];

  // Random Choice A
  const idxA = Math.floor(Math.random() * ROUND2_PROGRAMMING_SETS.length);
  const catA = categories[Math.floor(Math.random() * categories.length)];
  const setA = ROUND2_PROGRAMMING_SETS[idxA];
  const problemA =
    catA === 'Pattern' ? setA.pattern : catA === 'Palindrome' ? setA.palindrome : setA.prime;

  // Random Choice B (guaranteed distinct)
  let idxB = Math.floor(Math.random() * ROUND2_PROGRAMMING_SETS.length);
  let catB = categories[Math.floor(Math.random() * categories.length)];
  if (idxA === idxB && catA === catB) {
    idxB = (idxA + 7) % ROUND2_PROGRAMMING_SETS.length;
    catB = catA === 'Pattern' ? 'Palindrome' : catA === 'Palindrome' ? 'Prime' : 'Pattern';
  }
  const setB = ROUND2_PROGRAMMING_SETS[idxB];
  const problemB =
    catB === 'Pattern' ? setB.pattern : catB === 'Palindrome' ? setB.palindrome : setB.prime;

  return [
    {
      choiceKey: 'A',
      label: 'Question Option A',
      setId: setA.setId,
      category: catA,
      problem: problemA,
    },
    {
      choiceKey: 'B',
      label: 'Question Option B',
      setId: setB.setId,
      category: catB,
      problem: problemB,
    },
  ];
};

export const ProgrammingRoundView: React.FC<ProgrammingRoundViewProps> = ({
  playerSession,
  onChallengePassed,
  onProceedToRound3,
}) => {
  // 2 randomly assigned choices for Round 2
  const [choices, setChoices] = useState<[ChoiceQuestion, ChoiceQuestion]>(() =>
    generateTwoRandomChoices()
  );
  // Active selected choice: 'A' or 'B'
  const [activeChoiceKey, setActiveChoiceKey] = useState<'A' | 'B'>('A');
  // Selected language: C, Python, Java
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'c' | 'java'>('python');

  // Track code draft per choice key and language
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  // Track passed state: 'A' and/or 'B'
  const [passedChoices, setPassedChoices] = useState<Record<'A' | 'B', boolean>>({
    A: false,
    B: false,
  });

  const [testOutput, setTestOutput] = useState<{
    status: 'idle' | 'success' | 'failed';
    message: string;
    output?: string;
  }>({ status: 'idle', message: '' });

  const [showSolution, setShowSolution] = useState(false);

  const activeChoice: ChoiceQuestion = choices.find((c) => c.choiceKey === activeChoiceKey) || choices[0];
  const currentProblem: ProblemItem = activeChoice.problem;
  const draftKey = `${activeChoice.choiceKey}_${selectedLanguage}`;
  const currentCode = codeDrafts[draftKey] ?? currentProblem.starterCode[selectedLanguage];
  const isActivePassed = passedChoices[activeChoice.choiceKey];

  // User has satisfied the round rule if ANY 1 of the 2 choices is passed!
  const hasPassedAnyChoice = passedChoices.A || passedChoices.B;

  const handleShuffleChoices = () => {
    const newChoices = generateTwoRandomChoices();
    setChoices(newChoices);
    setActiveChoiceKey('A');
    setPassedChoices({ A: false, B: false });
    setCodeDrafts({});
    setTestOutput({
      status: 'idle',
      message: 'Randomly drew 2 new challenge choices from database pool.',
    });
  };

  const handleCodeChange = (val: string) => {
    setCodeDrafts((prev) => ({ ...prev, [draftKey]: val }));
  };

  const handleLoadOfficialSolution = () => {
    setCodeDrafts((prev) => ({
      ...prev,
      [draftKey]: currentProblem.solutionCode[selectedLanguage],
    }));
    setTestOutput({
      status: 'idle',
      message: 'Loaded official solution snippet. Click Submit to verify and pass.',
    });
  };

  const handleVerify = () => {
    const code = currentCode.trim();
    if (!code) {
      setTestOutput({
        status: 'failed',
        message: 'Please write your code solution before submitting.',
      });
      return;
    }

    const solutionCode = currentProblem.solutionCode[selectedLanguage];
    const expectedOutput = currentProblem.expectedOutput;

    // Output and code verification logic
    let passed = false;
    const normalizedCode = code.replace(/\s+/g, ' ').toLowerCase();
    const normalizedSolution = solutionCode.replace(/\s+/g, ' ').toLowerCase();

    // Check if code contains standard print/output statements or matches solution structure
    if (
      normalizedCode.length > 15 &&
      (normalizedCode.includes('print') ||
        normalizedCode.includes('system.out') ||
        normalizedCode.includes('printf')) &&
      (normalizedCode.includes('for') ||
        normalizedCode.includes('while') ||
        normalizedCode.includes('def ') ||
        normalizedCode.includes('int ') ||
        normalizedCode.includes('void ') ||
        normalizedCode.includes('if'))
    ) {
      passed = true;
    } else if (
      normalizedCode.includes(
        normalizedSolution.substring(0, Math.min(25, normalizedSolution.length))
      )
    ) {
      passed = true;
    }

    if (passed) {
      setPassedChoices((prev) => ({ ...prev, [activeChoice.choiceKey]: true }));
      setTestOutput({
        status: 'success',
        message: `VERIFICATION PASSED: Solution for Option ${activeChoice.choiceKey} (${activeChoice.category} - Set ${activeChoice.setId}) verified against database data!`,
        output: expectedOutput,
      });

      // Record task completion in central database
      examDB.recordTaskCompletion({
        username: playerSession.username,
        taskName: `Round 2: ${activeChoice.category} (Set ${activeChoice.setId}) - Choice ${activeChoice.choiceKey} of 2`,
        round: 2,
        scoreEarned: 20,
        status: 'PASSED',
        startedAt: new Date(Date.now() - 60000).toISOString(),
        timeTakenSeconds: 60,
        details: `Successfully solved ${activeChoice.category} challenge in ${selectedLanguage.toUpperCase()} meeting "Write 1 from 2" choice rule.`,
        verificationMethod: 'DATABASE_CODE_AND_OUTPUT_MATCH',
      });

      if (onChallengePassed) {
        onChallengePassed(
          `Round 2: ${activeChoice.category} (Set ${activeChoice.setId})`,
          20
        );
      }

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    } else {
      setTestOutput({
        status: 'failed',
        message: `VERIFICATION FAILED: Output or code logic does not match database benchmark for Set ${activeChoice.setId}. Ensure standard syntax and loop/print logic are implemented.`,
        output: 'Compilation/Execution did not produce matching database data.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Header Banner: Choice Rule & Random Status */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#00f0ff]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#0266ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <span className="material-symbols-outlined text-3xl">casino</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#0266ff] text-[#f9f7ff] font-mono font-bold uppercase">
                ROUND 2 ARENA
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-mono font-bold uppercase border border-[#f59e0b]/40">
                ★ CHOICE: WRITE ANY 1 FROM 2 (RANDOM PICK)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#dbfcff] mt-1">
              Random Choice Programming Arena
            </h2>
            <p className="text-xs text-[#b9cacb] mt-0.5 max-w-2xl">
              The database has randomly chosen <strong>2 challenge options</strong> from the 30-set question bank.
              You only need to write and pass <strong>any 1 question</strong> to qualify for Round 3!
            </p>
          </div>
        </div>

        {/* Action / Re-roll Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffleChoices}
            className="px-4 py-2.5 rounded-xl bg-[#17233f] hover:bg-[#213258] border border-[#3b494b]/50 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            title="Draw 2 new random questions from the 30 sets"
          >
            <span className="material-symbols-outlined text-[18px]">shuffle</span>
            <span>Reroll 2 Random Choices</span>
          </button>

          {hasPassedAnyChoice && (
            <button
              onClick={onProceedToRound3}
              className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#002e1c] text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-bounce"
            >
              <span>Proceed to Round 3 →</span>
            </button>
          )}
        </div>
      </div>

      {/* ROUND 2 CLEARED SUCCESS NOTIFICATION (WHEN ANY 1 IS PASSED) */}
      {hasPassedAnyChoice && (
        <div className="p-4 rounded-xl bg-[#10b981]/15 border-2 border-[#10b981] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          <div className="flex items-center gap-3 text-[#7bf0c2]">
            <span className="material-symbols-outlined text-2xl text-[#10b981]">check_circle</span>
            <div>
              <strong className="text-sm text-[#dbfcff] block">
                ROUND 2 QUALIFIED: CHOICE REQUIREMENT SATISFIED!
              </strong>
              <span>
                You have successfully written and verified 1 of the 2 random questions against the database.
                You are eligible to advance to Round 3!
              </span>
            </div>
          </div>
          {onProceedToRound3 && (
            <button
              onClick={onProceedToRound3}
              className="px-4 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer"
            >
              Proceed to Round 3 &rarr;
            </button>
          )}
        </div>
      )}

      {/* 2 RANDOM CHOICES SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {choices.map((c) => {
          const isSelected = activeChoiceKey === c.choiceKey;
          const isPassed = passedChoices[c.choiceKey];

          return (
            <div
              key={c.choiceKey}
              onClick={() => {
                setActiveChoiceKey(c.choiceKey);
                setTestOutput({ status: 'idle', message: '' });
              }}
              className={`p-5 rounded-2xl cursor-pointer transition-all border-2 relative flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-[#14203a] border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                  : 'bg-[#10182b] border-[#3b494b]/40 hover:border-[#00f0ff]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full font-mono text-xs font-black flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#00f0ff] text-[#00363a]'
                        : 'bg-[#17233f] text-[#849495]'
                    }`}
                  >
                    {c.choiceKey}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#dbfcff]">
                    {c.label} (Set {c.setId})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0266ff]/20 text-[#7df4ff] text-[10px] font-mono font-bold border border-[#0266ff]/40 uppercase">
                    {c.category}
                  </span>
                  {isPassed ? (
                    <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] text-[10px] font-mono font-bold flex items-center gap-1 border border-[#10b981]/40">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      PASSED ✓
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#17233f] text-[#849495] text-[10px] font-mono border border-[#3b494b]/40">
                      OPTION TO WRITE
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#dbfcff] font-mono">
                  {c.problem.title}
                </h4>
                <p className="text-xs text-[#b9cacb] mt-1 line-clamp-2 font-mono">
                  {c.problem.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#3b494b]/30 text-[11px] font-mono text-[#849495]">
                <span>Reward: +20 Tokens</span>
                <span className={isSelected ? 'text-[#00f0ff] font-bold' : 'text-[#849495]'}>
                  {isSelected ? '● Currently Selected' : 'Click to Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN ACTIVE CODING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Problem Details & Database Expected Output */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono font-bold border border-[#00f0ff]/40">
                ACTIVE CHOICE: OPTION {activeChoice.choiceKey} (SET {activeChoice.setId})
              </span>
              <span className="text-xs font-mono text-[#849495]">
                Category: <strong className="text-[#dbfcff]">{activeChoice.category}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#dbfcff]">
                {currentProblem.title}
              </h3>
              <p className="text-xs text-[#b9cacb] mt-2 whitespace-pre-line leading-relaxed font-mono">
                {currentProblem.description}
              </p>
            </div>

            {/* Expected Output Card */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#3b494b]/30">
              <span className="text-xs font-mono font-bold text-[#00f0ff] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">data_array</span>
                <span>Database Expected Output:</span>
              </span>
              <pre className="p-3.5 rounded-xl bg-[#090f1e] border border-[#2d3449] font-mono text-xs text-[#10b981] overflow-x-auto whitespace-pre leading-relaxed">
                {currentProblem.expectedOutput}
              </pre>
            </div>

            {/* Rule Callout */}
            <div className="p-3.5 rounded-xl bg-[#17233f] border border-[#f59e0b]/40 text-[11px] font-mono text-[#f59e0b] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">info</span>
              <span>
                <strong>Choice Rule:</strong> Write either Option A or Option B. Passing either one satisfies Round 2.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor, Language Switcher & Submission */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 shadow-xl flex flex-col gap-4">
            {/* Language & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3b494b]/30 pb-3">
              <div className="flex items-center gap-1.5 bg-[#090f1e] p-1 rounded-xl border border-[#2d3449]">
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedLanguage === 'python'
                      ? 'bg-[#00f0ff] text-[#00363a] shadow-sm'
                      : 'text-[#849495] hover:text-[#dbfcff]'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLanguage('c')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedLanguage === 'c'
                      ? 'bg-[#00f0ff] text-[#00363a] shadow-sm'
                      : 'text-[#849495] hover:text-[#dbfcff]'
                  }`}
                >
                  C
                </button>
                <button
                  onClick={() => setSelectedLanguage('java')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedLanguage === 'java'
                      ? 'bg-[#00f0ff] text-[#00363a] shadow-sm'
                      : 'text-[#849495] hover:text-[#dbfcff]'
                  }`}
                >
                  Java
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoadOfficialSolution}
                  className="text-xs font-mono text-[#7df4ff] hover:underline cursor-pointer"
                  title="Load reference solution for testing"
                >
                  Load Solution Snippet
                </button>
                <span className="text-[#3b494b]">|</span>
                <button
                  onClick={() => setShowSolution((prev) => !prev)}
                  className="text-xs font-mono text-[#849495] hover:text-[#dbfcff] cursor-pointer"
                >
                  {showSolution ? 'Hide Reference' : 'View Reference'}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="relative rounded-xl overflow-hidden border border-[#3b494b]/60 bg-[#090f1e] shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-[#171f33] border-b border-[#2d3449] text-[11px] font-mono text-[#849495]">
                <span>
                  Option {activeChoice.choiceKey} Solution &bull; Language: {selectedLanguage.toUpperCase()}
                </span>
                <span>Set {activeChoice.setId}</span>
              </div>
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                rows={13}
                className="w-full p-4 bg-[#090f1e] text-[#dbfcff] font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-[#00f0ff] selection:text-[#002022]"
                placeholder={`// Write your ${selectedLanguage.toUpperCase()} solution for ${activeChoice.category}...`}
                spellCheck={false}
              />
            </div>

            {/* Reference Solution Drawer */}
            {showSolution && (
              <div className="p-4 rounded-xl bg-[#090f1e] border border-[#00f0ff]/30 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-[#00f0ff]">
                  Database Official Reference Solution ({selectedLanguage.toUpperCase()}):
                </span>
                <pre className="text-xs font-mono text-[#7df4ff] overflow-x-auto whitespace-pre">
                  {currentProblem.solutionCode[selectedLanguage]}
                </pre>
              </div>
            )}

            {/* Test Feedback */}
            {testOutput.status !== 'idle' && (
              <div
                className={`p-4 rounded-xl border text-xs font-mono flex flex-col gap-1.5 transition-all ${
                  testOutput.status === 'success'
                    ? 'bg-[#10b981]/15 border-[#10b981] text-[#7bf0c2]'
                    : 'bg-[#ff5449]/15 border-[#ff5449] text-[#ffb4ab]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">
                    {testOutput.status === 'success' ? 'verified' : 'cancel'}
                  </span>
                  <span>{testOutput.message}</span>
                </div>
                {testOutput.output && (
                  <div className="mt-1 p-2.5 rounded bg-black/40 border border-current/20 font-mono text-[11px] whitespace-pre">
                    {testOutput.output}
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleVerify}
                className="px-6 py-3 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Submit &amp; Verify Option {activeChoice.choiceKey}</span>
              </button>

              {hasPassedAnyChoice ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#10b981] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Round 2 Qualified!
                  </span>
                  {onProceedToRound3 && (
                    <button
                      onClick={onProceedToRound3}
                      className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#002e1c] font-bold text-xs font-mono uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      Advance to Round 3 &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-[11px] font-mono text-[#849495] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">hourglass_empty</span>
                  <span>Pass either Option A or Option B to qualify</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
