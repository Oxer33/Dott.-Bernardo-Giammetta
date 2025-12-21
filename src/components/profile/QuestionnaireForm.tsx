// =============================================================================
// QUESTIONNAIRE FORM - DOTT. BERNARDO GIAMMETTA
// Componente per compilare il questionario alimentare
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { QUESTIONS, SECTIONS, getTotalProgress, isQuestionnaireComplete } from '@/lib/questionnaire-data';

// =============================================================================
// TIPI
// =============================================================================

interface QuestionnaireFormProps {
  userEmail: string;
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function QuestionnaireForm({ userEmail }: QuestionnaireFormProps) {
  // State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Carica risposte salvate dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`questionnaire_${userEmail}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        // Errore parsing JSON - ignora risposte corrotte
      }
    }
  }, [userEmail]);

  // Salva automaticamente nel localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`questionnaire_${userEmail}`, JSON.stringify(answers));
    }
  }, [answers, userEmail]);

  // Domanda corrente
  const question = QUESTIONS[currentQuestion];
  const progress = getTotalProgress(answers);
  const isComplete = isQuestionnaireComplete(answers);

  // Gestione risposta
  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  // Navigazione
  const goToNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Salva questionario
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/user/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Trova sezione corrente
  const currentSection = SECTIONS.find(s => 
    question.id >= s.range[0] && question.id <= s.range[1]
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-sage-600 mb-2">
          <span>Progresso</span>
          <span>{progress}% completato</span>
        </div>
        <div className="h-3 bg-sage-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sage-400 to-sage-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card Domanda */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        {/* Header sezione */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <p className="text-sm text-sage-500">{currentSection?.name}</p>
            <p className="text-xs text-sage-400">
              Domanda {currentQuestion + 1} di {QUESTIONS.length}
            </p>
          </div>
        </div>

        {/* Domanda */}
        <h2 className="text-lg font-medium text-sage-900 mb-6 leading-relaxed">
          {question.text}
        </h2>

        {/* Input risposta */}
        {question.type === 'text' && (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Scrivi la tua risposta..."
            className="w-full px-4 py-3 rounded-xl border border-sage-200 
                     focus:border-sage-400 focus:ring-2 focus:ring-sage-100
                     outline-none text-sage-800 placeholder:text-sage-400"
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Scrivi la tua risposta in modo dettagliato..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-sage-200 
                     focus:border-sage-400 focus:ring-2 focus:ring-sage-100
                     outline-none text-sage-800 placeholder:text-sage-400 resize-none"
          />
        )}

        {question.type === 'radio' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  answers[question.id] === option
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-sage-200 hover:border-sage-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="mt-1 w-4 h-4 text-sage-600 focus:ring-sage-500"
                />
                <span className="text-sage-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && (
          <label className="flex items-start gap-3 p-4 rounded-xl border border-sage-200 cursor-pointer hover:border-sage-300 transition-all">
            <input
              type="checkbox"
              checked={answers[question.id] === 'true'}
              onChange={(e) => handleAnswerChange(e.target.checked ? 'true' : '')}
              className="mt-1 w-5 h-5 text-sage-600 focus:ring-sage-500 rounded"
            />
            <span className="text-sage-700">
              Autorizzo il trattamento dei dati personali
            </span>
          </label>
        )}

        {/* Navigazione */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-sage-100">
          <button
            onClick={goToPrev}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 text-sage-600 hover:text-sage-800 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Precedente
          </button>

          <div className="flex items-center gap-3">
            {/* Pulsante salva */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salva
            </button>

            {/* Pulsante avanti/invia */}
            {currentQuestion < QUESTIONS.length - 1 ? (
              <button
                onClick={goToNext}
                className="flex items-center gap-2 px-6 py-2 bg-sage-500 hover:bg-sage-600 
                         text-white rounded-xl font-medium transition-colors"
              >
                Avanti
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!isComplete || isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-sage-500 hover:bg-sage-600 
                         text-white rounded-xl font-medium transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Invio...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Invia Questionario
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Status salvataggio */}
        {saveStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Risposte salvate con successo!</span>
          </motion.div>
        )}

        {saveStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"
          >
            <AlertCircle className="w-5 h-5" />
            <span>Errore nel salvataggio. Le risposte sono salvate localmente.</span>
          </motion.div>
        )}
      </motion.div>

      {/* Jump to question */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-sm font-medium text-sage-700 mb-4">Vai alla domanda:</h3>
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                idx === currentQuestion
                  ? 'bg-sage-500 text-white'
                  : answers[q.id]
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
              }`}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
