import React, { useState, useEffect } from 'react';
import { ViewMode, PlayerSession } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  playerSession: PlayerSession;
  onOpenLogin: () => void;
  onLogout: () => void;
  onUnauthorizedAction?: (details: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  playerSession,
  onOpenLogin,
  onLogout,
  onUnauthorizedAction,
}) => {
  const [utcTime, setUtcTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ViewMode; label: string; icon: string; badge?: string }[] = [
    { id: 'quiz-arena', label: 'Quiz Arena', icon: 'quiz' },
    {
      id: 'live-leaderboard',
      label: 'Leaderboard Dashboard',
      icon: 'leaderboard',
      badge: playerSession.role === 'admin' ? 'Leader Unlocked' : 'Admin Locked 🔒',
    },
    { id: 'admin-portal', label: 'Admin Portal', icon: 'admin_panel_settings', badge: 'datascience@12' },
    { id: 'exam-rules', label: 'Exam Rules & Lockout', icon: 'gavel' },
  ];

  const handleNavClick = (viewId: ViewMode) => {
    if (playerSession.isExamLocked) {
      if (onUnauthorizedAction) {
        onUnauthorizedAction(`Clicked navigation button [${viewId}] while exam was locked.`);
      }
      return;
    }
    onNavigate(viewId);
  };

  const handleLogoClick = () => {
    if (playerSession.isExamLocked) {
      if (onUnauthorizedAction) {
        onUnauthorizedAction('Clicked logo while exam was locked.');
      }
      return;
    }
    onNavigate('quiz-arena');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b1326]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.7)] border-b border-[#3b494b]/40">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo and Exam Platform Brand */}
        <div
          onClick={handleLogoClick}
          className={`flex items-center gap-3 shrink-0 select-none ${
            playerSession.isExamLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#0266ff] flex items-center justify-center text-[#002022] font-black shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            <span className="material-symbols-outlined text-2xl font-bold">code</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md tracking-wider text-[#dbfcff] font-bold drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">
                CODE QUIZ
              </span>
              <span className="text-xs bg-[#171f33] px-2 py-0.5 rounded text-[#00f0ff] uppercase tracking-wider font-bold border border-[#00f0ff]/30">
                EXAM PORTAL
              </span>
            </div>
            <span className="text-[11px] text-[#b9cacb]/80 tracking-wider font-mono">
              Secure Assessment • 10m Locked Timer • Anti-Cheat
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 shrink-0">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 transition-all text-xs sm:text-sm font-bold px-3 py-2 rounded-xl relative ${
                  playerSession.isExamLocked
                    ? 'text-[#849495] cursor-not-allowed hover:text-[#ff5449]'
                    : isActive
                    ? 'bg-[#0266ff] text-[#f9f7ff] shadow-[0_0_14px_rgba(2,102,255,0.4)] cursor-pointer'
                    : 'text-[#b9cacb] hover:text-[#dae2fd] hover:bg-[#171f33] cursor-pointer'
                }`}
                title={playerSession.isExamLocked ? 'LOCKED: Click will trigger disqualification' : item.label}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00f0ff]/20 text-[#7df4ff] font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Badges & Auth Control */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Exam Lock Warning Badge */}
          {playerSession.isExamLocked && (
            <div className="flex items-center gap-1.5 bg-[#ff5449]/20 px-3 py-1.5 rounded-xl border border-[#ff5449]/60 text-xs font-mono text-[#ffb4ab] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#ff5449] shadow-[0_0_8px_rgba(255,84,73,1)]"></span>
              <span className="font-bold">EXAM LOCKED (ANTI-CHEAT ON)</span>
            </div>
          )}

          {/* Clock */}
          <div className="hidden sm:flex items-center bg-[#171f33] px-3 py-1.5 rounded-xl border border-[#3b494b]/30">
            <span className="font-mono text-xs text-[#b3c5ff]">
              {utcTime || '14:28:42 UTC'}
            </span>
          </div>

          {/* User Status / Login Pill */}
          <div className="flex items-center gap-2 bg-[#171f33] p-1.5 pl-3 rounded-xl border border-[#3b494b]/40">
            <div className="flex flex-col text-right">
              <span className="text-[11px] font-mono text-[#7df4ff] font-bold tracking-wider">
                {playerSession.role === 'admin' ? 'ADMIN' : 'EXAMINEE'}
              </span>
              <span className="text-xs font-bold text-[#dbfcff] truncate max-w-[130px]">
                {playerSession.username}
              </span>
            </div>

            <button
              onClick={() => {
                if (playerSession.isExamLocked) {
                  if (onUnauthorizedAction) {
                    onUnauthorizedAction('Attempted to switch account while exam was locked.');
                  }
                  return;
                }
                onOpenLogin();
              }}
              className="px-2.5 py-1 rounded-lg bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] text-xs font-bold font-mono transition-all cursor-pointer"
              title="Switch user / Admin login"
            >
              Switch
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => {
              if (playerSession.isExamLocked) {
                if (onUnauthorizedAction) {
                  onUnauthorizedAction('Opened menu during locked exam.');
                }
                return;
              }
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl bg-[#171f33] text-[#dbfcff] hover:bg-[#2d3449]"
            title="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#060e20] border-b border-[#3b494b]/40 p-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all font-bold text-sm ${
                  isActive
                    ? 'bg-[#0266ff] text-[#f9f7ff]'
                    : 'text-[#b9cacb] hover:text-[#dae2fd] hover:bg-[#171f33]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#7df4ff] font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

