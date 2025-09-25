import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set. Database operations are not available.");
    }
    
    const sql = neon(connectionString);
    db = drizzle(sql, { schema });
  }
  
  return db;
}

// Export for compatibility
export { db };