import { generateFiles } from "fumadocs-openapi";
import { openapi } from "../src/lib/openapi";

await generateFiles({
	includeDescription: true,
	input: openapi,
	output: "./content/docs/api/reference",
});
