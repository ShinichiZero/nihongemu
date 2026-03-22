import { useAppStore } from '../store/useAppStore';

const categories = [
  { id: 'intentions', label: 'Intentions', emoji: '🎯' },
  { id: 'conditionals', label: 'Conditionals', emoji: '🔀' },
  { id: 'sensory', label: 'Sensory', emoji: '👂' },
  { id: 'comparisons', label: 'Comparisons', emoji: '⚖️' },
  { id: 'experience', label: 'Experience', emoji: '📚' },
];

export function ModuleNav() {
  const { currentModule, setModule } = useAppStore();

  return (
    <nav className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setModule(cat.id)}
          className={`
            flex-shrink-0 flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-semibold
            transition-all duration-200 whitespace-nowrap
            ${currentModule === cat.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-400'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }
          `}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </nav>
  );
}