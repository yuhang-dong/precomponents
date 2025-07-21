import type {StoryIndex} from 'storybook/internal/types';

export type {
  StoryIndex
}
declare module 'virtual:storybook-index' {
  export const index: StoryIndex; // or define a more specific type
}