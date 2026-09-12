import React from 'react';

export const RulesScoringView: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-6 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-[#171f33] text-[#00f0ff] font-mono text-xs uppercase tracking-wider font-bold border border-[#00f0ff]/30">
            EXAM INTEGRITY SPECIFICATION
          </span>
          <span className="text-[#3b494b] font-mono">/</span>
          <span className="font-mono text-xs text-[#b9cacb]">SECURITY CODEX</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#dbfcff]">
          Examination Governance &amp; Anti-Cheat Rules
        </h1>
        <p className="text-xs sm:text-sm text-[#b9cacb] max-w-2xl mt-1">
          Strict rules governing the 30-minute minimum duration, database answer shielding, anti-cheat button click lockout, and leaderboard persistence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Anti-Cheat & Lockout Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#131b2e] border-2 border-[#ff5449]/40 shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-3 text-[#ff5449]">
            <span className="material-symbols-outlined text-3xl">gavel</span>
            <div>
              <h2 className="text-xl font-bold text-[#ffb4ab]">
                Anti-Cheat &amp; 1-Minute Lockout Rule
              </h2>
              <span className="text-xs text-[#ffb4ab]/80 font-mono">AUTOMATED VIOLATION PENALTY</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#b9cacb] leading-relaxed">
            During an active examination session, the platform locks the candidate's browser window. Any interaction with external navigation or forbidden buttons is treated as an integrity violation:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#171f33] border border-[#ff5449]/30 text-[#ffb4ab] space-y-1">
              <span className="font-bold block text-[#ff5449]">1. Forbidden Button Click Detection:</span>
              <p className="text-[#dae2fd]/80">
                Attempting to click header tabs, switch views, or trigger outside action buttons while an exam is locked immediately invokes the security trigger.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171f33] border border-[#ff5449]/30 text-[#ffb4ab] space-y-1">
              <span className="font-bold block text-[#ff5449]">2. Mandatory 1-Minute (60s) Account Block:</span>
              <p className="text-[#dae2fd]/80">
                The interface enters lockdown mode with a real-time 60-second countdown timer. All controls remain inaccessible until the penalty expires.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171f33] border border-[#ff5449]/30 text-[#ffb4ab] space-y-1">
              <span className="font-bold block text-[#ff5449]">3. Automatic Disqualification:</span>
              <p className="text-[#dae2fd]/80">
                The examinee is marked as <strong>DISQUALIFIED</strong> in the global Leaderboard Dashboard, zeroing out candidate tokens and logging the violation timestamp.
              </p>
            </div>
          </div>
        </div>

        {/* 30-Minute Minimum Timer & Answer Shielding */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#131b2e] border border-[#00f0ff]/40 shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-3 text-[#00f0ff]">
            <span className="material-symbols-outlined text-3xl">timer</span>
            <div>
              <h2 className="text-xl font-bold text-[#dbfcff]">
                30-Minute Minimum &amp; Database Shield
              </h2>
              <span className="text-xs text-[#7df4ff] font-mono">TIME RECORDING &amp; PRIVACY</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#b9cacb] leading-relaxed">
            The assessment measures exact time taken while maintaining strict separation of questions and answer keys:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#171f33] border border-[#00f0ff]/30 text-[#dbfcff] space-y-1">
              <span className="font-bold block text-[#00f0ff]">1. 30-Minute Minimum Standard (1800s):</span>
              <p className="text-[#dae2fd]/80">
                The assessment is designed for a minimum duration of 30 minutes. The timer counts every second spent and records the candidate's exact total time to the central database.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171f33] border border-[#00f0ff]/30 text-[#dbfcff] space-y-1">
              <span className="font-bold block text-[#00f0ff]">2. Hidden Answer Keys in Database:</span>
              <p className="text-[#dae2fd]/80">
                Answer keys are never transmitted to the client application. All answer verification happens on the database engine.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171f33] border border-[#00f0ff]/30 text-[#dbfcff] space-y-1">
              <span className="font-bold block text-[#00f0ff]">3. Administrator Credentials:</span>
              <p className="text-[#dae2fd]/80">
                System administration and database inspection require login with username <strong className="text-[#00f0ff]">datascience@12</strong> and masked password <strong className="text-[#00f0ff]">saisrinivas@ds12</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

