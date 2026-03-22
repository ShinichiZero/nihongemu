import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | null;
  onDone: () => void;
}

function playBeep(frequency: number, duration: number, type: 'correct' | 'wrong') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    } else {
      oscillator.frequency.setValueAtTime(220, ctx.currentTime);
      oscillator.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function FeedbackOverlay({ type, onDone }: FeedbackOverlayProps) {
  useEffect(() => {
    if (!type) return;

    if (type === 'correct') {
      playBeep(523, 0.2, 'correct');
    } else {
      playBeep(220, 0.3, 'wrong');
    }

    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [type, onDone]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          {type === 'correct' ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-8xl"
            >
              ✨🎉✨
            </motion.div>
          ) : (
            <motion.div
              animate={{ x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="text-8xl"
            >
              ❌
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}