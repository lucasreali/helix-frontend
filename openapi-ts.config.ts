import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "http://localhost:8080/docs/json",
	output: "src/client",
	plugins: [
		"@hey-api/client-axios",
		"@hey-api/typescript",
		"@tanstack/react-query",
	],
});
