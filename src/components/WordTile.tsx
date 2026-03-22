import { useMemo } from 'react';
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
  let pointerDownX: number | null = null;
  let pointerDownY: number | null = null;
  let pointerDownTime: number | null = null;

  const onPointerDown = (e: React.PointerEvent) => {
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownTime = Date.now();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!onTap) return;
    if (pointerDownX == null || pointerDownY == null || pointerDownTime == null) return;
    const dx = Math.abs(e.clientX - pointerDownX);
    const dy = Math.abs(e.clientY - pointerDownY);
    const dt = Date.now() - pointerDownTime;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // treat as tap if short and little movement
    if (distance < 8 && dt < 300 && !isBeingDragged) {
      onTap();
    }
    pointerDownX = pointerDownY = pointerDownTime = null;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'manipulation' }}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
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