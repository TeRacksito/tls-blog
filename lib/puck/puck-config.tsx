import type { Config } from '@puckeditor/core';

export const puckConfig: Config = {
  components: {
    HeadingBlock: {
      fields: {
        title: {
          type: 'text',
          label: 'Title',
        },
      },
      defaultProps: {
        title: 'Your headline goes here',
      },
      render: ({ title }) => {
        return (
          <h1 className="mb-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
        );
      },
    },
    ParagraphBlock: {
      fields: {
        body: {
          type: 'textarea',
          label: 'Paragraph',
        },
      },
      defaultProps: {
        body: 'Start writing your story with your own content blocks.',
      },
      render: ({ body }) => {
        return (
          <p className="mb-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {body}
          </p>
        );
      },
    },
    CalloutBlock: {
      fields: {
        text: {
          type: 'textarea',
          label: 'Callout text',
        },
      },
      defaultProps: {
        text: 'Important note for your readers.',
      },
      render: ({ text }) => {
        return (
          <aside className="mb-6 rounded-lg border border-zinc-300 bg-zinc-100 p-4 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {text}
          </aside>
        );
      },
    },
  },
};
