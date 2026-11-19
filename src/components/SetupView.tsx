import React from 'react';
import { Sparkles, Trash2, BookText, AlertCircle, Loader2 } from 'lucide-react';

interface SetupViewProps {
  notes: string;
  onChangeNotes: (value: string) => void;
  onGenerateQuiz: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const SAMPLE_NOTES = [
  {
    title: 'Photosynthesis',
    content:
      'Photosynthesis is the biological process by which green plants, algae, and cyanobacteria convert light energy into chemical energy. In plants, the process takes place in the chloroplasts, specifically utilizing the green pigment chlorophyll. Light-dependent reactions occur in the thylakoid membranes, splitting water molecules into oxygen gas, protons, and electrons while producing ATP and NADPH. The light-independent reactions (Calvin cycle) take place in the stroma, using ATP and NADPH to fix carbon dioxide into glucose and other essential sugars.',
  },
  {
    title: "Newton's Laws of Motion",
    content:
      "Sir Isaac Newton established three foundational laws of classical mechanics in 1687. The First Law (Law of Inertia) states that an object at rest stays at rest, and an object in uniform motion stays in uniform motion unless acted upon by an external net force. The Second Law states that the force acting on an object equals its mass multiplied by its acceleration (F = ma), meaning acceleration is directly proportional to net force and inversely proportional to mass. The Third Law states that for every action, there is an equal and opposite reaction.",
  },
  {
    title: 'Cellular Mitosis',
    content:
      'Mitosis is a phase of the eukaryotic cell cycle in which replicated chromosomes are separated into two new identical nuclei. It consists of four primary stages: Prophase (chromatin condenses into visible chromosomes and the nuclear envelope begins to break down), Metaphase (chromosomes align along the equatorial metaphase plate guided by spindle fibers), Anaphase (sister chromatids are pulled apart to opposite poles of the cell), and Telophase (nuclear membranes reform around each set of daughter chromosomes). Cytokinesis follows, dividing the cytoplasm into two diploid daughter cells.',
  },
];

export const SetupView: React.FC<SetupViewProps> = ({
  notes,
  onChangeNotes,
  onGenerateQuiz,
  isLoading,
  errorMessage,
}) => {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;
  const isNotesValid = notes.trim().length >= 15;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* Title & Introduction */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
            <BookText className="w-3.5 h-3.5" />
            Step 1: Input Your Notes
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Paste Your Study Notes
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            Enter lecture notes, textbook excerpts, or revision summaries below.
            We will generate 3 targeted multiple-choice questions to test your comprehension.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Try a sample study topic:
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_NOTES.map((sample) => (
              <button
                key={sample.title}
                type="button"
                onClick={() => onChangeNotes(sample.content)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                + {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Box for Study Notes */}
        <div className="relative mb-3">
          <label htmlFor="study-notes-input" className="sr-only">
            Study Notes Text Box
          </label>
          <textarea
            id="study-notes-input"
            rows={10}
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            disabled={isLoading}
            placeholder="Paste your study notes here... For example: key definitions, scientific processes, historical dates, or main concepts you want to study."
            className="w-full rounded-xl border border-slate-300 p-4 text-slate-800 text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-y"
          />
        </div>

        {/* Counter and Clear action */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-slate-700">{wordCount}</strong> words
            </span>
            <span>•</span>
            <span>
              <strong className="text-slate-700">{charCount}</strong> characters
            </span>
          </div>
          {notes.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => onChangeNotes('')}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear notes
            </button>
          )}
        </div>

        {/* Error notification if applicable */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to generate quiz</p>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Generate Quiz Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {!isNotesValid && (
              <span className="text-amber-600 font-medium">
                Please paste at least a sentence of study notes to begin.
              </span>
            )}
            {isNotesValid && (
              <span className="text-emerald-600 font-medium">
                Ready to generate your 3-question quiz!
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onGenerateQuiz}
            disabled={!isNotesValid || isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              isNotesValid && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:shadow cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
