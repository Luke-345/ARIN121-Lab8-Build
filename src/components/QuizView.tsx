import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, ArrowLeft, Send, AlertTriangle } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  selectedAnswers: Record<number, number>;
  onSelectAnswer: (questionIndex: number, optionIndex: number) => void;
  onSubmitAnswers: () => void;
  onBackToNotes: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  selectedAnswers,
  onSelectAnswer,
  onSubmitAnswers,
  onBackToNotes,
}) => {
  const [attemptedSubmitWithoutAll, setAttemptedSubmitWithoutAll] = useState(false);

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;
  const allAnswered = answeredCount === totalQuestions;

  const handleSubmit = () => {
    if (!allAnswered) {
      setAttemptedSubmitWithoutAll(true);
      return;
    }
    onSubmitAnswers();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Quiz Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBackToNotes}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Study Notes
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Progress:
          </span>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700 shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                allAnswered ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {answeredCount} of {totalQuestions} answered
            </span>
          </div>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 mb-6 text-slate-700">
        <h2 className="text-base font-bold text-indigo-950">
          Knowledge Check: 3 Questions
        </h2>
        <p className="text-xs text-indigo-900/80 mt-1">
          Select one option for each question using the radio buttons below. Your selections will remain visible as you take the quiz.
        </p>
      </div>

      {/* 3 Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const isSelected = selectedAnswers[qIndex] !== undefined;
          const currentSelected = selectedAnswers[qIndex];
          const isMissingAnswer = attemptedSubmitWithoutAll && !isSelected;

          return (
            <div
              key={q.id || `q-${qIndex}`}
              className={`bg-white rounded-2xl border transition-all shadow-xs p-6 ${
                isMissingAnswer
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : isSelected
                  ? 'border-indigo-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-700">
                  Question {qIndex + 1} of {totalQuestions}
                </span>

                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Answered
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Awaiting response
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-5">
                {q.question}
              </h3>

              {/* Multiple Choice Radio Options */}
              <div
                className="space-y-2.5"
                role="radiogroup"
                aria-label={`Options for question ${qIndex + 1}`}
              >
                {q.options.map((option, optIndex) => {
                  const isOptionChecked = currentSelected === optIndex;
                  const inputId = `question-${qIndex}-option-${optIndex}`;

                  return (
                    <label
                      key={inputId}
                      htmlFor={inputId}
                      className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border text-sm cursor-pointer transition-all ${
                        isOptionChecked
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500/20 font-medium'
                          : 'border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      {/* Radio button */}
                      <div className="flex items-center h-5 pt-0.5">
                        <input
                          type="radio"
                          id={inputId}
                          name={`question-${qIndex}`}
                          value={optIndex}
                          checked={isOptionChecked}
                          onChange={() => {
                            onSelectAnswer(qIndex, optIndex);
                            if (attemptedSubmitWithoutAll) {
                              setAttemptedSubmitWithoutAll(false);
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                        />
                      </div>

                      {/* Option Letter Badge */}
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                          isOptionChecked
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {OPTION_LETTERS[optIndex]}
                      </span>

                      {/* Option Text */}
                      <span className="flex-1 leading-relaxed">
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Warning if missed */}
              {isMissingAnswer && (
                <p className="text-xs font-semibold text-rose-600 mt-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Please select an option for Question {qIndex + 1}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Submission Section */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Ready to see how you scored?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {allAnswered
                ? 'All 3 questions answered! Click submit to calculate your score and review explanations.'
                : `You have answered ${answeredCount} of ${totalQuestions} questions. Please complete all questions before submitting.`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:shadow cursor-pointer'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Submit Answers</span>
          </button>
        </div>

        {attemptedSubmitWithoutAll && !allAnswered && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Please select an answer for all 3 questions before submitting.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
