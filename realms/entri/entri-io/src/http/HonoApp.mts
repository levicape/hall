import { SporkHonoHttpServer } from "@levicape/spork/router/hono/HonoHttpServerBuilder";
import type { DefaultHonoHttpMiddleware } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import { createFactory } from "hono/factory";
import { HTTP_BASE_PATH } from "./Atlas.mjs";

export const { server, handler, stream } = await SporkHonoHttpServer(
	createFactory<DefaultHonoHttpMiddleware>(),
	(app) => app.basePath(HTTP_BASE_PATH),
);

export type HonoApp = typeof server.app;
