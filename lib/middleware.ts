import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        return query(args);
      }
    }
  }
});

export default prisma; 