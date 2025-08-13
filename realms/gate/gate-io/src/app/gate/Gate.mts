import type { HonoHttpAuthentication } from "@levicape/spork/router/hono/middleware/security/HonoAuthenticationBearer";
import { createFactory } from "hono/factory";
import type { HttpMiddleware } from "../../http/HonoApp.mjs";

export type Gate = HttpMiddleware & HonoHttpAuthentication;
const factory = createFactory<Gate>();
export const Gate = () => {
	return factory;
};
