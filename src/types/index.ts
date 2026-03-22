export type TileType = 'verb' | 'particle' | 'adjective' | 'noun' | 'grammar';
export type ConditionalType = 'ba' | 'tara' | 'to' | 'none';
export type Category = 'intentions' | 'conditionals' | 'sensory' | 'comparisons' | 'experience';

export interface TileData {
  id: string;
  text: string;
  type: TileType;
}

export interface SlotData {
  id: string;
  accepts: TileType[];
  order: number;
}

export interface ExerciseData {
  id: string;
  prompt: string;
  tiles: TileData[];
  slots: SlotData[];
  solution: string[];
  sameSubject: boolean;
  conditionalType: ConditionalType;
}

export interface LessonData {
  id: string;
  grammarPoint: string;
  category: Category;
  title: string;
  explanation: string;
  exercises: ExerciseData[];
}