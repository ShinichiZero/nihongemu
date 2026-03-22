import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { SlotData, TileData } from '../types';

interface GrammarSlotProps {
  slot: SlotData;
  occupiedTile?: TileData;
  isCorrect?: boolean;
  isError?: boolean;
  onRemove?: (slotId: string) => void;
}

export function GrammarSlot({ slot, occupiedTile, isCorrect, isError, onRemove }: GrammarSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id });

  const borderClass = isCorrect
    ? 'border-green-400 shadow-green-400/50 shadow-lg'
    : isError
    ? 'border-red-400 shadow-red-400/50 shadow-lg'
    : isOver
    ? 'border-blue-400 bg-blue-900/30'
    : occupiedTile
    ? 'border-white/50'
    : 'border-white/20 border-dashed';

  return (
    <div
      ref={setNodeRef}
      className={`
        relative inline-flex items-center justify-center
        min-w-[5rem] min-h-[2.5rem] px-3 py-2
        rounded-xl border-2 ${borderClass}
        transition-all duration-200
      `}
    >
      <AnimatePresence mode="wait">
        {occupiedTile ? (
          <motion.span
            key={occupiedTile.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1.2, 1], opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="text-sm font-medium text-white cursor-pointer"
            role={onRemove ? 'button' : undefined}
            tabIndex={onRemove ? 0 : undefined}
            onClick={onRemove ? () => onRemove(slot.id) : undefined}
            onKeyDown={onRemove ? (e) => { if (e.key === 'Enter' || e.key === ' ') onRemove(slot.id); } : undefined}
          >
            {occupiedTile.text}
            {isCorrect && (
              <span className="ml-1 text-green-400">✓</span>
            )}
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/30 text-sm"
          >
            ___
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}