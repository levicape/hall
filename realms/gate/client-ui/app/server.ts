import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";

const app = createApp({
	trailingSlash: true,
});

showRoutes(app, {
	verbose: true,
});

export default app;
