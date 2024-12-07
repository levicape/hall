import { createCookieSessionStorage } from "../cookie-store.server.js";
import type { Timings } from "../timing.server.js";
import type { ProviderName } from "./connections.js";
import { GitHubProvider } from "./github.server.js";
import type { AuthProvider } from "./provider.js";

export const connectionSessionStorage = createCookieSessionStorage({
	cookie: {
		name: "en_connection",
		sameSite: "lax", // CSRF protection is advised if changing to 'none'
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		secrets: (
			process.env.SESSION_SECRET ?? "ev04QPaIMZ4QfGG33ZtqjOzgvYXZ22DH"
		).split(","),
		secure: process.env.NODE_ENV === "production",
	},
});

export const providers: Record<ProviderName, AuthProvider> = {
	github: new GitHubProvider(),
};

export function handleMockAction(providerName: ProviderName, request: Request) {
	return providers[providerName].handleMockAction(request);
}

export function resolveConnectionData(
	providerName: ProviderName,
	providerId: string,
	options?: { timings?: Timings },
) {
	return providers[providerName].resolveConnectionData(providerId, options);
}
