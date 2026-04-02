import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        kommune: {
          blue: '#0F4C81',
          light: '#E8F0F7'
        }
      }
    }
  },
  plugins: []
};

export default config;
