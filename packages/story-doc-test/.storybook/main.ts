import type { StorybookConfig } from '@storybook/react-vite';
import { PreComponentsStorybookVitePlugin } from '@precomponents/storybook-integration/plugin';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
  ],
  viteFinal: async (config, options) => {
    config.plugins?.push([PreComponentsStorybookVitePlugin({
      ...options,
      base: '/precomponents'
    })])
    return {
      ...config,
    }
  },
  "framework": {
    "name": "@storybook/react-vite",
    "options": {
    }
  },
};
export default config;