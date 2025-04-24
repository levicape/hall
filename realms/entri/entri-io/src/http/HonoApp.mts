import { HonoHttpServer } from "@levicape/spork/router/hono/HonoHttpServer";
import type { HonoHttp } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import { streamHandle } from "hono/aws-lambda";
import { createFactory } from "hono/factory";
import { env } from "std-env";
import { HTTP_BASE_PATH } from "./Atlas.mjs";

export const { server } = await HonoHttpServer(
	createFactory<HonoHttp>(),
	(app) => app.basePath(HTTP_BASE_PATH),
);

export const stream = env.AWS_REGION && (streamHandle(server.app) as unknown);
export type HonoApp = typeof server.app;
