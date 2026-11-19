/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppView, QuizQuestion } from './types';
import { Header } from './components/Header';
import { SetupView } from './components/SetupView';
import { QuizView } from './components/QuizView';
import { ResultsView } from './components/ResultsView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('setup');
  const [notes, setNotes] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    if (!notes.trim() || notes.trim().length < 15) {
      setErrorMessage('Please enter at least 15 characters of study notes to generate a quiz.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No quiz questions could be generated from these notes. Please try adding more detail.');
      }

      setQuestions(data.questions);
      setSelectedAnswers({});
      setCurrentView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setErrorMessage(
        err.message || 'An error occurred while generating the quiz. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitAnswers = () => {
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditNotes = () => {
    setCurrentView('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Header
        currentView={currentView}
        onResetToSetup={() => {
          if (currentView !== 'setup') {
            handleEditNotes();
          }
        }}
      />

      <main className="flex-1">
        {currentView === 'setup' && (
          <SetupView
            notes={notes}
            onChangeNotes={(val) => {
              setNotes(val);
              if (errorMessage) setErrorMessage(null);
            }}
            onGenerateQuiz={handleGenerateQuiz}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            questions={questions}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
            onSubmitAnswers={handleSubmitAnswers}
            onBackToNotes={handleEditNotes}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            questions={questions}
            selectedAnswers={selectedAnswers}
            onRetakeQuiz={handleRetakeQuiz}
            onGenerateNewQuiz={handleGenerateQuiz}
            onEditNotes={handleEditNotes}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-400">
        <p>Study Notes Quiz Generator • Active recall & spaced retrieval practice</p>
      </footer>
    </div>
  );
}
