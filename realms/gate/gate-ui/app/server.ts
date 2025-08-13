import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";

const app = createApp({
	init(app) {
		app.use(
			cors({
				origin: (origin) => {
					return origin;
				},
				allowHeaders: ["*"],
				allowMethods: ["GET", "POST", "OPTIONS"],
			}),
		);
	},
	trailingSlash: true,
});

showRoutes(app, {
	verbose: true,
});

export default app;
