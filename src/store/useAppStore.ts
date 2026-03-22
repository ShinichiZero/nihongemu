import { create } from 'zustand';

interface AppState {
  currentModule: string;
  currentExerciseIndex: number;
  progress: Record<string, boolean>;
  focusMode: boolean;
  completedExercises: string[];
  setModule: (module: string) => void;
  nextExercise: () => void;
  markComplete: (exerciseId: string) => void;
  toggleFocusMode: () => void;
  loadProgress: () => void;
  saveProgress: () => void;
}

const STORAGE_KEY = 'nihongemu_progress';

export const useAppStore = create<AppState>((set, get) => ({
  currentModule: 'intentions',
  currentExerciseIndex: 0,
  progress: Object.create(null) as Record<string, boolean>,
  focusMode: false,
  completedExercises: [],

  setModule: (module: string) => {
    set({ currentModule: module, currentExerciseIndex: 0 });
  },

  nextExercise: () => {
    set((state) => ({ currentExerciseIndex: state.currentExerciseIndex + 1 }));
  },

  markComplete: (exerciseId: string) => {
    const state = get();
    if (!state.completedExercises.includes(exerciseId)) {
      const newCompleted = [...state.completedExercises, exerciseId];
      const newProgress = Object.assign(Object.create(null), state.progress, {
        [exerciseId]: true,
      }) as Record<string, boolean>;
      set({ completedExercises: newCompleted, progress: newProgress });
      get().saveProgress();
    }
  },

  toggleFocusMode: () => {
    set((state) => ({ focusMode: !state.focusMode }));
  },

  loadProgress: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const ids = parsed.filter((item): item is string => typeof item === 'string');
          const progress = Object.create(null) as Record<string, boolean>;
          for (const id of ids) {
            progress[id] = true;
          }
          set({ completedExercises: ids, progress });
        }
      }
    } catch {
      // ignore localStorage errors
    }
  },

  saveProgress: () => {
    try {
      const { completedExercises } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedExercises));
    } catch {
      // ignore localStorage errors
    }
  },
}));