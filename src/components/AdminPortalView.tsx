import React, { useState } from 'react';
import { examDB, ADMIN_CREDENTIALS } from '../data/database';
import { SecureQuestionItem, QuestionCategory } from '../types';

interface AdminPortalViewProps {
  onOpenLogin: () => void;
  isAdminAuthenticated: boolean;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onOpenLogin,
  isAdminAuthenticated,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'violations'>('users');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch from database
  const userLogins = examDB.getUsers();
  const allSecureQuestions = examDB.getAllSecureQuestions();
  const violations = examDB.getSecurityViolations();
  const examRecords = examDB.getLeaderboard();

  // Filter questions
  const filteredQuestions = allSecureQuestions.filter((q) => {
    const matchCat = selectedCategory === 'ALL' || q.cat === selectedCategory;
    const matchSearch =
      q.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.cat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filter users
  const filteredUsers = userLogins.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not logged in as admin, prompt authentication with credentials
  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 max-w-xl mx-auto my-12 rounded-2xl bg-[#131b2e] border border-[#00f0ff]/30 text-center shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] mb-4">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-[#dbfcff] mb-2">Administrator Access Required</h2>
        <p className="text-xs sm:text-sm text-[#b9cacb] mb-6 leading-relaxed">
          The Question Database and User Login Directory are restricted to administrative personnel.
          <br />
          Please authenticate with authorized credentials:
        </p>

        <div className="p-4 rounded-xl bg-[#171f33] border border-[#3b494b]/50 text-left w-full mb-6 font-mono text-xs text-[#dae2fd] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#849495]">Required Username:</span>
            <span className="text-[#00f0ff] font-bold">datascience@12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#849495]">Encrypted Password:</span>
            <span className="text-[#7df4ff]">saisrinivas@ds12 (Hidden)</span>
          </div>
        </div>

        <button
          onClick={onOpenLogin}
          className="w-full py-3.5 px-6 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer"
        >
          Open Admin Login Portal
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#3b494b]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-xs uppercase tracking-wider font-bold border border-[#00f0ff]/40">
              AUTHENTICATED ROOT
            </span>
            <span className="text-[#3b494b] font-mono">/</span>
            <span className="font-mono text-xs text-[#b9cacb]">ADMIN: datascience@12</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#dbfcff]">
            Exam &amp; Database Administration Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#b9cacb] mt-1">
            Manage question answer database, monitor user logins, and inspect anti-cheat security lockout events.
          </p>
        </div>

        {/* Quick Stats Capsule */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#171f33] px-3 py-2 rounded-xl border border-[#3b494b]/40 font-mono text-xs">
            <span className="text-[#849495]">DB USERS:</span>
            <span className="font-bold text-[#00f0ff]">{userLogins.length}</span>
            <span className="text-[#3b494b]">|</span>
            <span className="text-[#849495]">QUESTIONS:</span>
            <span className="font-bold text-[#7df4ff]">{allSecureQuestions.length}</span>
            <span className="text-[#3b494b]">|</span>
            <span className="text-[#849495]">VIOLATIONS:</span>
            <span className="font-bold text-[#ff5449]">{violations.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex bg-[#131b2e] p-1 rounded-xl border border-[#3b494b]/40">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_12px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>User Accounts Database ({userLogins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_12px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            <span>Question Bank &amp; Answers ({allSecureQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('violations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'violations'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_12px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>Security Violations &amp; Lockouts ({violations.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#849495] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#171f33] text-[#dbfcff] font-mono text-xs border border-[#3b494b]/40 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>
      </div>

      {/* TAB 1: USERS DATABASE */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#171f33] border border-[#00f0ff]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00f0ff]">storage</span>
              <div>
                <h3 className="text-sm font-bold text-[#dbfcff]">User Login Database Table</h3>
                <p className="text-xs text-[#b9cacb]">
                  Records all usernames who logged in with timestamp, IP, and exam engagement status.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#131b2e] shadow-xl border border-[#3b494b]/40">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#171f33] font-mono text-[#b9cacb] uppercase tracking-wider border-b border-[#2d3449]">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Username</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">First Login</th>
                  <th className="px-4 py-3.5">IP Address</th>
                  <th className="px-4 py-3.5">Browser Client</th>
                  <th className="px-4 py-3.5">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3449]/40 text-[#dae2fd]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#171f33]/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[#849495]">{u.id}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#dbfcff]">{u.username}</td>
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                            : 'bg-[#171f33] text-[#dae2fd]'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#849495]">
                      {new Date(u.loginTimestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#7df4ff]">{u.ipAddress}</td>
                    <td className="px-4 py-3.5 font-mono text-[#dae2fd] max-w-[180px] truncate">
                      {u.browser}
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          u.status === 'ONLINE'
                            ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                            : u.status === 'IN_EXAM'
                            ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                            : u.status === 'DISQUALIFIED'
                            ? 'bg-[#ff5449]/20 text-[#ff5449]'
                            : 'bg-[#171f33] text-[#dae2fd]'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK WITH STORED DATABASE ANSWERS */}
      {activeTab === 'questions' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#171f33] border border-[#00f0ff]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00f0ff]">verified</span>
              <div>
                <h3 className="text-sm font-bold text-[#dbfcff]">
                  Protected Question Bank (Answers Stored Securely in Database)
                </h3>
                <p className="text-xs text-[#b9cacb]">
                  The answers shown below are strictly hidden from web exam candidates and stripped before transmission.
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'Python', 'C', 'C++', 'Java', 'SQL'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#00f0ff] text-[#00363a]'
                      : 'bg-[#131b2e] text-[#b9cacb] hover:text-[#dae2fd]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#131b2e] shadow-xl border border-[#3b494b]/40">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#171f33] font-mono text-[#b9cacb] uppercase tracking-wider border-b border-[#2d3449]">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Difficulty</th>
                  <th className="px-4 py-3.5">Question Prompt</th>
                  <th className="px-4 py-3.5">Database Answer Key (Hidden in Web Rounds)</th>
                  <th className="px-4 py-3.5">Option Text</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3449]/40 text-[#dae2fd]">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-[#171f33]/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[#7df4ff]">#Q-{q.id}</td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#171f33] text-[#dbfcff] border border-[#3b494b]/40">
                        {q.cat}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={
                          q.diff === 'Easy'
                            ? 'text-[#00f0ff]'
                            : q.diff === 'Medium'
                            ? 'text-[#f59e0b]'
                            : 'text-[#ef4444]'
                        }
                      >
                        {q.diff}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-sm truncate text-[#dae2fd]" title={q.prompt}>
                      {q.prompt}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[#00f0ff]">
                      <span className="px-2 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/40">
                        Option [{q.correct}]
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#dae2fd] max-w-xs truncate">
                      {q.opts[q.correct]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-CHEAT LOCKOUT LOGS */}
      {activeTab === 'violations' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-[#171f33] border border-[#ff5449]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff5449]">gavel</span>
              <div>
                <h3 className="text-sm font-bold text-[#ffb4ab]">
                  Anti-Cheat Violation &amp; 1-Minute Lockout Ledger
                </h3>
                <p className="text-xs text-[#b9cacb]">
                  Users who clicked outside buttons during a locked exam are penalized with 1-min account blocking and logged as Disqualified.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#131b2e] shadow-xl border border-[#3b494b]/40">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#171f33] font-mono text-[#b9cacb] uppercase tracking-wider border-b border-[#2d3449]">
                <tr>
                  <th className="px-4 py-3.5">Violation ID</th>
                  <th className="px-4 py-3.5">Username</th>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Action Caught</th>
                  <th className="px-4 py-3.5">Elapsed Exam Time</th>
                  <th className="px-4 py-3.5">Penalty Enforced</th>
                  <th className="px-4 py-3.5">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3449]/40 text-[#dae2fd]">
                {violations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center font-mono text-xs text-[#849495]">
                      No anti-cheat violations logged yet. All exams completed cleanly.
                    </td>
                  </tr>
                ) : (
                  violations.map((v) => (
                    <tr key={v.id} className="hover:bg-[#171f33]/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[#849495]">{v.id}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#ffb4ab]">{v.username}</td>
                      <td className="px-4 py-3.5 font-mono text-[#849495]">{v.timestamp}</td>
                      <td className="px-4 py-3.5 text-[#dae2fd]">{v.action}</td>
                      <td className="px-4 py-3.5 font-mono text-[#7df4ff]">{v.elapsedTime}s</td>
                      <td className="px-4 py-3.5 font-mono text-[#ff5449]">
                        {v.lockoutDurationSeconds}s Account Block
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#ff5449]/20 text-[#ff5449] font-bold border border-[#ff5449]/40">
                          {v.verdict}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
