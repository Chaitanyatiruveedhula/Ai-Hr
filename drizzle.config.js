/** @type { import("drizzle-kit").Config } */
export default {
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:vPoNO2wUm6eq@ep-red-dust-a5b4hc3x.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
}

//   import { defineConfig } from "drizzle-kit";
// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./src/schema.ts",
//   out: "./drizzle",
// });
