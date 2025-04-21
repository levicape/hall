import { createFactory } from "hono/factory";
import type { HttpMiddleware } from "../../http/HonoApp.mjs";

const factory = createFactory<HttpMiddleware>();
export const Gate = () => {
	return factory;
};
