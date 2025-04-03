import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.NODE_ENV === "test"
          ? process.env.DATABASE_URL
          : process.env.DATABASE_URL,
    },
  },
});

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

export default prisma;
export { supabase };
