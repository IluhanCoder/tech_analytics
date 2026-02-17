import { defineConfig } from '@prisma/internals';

export default defineConfig({
  datasource: {
    provider: 'mongodb',
    url: process.env.DATABASE_URL,
  },
});
