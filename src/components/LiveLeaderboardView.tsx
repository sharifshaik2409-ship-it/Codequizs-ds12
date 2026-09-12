import React, { useState } from 'react';
import { ExamSubmissionRecord, UserLoginRecord, TaskCompletionRecord } from '../types';
import { examDB, ADMIN_CREDENTIALS } from '../data/database';
import { InspectorModal } from './InspectorModal';

interface LiveLeaderboardViewProps {
  isAdminAuthenticated?: boolean;
  onAdminAuthenticated?: () => void;
}

export const LiveLeaderboardView: React.FC<LiveLeaderboardViewProps> = ({
  isAdminAuthenticated = false,
  onAdminAuthenticated,
}) => {
  // Direct view mode for Leaderboard Dashboard, with Leader Admin privilege controls
  const [unlockedByInput, setUnlockedByInput] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tabs: 'tasks' (Completed tasks & time taken), 'users' (All web loginers & aggregate times), 'leaderboard' (Exam rankings)
  const [activeTab, setActiveTab] = useState<'tasks' | 'users' | 'leaderboard'>('tasks');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'QUALIFIED' | 'PASSED' | 'FAILED' | 'DISQUALIFIED'>('ALL');
  const [inspectedRecord, setInspectedRecord] = useState<ExamSubmissionRecord | null>(null);

  const isAccessAllowed = isAdminAuthenticated || unlockedByInput;

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminUsername.trim() === ADMIN_CREDENTIALS.username &&
      adminPassword.trim() === ADMIN_CREDENTIALS.password
    ) {
      setUnlockedByInput(true);
      setAuthError('');
      if (onAdminAuthenticated) {
        onAdminAuthenticated();
      }
    } else {
      setAuthError('Invalid credentials. Access restricted to authorized Leader Admin.');
    }
  };

  const handleLockDashboard = () => {
    setUnlockedByInput(false);
    setAdminPassword('');
  };

  // If locked, show secure login gate
  if (!isAccessAllowed) {
    return (
      <div className="flex items-center justify-center min-h-[75vh] px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#131b2e] border-2 border-[#f59e0b]/50 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b] flex items-center justify-center mx-auto text-[#f59e0b]">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>

          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] font-mono text-xs font-bold uppercase tracking-wider border border-[#f59e0b]/40 inline-block mb-2">
              RESTRICTED LEADERBOARD
            </span>
            <h2 className="text-2xl font-bold text-[#dbfcff]">
              Leader Admin Authentication
            </h2>
            <p className="text-xs text-[#b9cacb] mt-2 leading-relaxed">
              Enter authorized leader credentials to reveal participant timings, task completion records, and scores.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-[#ff5449]/15 border border-[#ff5449]/40 text-xs text-[#ffb4ab] font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ff5449]">error</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminUnlock} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-mono text-[#849495] block mb-1">
                Leader Admin Username
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="e.g. datascience@12"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#090f1e] border border-[#3b494b]/50 text-[#dbfcff] font-mono text-sm focus:border-[#00f0ff] outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#849495] block mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090f1e] border border-[#3b494b]/50 text-[#dbfcff] font-mono text-sm focus:border-[#00f0ff] outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#849495] hover:text-[#dbfcff] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090f1e] border border-[#3b494b]/30 flex items-center justify-between text-[11px] font-mono text-[#849495]">
              <span>Authorized Access:</span>
              <button
                type="button"
                onClick={() => {
                  setAdminUsername(ADMIN_CREDENTIALS.username);
                  setAdminPassword(ADMIN_CREDENTIALS.password);
                }}
                className="text-[#00f0ff] hover:underline cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer mt-2"
            >
              Unlock &amp; View Leaderboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Live database records
  const examRecords: ExamSubmissionRecord[] = examDB.getLeaderboard();
  const userLogins: UserLoginRecord[] = examDB.getUsers();
  const taskRecords: TaskCompletionRecord[] = examDB.getTasks();

  // Filter tasks
  const filteredTasks = taskRecords.filter((task) => {
    const matchesSearch =
      task.username.toLowerCase().includes(search.toLowerCase()) ||
      task.taskName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'ALL' ||
      task.status === filterStatus ||
      (filterStatus === 'QUALIFIED' && task.status === 'PASSED');
    return matchesSearch && matchesStatus;
  });

  // Filter web loginers
  const filteredUsers = userLogins.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'ALL' ||
      u.status === filterStatus ||
      (filterStatus === 'QUALIFIED' && u.status === 'COMPLETED');
    return matchesSearch && matchesStatus;
  });

  // Filter exams
  const filteredExams = examRecords.filter((rec) => {
    const matchesSearch = rec.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || rec.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Export complete CSV including Web Loginers and Task Completion Times
  const handleExportCSV = () => {
    let csv = 'SECTION 1: WEB LOGINERS DATABASE\n';
    csv += 'User ID,Username,Role,First Login Time,Last Active,Tasks Completed,Total Time Taken (Seconds),Total Time Formatted,Latest Task,Status,IP Address,Browser\n';
    userLogins.forEach((u) => {
      csv += `"${u.id}","${u.username}","${u.role}","${u.loginTimestamp}","${u.lastSeen || ''}",${u.tasksCompleted || 0},${u.totalTimeSpentSeconds || 0},"${u.totalTimeSpentFormatted || '00m 00s'}","${u.latestTask || 'None'}","${u.status}","${u.ipAddress}","${u.browser}"\n`;
    });

    csv += '\nSECTION 2: COMPLETED TASKS & TIME TAKEN\n';
    csv += 'Task ID,Username,Round,Task Name,Score Earned,Time Taken (Seconds),Time Taken Formatted,Status,Completed At,Verification Method,HMAC\n';
    taskRecords.forEach((t) => {
      csv += `"${t.id}","${t.username}",${t.round},"${t.taskName}",${t.scoreEarned},${t.timeTakenSeconds},"${t.timeTakenFormatted}","${t.status}","${t.completedAt}","${t.verificationMethod}","${t.hmacSignature}"\n`;
    });

    csv += '\nSECTION 3: 30-QUESTION EXAM STANDINGS\n';
    csv += 'Rank,Username,LoginTime,Score,Correct Answers,Time Taken,Status,DisqualificationReason,HMAC\n';
    examRecords.forEach((c, i) => {
      csv += `${i + 1},"${c.username}","${c.loginTime}",${c.score},"${c.correctAnswersCount}/${c.totalQuestions}","${c.timeTakenFormatted}","${c.status}","${c.disqualificationReason || 'None'}","${c.hmacSignature}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leaderboard_dashboard_database_${Date.now()}.csv`);
    link.click();
  };

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto" id="leader-dashboard-container">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#3b494b]/30">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-mono text-xs uppercase tracking-wider font-bold border border-[#10b981]/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              CENTRAL EXAM DATABASE • LIVE LEADER DASHBOARD
            </span>
            <span className="text-[#3b494b] font-mono">/</span>
            <span className="font-mono text-xs text-[#b9cacb]">REAL-TIME TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#dbfcff]">
            Leaderboard &amp; Web Loginers Database
          </h1>
          <p className="text-xs sm:text-sm text-[#b9cacb] max-w-3xl mt-1">
            Live database tracking for all web loginers: usernames, login timestamps, all completed tasks, exact time taken to complete each task, and cryptographic HMAC verification.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={handleLockDashboard}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#b9cacb] border border-[#3b494b]/50 font-mono text-xs font-bold transition-all cursor-pointer"
            title="Lock dashboard with administrator credentials"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Admin Lock</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f0ff] text-[#00363a] font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-[#7df4ff] cursor-pointer transition-all"
            id="btn-export-database-csv"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Database CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
        <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-mono text-[#849495] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">group</span>
            Web Loginers
          </span>
          <span className="text-2xl font-bold font-mono text-[#dbfcff]">
            {userLogins.length} Users
          </span>
          <span className="text-[11px] text-[#10b981] font-mono">
            {userLogins.filter((u) => u.status === 'ONLINE' || u.status === 'IN_EXAM').length} currently active
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-mono text-[#849495] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#f59e0b]">task_alt</span>
            Tasks Completed
          </span>
          <span className="text-2xl font-bold font-mono text-[#f59e0b]">
            {taskRecords.length} Tasks
          </span>
          <span className="text-[11px] text-[#b9cacb] font-mono">
            Across Round 1, 2 &amp; 3
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-mono text-[#849495] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#7df4ff]">timer</span>
            Min Exam Duration
          </span>
          <span className="text-2xl font-bold font-mono text-[#7df4ff]">
            30m 00s
          </span>
          <span className="text-[11px] text-[#00f0ff] font-mono">
            Enforced in Database
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#3b494b]/40 flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-mono text-[#849495] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#10b981]">verified_user</span>
            Verification Engine
          </span>
          <span className="text-2xl font-bold font-mono text-[#10b981]">
            Active
          </span>
          <span className="text-[11px] text-[#849495] font-mono truncate">
            HMAC &amp; Code/Output Match
          </span>
        </div>
      </div>

      {/* Main View Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex bg-[#131b2e] p-1.5 rounded-xl border border-[#3b494b]/40 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
            id="tab-btn-tasks"
          >
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span>Completed Tasks &amp; Times ({taskRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_12px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
            id="tab-btn-users"
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>All Web Loginers Database ({userLogins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-[#f59e0b] text-[#000] shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
            id="tab-btn-standings"
          >
            <span className="material-symbols-outlined text-[18px]">trophy</span>
            <span>30-Question Assessment Standings ({examRecords.length})</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#849495] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate username..."
              className="pl-9 pr-4 py-2 rounded-xl bg-[#131b2e] border border-[#3b494b]/40 text-xs font-mono text-[#dbfcff] focus:border-[#00f0ff] outline-none w-64"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-[#3b494b]/40 text-xs font-mono">
            {(['ALL', 'QUALIFIED', 'PASSED', 'FAILED', 'DISQUALIFIED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  filterStatus === st
                    ? 'bg-[#00f0ff] text-[#00363a]'
                    : 'text-[#849495] hover:text-[#dbfcff]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ALL COMPLETED TASKS & TIME TAKEN PER TASK           */}
      {/* ========================================================= */}
      {activeTab === 'tasks' && (
        <div className="overflow-x-auto rounded-2xl border border-[#3b494b]/40 bg-[#131b2e]/95 shadow-2xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#3b494b]/40 bg-[#171f33] text-[#849495] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Task ID</th>
                <th className="py-3.5 px-4 font-semibold">Candidate Username</th>
                <th className="py-3.5 px-4 font-semibold">Round &amp; Task Name</th>
                <th className="py-3.5 px-4 font-semibold text-[#00f0ff]">Time Taken to Complete</th>
                <th className="py-3.5 px-4 font-semibold">Score Earned</th>
                <th className="py-3.5 px-4 font-semibold">Outcome Status</th>
                <th className="py-3.5 px-4 font-semibold">Completion Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Verification Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b]/20">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#849495]">
                    No task completions found matching query. Complete questions or exams to see live task times recorded here!
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#1f2942]/50 transition-colors">
                    <td className="py-4 px-4 text-[#849495]">{task.id}</td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] text-xs font-bold">
                          {task.username.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <span className="font-bold text-[#dbfcff] text-sm block">
                            {task.username}
                          </span>
                          <span className="text-[10px] text-[#849495]">
                            Verified in Database
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#dbfcff]">
                          {task.taskName}
                        </span>
                        <span className="text-[10px] text-[#849495]">
                          Round {task.round} • {task.verificationMethod.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>

                    {/* Prominent Time Taken Display */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] font-bold text-sm">
                        <span className="material-symbols-outlined text-[16px] animate-pulse">timer</span>
                        <span>{task.timeTakenFormatted}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#7df4ff]">
                      +{task.scoreEarned} Tokens
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                          task.status === 'QUALIFIED' || task.status === 'PASSED'
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                            : task.status === 'DISQUALIFIED'
                            ? 'bg-[#ff5449]/20 text-[#ffb4ab] border border-[#ff5449]/40'
                            : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#b9cacb]">
                      {new Date(task.completedAt).toLocaleTimeString()}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[11px] text-[#849495] font-mono truncate max-w-[120px] block" title={task.hmacSignature}>
                        {task.hmacSignature}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ALL WEB LOGINERS DATABASE & TOTAL TIMES            */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-[#3b494b]/40 bg-[#131b2e]/95 shadow-2xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#3b494b]/40 bg-[#171f33] text-[#849495] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">User ID</th>
                <th className="py-3.5 px-4 font-semibold">Username in Database</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Initial Web Login Time</th>
                <th className="py-3.5 px-4 font-semibold">Tasks Completed</th>
                <th className="py-3.5 px-4 font-semibold text-[#00f0ff]">Total Time Taken</th>
                <th className="py-3.5 px-4 font-semibold">Latest Task Outcome</th>
                <th className="py-3.5 px-4 font-semibold">Simulated IP &amp; Client</th>
                <th className="py-3.5 px-4 font-semibold">Current State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b]/20">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#849495]">
                    No logged in users recorded in database.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1f2942]/50 transition-colors">
                    <td className="py-4 px-4 text-[#849495]">{user.id}</td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#0266ff]/20 border border-[#0266ff]/40 flex items-center justify-center text-[#7df4ff] text-xs font-bold">
                          {user.username.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <span className="font-bold text-[#dbfcff] text-sm block">
                            {user.username}
                          </span>
                          <span className="text-[10px] text-[#849495]">
                            {user.registeredVia || 'WEB_PORTAL'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-[#0266ff]/20 text-[#7df4ff] border border-[#0266ff]/40'
                            : 'bg-[#171f33] text-[#b9cacb]'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#b9cacb]">
                      {new Date(user.loginTimestamp).toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#171f33] border border-[#3b494b]/40 font-bold text-[#dbfcff]">
                        {user.tasksCompleted || 0} Tasks
                      </span>
                    </td>

                    {/* Total Time Spent Formatted */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/30">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{user.totalTimeSpentFormatted || '00m 00s'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs text-[#dbfcff] font-medium block">
                        {user.latestTask || 'None'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#7df4ff]">{user.ipAddress}</span>
                        <span className="text-[10px] text-[#849495]">{user.browser}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          user.status === 'ONLINE'
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                            : user.status === 'IN_EXAM'
                            ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                            : user.status === 'DISQUALIFIED'
                            ? 'bg-[#ff5449]/20 text-[#ffb4ab] border border-[#ff5449]/40'
                            : 'bg-[#171f33] text-[#849495] border border-[#3b494b]/30'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: 30-QUESTION ASSESSMENT OFFICIAL STANDINGS           */}
      {/* ========================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="overflow-x-auto rounded-2xl border border-[#3b494b]/40 bg-[#131b2e]/95 shadow-2xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#3b494b]/40 bg-[#171f33] text-[#849495] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Rank</th>
                <th className="py-3.5 px-4 font-semibold">Examinee Username</th>
                <th className="py-3.5 px-4 font-semibold">Score / Correct (30 Qs)</th>
                <th className="py-3.5 px-4 font-semibold text-[#00f0ff]">Time Recorded</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">HMAC Ledger Digest</th>
                <th className="py-3.5 px-4 font-semibold text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b]/20">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#849495]">
                    No exam records found matching query.
                  </td>
                </tr>
              ) : (
                filteredExams.map((record, index) => {
                  const isTop3 = index < 3 && record.status !== 'DISQUALIFIED';
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-[#1f2942]/50 transition-colors group"
                    >
                      <td className="py-4 px-4 font-bold">
                        <div className="flex items-center gap-2">
                          {isTop3 ? (
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0
                                  ? 'bg-[#f59e0b] text-[#000]'
                                  : index === 1
                                  ? 'bg-[#cbd5e1] text-[#000]'
                                  : 'bg-[#d97706] text-[#fff]'
                              }`}
                            >
                              {index + 1}
                            </span>
                          ) : (
                            <span className="text-[#849495] px-2 font-mono">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#dbfcff] text-sm">
                            {record.username}
                          </span>
                          <span className="text-[10px] text-[#849495]">
                            Logged in: {record.loginTime}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#7df4ff] text-sm">
                            {record.score} Tokens
                          </span>
                          <span className="text-[10px] text-[#b9cacb]">
                            {record.correctAnswersCount} / {record.totalQuestions} Correct Answers
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>{record.timeTakenFormatted}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                            record.status === 'QUALIFIED'
                              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                              : record.status === 'DISQUALIFIED'
                              ? 'bg-[#ff5449]/20 text-[#ffb4ab] border border-[#ff5449]/40'
                              : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                          }`}
                        >
                          {record.status}
                        </span>
                        {record.disqualificationReason && (
                          <span className="text-[10px] text-[#ffb4ab] block mt-0.5 max-w-xs truncate">
                            {record.disqualificationReason}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-[11px] text-[#849495] font-mono truncate max-w-[120px] block" title={record.hmacSignature}>
                          {record.hmacSignature}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setInspectedRecord(record)}
                          className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-bold transition-all cursor-pointer"
                        >
                          Audit Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Modal */}
      {inspectedRecord && (
        <InspectorModal
          isOpen={!!inspectedRecord}
          onClose={() => setInspectedRecord(null)}
          contender={inspectedRecord}
        />
      )}
    </div>
  );
};
