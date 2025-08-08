import type { Config } from 'tailwindcss'
import { heroui } from '@heroui/react'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [heroui()],
} satisfies Config
