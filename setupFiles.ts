// setup.js (for jest)
// import { setProjectAnnotations } from '@storybook/react';
// import projectAnnotations from './.storybook/preview';

// setProjectAnnotations(projectAnnotations);

// Cosmos uses the CSS Custom Highlight API, which is not implemented by JSDOM.
Object.defineProperty(globalThis, 'Highlight', {
  configurable: true,
  value: class Highlight extends Set<Range> {}
});
