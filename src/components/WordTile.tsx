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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      onClick={!draggable && onTap ? onTap : undefined}
      animate={{ scale: isBeingDragged ? 1.1 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        inline-flex items-center justify-center
        px-3 py-2 rounded-xl border-2 ${draggable ? 'cursor-grab' : (onTap ? 'cursor-pointer' : '')}
        font-medium text-sm select-none
        shadow-lg ${colorClass}
        ${isBeingDragged ? 'opacity-50 z-50' : 'opacity-100'}
        hover:scale-105 transition-transform
        min-w-[3rem]
      `}
    >
      {tile.text}
    </motion.div>
  );
}