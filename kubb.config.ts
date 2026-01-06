import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
export default defineConfig({
	name: "helix",
	root: ".",
	input: {
		path: "http://localhost:8080/docs/json",
	},
	output: {
		path: "./src/api",
	},
	hooks: { done: [] },
	plugins: [
		pluginOas({
			generators: [],
			validate: false,
		}),
		pluginTs({
			output: {
				path: "models.ts",
			},
		}),
		pluginClient({
			baseURL: "http://localhost:8080",
			output: {
				path: "clients.ts",
			},
			importPath: "@/lib/fetch-client.ts",
			dataReturnType: "full",
		}),
		pluginReactQuery({
			output: {
				path: "hooks.ts",
			},
			suspense: false,
			client: {
				baseURL: "http://localhost:8080",
			},
		}),
	],
});
