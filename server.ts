import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Fallback generator for resilient offline/fallback operation
function generateFallbackQuiz(notes: string): QuizQuestion[] {
  const sentences = notes
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  const fallbackQuestions: QuizQuestion[] = [];

  if (sentences.length >= 3) {
    for (let i = 0; i < 3; i++) {
      const sentence = sentences[i];
      const words = sentence.split(/\s+/).filter(w => w.length > 4);
      const targetWord = words.length > 0 ? words[Math.floor(words.length / 2)].replace(/[^a-zA-Z0-9]/g, '') : 'concept';
      const questionText = sentence.replace(new RegExp(`\\b${targetWord}\\b`, 'i'), '_______');

      fallbackQuestions.push({
        id: `q-${i + 1}`,
        question: `Based on your study notes, complete the statement: "${questionText}"`,
        options: [
          targetWord,
          `Alternative ${targetWord} hypothesis`,
          `Unrelated general factor`,
          `Secondary observation`,
        ],
        correctIndex: 0,
        explanation: `According to your notes: "${sentence}". The key concept here is ${targetWord}.`,
      });
    }
  } else {
    fallbackQuestions.push(
      {
        id: 'q-1',
        question: 'According to the provided study notes, what is the central theme being discussed?',
        options: [
          'The core principles and facts stated directly in the notes',
          'An unrelated historical methodology',
          'A theoretical model not referenced in the text',
          'A critique disproving the primary thesis',
        ],
        correctIndex: 0,
        explanation: 'The provided notes concentrate primarily on the factual principles and statements supplied.',
      },
      {
        id: 'q-2',
        question: 'Which of the following aligns best with the details outlined in your notes?',
        options: [
          'The specific definitions and points highlighted in the input',
          'Contradictory assumptions not supported by the notes',
          'Speculative outcomes without textual grounding',
          'None of the above',
        ],
        correctIndex: 0,
        explanation: 'The notes present key definitions and structured assertions confirming this point.',
      },
      {
        id: 'q-3',
        question: 'How should the key insights from these study notes be applied?',
        options: [
          'By understanding the foundational relationships and facts described',
          'By disregarding the empirical details provided',
          'By assuming opposite conclusions without verification',
          'Only in unrelated academic scenarios',
        ],
        correctIndex: 0,
        explanation: 'Effective study relies on synthesizing the core relationships and facts described in the text.',
      }
    );
  }

  return fallbackQuestions;
}

// POST endpoint to generate 3 questions from study notes
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  const { notes } = req.body;

  if (!notes || typeof notes !== 'string' || notes.trim().length < 15) {
    return res.status(400).json({
      error: 'Please provide at least 15 characters of study notes to generate a quiz.',
    });
  }

  const trimmedNotes = notes.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing. Using heuristic quiz generation fallback.');
    const fallbackQuiz = generateFallbackQuiz(trimmedNotes);
    return res.json({
      questions: fallbackQuiz,
      source: 'fallback',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an expert tutor and educational assessment specialist.
Carefully review the following study notes provided by a learner:
"""
${trimmedNotes}
"""

Generate exactly 3 high-quality multiple-choice questions directly based on the key facts, concepts, definitions, or mechanisms in these notes.

Requirements for each question:
1. Exactly 4 clear, plausible options (A, B, C, D).
2. Exactly one option must be unambiguously correct according to the notes.
3. The remaining 3 options should be plausible distractors (not silly or "All of the above").
4. "correctIndex" must be the 0-based integer index of the correct option (0, 1, 2, or 3). Shuffle where the correct index lands so it is not always 0.
5. "explanation" must be a concise (1 to 2 sentences) educational explanation explaining why the correct answer is right and citing/referencing the specific insight from the notes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an educational quiz engine. You generate strictly structured multiple-choice questions from provided text notes.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: 'Array of exactly 3 multiple choice questions.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Unique question id, e.g. q-1, q-2, q-3' },
                  question: { type: Type.STRING, description: 'The question text' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exactly 4 distinct multiple choice answer options'
                  },
                  correctIndex: { type: Type.INTEGER, description: 'Zero-based index (0 to 3) of the correct option' },
                  explanation: { type: Type.STRING, description: 'Brief explanation of why the correct option is right' }
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation']
              }
            }
          },
          required: ['questions']
        }
      }
    });

    const rawText = response.text?.trim() || '{}';
    const parsed = JSON.parse(rawText);

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Invalid schema returned from model');
    }

    // Ensure exactly 3 questions
    const formattedQuestions: QuizQuestion[] = parsed.questions.slice(0, 3).map((q: any, idx: number) => ({
      id: q.id || `q-${idx + 1}`,
      question: q.question,
      options: Array.isArray(q.options) && q.options.length >= 4 ? q.options.slice(0, 4) : ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0,
      explanation: q.explanation || 'Based on the provided study notes.',
    }));

    // If fewer than 3 were returned for any reason, pad with fallback
    if (formattedQuestions.length < 3) {
      const fallbacks = generateFallbackQuiz(trimmedNotes);
      while (formattedQuestions.length < 3) {
        formattedQuestions.push(fallbacks[formattedQuestions.length]);
      }
    }

    return res.json({
      questions: formattedQuestions,
      source: 'gemini',
    });
  } catch (err: any) {
    console.error('Gemini generation error:', err);
    // Return graceful fallback so user experience is uninterrupted
    const fallbackQuiz = generateFallbackQuiz(trimmedNotes);
    return res.json({
      questions: fallbackQuiz,
      source: 'fallback',
      warning: 'Generated using local note analysis due to a temporary service disruption.',
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
