import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (메인 컬러 #5D5FEF 기반)
        primary: {
          50: '#f0f0ff',
          100: '#e5e5ff',
          200: '#d1d1ff',
          300: '#b3b3ff',
          400: '#9999ff',
          500: '#5D5FEF', // 메인 컬러
          600: '#4a4dd6',
          700: '#3b3eb8',
          800: '#2f3294',
          900: '#282a7a',
        },
        
        // Gray Scale
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },

        // Semantic Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // GitHub Status Colors
        'github-open': '#0969da',
        'github-merged': '#8250df',
        'github-closed': '#d1242f',
        
        // Category Colors for Word Cloud
        'category-react': '#61dafb',
        'category-typescript': '#3178c6',
        'category-performance': '#ff6b6b',
        'category-structure': '#4ecdc4',
        'category-quality': '#45b7d1',
        'category-api': '#96ceb4',
        'category-other': '#feca57',
      },
      
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      fontSize: {
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 32px
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // 24px
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20px
        'body1': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'body2': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1rem' }], // 12px
      },

      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
      },

      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;