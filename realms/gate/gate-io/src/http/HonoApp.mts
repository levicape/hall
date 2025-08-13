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
import { streamHandle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import { createFactory } from "hono/factory";
import { env, isDevelopment } from "std-env";
import { parseURL } from "ufo";
import { WellknownRouter } from "../app/gate/WellknownRouter.mjs";
import type { QureauBaseClaims } from "../app/qureau/QureauJwt.mjs";
import { QureauNotFound, QureauRouter } from "../app/qureau/QureauRouter.mjs";
import type {
	AuthorizeQueryParamResponseType,
	AuthorizeQueryParamScope,
	AuthorizeQueryParamSubjectType,
} from "../app/qureau/controller/login/AuthorizeQueryParams.mjs";
import { HTTP_BASE_PATH } from "./Polly.mjs";

export type HttpMiddleware = HonoHttp &
	HonoHttpAuthentication &
	HonoJwtIssuer<QureauBaseClaims> & {
		Variables: {
			JwkConfiguration: {
				token: {
					alg: string;
					typ: string;
				};
				material: {
					alg: string;
					enc: string;
				};
			};
			OauthConfiguration: {
				issuer: string;
				responseTypes: ReadonlyArray<AuthorizeQueryParamResponseType>;
				scopes: ReadonlyArray<AuthorizeQueryParamScope>;
				subjectTypes: ReadonlyArray<AuthorizeQueryParamSubjectType>;
			};
			OauthClients: ReadonlyArray<{
				clientId: string;
				redirectUrls: ReadonlyArray<string>;
			}>;
			OauthClientsById: Record<string, { redirectUrls: ReadonlyArray<string> }>;
		};
	};

const {
	OAUTH_PUBLIC_OIDC_AUTHORITY,
	OAUTH_PUBLIC_OIDC_RESPONSE_TYPE,
	OAUTH_PUBLIC_OIDC_SCOPE,
	OAUTH_PUBLIC_OIDC_CLIENT_ID,
	OAUTH_PUBLIC_OIDC_REDIRECT_URI,
	OAUTH_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
	OAUTH_PUBLIC_OIDC_SILENT_REDIRECT_URI,
} = env;

export const { server } = await HonoHttpServer(
	createFactory<HttpMiddleware>({
		initApp(app) {
			const OauthConfiguration = {
				issuer: OAUTH_PUBLIC_OIDC_AUTHORITY ?? "localhost",
				responseTypes: (OAUTH_PUBLIC_OIDC_RESPONSE_TYPE ?? "").split(
					",",
				) as AuthorizeQueryParamResponseType[],
				scopes: (OAUTH_PUBLIC_OIDC_SCOPE ?? "").split(
					",",
				) as AuthorizeQueryParamScope[],
				subjectTypes: ["public"] as AuthorizeQueryParamSubjectType[],
			} as const;

			const JwkConfiguration = {
				token: {
					alg: "ES256",
					typ: "JWT",
				},
				material: {
					alg: "A256GCMKW",
					enc: "A256GCM",
				},
			} as const;
			const OauthClients = [
				{
					clientId: OAUTH_PUBLIC_OIDC_CLIENT_ID ?? "default",
					redirectUrls: [
						OAUTH_PUBLIC_OIDC_REDIRECT_URI,
						OAUTH_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI,
						OAUTH_PUBLIC_OIDC_SILENT_REDIRECT_URI,
					].filter((url) => !!url) as string[],
				},
			] as const;

			app.use(async (c, next) => {
				c.set("JwkConfiguration", JwkConfiguration);
				c.set("OauthConfiguration", OauthConfiguration);
				c.set("OauthClients", OauthClients);
				c.set(
					"OauthClientsById",
					Object.fromEntries(
						OauthClients.map((client) => [
							client.clientId,
							{ redirectUrls: client.redirectUrls },
						]),
					),
				);
				await next();
			});
			app.use(
				HonoHttpAuthenticationMiddleware(
					{},
					JwtClaimsCognitoTokenUse("access"),
				),
			);
			app.use(
				HonoHttpJwtIssuerMiddleware({
					initializeToken: (token) => {
						const now = Math.floor(Date.now() / 1000);
						return token
							.setProtectedHeader({
								alg: JwkConfiguration.token.alg,
								typ: JwkConfiguration.token.typ,
							})
							.setIssuer(OauthConfiguration.issuer)
							.setIssuedAt(now)
							.setNotBefore(now);
					},
					initializeMaterial: (materials) => {
						return materials
							.setIssuer(OauthConfiguration.issuer)
							.setProtectedHeader({
								alg: JwkConfiguration.material.alg,
								enc: JwkConfiguration.material.enc,
							});
					},
				}),
			);

			app.use(
				cors({
					origin: (origin) => {
						const hasValidOrigin = OauthClients.find((client) => {
							const redirectUrls = client.redirectUrls;
							return redirectUrls.find((url) => {
								const parsedUrl = parseURL(url);
								if (!parsedUrl) return false;

								const { host, protocol } = parsedUrl;
								return origin === `${protocol}//${host}`;
							});
						});

						if (hasValidOrigin) {
							return origin;
						}

						return isDevelopment ? "*" : null;
					},
					allowHeaders: ["*"],
					allowMethods: ["GET", "POST", "OPTIONS"],
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

export const stream = env.AWS_REGION && (streamHandle(server.app) as unknown);
export type HonoApp = typeof server.app;
