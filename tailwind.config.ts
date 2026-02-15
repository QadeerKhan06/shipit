import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-dim': '#484f58',
        accent: {
          cyan: '#58a6ff',
          magenta: '#f778ba',
          green: '#3fb950',
          amber: '#d29922',
          red: '#f85149',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
