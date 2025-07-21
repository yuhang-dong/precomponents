import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming';
import { PreComponentsStorybookDecorator } from '@precomponents/storybook-integration/decorator';

const preview: Preview = {
  parameters: {
    darkMode: {
      dark: {
        ...themes.dark,
        appBg: 'black',
        appPreviewBg: "gray", // set appPreviewBg
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
  },
  decorators: [PreComponentsStorybookDecorator]
};



export default preview;