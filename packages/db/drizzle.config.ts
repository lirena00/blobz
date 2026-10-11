import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dbCredentials: {
		url: process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL || "",
	},
	dialect: "postgresql",
	out: "./src/migrations",
	schema: "./src/schema/index.ts",
	schemaFilter: ["public"],
});
