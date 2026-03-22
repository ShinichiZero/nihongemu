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
            className="fixed inset-0 bg-pink-200/40 backdrop-blur-md z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>
      <button
        onClick={toggleFocusMode}
        className={`
          fixed top-4 right-4 z-[60] px-4 py-2 rounded-full
          text-sm font-extrabold transition-transform duration-300 hover:scale-105 active:scale-95
          ${focusMode
            ? 'bg-pink-400 text-white shadow-[0_4px_15px_rgba(244,114,182,0.6)]'
            : 'bg-white text-pink-500 hover:bg-pink-50 border-2 border-pink-200 shadow-md'
          }
        `}
      >
        {focusMode ? '🌸 Unfocus' : '✨ Focus Mode'}
      </button>
    </>
  );
}