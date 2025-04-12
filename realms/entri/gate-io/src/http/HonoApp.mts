import { SporkHonoHttpServer } from "@levicape/spork/router/hono/HonoHttpServerBuilder";
import type { DefaultHonoHttpMiddleware } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import { createFactory } from "hono/factory";
import { WellknownRouter } from "../app/gate/WellknownRouter.mjs";
import { QureauNotFound, QureauRouter } from "../app/qureau/QureauRouter.mjs";
import { HTTP_BASE_PATH } from "./Atlas.mjs";

export const { server, handler, stream } = await SporkHonoHttpServer(
	createFactory<DefaultHonoHttpMiddleware>(),
	(app) =>
		app
			.route(".well-known", WellknownRouter)
			.route(HTTP_BASE_PATH, QureauRouter)
			.all("*", ...QureauNotFound),
);

export type HonoApp = typeof server.app;
