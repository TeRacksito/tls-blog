import { Seeder } from '../types';

export default {
  name: 'connection-test',
  options: {
    suppressDuplicateKeyErrors: true,
  },
  seed: async (tx) => {
    await tx.connectionTestTitle.create({
      data: {
        id: 1,
        title: 'Connection Test!',
        description: 'This is a test title to verify the database connection.',
      },
    });
  },
} satisfies Seeder;
