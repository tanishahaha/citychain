import { defineConfig } from "drizzle-kit"
export default defineConfig({
    dialect: "postgresql", 
    dbCredentials: {
        url:process.env.DATABASE_CONNECTION_STRING as string,
    },
    schema:"./src/lib/db/schema.ts",
    out:"./drizzle",
})