import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL || "", { schema });

// Export schema for use in other packages
export * from "./schema";
