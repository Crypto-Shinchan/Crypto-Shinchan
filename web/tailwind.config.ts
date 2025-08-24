import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-[#0b0b10]',
    'h-[80vmax]', 'w-[80vmax]', 'h-[70vmax]', 'w-[70vmax]', 'h-[65vmax]', 'w-[65vmax]',
    'bg-[radial-gradient(circle_at_center,rgba(247,147,26,.55),transparent_60%)]',
    'bg-[radial-gradient(circle_at_center,rgba(255,193,7,.55),transparent_60%)]',
    'bg-[radial-gradient(circle_at_center,rgba(255,255,255,.2),transparent_60%)]',
    'animate-[aurora_36s_linear_infinite]',
    'animate-[aurora_28s_linear_infinite]',
    'animate-[aurora_32s_linear_infinite]',
    'animate-[shimmer_7s_linear_infinite]',
    'animate-[twinkle_4s_ease-in-out_infinite]',
  ],
  theme: {
    extend: {
      keyframes: {
        aurora: {
          '0%':   { transform: 'translate(-20%, -10%) rotate(0deg)   scale(1)' },
          '50%':  { transform: 'translate( 20%,  10%) rotate(180deg) scale(1.05)' },
          '100%': { transform: 'translate(-20%, -10%) rotate(360deg) scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        twinkle: {
          '0%,100%': { opacity: '.15' },
          '50%':     { opacity: '.35' },
        },
      },
      animation: {
        'aurora-slow': 'aurora 36s linear infinite',
        'aurora-med':  'aurora 28s linear infinite',
        'aurora-fast': 'aurora 20s linear infinite',
        shimmer:       'shimmer 7s linear infinite',
        twinkle:       'twinkle 4s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config