import { useMemo, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { TileData } from '../types';

interface WordTileProps {
  tile: TileData;
  isDragging?: boolean;
  onTap?: () => void;
  draggable?: boolean;
}

const tileColors: Record<string, string> = {
  verb: 'bg-[#60A5FA] border-[#3B82F6] text-white shadow-blue-500/50',
  particle: 'bg-[#F472B6] border-[#EC4899] text-white shadow-pink-500/50',
  adjective: 'bg-[#34D399] border-[#10B981] text-white shadow-green-500/50',
  noun: 'bg-[#FBBF24] border-[#F59E0B] text-black shadow-yellow-500/50',
  grammar: 'bg-purple-600 border-purple-400 text-white shadow-purple-500/50',
};

export function WordTile({ tile, isDragging: externalIsDragging, onTap, draggable = true }: WordTileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tile.id,
    data: { tile },
  });

  const style = useMemo(() => ({
    transform: CSS.Translate.toString(transform),
  }), [transform]);

  const colorClass = tileColors[tile.type] ?? 'bg-gray-600 border-gray-400 text-white';
  const isBeingDragged = isDragging || externalIsDragging;

  // pointer-based tap detection to avoid triggering during drag
  const pointerDownX = useRef<number | null>(null);
  const pointerDownY = useRef<number | null>(null);
  const pointerDownTime = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerDownX.current = e.clientX;
    pointerDownY.current = e.clientY;
    pointerDownTime.current = Date.now();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!onTap) return;
    if (pointerDownX.current == null || pointerDownY.current == null || pointerDownTime.current == null) return;
    const dx = Math.abs(e.clientX - pointerDownX.current);
    const dy = Math.abs(e.clientY - pointerDownY.current);
    const dt = Date.now() - pointerDownTime.current;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // treat as tap if short and little movement
    if (distance < 8 && dt < 300 && !isBeingDragged) {
      onTap();
    }
    pointerDownX.current = pointerDownY.current = pointerDownTime.current = null;
  };

  // Capture-phase handler: run before other pointer handlers (helps when dnd-kit
  // attaches listeners that can swallow clicks). It will trigger the tap
  // behavior early for small movements.
  const onPointerUpCapture = (e: React.PointerEvent) => {
    if (!onTap) return;
    if (pointerDownX.current == null || pointerDownY.current == null || pointerDownTime.current == null) return;
    const dx = Math.abs(e.clientX - pointerDownX.current);
    const dy = Math.abs(e.clientY - pointerDownY.current);
    const dt = Date.now() - pointerDownTime.current;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 8 && dt < 300 && !isBeingDragged) {
      // clear refs to avoid double-calling in bubble-phase
      pointerDownX.current = pointerDownY.current = pointerDownTime.current = null;
      onTap();
    }
  };

  const onClickFallback = () => {
    if (!onTap) return;
    if (!isBeingDragged) onTap();
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'manipulation' }}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerUpCapture={onPointerUpCapture}
      onClick={onClickFallback}
      role={onTap ? 'button' : undefined}
      tabIndex={0}
      aria-label={tile.text}
      animate={{ scale: isBeingDragged ? 1.1 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        inline-flex items-center justify-center
        px-4 py-3 rounded-xl border-2 ${draggable ? 'cursor-grab' : 'cursor-pointer'}
        font-medium text-sm select-none touch-manipulation
        shadow-lg ${colorClass}
        ${isBeingDragged ? 'opacity-50 z-50' : 'opacity-100'}
        hover:scale-105 transition-transform
        min-w-[4rem]
      `}
    >
      {tile.text}
    </motion.div>
  );
}