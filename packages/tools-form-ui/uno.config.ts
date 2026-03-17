import { defineConfig } from 'unocss';
import { presetWind3 } from '@unocss/preset-wind3';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{js,ts,jsx,tsx}'],
  },
  presets: [presetRemToPx(), presetWind3({ prefix: 'fairystaroform__' }) as any],
});
