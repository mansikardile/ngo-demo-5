import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent multiple Prisma instances in development (hot-reload)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma 5 standard client — DATABASE_URL is read from environment via schema.prisma
 */
export const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
