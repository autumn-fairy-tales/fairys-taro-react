import { defineConfig } from 'unocss';
import { presetWind3 } from '@unocss/preset-wind3';

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{js,ts,jsx,tsx}'],
  },
  presets: [presetWind3({ prefix: 'fairystaroform__' })],
});
