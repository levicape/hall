import type { DefaultHonoHttpMiddleware } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import { createFactory } from "hono/factory";

const factory = createFactory<DefaultHonoHttpMiddleware>();
export const Gate = () => {
	return factory;
};
