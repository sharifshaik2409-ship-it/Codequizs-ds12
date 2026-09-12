import React, { useState, useEffect } from 'react';
import { QuestionItem, QuestionCategory, DifficultyLevel } from '../types';

interface QuestionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (q: QuestionItem) => void;
  initialQuestion?: QuestionItem | null;
  nextId: number;
}

export const QuestionDrawer: React.FC<QuestionDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
  nextId,
}) => {
  const [id, setId] = useState(nextId);
  const [cat, setCat] = useState<QuestionCategory>('Python');
  const [diff, setDiff] = useState<DifficultyLevel>('Easy');
  const [prompt, setPrompt] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [val, setVal] = useState(1);

  useEffect(() => {
    if (initialQuestion) {
      setId(initialQuestion.id);
      setCat(initialQuestion.cat);
      setDiff(initialQuestion.diff);
      setPrompt(initialQuestion.prompt);
      setOptA(initialQuestion.opts.A);
      setOptB(initialQuestion.opts.B);
      setOptC(initialQuestion.opts.C);
      setOptD(initialQuestion.opts.D);
      setCorrect(initialQuestion.correct);
      setVal(initialQuestion.val);
    } else {
      setId(nextId);
      setCat('Python');
      setDiff('Easy');
      setPrompt('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrect('A');
      setVal(1);
    }
  }, [initialQuestion, nextId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onSave({
      id,
      cat,
      diff,
      prompt: prompt.trim(),
      opts: {
        A: optA.trim() || 'Option A',
        B: optB.trim() || 'Option B',
        C: optC.trim() || 'Option C',
        D: optD.trim() || 'Option D',
      },
      correct,
      val: Math.max(1, val),
    });
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#131b2e] shadow-2xl z-50 flex flex-col border-l border-[#3b494b]/40">
      {/* Drawer Header */}
      <div className="p-6 bg-[#171f33] flex items-center justify-between border-b border-[#2d3449]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f0ff] text-[22px]">
            {initialQuestion ? 'edit_document' : 'add_circle'}
          </span>
          <h3 className="font-headline-md text-headline-md text-[#dbfcff]">
            {initialQuestion ? `Edit Question #${id}` : 'Add Question to Round 1'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded bg-[#222a3d] hover:bg-[#31394d] flex items-center justify-center text-[#dae2fd] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Drawer Form */}
      <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">Question ID</label>
            <input
              type="number"
              min="1"
              max="999"
              value={id}
              onChange={(e) => setId(parseInt(e.target.value, 10) || 1)}
              className="px-4 py-2 rounded bg-[#171f33] text-[#dbfcff] font-telemetry-md text-telemetry-md focus:outline-none focus:ring-1 focus:ring-[#00f0ff] border border-[#3b494b]/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">
              Category / Language
            </label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as QuestionCategory)}
              className="px-4 py-2 rounded bg-[#171f33] text-[#dae2fd] font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-[#00f0ff] border border-[#3b494b]/40 cursor-pointer"
            >
              <option value="Python">Python (Q1-12)</option>
              <option value="C">C (Q13-24)</option>
              <option value="C++">C++ (Q25-36)</option>
              <option value="Java">Java (Q37-48)</option>
              <option value="SQL">SQL (Q49-60)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">Difficulty Level</label>
          <div className="flex gap-4">
            {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => (
              <label key={d} className="flex items-center gap-1.5 font-body-sm text-body-sm cursor-pointer text-[#dae2fd]">
                <input
                  type="radio"
                  name="difficulty"
                  value={d}
                  checked={diff === d}
                  onChange={() => setDiff(d)}
                  className="accent-[#00f0ff]"
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">Question Prompt</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter algorithmic or conceptual prompt..."
            className="px-4 py-2 rounded bg-[#171f33] text-[#dae2fd] font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-[#00f0ff] border border-[#3b494b]/40"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">Options (A - D)</label>
          <div className="flex items-center gap-2">
            <span className="font-telemetry-sm text-telemetry-sm text-[#dbfcff] w-6">A:</span>
            <input
              type="text"
              value={optA}
              onChange={(e) => setOptA(e.target.value)}
              placeholder="Option A text"
              className="flex-1 px-4 py-1.5 rounded bg-[#171f33] text-[#dae2fd] font-body-sm text-body-sm border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-telemetry-sm text-telemetry-sm text-[#dbfcff] w-6">B:</span>
            <input
              type="text"
              value={optB}
              onChange={(e) => setOptB(e.target.value)}
              placeholder="Option B text"
              className="flex-1 px-4 py-1.5 rounded bg-[#171f33] text-[#dae2fd] font-body-sm text-body-sm border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-telemetry-sm text-telemetry-sm text-[#dbfcff] w-6">C:</span>
            <input
              type="text"
              value={optC}
              onChange={(e) => setOptC(e.target.value)}
              placeholder="Option C text"
              className="flex-1 px-4 py-1.5 rounded bg-[#171f33] text-[#dae2fd] font-body-sm text-body-sm border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-telemetry-sm text-telemetry-sm text-[#dbfcff] w-6">D:</span>
            <input
              type="text"
              value={optD}
              onChange={(e) => setOptD(e.target.value)}
              placeholder="Option D text"
              className="flex-1 px-4 py-1.5 rounded bg-[#171f33] text-[#dae2fd] font-body-sm text-body-sm border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">
              Correct Option Key
            </label>
            <select
              value={correct}
              onChange={(e) => setCorrect(e.target.value as 'A' | 'B' | 'C' | 'D')}
              className="px-4 py-2 rounded bg-[#171f33] text-[#7df4ff] font-telemetry-md text-telemetry-md focus:outline-none border border-[#3b494b]/40"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-telemetry-sm text-telemetry-sm text-[#b9cacb]">
              Token Award Value
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={val}
              onChange={(e) => setVal(parseInt(e.target.value, 10) || 1)}
              className="px-4 py-2 rounded bg-[#171f33] text-[#dbfcff] font-telemetry-md text-telemetry-md border border-[#3b494b]/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-auto pt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded bg-[#171f33] hover:bg-[#31394d] text-[#dae2fd] font-headline-sm text-body-md transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded bg-[#00f0ff] text-[#00363a] font-headline-sm text-body-md font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-95 transition-all cursor-pointer"
          >
            Commit Question
          </button>
        </div>
      </form>
    </div>
  );
};
