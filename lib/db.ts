import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Validate database configuration
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Detect database type from URL
const isPostgreSQL = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
const isMySQL = databaseUrl.startsWith("mysql://");

if (!isPostgreSQL && !isMySQL) {
  throw new Error("DATABASE_URL must start with 'postgresql://', 'postgres://', or 'mysql://'");
}

// Log database type for debugging
if (process.env.NODE_ENV === "development") {
  console.log(`🔗 Using ${isPostgreSQL ? 'PostgreSQL' : 'MySQL'} database`);
}

const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export { db };
export default db;
