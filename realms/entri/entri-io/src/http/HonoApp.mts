import { HonoHttpServer } from "@levicape/spork/router/hono/HonoHttpServer";
import type { HonoHttp } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import { createFactory } from "hono/factory";
import { HTTP_BASE_PATH } from "./Atlas.mjs";

export const { server, handler, stream } = await HonoHttpServer(
	createFactory<HonoHttp>(),
	(app) => app.basePath(HTTP_BASE_PATH),
);

export type HonoApp = typeof server.app;
