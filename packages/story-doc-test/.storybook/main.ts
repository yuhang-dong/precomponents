import type { StorybookConfig } from '@storybook/react-vite';
// @ts-ignore
import { StoryDocPlugin } from '@componentview/story-doc';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
  ],
  viteFinal: async (config, options) => {
    // @ts-ignore
    config.plugins?.push([StoryDocPlugin(options)])
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