import { defineConfig } from 'prisma/config';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrate: {
    async adapter() {
      return new PrismaPg({
        connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
      });
    },
  },
});
