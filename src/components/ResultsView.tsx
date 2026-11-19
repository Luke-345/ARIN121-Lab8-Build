import React from 'react';
import { QuizQuestion } from '../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Lightbulb,
  Check,
} from 'lucide-react';

interface ResultsViewProps {
  questions: QuizQuestion[];
  selectedAnswers: Record<number, number>;
  onRetakeQuiz: () => void;
  onGenerateNewQuiz: () => void;
  onEditNotes: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const ResultsView: React.FC<ResultsViewProps> = ({
  questions,
  selectedAnswers,
  onRetakeQuiz,
  onGenerateNewQuiz,
  onEditNotes,
}) => {
  // Calculate score
  let score = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      score += 1;
    }
  });

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  const getScoreSummary = () => {
    if (score === 3) {
      return {
        title: 'Perfect Score! 🌟',
        subtitle: 'Outstanding comprehension! You nailed every question based on your notes.',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cardBg: 'from-emerald-500/10 to-teal-500/5 border-emerald-200',
      };
    }
    if (score === 2) {
      return {
        title: 'Great Job! 📚',
        subtitle: 'Strong understanding! Review the explanation for the missed question below.',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
        cardBg: 'from-blue-500/10 to-indigo-500/5 border-blue-200',
      };
    }
    return {
      title: 'Keep Practicing! 💪',
      subtitle: 'Review the explanations below to reinforce your understanding of these notes.',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      cardBg: 'from-amber-500/10 to-orange-500/5 border-amber-200',
    };
  };

  const summary = getScoreSummary();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Score Results Hero Banner */}
      <div
        className={`rounded-2xl border bg-gradient-to-br ${summary.cardBg} bg-white p-6 sm:p-8 shadow-sm mb-8`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${summary.badgeBg} mb-3`}
            >
              <Award className="w-3.5 h-3.5" />
              Quiz Complete
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {summary.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 max-w-lg leading-relaxed">
              {summary.subtitle}
            </p>
          </div>

          <div className="flex items-center sm:flex-col items-start sm:items-end gap-3 sm:gap-1 bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Calculated Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {score}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400">
                / {total}
              </span>
            </div>
            <span className="text-xs font-semibold text-indigo-600 sm:mt-1">
              {percentage}% accuracy
            </span>
          </div>
        </div>

        {/* Action buttons on hero */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-200/60">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Retake Quiz
          </button>

          <button
            type="button"
            onClick={onGenerateNewQuiz}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate New Quiz from Notes
          </button>

          <button
            type="button"
            onClick={onEditNotes}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors ml-auto cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            Edit Study Notes
          </button>
        </div>
      </div>

      {/* Detailed Question Review with Explanations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Question Review & Explanations
          </h3>
          <span className="text-xs text-slate-500">
            {score} of {total} correct
          </span>
        </div>

        {questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[qIndex];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id || `result-q-${qIndex}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 overflow-hidden"
            >
              {/* Question Header & Outcome Status */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question {qIndex + 1} of {total}
                </span>

                {isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Correct (+1)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Incorrect
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-4">
                {q.question}
              </h4>

              {/* Options breakdown */}
              <div className="space-y-2 mb-5">
                {q.options.map((option, optIndex) => {
                  const isUserSelection = userAnswer === optIndex;
                  const isActualCorrect = q.correctIndex === optIndex;

                  let optionStyle =
                    'border-slate-200 bg-white text-slate-600 opacity-80';
                  let badgeStyle = 'bg-slate-100 text-slate-500';

                  if (isActualCorrect) {
                    optionStyle =
                      'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500/20 opacity-100';
                    badgeStyle = 'bg-emerald-600 text-white';
                  } else if (isUserSelection && !isCorrect) {
                    optionStyle =
                      'border-rose-300 bg-rose-50/70 text-rose-950 line-through opacity-90';
                    badgeStyle = 'bg-rose-600 text-white';
                  }

                  return (
                    <div
                      key={optIndex}
                      className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-sm transition-all ${optionStyle}`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${badgeStyle}`}
                        >
                          {OPTION_LETTERS[optIndex]}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </div>

                      {/* Status indicator tags */}
                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold">
                        {isActualCorrect && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" />
                            Correct Answer
                          </span>
                        )}
                        {isUserSelection && !isActualCorrect && (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
                            Your Choice
                          </span>
                        )}
                        {isUserSelection && isActualCorrect && (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md font-bold">
                            Your Choice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Area */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Explanation
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky-like Action Footer */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onRetakeQuiz}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          Retake This Quiz
        </button>
        <button
          type="button"
          onClick={onGenerateNewQuiz}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Quiz
        </button>
      </div>
    </div>
  );
};
