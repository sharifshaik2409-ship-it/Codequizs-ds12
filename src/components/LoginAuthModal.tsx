import React, { useState } from 'react';
import { ADMIN_CREDENTIALS, examDB } from '../data/database';
import { PlayerSession } from '../types';

interface LoginAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: PlayerSession) => void;
  defaultMode?: 'candidate' | 'admin';
}

export const LoginAuthModal: React.FC<LoginAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultMode = 'candidate',
}) => {
  const [mode, setMode] = useState<'candidate' | 'admin'>(defaultMode);
  const [username, setUsername] = useState(defaultMode === 'admin' ? 'datascience@12' : '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleAdminSwitch = () => {
    setMode('admin');
    setUsername('datascience@12');
    setPassword('');
    setErrorMessage('');
  };

  const handleCandidateSwitch = () => {
    setMode('candidate');
    setUsername('');
    setPassword('');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setErrorMessage('Username is required.');
      return;
    }

    if (mode === 'admin') {
      // Validate requested admin credentials:
      // username = datascience@12, password = saisrinivas@ds12
      if (
        trimmedUser !== ADMIN_CREDENTIALS.username ||
        password !== ADMIN_CREDENTIALS.password
      ) {
        setErrorMessage('Invalid administrator username or password.');
        return;
      }

      // Record in database
      const userRecord = examDB.recordUserLogin(trimmedUser, 'admin', 'WEB_LOGIN_MODAL');

      const session: PlayerSession = {
        username: userRecord.username,
        role: 'admin',
        authenticated: true,
        loginTime: new Date().toLocaleTimeString(),
        gridSlot: 1,
        tokenPurse: 120,
        trackPosition: 'ADMIN ROOT',
        qualification: 'QUALIFIED',
        latency: '0.8 ms',
        isExamLocked: false,
        isBlocked: false,
        blockRemainingSeconds: 0,
      };

      onLoginSuccess(session);
      onClose();
    } else {
      // Candidate login: register / store username in database
      const userRecord = examDB.recordUserLogin(trimmedUser, 'candidate', 'WEB_LOGIN_MODAL');

      const session: PlayerSession = {
        username: userRecord.username,
        role: 'candidate',
        authenticated: true,
        loginTime: new Date().toLocaleTimeString(),
        gridSlot: Math.floor(Math.random() * 800 + 100),
        tokenPurse: 0,
        trackPosition: 'EXAM GATEWAY',
        qualification: 'PENDING',
        latency: '1.4 ms',
        isExamLocked: false,
        isBlocked: false,
        blockRemainingSeconds: 0,
      };

      onLoginSuccess(session);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0d1527] border border-[#00f0ff]/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#849495] hover:text-[#dbfcff] p-1.5 rounded-lg hover:bg-[#171f33] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Tab Toggle: Candidate vs Administrator */}
        <div className="flex bg-[#171f33] p-1 rounded-xl mb-5 border border-[#3b494b]/40">
          <button
            type="button"
            onClick={handleCandidateSwitch}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'candidate'
                ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>Candidate Exam Login</span>
          </button>
          <button
            type="button"
            onClick={handleAdminSwitch}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'admin'
                ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_15px_rgba(2,102,255,0.4)]'
                : 'text-[#b9cacb] hover:text-[#dae2fd]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">security</span>
            <span>Admin Portal Login</span>
          </button>
        </div>

        {/* Header Information with Highlight Words */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center mx-auto mb-2 text-[#00f0ff]">
            <span className="material-symbols-outlined text-2xl">
              {mode === 'admin' ? 'admin_panel_settings' : 'badge'}
            </span>
          </div>
          
          {mode === 'candidate' ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                <span>MANDATORY CANDIDATE REGISTRATION</span>
              </div>
              <h2 className="text-xl font-black text-[#dbfcff] tracking-tight">
                ENTER YOUR <span className="text-[#00f0ff] underline decoration-[#00f0ff]/50">OFFICIAL USERNAME</span>
              </h2>
              <div className="mt-2.5 p-3 rounded-xl bg-[#131b2e] border border-[#00f0ff]/20 text-left text-xs text-[#dae2fd] leading-relaxed">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-mono font-bold text-[10px]">
                    ★ REQUIRED
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-mono font-bold text-[10px]">
                    ● LIVE DATABASE RECORD
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0266ff]/30 text-[#7df4ff] font-mono font-bold text-[10px]">
                    ▲ LEADERBOARD BOUND
                  </span>
                </div>
                <p className="text-[11px] text-[#b9cacb]">
                  Please enter your <strong className="text-[#00f0ff]">EXACT REGISTERED USERNAME</strong>. This identifier will be <strong className="text-[#dbfcff]">PERMANENTLY RECORDED IN THE CENTRAL DATABASE</strong>, logged for <strong className="text-[#7df4ff]">REAL-TIME TRACKING</strong>, and displayed on the <strong className="text-[#10b981]">LEADERBOARD DASHBOARD</strong> upon exam completion.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#dbfcff]">
                Administrator Verification
              </h2>
              <p className="text-xs text-[#b9cacb] mt-1">
                Authorized access for leaderboard &amp; question database
              </p>
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[#00f0ff] tracking-wider uppercase flex items-center gap-1">
                <span>{mode === 'admin' ? 'Administrator Username' : 'Examinee Candidate Username'}</span>
                <span className="text-[#ff5449]">*</span>
              </label>
              <span className="text-[10px] font-mono text-[#849495] uppercase">
                {mode === 'candidate' ? 'Unique Handle' : 'Admin Account'}
              </span>
            </div>
            
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00f0ff] text-[20px]">
                person
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'admin' ? 'datascience@12' : 'Enter your official username (e.g. keerthi_ds)'}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#171f33] border-2 border-[#00f0ff]/40 text-[#dbfcff] font-mono text-sm font-semibold focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/30 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)] transition-all"
                required
                autoFocus
              />
            </div>
            {mode === 'candidate' ? (
              <span className="text-[11px] text-[#849495] font-mono">
                Highlight: Use letters, numbers, or underscore. Cannot be left blank.
              </span>
            ) : (
              <span className="text-[11px] text-[#849495] font-mono">
                System Account: <span className="text-[#00f0ff]">datascience@12</span>
              </span>
            )}
          </div>

          {/* Password Input (Admin Only) with Masking */}
          {mode === 'admin' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-[#7df4ff] tracking-wider uppercase">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#849495] hover:text-[#00f0ff] transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#849495] text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#171f33] border border-[#3b494b]/50 text-[#dbfcff] font-mono text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]"
                  required
                />
              </div>
              <span className="text-[11px] text-[#849495] font-mono">
                Encrypted password field.
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#ff5449]/10 border border-[#ff5449]/40 text-[#ffb4ab] text-xs font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#ff5449]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            {mode === 'admin' ? 'Verify & Access Admin Portal' : 'Login & Access Exam Arena'}
          </button>
        </form>

        {/* Database Logging Notice */}
        <div className="mt-4 pt-4 border-t border-[#3b494b]/30 text-center">
          <span className="text-[11px] text-[#849495] font-mono">
            User credentials and timestamps are persisted in the central database.
          </span>
        </div>
      </div>
    </div>
  );
};
