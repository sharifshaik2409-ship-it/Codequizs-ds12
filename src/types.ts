export type ViewMode =
  | 'quiz-arena'
  | 'live-leaderboard'
  | 'admin-portal'
  | 'exam-rules';

export type QuestionCategory = 'Python' | 'C' | 'C++' | 'Java' | 'SQL';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

// Stored securely in database WITH correct answer
export interface SecureQuestionItem {
  id: number;
  cat: QuestionCategory;
  diff: DifficultyLevel;
  prompt: string;
  snippet?: string;
  correct: 'A' | 'B' | 'C' | 'D'; // Kept in database ONLY
  opts: QuestionOption;
  val: number;
}

// Client-facing Question: correct answer is STRIPPED/HIDDEN completely
export interface ClientQuestionItem {
  id: number;
  cat: QuestionCategory;
  diff: DifficultyLevel;
  prompt: string;
  snippet?: string;
  opts: QuestionOption;
  val: number;
}

// Legacy alias for backward compatibility in existing code
export type QuestionItem = SecureQuestionItem;

// Database User Login Record (Tracks all web loginers and their activity times)
export interface UserLoginRecord {
  id: string;
  username: string;
  role: 'admin' | 'candidate';
  loginTimestamp: string;
  ipAddress: string;
  browser: string;
  status: 'ONLINE' | 'IN_EXAM' | 'COMPLETED' | 'DISQUALIFIED' | 'OFFLINE';
  lastSeen: string;
  tasksCompleted?: number;
  totalTimeSpentSeconds?: number;
  totalTimeSpentFormatted?: string;
  latestTask?: string;
  registeredVia?: string;
}

// Database Task Completion Record (Tracks individual completed tasks and exact time taken)
export interface TaskCompletionRecord {
  id: string;
  username: string;
  taskName: string; // e.g. "Round 1: 30 MCQ Randomized Assessment", "Round 2: Bug Hunter", "Round 3: Algorithmic Code Challenge"
  round: number; // 1, 2, or 3
  scoreEarned: number;
  status: 'PASSED' | 'QUALIFIED' | 'FAILED' | 'DISQUALIFIED';
  startedAt: string;
  completedAt: string;
  timeTakenSeconds: number; // Exact duration
  timeTakenFormatted: string; // e.g. "30m 14s", "04m 20s"
  details: string;
  verificationMethod: 'DATABASE_KEY_CHECK' | 'DATABASE_CODE_AND_OUTPUT_MATCH' | 'SECURITY_INTEGRITY_AUDIT';
  hmacSignature: string;
}

// Database Exam Submission / Leaderboard Record
export interface ExamSubmissionRecord {
  id: string;
  username: string;
  loginTime: string;
  score: number; // e.g. 40 tokens or 5/5
  totalQuestions: number;
  correctAnswersCount: number;
  timeTakenSeconds: number; // tracked live per user
  timeTakenFormatted: string; // e.g. "10m 14s"
  status: 'QUALIFIED' | 'FAILED' | 'DISQUALIFIED' | 'IN_EXAM';
  disqualificationReason?: string;
  disqualifiedAt?: string;
  submittedAt: string;
  hmacSignature: string;
  answers: {
    qId: number;
    cat: string;
    selected: 'A' | 'B' | 'C' | 'D' | null;
  }[];
}

// Legacy alias
export type ContenderAudit = ExamSubmissionRecord;

export interface SecurityViolationLog {
  id: string;
  username: string;
  timestamp: string;
  type: 'UNAUTHORIZED_BUTTON_CLICK' | 'TAB_SWITCH' | 'WINDOW_BLUR' | 'DEVTOOLS';
  details: string;
  action?: string;
  penaltySeconds: number;
  lockoutDurationSeconds?: number;
  elapsedTime?: number;
  verdict?: 'DISQUALIFIED';
}

export interface SecurityLogItem {
  id: string;
  tag: string;
  time: string;
  message: string;
  severity?: 'normal' | 'warn' | 'error' | 'success';
}

export interface PlayerSession {
  username: string;
  role: 'admin' | 'candidate';
  authenticated: boolean;
  loginTime: string;
  gridSlot: number;
  tokenPurse: number;
  trackPosition: string;
  qualification: 'PENDING' | 'QUALIFIED' | 'FAILED' | 'DISQUALIFIED';
  latency: string;
  isExamLocked: boolean;
  isBlocked: boolean;
  blockRemainingSeconds: number;
}

