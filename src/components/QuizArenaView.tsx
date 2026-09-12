import React, { useState, useEffect, useRef } from 'react';
import { ClientQuestionItem, PlayerSession, ExamSubmissionRecord, QuestionCategory } from '../types';
import { examDB } from '../data/database';
import { CodingRoundView } from './CodingRoundView';
import { BugHunterRoundView } from './BugHunterRoundView';
import { ProgrammingRoundView } from './ProgrammingRoundView';
import confetti from 'canvas-confetti';

interface QuizArenaViewProps {
  playerSession: PlayerSession;
  setPlayerSession: React.Dispatch<React.SetStateAction<PlayerSession>>;
  onTriggerDisqualification: (reason: string) => void;
  onNavigateToLeaderboard: () => void;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({
  playerSession,
  setPlayerSession,
  onTriggerDisqualification,
  onNavigateToLeaderboard,
}) => {
  // Current active round: Round 1 (30 Randomized MCQs), Round 2 (Bug Hunter), Round 3 (Live Coding)
  const [activeRound, setActiveRound] = useState<'round-1' | 'round-2' | 'round-3'>('round-1');

  // Examinee Username input state with highlighted confirmation
  const [candidateUsernameInput, setCandidateUsernameInput] = useState(
    playerSession.username && playerSession.username !== 'GUEST_CANDIDATE'
      ? playerSession.username
      : 'datascience_candidate'
  );
  const [usernameInputError, setUsernameInputError] = useState('');

  // Full-screen state & violation warning
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenViolationOpen, setFullScreenViolationOpen] = useState(false);

