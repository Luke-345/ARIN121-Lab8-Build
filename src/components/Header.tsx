import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onResetToSetup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onResetToSetup }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={onResetToSetup}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          title="Go to Setup"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
              Study Notes Quiz Generator
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Turn any study material into instant 3-question mastery tests
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              currentView === 'setup'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : currentView === 'quiz'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentView === 'setup'
                  ? 'bg-indigo-600'
                  : currentView === 'quiz'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            />
            {currentView === 'setup' && '1. Setup Notes'}
            {currentView === 'quiz' && '2. Active Quiz'}
            {currentView === 'results' && '3. Quiz Results'}
          </span>
        </div>
      </div>
    </header>
  );
};
