import React, { useState, useEffect } from 'react';
import { ViewMode, PlayerSession } from './types';
import { Header } from './components/Header';
import { QuizArenaView } from './components/QuizArenaView';
import { LiveLeaderboardView } from './components/LiveLeaderboardView';
import { RulesScoringView } from './components/RulesScoringView';
import { AdminPortalView } from './components/AdminPortalView';
import { LoginAuthModal } from './components/LoginAuthModal';
import { AntiCheatLockoutModal } from './components/AntiCheatLockoutModal';
import { examDB, ADMIN_CREDENTIALS } from './data/database';

export const App: React.FC = () => {
  // Current view mode: Default directly to Quiz Arena!
  const [currentView, setCurrentView] = useState<ViewMode>('quiz-arena');

  // Player session state
  const [playerSession, setPlayerSession] = useState<PlayerSession>(() => {
    // Check initial user in database
    const initialUser = 'datascience_student_01';
    examDB.recordUserLogin(initialUser, 'candidate');
    return {
      username: initialUser,
      role: 'candidate',
      authenticated: true,
      loginTime: new Date().toLocaleTimeString(),
      gridSlot: 104,
      tokenPurse: 0,
      trackPosition: 'EXAM ARENA',
      qualification: 'PENDING',
      latency: '1.2 ms',
      isExamLocked: false,
      isBlocked: false,
      blockRemainingSeconds: 0,
    };
  });

  // Modal states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'candidate' | 'admin'>('candidate');
  const [lockoutModalOpen, setLockoutModalOpen] = useState(false);
  const [lockoutReason, setLockoutReason] = useState('Clicked unauthorized button during locked exam.');

  // Handle unauthorized action when exam is locked
  const handleTriggerDisqualification = (reason: string) => {
    if (!playerSession.isExamLocked) return;

    // Record violation & disqualification in central database
    examDB.recordDisqualification(playerSession.username, 120, reason);

    // Update session state
    setPlayerSession((prev) => ({
      ...prev,
      isExamLocked: false,
      isBlocked: true,
      blockRemainingSeconds: 60,
      qualification: 'DISQUALIFIED',
    }));

    setLockoutReason(reason);
    setLockoutModalOpen(true);
  };

  const handleLockoutComplete = () => {
    setLockoutModalOpen(false);
    setPlayerSession((prev) => ({
      ...prev,
      isBlocked: false,
      blockRemainingSeconds: 0,
    }));
    // Redirect to Leaderboard Dashboard
    setCurrentView('live-leaderboard');
  };

  const handleOpenAdminLogin = () => {
    setLoginModalMode('admin');
    setLoginModalOpen(true);
  };

  const handleOpenCandidateLogin = () => {
    setLoginModalMode('candidate');
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (session: PlayerSession) => {
    setPlayerSession(session);
    if (session.role === 'admin') {
      setCurrentView('admin-portal');
    }
  };

  const handleLogout = () => {
    examDB.updateUserStatus(playerSession.username, 'OFFLINE');
    setPlayerSession({
      username: 'GUEST_CANDIDATE',
      role: 'candidate',
      authenticated: false,
      loginTime: new Date().toLocaleTimeString(),
      gridSlot: 0,
      tokenPurse: 0,
      trackPosition: 'GATEWAY',
      qualification: 'PENDING',
      latency: '1.0 ms',
      isExamLocked: false,
      isBlocked: false,
      blockRemainingSeconds: 0,
    });
    setCurrentView('quiz-arena');
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-body selection:bg-[#00f0ff] selection:text-[#002022]">
      {/* Top Header Navigation: Hidden during active exam lock to avoid seeing other dashboards in web */}
      {!playerSession.isExamLocked && (
        <Header
          currentView={currentView}
          onNavigate={(v) => {
            if (v === 'admin-portal' && playerSession.role !== 'admin') {
              handleOpenAdminLogin();
              return;
            }
            setCurrentView(v);
          }}
          playerSession={playerSession}
          onOpenLogin={() => {
            setLoginModalMode(playerSession.role === 'admin' ? 'admin' : 'candidate');
            setLoginModalOpen(true);
          }}
          onLogout={handleLogout}
          onUnauthorizedAction={handleTriggerDisqualification}
        />
      )}

      {/* Main Container */}
      <main className={`flex-1 ${playerSession.isExamLocked ? 'pt-0' : 'pt-20'}`}>
        {currentView === 'quiz-arena' && (
          <QuizArenaView
            playerSession={playerSession}
            setPlayerSession={setPlayerSession}
            onTriggerDisqualification={handleTriggerDisqualification}
            onNavigateToLeaderboard={() => setCurrentView('live-leaderboard')}
          />
        )}

        {currentView === 'live-leaderboard' && (
          <LiveLeaderboardView
            isAdminAuthenticated={
              playerSession.role === 'admin' &&
              playerSession.username === ADMIN_CREDENTIALS.username
            }
            onAdminAuthenticated={() => {
              setPlayerSession((prev) => ({
                ...prev,
                role: 'admin',
                username: ADMIN_CREDENTIALS.username,
                authenticated: true,
              }));
            }}
          />
        )}

        {currentView === 'admin-portal' && (
          <AdminPortalView
            onOpenLogin={handleOpenAdminLogin}
            isAdminAuthenticated={
              playerSession.role === 'admin' &&
              playerSession.username === ADMIN_CREDENTIALS.username
            }
          />
        )}

        {currentView === 'exam-rules' && <RulesScoringView />}
      </main>

      {/* Login / Authentication Modal */}
      <LoginAuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultMode={loginModalMode}
      />

      {/* Anti-Cheat 1-Minute Lockout Modal */}
      <AntiCheatLockoutModal
        isOpen={lockoutModalOpen}
        username={playerSession.username}
        reason={lockoutReason}
        onLockoutComplete={handleLockoutComplete}
      />
    </div>
  );
};

export default App;
