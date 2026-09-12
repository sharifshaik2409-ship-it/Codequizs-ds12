import React, { useState } from 'react';
import { ROUND_3_CODING_QUESTIONS, CodingQuestion } from '../data/codingRoundQuestions';
import { PlayerSession } from '../types';
import { examDB } from '../data/database';
import confetti from 'canvas-confetti';
import { CertificateModal } from './CertificateModal';

interface CodingRoundViewProps {
  playerSession: PlayerSession;
  onQuestionPassed?: (questionId: number, tokensEarned: number) => void;
  onUnauthorizedAction?: (reason: string) => void;
}

export interface TestResult {
  testCaseId: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  matched: boolean;
  error?: string;
}

export interface Round3QuestionAudit {
  questionId: number;
  title: string;
  category: string;
  tokens: number;
  isRight: boolean;
  reason: string;
  passedCount: number;
  totalCount: number;
  testOutputs: TestResult[];
}

export const CodingRoundView: React.FC<CodingRoundViewProps> = ({
  playerSession,
  onQuestionPassed,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userCode, setUserCode] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    ROUND_3_CODING_QUESTIONS.forEach((q) => {
      map[q.id] = q.starterCode;
    });
    return map;
  });

  const [testResults, setTestResults] = useState<Record<number, TestResult[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passedQuestions, setPassedQuestions] = useState<Record<number, boolean>>({});
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    status: 'idle' | 'success' | 'failed';
    message: string;
    details?: string;
  }>({ status: 'idle', message: '' });

  // Exam Audit & Certificate states
  const [showExamCompletionModal, setShowExamCompletionModal] = useState(false);
  const [examAuditResults, setExamAuditResults] = useState<Round3QuestionAudit[] | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState(false);

  const currentQ = ROUND_3_CODING_QUESTIONS[activeQuestionIndex];
  const currentCode = userCode[currentQ.id] ?? currentQ.starterCode;
  const currentResults = testResults[currentQ.id];
  const isCurrentPassed = passedQuestions[currentQ.id] || false;

  // Helper: Evaluates a single question against the database data and test vectors
  const runQuestionEvaluation = (
    question: CodingQuestion,
    code: string
  ): {
    isRight: boolean;
    reason: string;
    testOutputs: TestResult[];
    passedCount: number;
    totalCount: number;
  } => {
    const isDefaultStarter =
      !code ||
      code.trim() === '' ||
      code.trim() === question.starterCode.trim() ||
      code.replace(/\/\/.*/g, '').replace(/\s+/g, '').endsWith('{}');

    if (isDefaultStarter) {
      return {
        isRight: false,
        reason: 'Default passing is prohibited. Write your algorithmic solution.',
        testOutputs: question.testCases.map((tc) => ({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'NO_SOLUTION_WRITTEN',
          matched: false,
        })),
        passedCount: 0,
        totalCount: question.testCases.length,
      };
    }

    let fnName = 'solution';
    if (question.id === 1) fnName = 'twoSum';
    else if (question.id === 2) fnName = 'isPalindrome';
    else if (question.id === 3) fnName = 'fizzBuzz';
    else if (question.id === 4) fnName = 'maxSubArray';

    try {
      // Wrap code inside an isolated function scope
      // eslint-disable-next-line no-new-func
      const runner = new Function(`
        ${code}
        if (typeof ${fnName} !== 'function') {
          throw new Error('Function "${fnName}" is not defined or exportable.');
        }
        return ${fnName};
      `);

      const userFn = runner();
      const testOutputs: TestResult[] = [];

      question.testCases.forEach((tc) => {
        try {
          let actual: any;
          if (question.id === 1) {
            if (tc.id === 1) actual = userFn([2, 7, 11, 15], 9);
            else if (tc.id === 2) actual = userFn([3, 2, 4], 6);
            else actual = userFn([3, 3], 6);
          } else if (question.id === 2) {
            if (tc.id === 1) actual = userFn('racecar');
            else if (tc.id === 2) actual = userFn('A man, a plan, a canal: Panama');
            else actual = userFn('race a car');
          } else if (question.id === 3) {
            if (tc.id === 1) actual = userFn(15);
            else if (tc.id === 2) actual = userFn(9);
            else if (tc.id === 3) actual = userFn(10);
            else actual = userFn(7);
          } else if (question.id === 4) {
            if (tc.id === 1) actual = userFn([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
            else if (tc.id === 2) actual = userFn([1]);
            else actual = userFn([5, 4, -1, 7, 8]);
          }

          const actualStr = JSON.stringify(actual);
          const expectedStr = tc.expectedOutput.replace(/'/g, '"').trim();
          const matched =
            actualStr === expectedStr ||
            String(actual) === tc.expectedOutput.trim() ||
            (typeof actual === 'string' && actual === tc.expectedOutput.replace(/"/g, ''));

          testOutputs.push({
            testCaseId: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: actualStr !== undefined ? actualStr : String(actual),
            matched,
          });
        } catch (err: any) {
          testOutputs.push({
            testCaseId: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: 'RUNTIME_ERROR',
            matched: false,
            error: err?.message || 'Execution error',
          });
        }
      });

      // Send to central database evaluator to check both code and output matching
      const dbEvaluation = examDB.evaluateCodingSubmission(
        question.id,
        code,
        testOutputs.map((r) => ({
          testCaseId: r.testCaseId,
          actualOutput: r.actualOutput,
          matched: r.matched,
        }))
      );

      const passedCount = testOutputs.filter((t) => t.matched).length;

      return {
        isRight: dbEvaluation.passed,
        reason: dbEvaluation.reason,
        testOutputs,
        passedCount,
        totalCount: question.testCases.length,
      };
    } catch (err: any) {
      return {
        isRight: false,
        reason: `Syntax or compilation error: ${err?.message || 'Invalid syntax'}`,
        testOutputs: question.testCases.map((tc) => ({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'SYNTAX_ERROR',
          matched: false,
          error: err?.message,
        })),
        passedCount: 0,
        totalCount: question.testCases.length,
      };
    }
  };

  // Execute and Submit Current Code against Database Data
  const handleSubmitAndVerify = () => {
    setIsSubmitting(true);
    setSubmissionFeedback({
      status: 'idle',
      message: 'Running code in JS sandbox and evaluating against database test vectors...',
    });

    setTimeout(() => {
      const evaluation = runQuestionEvaluation(currentQ, currentCode);

      setTestResults((prev) => ({ ...prev, [currentQ.id]: evaluation.testOutputs }));

      if (evaluation.isRight) {
        setPassedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
        setSubmissionFeedback({
          status: 'success',
          message: 'SUBMISSION PASSED: Output and code verified against database specifications!',
          details: `All ${currentQ.testCases.length} test cases passed. Earned +${currentQ.tokens} Tokens. You can now pass to the next question.`,
        });

        // Record task completion in central database
        examDB.recordTaskCompletion({
          username: playerSession.username,
          taskName: `Round 3: ${currentQ.title}`,
          round: 3,
          scoreEarned: currentQ.tokens,
          status: 'PASSED',
          timeTakenSeconds: 240,
          details: `Verified: Output and code logic matched database specifications. All ${currentQ.testCases.length} tests passed.`,
          verificationMethod: 'DATABASE_CODE_AND_OUTPUT_MATCH',
        });

        if (onQuestionPassed) {
          onQuestionPassed(currentQ.id, currentQ.tokens);
        }

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      } else {
        setSubmissionFeedback({
          status: 'failed',
          message: `SUBMISSION REJECTED: ${evaluation.reason}`,
          details: 'Exam requirement: Output and code must match database data. Review test comparisons below.',
        });
      }

      setIsSubmitting(false);
    }, 350);
  };

  // PASS TO NEXT QUESTION
  const handlePassToNext = () => {
    if (!isCurrentPassed) return;
    if (activeQuestionIndex < ROUND_3_CODING_QUESTIONS.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setSubmissionFeedback({ status: 'idle', message: '' });
    } else {
      // Completed last question, trigger full exam evaluation
      handleCompleteExamAndAudit();
    }
  };

  // FULL EXAM EVALUATION & AUDIT: Checks whether all Round 3 answers are right or wrong according to given database data
  const handleCompleteExamAndAudit = () => {
    const audits: Round3QuestionAudit[] = ROUND_3_CODING_QUESTIONS.map((q) => {
      const code = userCode[q.id] || q.starterCode;
      const evaluation = runQuestionEvaluation(q, code);
      return {
        questionId: q.id,
        title: q.title,
        category: q.category,
        tokens: q.tokens,
        isRight: evaluation.isRight,
        reason: evaluation.reason,
        passedCount: evaluation.passedCount,
        totalCount: evaluation.totalCount,
        testOutputs: evaluation.testOutputs,
      };
    });

    setExamAuditResults(audits);
    setShowExamCompletionModal(true);

    const allRight = audits.every((a) => a.isRight);

    if (allRight) {
      setIsCertificateUnlocked(true);

      // Record final certification approval in database
      examDB.recordTaskCompletion({
        username: playerSession.username,
        taskName: 'Round 3: Final Certification Approved',
        round: 3,
        scoreEarned: 60,
        status: 'PASSED',
        timeTakenSeconds: 300,
        details: 'Cleared all 4 Round 3 coding challenges with 100% database output matching. Certificate officially unlocked.',
        verificationMethod: 'DATABASE_CODE_AND_OUTPUT_MATCH',
      });

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handleResetCode = () => {
    setUserCode((prev) => ({ ...prev, [currentQ.id]: currentQ.starterCode }));
    setTestResults((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setSubmissionFeedback({
      status: 'idle',
      message: 'Code reset to starter template.',
    });
  };

  // Helper for examinee to insert reference solution
  const handleLoadReferenceSolution = () => {
    setUserCode((prev) => ({ ...prev, [currentQ.id]: currentQ.databaseSolution }));
    setSubmissionFeedback({
      status: 'idle',
      message: 'Loaded database reference solution into editor. Click Submit to verify and pass.',
    });
  };

  const allPassedSoFar =
    ROUND_3_CODING_QUESTIONS.length > 0 &&
    ROUND_3_CODING_QUESTIONS.every((q) => passedQuestions[q.id]);

  const totalPossibleScore = ROUND_3_CODING_QUESTIONS.reduce((acc, q) => acc + q.tokens, 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Banner: Round 3 Rules & Status */}
      <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#00f0ff]/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
            <span className="material-symbols-outlined text-2xl">terminal</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#0266ff] text-[#f9f7ff] font-mono font-bold uppercase">
                ROUND 3
              </span>
              <h2 className="text-lg font-bold text-[#dbfcff]">
                Algorithmic Coding Arena
              </h2>
            </div>
            <p className="text-xs text-[#b9cacb] mt-0.5">
              <strong>Database Rule:</strong> Answers are evaluated Right or Wrong against database test data.
              Matching all data unlocks <strong>Your Certificate</strong>; otherwise message is returned.
            </p>
          </div>
        </div>

        {/* Global Controls & Certificate Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Unlocked Certificate Pill Button */}
          {isCertificateUnlocked ? (
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#10b981] to-[#00f0ff] text-[#002e1c] font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer animate-pulse transition-all hover:scale-105"
            >
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span>Your Certificate (Unlocked)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17233f] border border-[#3b494b]/40 text-[#849495] text-[11px] font-mono">
              <span className="material-symbols-outlined text-[15px] text-[#849495]">lock</span>
              <span>Certificate: Locked</span>
            </div>
          )}

          {/* Final Submit & Audit Button */}
          <button
            onClick={handleCompleteExamAndAudit}
            className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            <span>Check Answers &amp; Complete Exam</span>
          </button>
        </div>
      </div>

      {/* Question Switcher Tabs */}
      <div className="flex items-center justify-between gap-4 bg-[#131b2e] p-3 rounded-2xl border border-[#3b494b]/40">
        <div className="flex items-center gap-2 overflow-x-auto">
          {ROUND_3_CODING_QUESTIONS.map((q, idx) => {
            const isPassed = passedQuestions[q.id];
            const isActive = activeQuestionIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestionIndex(idx);
                  setSubmissionFeedback({ status: 'idle', message: '' });
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : isPassed
                    ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                    : 'bg-[#171f33] text-[#849495] hover:text-[#dbfcff]'
                }`}
              >
                <span>Challenge {idx + 1}</span>
                {isPassed ? (
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                ) : (
                  <span className="text-[10px] text-[#849495]">({q.tokens}t)</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-[#849495] hidden sm:flex items-center gap-2">
          <span>Cleared:</span>
          <strong className="text-[#00f0ff]">
            {Object.values(passedQuestions).filter(Boolean).length} / {ROUND_3_CODING_QUESTIONS.length}
          </strong>
        </div>
      </div>

      {/* Main Coding Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Problem Specification & Database Test Data */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#0266ff]/20 text-[#7df4ff] text-xs font-mono font-bold border border-[#0266ff]/40">
                {currentQ.category}
              </span>
              <span className="text-xs font-mono text-[#849495]">
                {currentQ.tokens} Tokens Available
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#dbfcff]">{currentQ.title}</h3>

            <div className="text-xs text-[#b9cacb] leading-relaxed whitespace-pre-line font-mono">
              {currentQ.description}
            </div>

            {/* Test Case Data Table */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#3b494b]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00f0ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">data_array</span>
                  Database Test Case Data
                </span>
                <span className="text-[10px] font-mono text-[#849495]">
                  {currentQ.testCases.length} Vectors
                </span>
              </div>

              <div className="space-y-2">
                {currentQ.testCases.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-3 rounded-xl bg-[#090f1e] border border-[#2d3449]/60 font-mono text-xs"
                  >
                    <div className="flex justify-between text-[#849495] text-[11px] mb-1">
                      <span>Test Case #{tc.id}</span>
                      <span className="text-[#7df4ff]">{tc.explanation}</span>
                    </div>
                    <div className="text-[#dbfcff] truncate">
                      <strong className="text-[#849495]">Input:</strong> {tc.input}
                    </div>
                    <div className="text-[#10b981] truncate">
                      <strong className="text-[#849495]">Expected Output:</strong>{' '}
                      {tc.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor & Live Test Runner */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#3b494b]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-[#dbfcff]">
                  JavaScript Function Editor
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoadReferenceSolution}
                  className="text-xs font-mono text-[#7df4ff] hover:underline cursor-pointer"
                  title="Load database reference code"
                >
                  Load Solution Snippet
                </button>
                <span className="text-[#3b494b]">|</span>
                <button
                  onClick={handleResetCode}
                  className="text-xs font-mono text-[#849495] hover:text-[#dbfcff] cursor-pointer"
                >
                  Reset Template
                </button>
              </div>
            </div>

            {/* Monospace Code Editor Area */}
            <div className="relative rounded-xl overflow-hidden border border-[#3b494b]/60 bg-[#090f1e] shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-[#171f33] border-b border-[#2d3449] text-[11px] font-mono text-[#849495]">
                <span>Solution Workspace</span>
                <span>Language: ECMAScript (JS)</span>
              </div>
              <textarea
                value={currentCode}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserCode((prev) => ({ ...prev, [currentQ.id]: val }));
                }}
                rows={12}
                className="w-full p-4 bg-[#090f1e] text-[#dbfcff] font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-[#00f0ff] selection:text-[#002022]"
                placeholder="// Implement your algorithm here..."
                spellCheck={false}
              />
            </div>

            {/* Submission Status & Feedback Display */}
            {submissionFeedback.status !== 'idle' && (
              <div
                className={`p-4 rounded-xl border text-xs font-mono flex flex-col gap-1 transition-all ${
                  submissionFeedback.status === 'success'
                    ? 'bg-[#10b981]/15 border-[#10b981] text-[#7bf0c2]'
                    : 'bg-[#ff5449]/15 border-[#ff5449] text-[#ffb4ab]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-[18px]">
                    {submissionFeedback.status === 'success' ? 'verified' : 'cancel'}
                  </span>
                  <span>{submissionFeedback.message}</span>
                </div>
                {submissionFeedback.details && (
                  <p className="text-[11px] opacity-90 pl-6.5">{submissionFeedback.details}</p>
                )}
              </div>
            )}

            {/* Action Bar: Submit & Verify Button + Pass to Next Control */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleSubmitAndVerify}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>
                  {isSubmitting ? 'Evaluating in Database...' : 'Submit & Test Solution'}
                </span>
              </button>

              {/* Pass to Next Question / Complete */}
              {isCurrentPassed ? (
                <button
                  onClick={handlePassToNext}
                  className="px-5 py-3 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#002e1c] font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer flex items-center gap-2 animate-bounce"
                >
                  <span>
                    {activeQuestionIndex < ROUND_3_CODING_QUESTIONS.length - 1
                      ? 'Pass to Next Question →'
                      : 'Complete Exam & Check Certificate →'}
                  </span>
                </button>
              ) : (
                <div className="text-[11px] font-mono text-[#849495] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">lock</span>
                  <span>Pass to Next: Locked until output matches database</span>
                </div>
              )}
            </div>

            {/* Live Test Case Results Comparison Table */}
            {currentResults && (
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-[#dbfcff]">
                  Output vs Database Expected Data Comparison
                </span>
                <div className="overflow-x-auto rounded-xl border border-[#3b494b]/40 bg-[#090f1e]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#171f33] text-[#849495] border-b border-[#2d3449]">
                      <tr>
                        <th className="p-2.5">Case</th>
                        <th className="p-2.5">Input</th>
                        <th className="p-2.5">Expected Data</th>
                        <th className="p-2.5">Your Code Output</th>
                        <th className="p-2.5 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d3449]/40">
                      {currentResults.map((r) => (
                        <tr key={r.testCaseId} className="hover:bg-[#131b2e]/50">
                          <td className="p-2.5 font-bold text-[#7df4ff]">#{r.testCaseId}</td>
                          <td className="p-2.5 text-[#b9cacb] max-w-xs truncate">{r.input}</td>
                          <td className="p-2.5 text-[#10b981]">{r.expectedOutput}</td>
                          <td
                            className={`p-2.5 font-bold ${
                              r.matched ? 'text-[#10b981]' : 'text-[#ff5449]'
                            }`}
                          >
                            {r.actualOutput}
                          </td>
                          <td className="p-2.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.matched
                                  ? 'bg-[#10b981]/20 text-[#10b981]'
                                  : 'bg-[#ff5449]/20 text-[#ffb4ab]'
                              }`}
                            >
                              {r.matched ? 'MATCHED ✓' : 'MISMATCH ✕'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FINAL EXAM COMPLETION & AUDIT MODAL */}
      {showExamCompletionModal && examAuditResults && (
        <div
          id="exam-completion-audit-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-[#0d1527] border-2 border-[#3b494b]/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col gap-5 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#3b494b]/40 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-2xl text-[#00f0ff]">
                  assignment_turned_in
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#dbfcff]">
                    Round 3 Final Exam Evaluation
                  </h3>
                  <span className="text-[11px] font-mono text-[#849495]">
                    Database Verification of Output &amp; Code Accuracy
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowExamCompletionModal(false)}
                className="w-8 h-8 rounded-lg bg-[#17233f] text-[#849495] hover:text-[#dbfcff] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* OUTCOME 1: ALL ANSWERS ARE RIGHT ACCORDING TO DATABASE DATA -> ALLOW CERTIFICATE */}
            {examAuditResults.every((a) => a.isRight) ? (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981] shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] text-xs font-mono font-bold uppercase tracking-wider border border-[#10b981]/40">
                    EXAM PASSED &bull; 100% DATABASE MATCH
                  </span>
                  <h2 className="text-2xl font-black text-[#dbfcff] mt-2">
                    Congratulations! All Answers Matched the Given Data
                  </h2>
                  <p className="text-xs text-[#b9cacb] mt-1 max-w-lg mx-auto leading-relaxed">
                    Every coding challenge in Round 3 was evaluated against the official database
                    specifications and returned identical output vectors. You have qualified for
                    your official certificate!
                  </p>
                </div>

                {/* Primary Button to Open Certificate */}
                <button
                  onClick={() => {
                    setShowExamCompletionModal(false);
                    setIsCertificateModalOpen(true);
                  }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#0266ff] to-[#10b981] hover:opacity-95 text-[#002022] font-black text-sm uppercase tracking-wider cursor-pointer shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2.5 transition-all"
                >
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                  <span>View &amp; Print Your Certificate</span>
                </button>
              </div>
            ) : (
              /* OUTCOME 2: ANSWERS ARE WRONG ACCORDING TO GIVEN DATA -> BETTER LUCK NEXT TIME MESSAGE */
              <div className="flex flex-col gap-4">
                {/* EXACT SPECIFIED MESSAGE: "better luck next time thanks from datascience" */}
                <div className="p-6 rounded-2xl bg-[#ff5449]/15 border-2 border-[#ff5449] text-center shadow-[0_0_35px_rgba(255,84,73,0.3)] flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#ff5449]/25 border border-[#ff5449] flex items-center justify-center text-[#ff5449] mb-3">
                    <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                  </div>

                  {/* Verbatim message required by user */}
                  <h2 className="text-xl sm:text-2xl font-black text-[#ff897d] tracking-tight uppercase">
                    better luck next time thanks from datascience
                  </h2>

                  <p className="text-xs text-[#dae2fd] mt-2 max-w-lg leading-relaxed">
                    One or more answers were <strong>wrong</strong> according to the given database data.
                    Under examination rules, your certificate is strictly locked until all test vector outputs match the database benchmarks.
                  </p>
                </div>

                {/* Locked Certificate Notice */}
                <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#3b494b]/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#849495]">
                    <span className="material-symbols-outlined text-[18px] text-[#ff5449]">lock</span>
                    <span>Your Certificate: Access Locked (Answers Did Not Match)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#ff5449]/20 text-[#ff897d] text-[10px] font-bold">
                    DENIED
                  </span>
                </div>
              </div>
            )}

            {/* Questions Audit Table: RIGHT or WRONG according to given data */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#dbfcff] uppercase">
                Challenge Data Verification Breakdown
              </span>

              <div className="divide-y divide-[#2d3449]/50 border border-[#3b494b]/40 rounded-xl overflow-hidden bg-[#090f1e]">
                {examAuditResults.map((audit, idx) => (
                  <div
                    key={audit.questionId}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:bg-[#131d33]/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#849495] font-bold">#{idx + 1}</span>
                      <div>
                        <div className="font-bold text-[#dbfcff]">{audit.title}</div>
                        <div className="text-[11px] text-[#849495]">{audit.reason}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] text-[#849495]">
                        {audit.passedCount} / {audit.totalCount} Vectors
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          audit.isRight
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                            : 'bg-[#ff5449]/20 text-[#ff897d] border border-[#ff5449]/40'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {audit.isRight ? 'check_circle' : 'cancel'}
                        </span>
                        <span>{audit.isRight ? 'RIGHT (MATCHED ✓)' : 'WRONG (MISMATCH ✕)'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#3b494b]/40">
              <button
                onClick={() => {
                  setShowExamCompletionModal(false);
                  // Find the first failing question to help the user fix it
                  const firstWrongIndex = examAuditResults.findIndex((a) => !a.isRight);
                  if (firstWrongIndex !== -1) {
                    setActiveQuestionIndex(firstWrongIndex);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#17233f] hover:bg-[#223358] text-[#dbfcff] text-xs font-mono font-bold cursor-pointer transition-all border border-[#3b494b]/40"
              >
                Return to Editor &amp; Correct Code
              </button>

              {examAuditResults.every((a) => a.isRight) && (
                <button
                  onClick={() => {
                    setShowExamCompletionModal(false);
                    setIsCertificateModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] text-xs font-mono font-bold cursor-pointer transition-all"
                >
                  Open Your Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* THE OFFICIAL CERTIFICATE MODAL */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        candidateName={playerSession.username || 'Candidate'}
        totalScore={playerSession.tokenPurse + totalPossibleScore}
        completedAt={new Date().toLocaleString()}
        certificateId={`CERT-DS-${Math.floor(100000 + Math.random() * 900000)}`}
        hmacSignature={`SHA256-DS-${Math.random().toString(36).substring(2, 12).toUpperCase()}`}
        matchedQuestionsCount={ROUND_3_CODING_QUESTIONS.length}
        totalQuestionsCount={ROUND_3_CODING_QUESTIONS.length}
      />
    </div>
  );
};
