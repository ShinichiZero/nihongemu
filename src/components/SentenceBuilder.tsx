import { useState, useCallback, useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ExerciseData, TileData } from '../types';
import { WordTile } from './WordTile';
import { GrammarSlot } from './GrammarSlot';
import { FeedbackOverlay } from './FeedbackOverlay';
import { validateSameSubjectBa } from '../utils/sanitize';

interface SentenceBuilderProps {
  exercise: ExerciseData;
  onComplete: (exerciseId: string) => void;
}

export function SentenceBuilder({ exercise, onComplete }: SentenceBuilderProps) {
  const [slotFillings, setSlotFillings] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [activeTile, setActiveTile] = useState<TileData | null>(null);

  const tileMap = useMemo(
    () => new Map<string, TileData>(exercise.tiles.map((t) => [t.id, t])),
    [exercise.tiles]
  );

  const usedTileIds = new Set(Object.values(slotFillings));
  const availableTiles = exercise.tiles.filter((t) => !usedTileIds.has(t.id));

  // Detect touch devices and enable tap-to-select behavior there.
  const isTouchDevice = typeof navigator !== 'undefined' && (
    (navigator as any).maxTouchPoints > 0 || 'ontouchstart' in window
  );
  const tapToSelect = isTouchDevice;

  const handleTileTap = useCallback((tile: TileData) => {
    // Place tapped tile into first empty slot (mobile-friendly)
    setSlotFillings((prev) => {
      const empty = exercise.slots.find((s) => !prev[s.id]);
      if (!empty) return prev;
      const updated = { ...prev };
      // ensure tile isn't placed elsewhere
      for (const [sid, tid] of Object.entries(updated)) {
        if (tid === tile.id) delete updated[sid];
      }
      updated[empty.id] = tile.id;
      return updated;
    });
  }, [exercise.slots]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const tileId = event.active.id as string;
    const tile = tileMap.get(tileId);
    if (tile) setActiveTile(tile);
  }, [tileMap]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTile(null);
    const { active, over } = event;
    if (!over) return;

    const tileId = active.id as string;
    const slotId = over.id as string;

    const isValidSlot = exercise.slots.some((s) => s.id === slotId);
    if (!isValidSlot) return;

    setSlotFillings((prev) => {
      const updated = { ...prev };
      for (const [sid, tid] of Object.entries(updated)) {
        if (tid === tileId) {
          delete updated[sid];
        }
      }
      if (updated[slotId]) {
        delete updated[slotId];
      }
      updated[slotId] = tileId;
      return updated;
    });
  }, [exercise.slots]);

  const handleSubmit = useCallback(() => {
    const allFilled = exercise.slots.every((s) => slotFillings[s.id]);
    if (!allFilled) return;

    const sortedSlots = [...exercise.slots].sort((a, b) => a.order - b.order);
    const userAnswer = sortedSlots.map((s) => slotFillings[s.id]);
    const correct = JSON.stringify(userAnswer) === JSON.stringify(exercise.solution);

    const hasSubjectiveEnding = exercise.solution.some((tileId) => {
      const tile = tileMap.get(tileId);
      return tile ? (tile.text.includes('たい') || tile.text.includes('てください')) : false;
    });

    const validation = validateSameSubjectBa(
      exercise.sameSubject,
      exercise.conditionalType,
      hasSubjectiveEnding
    );

    if (!validation.valid) {
      setWarning(validation.warning);
    }

    setIsCorrect(correct);
    setSubmitted(true);
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      onComplete(exercise.id);
    }
  }, [exercise, slotFillings, tileMap, onComplete]);

  const handleReset = useCallback(() => {
    setSlotFillings({});
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback(null);
    setWarning(null);
  }, []);

  const allFilled = exercise.slots.every((s) => slotFillings[s.id]);
  const sortedSlots = [...exercise.slots].sort((a, b) => a.order - b.order);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Translate to Japanese:</p>
          <p className="text-white text-xl font-semibold">{exercise.prompt}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-800/50 rounded-2xl min-h-[4rem] items-center">
          {sortedSlots.map((slot) => (
            <GrammarSlot
              key={slot.id}
              slot={slot}
              occupiedTile={slotFillings[slot.id] ? tileMap.get(slotFillings[slot.id]) : undefined}
              isCorrect={submitted && isCorrect}
              isError={submitted && !isCorrect}
            />
          ))}
        </div>

        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-yellow-900/50 border border-yellow-500/50 rounded-xl text-yellow-300 text-sm"
          >
            {warning}
          </motion.div>
        )}

        <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-700/30 rounded-2xl min-h-[4rem] items-center">
          {availableTiles.map((tile) => (
            <WordTile
              key={tile.id}
              tile={tile}
              onTap={tapToSelect ? () => handleTileTap(tile) : undefined}
              draggable={!tapToSelect}
            />
          ))}
          {availableTiles.length === 0 && (
            <p className="text-gray-500 text-sm">All tiles placed!</p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            🔄 Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={!allFilled || submitted}
            className={`
              px-6 py-2 rounded-xl text-sm font-semibold transition-all
              ${allFilled && !submitted
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            ✅ Check Answer
          </button>
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-3 rounded-xl ${
              isCorrect
                ? 'bg-green-900/50 border border-green-500/50 text-green-300'
                : 'bg-red-900/50 border border-red-500/50 text-red-300'
            }`}
          >
            {isCorrect ? '🌸 Correct! Wonderful! 素晴らしい！' : '❌ Not quite. Try again!'}
          </motion.div>
        )}
      </div>

      <DragOverlay>
        {activeTile && (
          <WordTile tile={activeTile} isDragging={true} />
        )}
      </DragOverlay>

      <FeedbackOverlay type={feedback} onDone={() => setFeedback(null)} />
    </DndContext>
  );
}