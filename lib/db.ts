import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const pool = new Pool({
      connectionString,
    });

    db = drizzle(pool, { schema });
  }
  return db;
}

export async function initializeDb() {
  const dbInstance = getDb();
  return dbInstance;
}

export { schema };
