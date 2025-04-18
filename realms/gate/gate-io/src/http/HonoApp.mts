import { HonoHttpServer } from "@levicape/spork/router/hono/HonoHttpServer";
import type { HonoHttp } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import {
	type HonoHttpAuthentication,
	HonoHttpAuthenticationMiddleware,
} from "@levicape/spork/router/hono/middleware/security/HonoAuthenticationBearer";
import {
	HonoHttpJwtIssuerMiddleware,
	type HonoJwtIssuer,
} from "@levicape/spork/router/hono/middleware/security/HonoJwtIssuer";
import { JwtClaimsCognitoTokenUse } from "@levicape/spork/server/security/claims/JwtClaimsCognito";
import { createFactory } from "hono/factory";
import { WellknownRouter } from "../app/gate/WellknownRouter.mjs";
import type { QureauBaseClaims } from "../app/qureau/QureauJwt.mjs";
import { QureauNotFound, QureauRouter } from "../app/qureau/QureauRouter.mjs";
import { HTTP_BASE_PATH, Topology } from "./Atlas.mjs";

export type HttpMiddleware = HonoHttp &
	HonoHttpAuthentication &
	HonoJwtIssuer<QureauBaseClaims> & {
		Variables: {
			Topology: typeof Topology;
		};
	};

export const { server, handler, stream } = await HonoHttpServer(
	createFactory<HttpMiddleware>({
		initApp(app) {
			const issuer = Topology["/~/Frontend/Hostname"].url();
			const clientId = "ok";
			app.use(async (c, next) => {
				c.set("Topology", Topology);
				await next();
			});
			app.use(
				HonoHttpAuthenticationMiddleware(JwtClaimsCognitoTokenUse("access")),
			);
			app.use(
				HonoHttpJwtIssuerMiddleware({
					initializeToken: (token) => {
						const now = Math.floor(Date.now() / 1000);
						return token
							.setProtectedHeader({
								alg: "ES256",
							})
							.setIssuer(issuer)
							.setAudience(clientId)
							.setIssuedAt(now)
							.setNotBefore(now);
					},
				}),
			);
		},
	}),
	(app) =>
		app
			.route(HTTP_BASE_PATH, QureauRouter)
			.route(".well-known", WellknownRouter)
			.all("*", ...QureauNotFound),
);

export type HonoApp = typeof server.app;
