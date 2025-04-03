import { execSync } from "child_process";
import prisma from "../prisma/client";
import dotenv from "dotenv";

process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  try {
    if (!process.env.SUPABASE_URL) {
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    }
  } catch (error) {
    console.error("Error setting up test database:", error);
  }
});

afterAll(async () => {
  try {
    if (!process.env.SUPABASE_URL) {
      const tables = await prisma.$queryRaw`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
      `;

      for (const { tablename } of tables as { tablename: string }[]) {
        if (tablename !== "_prisma_migrations") {
          await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
          );
        }
      }
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error cleaning up test database:", error);
    await prisma.$disconnect();
  }
});
