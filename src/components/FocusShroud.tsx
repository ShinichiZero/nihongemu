import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export function FocusShroud() {
  const { focusMode, toggleFocusMode } = useAppStore();

  return (
    <>
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>
      <button
        onClick={toggleFocusMode}
        className={`
          fixed top-4 right-4 z-50 px-4 py-2 rounded-full
          text-sm font-semibold transition-all duration-200
          ${focusMode
            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
            : 'bg-gray-700 text-white hover:bg-gray-600'
          }
          shadow-lg
        `}
      >
        {focusMode ? '🌟 Focus ON' : '🔆 Focus Mode'}
      </button>
    </>
  );
}