export const getTypeColor = (type) => ({
  FIRE: 'bg-red-500',
  WATER: 'bg-blue-500',
  GRASS: 'bg-green-500',
  LIGHT: 'bg-yellow-400',
  DARK: 'bg-purple-700',
}[type] || 'bg-gray-500');

export const getGradeColor = (grade) => ({
  NORMAL: 'border-gray-400',
  MAGIC: 'border-green-400',
  RARE: 'border-blue-400',
  UNIQUE: 'border-purple-400',
  EPIC: 'border-purple-600',
  LEGENDARY: 'border-yellow-500',
  DIVINE: 'border-yellow-300',
  MYSTIC: 'border-pink-400',
  ETERNAL: 'border-cyan-400',
  INFINITY: 'border-red-600',
  ELDER: 'border-orange-600',
}[grade] || 'border-gray-400');
