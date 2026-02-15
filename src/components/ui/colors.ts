// Color palette matching terminal aesthetic
// Based on documentation: SHIPIT_DOCUMENTATION.md
export const colors = {
  // Backgrounds
  background: '#0d1117',
  black: '#000000',
  charcoal: '#0a0a0a',
  surface: '#161b22',

  // Borders
  border: '#30363d',

  // Text
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textDim: '#484f58',

  // Accent colors (with aliases)
  cyan: '#58a6ff',
  neonCyan: '#58a6ff',

  magenta: '#f778ba',
  neonPink: '#f778ba',

  green: '#3fb950',
  neonGreen: '#3fb950',

  amber: '#d29922',
  red: '#f85149',
} as const

export type ColorKey = keyof typeof colors
