import { createFactory } from "hono/factory";
import type { HttpMiddleware } from "../../http/HonoApp.mjs";

const factory = createFactory<HttpMiddleware>();
export const Gate = () => {
	return factory;
};

export const GateSubjectTypesSupported = async () => ["public"];

export const GateSupportedScopes = async () => ["openid", "profile", "email"];

export const GateSupportedResponseTypes = async () => ["code"];