  // Exam state for Round 1: 30 Randomized Questions
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState<ClientQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});

  // Timer: user's exact elapsed time in seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Submission & Result Modal
  const [submitting, setSubmitting] = useState(false);
  const [earlySubmitWarningOpen, setEarlySubmitWarningOpen] = useState(false);
  const [resultRecord, setResultRecord] = useState<ExamSubmissionRecord | null>(null);

  // Minimum exam duration requirement: 30 minutes (1800 seconds)
  const MINIMUM_DURATION_SECONDS = 1800;

  // Request true browser full-screen mode
  const requestFullScreenMode = () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if ((docEl as any).webkitRequestFullscreen) {
        (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).msRequestFullscreen) {
        (docEl as any).msRequestFullscreen();
      }
      setIsFullScreen(true);
      setFullScreenViolationOpen(false);
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  // Exit browser full-screen mode
  const exitFullScreenMode = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (e) {}
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Listen to Full Screen changes and Window visibility changes during active exam
  useEffect(() => {
    const handleFullScreenChange = () => {
      const active = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullScreen(active);
      if (examStarted && !active) {
        setFullScreenViolationOpen(true);
      }
    };

    const handleVisibilityChange = () => {
      if (examStarted && document.visibilityState === 'hidden') {
        setFullScreenViolationOpen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted]);

  // Check if candidate already has a submitted exam on mount or session change
  useEffect(() => {
    if (playerSession.username && !examStarted) {
      const existing = examDB.getExamRecords().find(
        (r) => r.username.toLowerCase() === playerSession.username.toLowerCase()
      );
      if (existing) {
        setResultRecord(existing);
      }
    }
  }, [playerSession.username, examStarted]);

  // Handle Start Exam (Round 1: 30 Random Questions from Database)
  const handleStartExam = () => {
    const trimmedUser = candidateUsernameInput.trim();
    if (!trimmedUser) {
      setUsernameInputError('Candidate Username is strictly mandatory. Please enter your official username.');
      return;
    }

    // Check if user already submitted the exam (Strict No-Rewrite Rule)
    const existingSubmission = examDB.getExamRecords().find(
      (r) => r.username.toLowerCase() === trimmedUser.toLowerCase()
    );
    if (existingSubmission) {
      setResultRecord(existingSubmission);
      setUsernameInputError(
        'An official exam record already exists for this candidate. Re-taking or rewriting the exam is strictly disabled.'
      );
      return;
    }

    setUsernameInputError('');

    // Register & record user login in database
    const userRecord = examDB.recordUserLogin(trimmedUser, 'candidate');

    // Pick 30 random questions from central database with answers strictly hidden
    const examQuestions = examDB.getExamQuestions(30);
    setQuestions(examQuestions);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setExamStarted(true);
    setResultRecord(null);

    // Lock the session for anti-cheat & update examinee handle
    setPlayerSession((prev) => ({
      ...prev,
      username: userRecord.username,
      isExamLocked: true,
      qualification: 'PENDING',
    }));

    // Live record user status in database
    examDB.updateUserStatus(userRecord.username, 'IN_EXAM');

    // Engage Browser Full Screen mode to avoid seeing others dashboard
    requestFullScreenMode();

    // Start counting live elapsed time according to user
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Select an option (Authorized action within exam)
  const handleSelectOption = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (!examStarted || playerSession.isBlocked) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optKey,
    }));
  };

  // Attempt to submit exam
  const handlePreSubmit = () => {
    // If under 10 minutes, warn the examinee about the 10-minute minimum standard
    if (elapsedSeconds < MINIMUM_DURATION_SECONDS) {
      setEarlySubmitWarningOpen(true);
    } else {
      executeFinalSubmission();
    }
  };

  // Perform secure final submission to database
  const executeFinalSubmission = () => {
    setEarlySubmitWarningOpen(false);
    setSubmitting(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Release full screen upon exam completion
    exitFullScreenMode();

    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedOption: selectedAnswers[q.id] || null,
    }));

    // Evaluate in database (where answers are securely held)
    const record = examDB.evaluateAndRecordExam(
      playerSession.username,
      answersPayload,
      elapsedSeconds
    );

    // Release exam lock
    setPlayerSession((prev) => ({
      ...prev,
      isExamLocked: false,
      tokenPurse: record.score,
      qualification: record.status,
    }));

    setResultRecord(record);
    setExamStarted(false);
    setSubmitting(false);

    if (record.status === 'QUALIFIED') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleRoundTabSwitch = (round: 'round-1' | 'round-2' | 'round-3') => {
    if (playerSession.isExamLocked) {
      onTriggerDisqualification(`Switched from active exam to ${round} during locked examination.`);
      return;
    }
    setActiveRound(round);
  };

  return (
    <div className="flex flex-col w-full pb-20 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Top Banner & Round Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3b494b]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-[#171f33] text-[#00f0ff] font-mono text-xs uppercase tracking-wider font-bold border border-[#00f0ff]/30">
              OFFICIAL EXAMINATION PORTAL
            </span>
            <span className="text-[#3b494b] font-mono">/</span>
            <span className="font-mono text-xs text-[#b9cacb] uppercase">
              {activeRound === 'round-1'
                ? 'Round 1: 60-Question Core Pool'
                : activeRound === 'round-2'
                ? 'Round 2: Programming (Choice: Write 1 from 2)'
                : 'Round 3: Live Coding Round'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#dbfcff]">
            Code Assessment Arena
          </h1>
          <p className="text-xs sm:text-sm text-[#b9cacb] max-w-2xl mt-1">
            Hidden Database Answers • 10-Minute Minimum Timer Tracking • Anti-Cheat Disqualification Lock
          </p>
        </div>

        {/* User Handle Capsule */}
        <div className="flex items-center gap-3 bg-[#131b2e] p-3 rounded-xl border border-[#3b494b]/40">
          <div className="w-10 h-10 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
          <div>
            <span className="text-[10px] text-[#849495] uppercase font-mono block">Logged In Handle</span>
            <span className="text-sm font-bold text-[#dbfcff] font-mono">{playerSession.username}</span>
          </div>
        </div>
      </div>

      {/* Rounds Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex bg-[#131b2e] p-1.5 rounded-xl border border-[#3b494b]/40">
          <button
            onClick={() => handleRoundTabSwitch('round-1')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeRound === 'round-1'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_12px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">list_alt</span>
            <span>Round 1: Core 60-Question Pool</span>
          </button>

          <button
            onClick={() => handleRoundTabSwitch('round-2')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeRound === 'round-2'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_12px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">casino</span>
            <span>Round 2: Programming (Write 1 from 2)</span>
          </button>

          <button
            onClick={() => handleRoundTabSwitch('round-3')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeRound === 'round-3'
                ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span>Round 3: Coding Round</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#849495]">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>Database Integrity Engine: ACTIVE</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROUND 3: LIVE CODING ROUND (NO SUBMIT OPTION, TEST & MATCH) */}
      {/* ========================================================= */}
      {activeRound === 'round-3' && (
        <CodingRoundView
          playerSession={playerSession}
          onQuestionPassed={(qId, tokens) => {
            setPlayerSession((prev) => ({
              ...prev,
              tokenPurse: prev.tokenPurse + tokens,
            }));
          }}
          onUnauthorizedAction={onTriggerDisqualification}
        />
      )}

      {/* ========================================================= */}
      {/* ROUND 2: RANDOM CHOICE PROGRAMMING ARENA (WRITE 1 FROM 2) */}
      {/* ========================================================= */}
      {activeRound === 'round-2' && (
        <ProgrammingRoundView
          playerSession={playerSession}
          onChallengePassed={(taskName, tokens) => {
            setPlayerSession((prev) => ({
              ...prev,
              tokenPurse: prev.tokenPurse + tokens,
            }));
          }}
          onProceedToRound3={() => setActiveRound('round-3')}
        />
      )}

      {/* ========================================================= */}
      {/* ROUND 1: 30-QUESTION RANDOMIZED MULTIPLE-CHOICE EXAM */}
      {/* ========================================================= */}
      {activeRound === 'round-1' && (
        <>
          {/* VIEW 1: PRE-EXAM BRIEFING & START GATE */}
          {!examStarted && !resultRecord && (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
              {/* MANDATORY EXAMINEE USERNAME REGISTRATION WITH HIGHLIGHT WORDS */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0e172a] border-2 border-[#00f0ff] shadow-[0_0_35px_rgba(0,240,255,0.25)] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3b494b]/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#00f0ff] text-2xl">badge</span>
                    <h3 className="text-lg font-black text-[#dbfcff] tracking-tight">
                      MANDATORY STEP: ENTER YOUR <span className="text-[#00f0ff] underline decoration-[#00f0ff]">OFFICIAL USERNAME</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#00f0ff]/40">
                      ★ MANDATORY FIELD
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#10b981]/40">
                      ● LIVE DB RECORD
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0266ff]/20 text-[#7df4ff] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#0266ff]/40">
                      ▲ LEADERBOARD BOUND
                    </span>
                  </div>
                </div>

                {/* Highlight Words Callout Box */}
                <div className="p-4 rounded-xl bg-[#131f38] border border-[#00f0ff]/25 text-xs text-[#dae2fd] leading-relaxed flex flex-col gap-2">
                  <p>
                    Please specify and confirm your <strong className="text-[#00f0ff] text-sm underline">OFFICIAL CANDIDATE USERNAME</strong>. 
                    Your <strong className="text-[#7df4ff]">30-QUESTION EXAM SCORE</strong>, <strong className="text-[#dbfcff]">30-MINUTE TIME DURATION</strong>, and <strong className="text-[#10b981]">HMAC CRYPTOGRAPHIC AUDIT</strong> will be <strong className="text-[#ffb4ab]">PERMANENTLY STORED IN THE CENTRAL DATABASE</strong> under this username.
                  </p>
                  <p className="text-[#849495] text-[11px] font-mono">
                    Audit Notice: This username will be publicly registered on the <strong className="text-[#00f0ff]">LIVE LEADERBOARD DASHBOARD</strong> and visible to the administrator.
                  </p>
                </div>

                {/* Username Input with Highlight Focus Glow */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00f0ff] text-[20px]">
                      person
                    </span>
                    <input
                      type="text"
                      value={candidateUsernameInput}
                      onChange={(e) => {
                        setCandidateUsernameInput(e.target.value);
                        setUsernameInputError('');
                      }}
                      placeholder="Enter official candidate username (e.g. keerthi_ds)"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#17233f] border-2 border-[#00f0ff]/50 text-[#dbfcff] font-mono text-sm font-bold focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/40 shadow-[inset_0_0_12px_rgba(0,240,255,0.15)] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = candidateUsernameInput.trim();
                      if (trimmed) {
                        examDB.recordUserLogin(trimmed, 'candidate');
                        setPlayerSession((prev) => ({ ...prev, username: trimmed }));
                        setUsernameInputError('');
                      } else {
                        setUsernameInputError('Please enter a valid candidate username.');
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-[#17233f] hover:bg-[#202f54] text-[#00f0ff] border border-[#00f0ff]/40 font-mono text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>CONFIRM USERNAME</span>
                  </button>
                </div>

                {usernameInputError && (
                  <div className="p-3 rounded-lg bg-[#ff5449]/15 border border-[#ff5449]/50 text-[#ffb4ab] text-xs font-mono flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#ff5449]">error</span>
                    <span>{usernameInputError}</span>
                  </div>
                )}
              </div>

              {/* Question Pool Scope: 30 Randomized Questions */}
              <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#00f0ff]/30 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#3b494b]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00f0ff]">shuffle</span>
                    <h3 className="text-base font-bold text-[#dbfcff]">Round 1: 30 Randomized Questions</h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#00f0ff]/10 text-[#7df4ff] border border-[#00f0ff]/30">
                    Random Draw: 30 Questions
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#090f1e] border border-[#2d3449]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 font-mono text-xs">
                    <span className="text-[#dbfcff] font-bold text-sm">
                      30 Questions Selected at Random from Database Pool
                    </span>
                    <span className="text-[#849495]">
                      Questions are randomly sampled across Python, C, C++, Java, and SQL. Answer keys are strictly hidden in client state and verified in the database on submission.
                    </span>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="text-2xl font-black text-[#00f0ff]">30</span>
                    <span className="block text-[10px] text-[#849495] uppercase">Questions</span>
                  </div>
                </div>
              </div>

              {/* Security Rules Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#131b2e] border-2 border-[#00f0ff]/40 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col gap-6">
                <div className="flex items-center gap-3 text-[#00f0ff]">
                  <span className="material-symbols-outlined text-3xl">security</span>
                  <div>
                    <h2 className="text-xl font-bold text-[#dbfcff]">Full-Screen Exam Lock &amp; Integrity Policy</h2>
                    <span className="text-xs text-[#7df4ff] font-mono">PLEASE READ CAREFULLY BEFORE INITIATING</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]/50 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#00f0ff]">
                      <span className="material-symbols-outlined text-base">timer</span>
                      <span className="font-bold">30-MINUTE MINIMUM TIME</span>
                    </div>
                    <p className="text-[#dae2fd]/80">
                      The exam is calibrated for a minimum of 30 minutes (1800 seconds). Your exact time spent will be tracked and saved in the global Leaderboard Dashboard.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171f33] border border-[#ff5449]/40 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#ff5449]">
                      <span className="material-symbols-outlined text-base">fullscreen</span>
                      <span className="font-bold">FULL-SCREEN ISOLATION</span>
                    </div>
                    <p className="text-[#ffb4ab]">
                      The exam runs in <strong>FULL SCREEN MODE</strong>. All other web dashboards are <strong>BLOCKED &amp; HIDDEN</strong>. Exiting full screen flags an anti-cheat violation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]/50 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#7df4ff]">
                      <span className="material-symbols-outlined text-base">database</span>
                      <span className="font-bold">HIDDEN ANSWER KEYS</span>
                    </div>
                    <p className="text-[#dae2fd]/80">
                      Answer keys are stored securely in the central database. The client UI receives zero hint of correct options.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171f33] border border-[#2d3449]/50 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#b3c5ff]">
                      <span className="material-symbols-outlined text-base">gavel</span>
                      <span className="font-bold">DISQUALIFICATION RULE</span>
                    </div>
                    <p className="text-[#dae2fd]/80">
                      Unauthorized actions or attempts to bypass exam lock trigger an immediate <strong>1-minute lockout</strong> and database disqualification record.
                    </p>
                  </div>
                </div>

                {/* Full-Screen Dashboard Isolation Notice */}
                <div className="p-4 rounded-xl bg-[#090f1e] border border-[#00f0ff]/30 flex items-center gap-3 text-xs text-[#7df4ff] font-mono">
                  <span className="material-symbols-outlined text-[#00f0ff] text-2xl shrink-0">visibility_off</span>
                  <p>
                    <strong className="text-[#00f0ff]">DASHBOARD SHIELD ACTIVE:</strong> Upon clicking below, the browser engages full-screen mode. Navigation to the Leaderboard, Admin, or other tabs is strictly blocked until your exam is submitted.
                  </p>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartExam}
                  className="w-full py-4 px-6 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-black text-base tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,240,255,0.45)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-2xl">fullscreen</span>
                  <span>ENGAGE FULL-SCREEN LOCK &amp; START 30-MINUTE EXAM (30 QUESTIONS)</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: ACTIVE LOCKED EXAM IN TRUE FULL-SCREEN OVERLAY */}
          {examStarted && currentQ && (
            <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#070d19] overflow-y-auto flex flex-col p-4 sm:p-6 select-none">
              <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 flex-1">
                {/* Full-Screen Exam Top Security Status Bar */}
                <div className="p-4 rounded-2xl bg-[#131b2e] border-2 border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Lock Indicator & Examinee Username */}
                  <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping"></span>
                      <span>FULL-SCREEN EXAM ISOLATION ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#ff5449]/15 border border-[#ff5449]/40 text-[#ffb4ab]">
                      <span className="material-symbols-outlined text-sm">visibility_off</span>
                      <span>OTHER DASHBOARDS BLOCKED</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#dbfcff]">
                      <span className="text-[#849495]">Examinee:</span>
                      <span className="px-2 py-0.5 rounded bg-[#171f33] font-bold text-[#00f0ff] border border-[#00f0ff]/30">
                        {playerSession.username}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Elapsed Clock & Submit Button */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-[#090f1e] px-3.5 py-1.5 rounded-xl border border-[#3b494b]/60">
                      <span className="material-symbols-outlined text-[#00f0ff] text-base animate-pulse">
                        timer
                      </span>
                      <span className="font-mono text-sm font-bold text-[#dbfcff]">
                        {formatTime(elapsedSeconds)}
                      </span>
                      <span className="text-[10px] font-mono text-[#849495]">
                        {elapsedSeconds < MINIMUM_DURATION_SECONDS
                          ? `(Min 30m: ${Math.max(0, 1800 - elapsedSeconds)}s left)`
                          : '(30m min fulfilled ✓)'}
                      </span>
                    </div>

                    <button
                      onClick={requestFullScreenMode}
                      title="Re-maximize Full Screen"
                      className="px-3 py-2 rounded-xl bg-[#171f33] hover:bg-[#202a42] text-[#7df4ff] border border-[#00f0ff]/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">fullscreen</span>
                      <span className="hidden sm:inline">Maximize</span>
                    </button>

                    <button
                      onClick={handlePreSubmit}
                      disabled={submitting}
                      className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                      {submitting ? 'Verifying...' : 'Submit Exam'}
                    </button>
                  </div>
                </div>

                {/* Question Navigation Matrix */}
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#131b2e] border border-[#3b494b]/30 max-h-36 overflow-y-auto">
                  {questions.map((q, idx) => {
                    const isCurrent = currentIndex === idx;
                    const isAnswered = selectedAnswers[q.id] !== undefined;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                          isCurrent
                            ? 'bg-[#00f0ff] text-[#00363a] border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                            : isAnswered
                            ? 'bg-[#0266ff]/20 text-[#7df4ff] border-[#0266ff]/50'
                            : 'bg-[#171f33] text-[#849495] border-[#3b494b]/30 hover:border-[#3b494b]'
                        }`}
                      >
                        <span>Q{q.id}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Question Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 shadow-xl flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#0266ff]/20 text-[#7df4ff] text-xs font-mono font-bold border border-[#0266ff]/40">
                        {currentQ.cat}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#00f0ff]/10 text-[#00f0ff]">
                        {currentQ.diff}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#849495]">
                      Question #{currentQ.id} ({currentIndex + 1} of {questions.length})
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#dbfcff] leading-relaxed">
                    {currentQ.prompt}
                  </h3>

                  {currentQ.snippet && (
                    <div className="rounded-xl bg-[#090f1e] p-4 border border-[#2d3449]/60 font-mono text-xs sm:text-sm text-[#7df4ff] overflow-x-auto shadow-inner leading-relaxed">
                      <pre>{currentQ.snippet}</pre>
                    </div>
                  )}

                  {/* Options List (A, B, C, D) - ANSWERS COMPLETELY HIDDEN */}
                  <div className="grid grid-cols-1 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                      const optText = currentQ.opts[optKey];
                      const isSelected = selectedAnswers[currentQ.id] === optKey;

                      return (
                        <button
                          key={optKey}
                          onClick={() => handleSelectOption(optKey)}
                          className={`flex items-start gap-4 p-4 rounded-xl text-left transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-[#0266ff]/20 border-[#00f0ff] text-[#dbfcff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                              : 'bg-[#171f33] border-[#3b494b]/30 text-[#dae2fd] hover:bg-[#1f2942] hover:border-[#3b494b]'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#00f0ff] text-[#00363a]'
                                : 'bg-[#222a3d] text-[#b9cacb]'
                            }`}
                          >
                            {optKey}
                          </span>
                          <span className="text-sm font-body self-center">{optText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons within Exam */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#3b494b]/30">
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        currentIndex === 0
                          ? 'text-[#849495] cursor-not-allowed bg-[#171f33]/40'
                          : 'bg-[#171f33] text-[#dbfcff] hover:bg-[#222a3d] cursor-pointer'
                      }`}
                    >
                      &larr; Previous Question
                    </button>

                    <span className="text-xs text-[#849495] font-mono">
                      Answered: {answeredCount} / {questions.length}
                    </span>

                    {currentIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-[#00f0ff] text-[#00363a] text-xs font-bold font-mono hover:bg-[#7df4ff] cursor-pointer transition-all"
                      >
                        Next Question &rarr;
                      </button>
                    ) : (
                      <button
                        onClick={handlePreSubmit}
                        className="px-5 py-2 rounded-xl bg-[#0266ff] text-[#f9f7ff] text-xs font-bold font-mono hover:bg-[#3b82f6] cursor-pointer shadow-md transition-all"
                      >
                        Review &amp; Submit &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FULL-SCREEN VIOLATION MODAL (If user exited full screen or switched tab) */}
          {fullScreenViolationOpen && (
            <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-2xl bg-[#0d1527] border-2 border-[#ff5449] p-6 sm:p-8 shadow-[0_0_60px_rgba(255,84,73,0.4)] flex flex-col text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#ff5449]/15 border-2 border-[#ff5449] flex items-center justify-center mx-auto text-[#ff5449]">
                  <span className="material-symbols-outlined text-3xl animate-bounce">fullscreen_exit</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-bold text-[#ff5449] uppercase tracking-wider">
                    ★ ANTI-CHEAT SECURITY BREACH ★
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#ffb4ab]">
                    FULL-SCREEN VIOLATION DETECTED
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#171f33] border border-[#ff5449]/40 text-xs text-[#dae2fd] text-left font-mono leading-relaxed flex flex-col gap-2">
                  <p>
                    You have <strong className="text-[#ff5449]">EXITED FULL-SCREEN MODE</strong> or <strong className="text-[#ffb4ab]">SWITCHED WINDOWS/TABS</strong>.
                  </p>
                  <p>
                    Exam integrity regulations mandate <strong className="text-[#00f0ff]">FULL-SCREEN ISOLATION</strong> throughout this 30-minute session to prevent viewing other dashboards or external tabs.
                  </p>
                  <p className="text-[#849495] text-[11px]">
                    Central database audit log has registered this event. Re-engage full-screen mode immediately to continue your exam.
                  </p>
                </div>

                <button
                  onClick={requestFullScreenMode}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">fullscreen</span>
                  <span>RE-ENGAGE FULL SCREEN &amp; RESUME EXAM</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: RESULT SUMMARY MODAL / SCREEN */}
          {resultRecord && (
            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#131b2e] border-2 border-[#00f0ff]/50 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-w-2xl mx-auto flex flex-col gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff] flex items-center justify-center mx-auto text-[#00f0ff]">
                <span className="material-symbols-outlined text-3xl">
                  {resultRecord.status === 'QUALIFIED' ? 'workspace_premium' : 'sentiment_dissatisfied'}
                </span>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-block mb-2 ${
                    resultRecord.status === 'QUALIFIED'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                      : 'bg-[#ff5449]/20 text-[#ffb4ab] border border-[#ff5449]/50'
                  }`}
                >
                  {resultRecord.status}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#dbfcff]">
                  Exam Evaluation Complete
                </h2>
                <p className="text-xs sm:text-sm text-[#b9cacb] mt-1 font-mono">
                  Results and verified HMAC token recorded to central database.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#171f33] border border-[#3b494b]/40 font-mono text-center">
                <div>
                  <span className="text-[10px] text-[#849495] block uppercase">Score</span>
                  <span className="text-xl font-bold text-[#7df4ff]">{resultRecord.score} TOK</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#849495] block uppercase">Accuracy</span>
                  <span className="text-xl font-bold text-[#dbfcff]">
                    {resultRecord.correctAnswersCount}/{resultRecord.totalQuestions}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#849495] block uppercase">Time Recorded</span>
                  <span className="text-xl font-bold text-[#00f0ff]">
                    {resultRecord.timeTakenFormatted}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#849495] font-mono">
                HMAC Ledger Digest: <span className="text-[#7df4ff]">{resultRecord.hmacSignature}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090f1e] border border-[#ff5449]/40 text-xs font-mono text-[#ffb4ab] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ff5449] text-xl shrink-0">lock</span>
                <div className="flex flex-col text-left">
                  <strong className="text-[#dbfcff]">EXAMINATION RECORD PERMANENTLY LOCKED IN DATABASE</strong>
                  <span className="text-[11px] text-[#849495]">
                    Per strict integrity policy, re-taking or rewriting this examination is permanently disabled. Your final score, accuracy, and duration have been cryptographically recorded in the database.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onNavigateToLeaderboard}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-sm tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">leaderboard</span>
                  <span>View Leaderboard Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveRound('round-2')}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#0266ff] hover:bg-[#3b82f6] text-[#f9f7ff] font-bold text-sm font-mono transition-all cursor-pointer border border-[#00f0ff]/40 flex items-center justify-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">code_blocks</span>
                  <span>Proceed to Round 2 (30 Sets) &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* EARLY SUBMIT CONFIRMATION MODAL (< 10 MINS) */}
          {earlySubmitWarningOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-[#0d1527] border border-[#f59e0b]/50 p-6 shadow-[0_0_40px_rgba(245,158,11,0.2)] flex flex-col text-center">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b] flex items-center justify-center mx-auto mb-3 text-[#f59e0b]">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>

                <h3 className="text-lg font-bold text-[#dbfcff]">
                  Minimum Duration Notice
                </h3>
                <p className="text-xs text-[#b9cacb] mt-2 mb-4 leading-relaxed">
                  The recommended minimum exam duration is <strong>30 minutes (1800s)</strong>.
                  <br />
                  You have currently spent <strong className="text-[#f59e0b]">{formatTime(elapsedSeconds)}</strong>.
                  <br />
                  Your exact user time will be saved on the Leaderboard. Are you sure you want to finish now?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEarlySubmitWarningOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#dbfcff] font-bold text-xs font-mono border border-[#3b494b]/40 cursor-pointer"
                  >
                    Continue Exam
                  </button>
                  <button
                    onClick={executeFinalSubmission}
                    className="flex-1 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#000] font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
