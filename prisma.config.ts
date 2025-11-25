import dotenv from 'dotenv';
dotenv.config();

export default {
  // Path to Prisma schema. Adjust if your schema is in a different place.
  schema: './prisma/schema.prisma',

  // Datasource config used by the Prisma CLI (migrate, studio, etc.)
  datasources: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/mydb?schema=public',
    },
  },
};
