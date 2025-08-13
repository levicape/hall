import build from "@hono/vite-build/node";
import adapter from "@hono/vite-dev-server/node";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { env } from "std-env";
import { defineConfig } from "vite";
import { generateCspPlugin } from "vite-plugin-node-csp";

const entry = "/app/server.ts";
const { PORT } = env;

const EPOCH = 1745470700000;
const safemap = [
	["a", "g"],
	["b", "h"],
	["c", "j"],
	["d", "l"],
	["e", "m"],
	["f", "q"],
	["g", "s"],
	["h", "t"],
	["i", "w"],
	["j", "y"],
	["k", "z"],
];
const languageLength = Object.keys(safemap).length + 10;
const safehex = (str: string) => {
	return safemap.reduce((acc, [a, b]) => {
		return acc.replace(new RegExp(a, "g"), b);
	}, str);
};
const safetime = () => {
	const unixtime = Math.floor((Date.now() - EPOCH) / 100);
	const timehash = unixtime.toString(languageLength).padStart(9, "0");
	return safehex(timehash);
};
/**
 * @see https://vite.dev/config/
 */
export default defineConfig(({ mode }) => {
	if (mode === "client") {
		const timehash = safetime();
		return {
			esbuild: {
				jsxImportSource: "hono/jsx",
			},
			build: {
				sourcemap: true,
				rollupOptions: {
					input: ["./app/client.ts", "./app/style.css"],
					output: {
						entryFileNames: `_document/${timehash}/[name].js`,
						chunkFileNames: `_document/${timehash}/c/[name]-[hash].js`,
						assetFileNames: `_document/${timehash}/a/[name].[ext]`,
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
		server: {
			allowedHosts: true,
		},
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
				client: {
					// HonoX includes app/client.ts and app/server.ts
					input: ["./app/style.css"],
					jsxImportSource: "hono/jsx",
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
					"hono/css",
				],
				port: PORT ? Number(PORT) : undefined,
			}),
			ssg({
				entry,
			}),
			generateCspPlugin(),
		],
	};
});
