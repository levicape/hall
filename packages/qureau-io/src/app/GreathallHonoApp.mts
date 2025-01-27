import {
	HonoHttpApp,
	HonoHttpMiddlewareStandard,
} from "@levicape/spork/router/hono";
import { QureauRouter } from "./qureau/QureauRouter.mjs";

export const GreathallHonoApp = async () =>
	HonoHttpApp({
		middleware: [...HonoHttpMiddlewareStandard()],
	}).route("/~/v1/Qureau", QureauRouter);
