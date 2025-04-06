import build from "@hono/vite-build/node";
import adapter from "@hono/vite-dev-server/node";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { env } from "std-env";
import { defineConfig } from "vite";

const entry = "/app/server.ts";
const { PORT } = env;

/**
 * @see https://vite.dev/config/
 */
export default defineConfig(({ mode }) => {
	if (mode === "client") {
		const unixtime = Math.floor(Date.now() / 1000);
		const timehash = unixtime.toString(16);
		return {
			build: {
				sourcemap: true,
				rollupOptions: {
					input: ["./app/client.ts", "./app/style.css"],
					output: {
						entryFileNames: `_!/${timehash}/[name].js`,
						chunkFileNames: `_!/${timehash}/c/[name]-[hash].js`,
						assetFileNames: `_!/${timehash}/a/[name].[ext]`,
						generatedCode: "es2015",
						compact: true,
					},
					treeshake: "smallest",
				},
				manifest: true,
			},
			plugins: [tailwindcss()],
		};
	}

	return {
		build: {
			ssrManifest: true,
			rollupOptions: {
				output: {
					generatedCode: "es2015",
				},
			},
			commonjsOptions: {
				include: ["cookie", "set-cookie-parser", "oidc-client-ts"],
			},
		},
		plugins: [
			tailwindcss(),
			honox({
				entry,
				client: {
					// HonoX automatically includes app/client.ts
					input: ["./app/style.css"],
				},
				devServer: {
					adapter,
				},
			}),
			build({
				emptyOutDir: false,
				external: [
					"prop-types",
					"fs-extra",
					"cookie",
					"set-cookie-parser",
					"oidc-client-ts",
				],
				port: PORT ? Number(PORT) : undefined,
			}),
			ssg({
				entry,
			}),
		],
	};
});
