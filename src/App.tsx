import { useEffect, useMemo, useState } from 'react';
import lessonsData from './data/lessons.json';
import { LessonData } from './types';
import { useAppStore } from './store/useAppStore';
import { ModuleNav } from './components/ModuleNav';
import { FocusShroud } from './components/FocusShroud';
import { SentenceBuilder } from './components/SentenceBuilder';

const lessons = lessonsData as LessonData[];

export default function App() {
  const {
    currentModule,
    currentExerciseIndex,
    completedExercises,
    markComplete,
    nextExercise,
    loadProgress,
  } = useAppStore();

  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const moduleLessons = useMemo(
    () => lessons.filter((l) => l.category === currentModule),
    [currentModule]
  );

  const allExercises = useMemo(
    () => moduleLessons.flatMap((l) => l.exercises),
    [moduleLessons]
  );

  const currentLesson = useMemo(() => {
    let exerciseCount = 0;
    for (const lesson of moduleLessons) {
      exerciseCount += lesson.exercises.length;
      if (exerciseCount > currentExerciseIndex) {
        return lesson;
      }
    }
    return moduleLessons[moduleLessons.length - 1] ?? null;
  }, [moduleLessons, currentExerciseIndex]);

  const currentExercise = allExercises[currentExerciseIndex] ?? null;

  const totalExercises = allExercises.length;
  const completedInModule = allExercises.filter((e) => completedExercises.includes(e.id)).length;
  const progressPct = totalExercises > 0 ? (completedInModule / totalExercises) * 100 : 0;

  const handleComplete = (exerciseId: string) => {
    markComplete(exerciseId);
  };

  const handleNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      nextExercise();
      setShowExplanation(false);
    }
  };

  const isModuleComplete = completedInModule === totalExercises && totalExercises > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <FocusShroud />

      <header className="sticky top-0 z-30 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white">
                🌸 日本語 Grammar Sandbox
              </h1>
              <p className="text-xs text-gray-400">Nihongemu — Learn Japanese Grammar</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Progress</p>
              <p className="text-sm font-semibold text-indigo-400">
                {completedInModule}/{totalExercises}
              </p>
            </div>
          </div>

          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <ModuleNav />

        {currentLesson && (
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-indigo-400 font-medium mb-1">
                  {currentLesson.grammarPoint}
                </p>
                <h2 className="text-lg font-bold text-white">{currentLesson.title}</h2>
              </div>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex-shrink-0 text-xs px-3 py-1 bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 rounded-full transition-colors"
              >
                {showExplanation ? '📖 Hide' : '📖 Explain'}
              </button>
            </div>

            {showExplanation && (
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                {currentLesson.explanation}
              </p>
            )}
          </div>
        )}

        {currentExercise ? (
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400">
                Exercise {currentExerciseIndex + 1} of {totalExercises}
              </p>
            </div>
            <SentenceBuilder
              key={currentExercise.id}
              exercise={currentExercise}
              onComplete={handleComplete}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                disabled={currentExerciseIndex >= totalExercises - 1}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${currentExerciseIndex < totalExercises - 1
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                Next →
              </button>
            </div>
          </div>
        ) : isModuleComplete ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <p className="text-5xl mb-4">🎊</p>
            <h3 className="text-xl font-bold text-white mb-2">Module Complete!</h3>
            <p className="text-gray-400 text-sm">
              You have completed all exercises in this module.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No exercises available for this module.</p>
          </div>
        )}
      </main>
    </div>
  );
}