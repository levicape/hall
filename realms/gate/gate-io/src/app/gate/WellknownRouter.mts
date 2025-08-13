import { envsubst } from "@levicape/spork/server/EnvSubst";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { type JWK, exportJWK } from "jose";
import { HTTP_BASE_PATH } from "../../http/Polly.mjs";
import {
	QureauAuthorizationEndpoint,
	QureauEndSessionEndpoint,
	QureauRevokeEndpoint,
	QureauTokenEndpoint,
	QureauUserinfoEndpoint,
} from "../qureau/Qureau.mjs";
import { Gate } from "./Gate.mjs";
import type { OpenIdConfiguration } from "./controller/openid-configuration/OpenIdConfiguration.mjs";

export const WellknownRouter = Gate()
	.createApp()
	.get(
		"jwks.json",
		(() => {
			let jwk: JWK | undefined;
			return createMiddleware<Gate & { Variables: { Jwk: JWK } }>(
				async function jwkCache(c, next) {
					const keyset = c.var.JwtVerification.jwks;
					if (!keyset) {
						throw new HTTPException(StatusCodes.LOCKED, {
							res: new Response(
								JSON.stringify({
									error: {
										code: "JWKS_ERROR",
										message: "Could not retrieve keys",
									},
								}),
							),
						});
					}

					if (jwk === undefined) {
						const keys = await keyset({
							alg: c.var.JwkConfiguration.token.alg,
						});
						c.var.Logging.withMetadata({
							keys: {
								algorithm: keys.algorithm,
								extractable: keys.extractable,
							},
						}).debug("Exporting JWK");
						jwk = await exportJWK(keys);
					}
					c.set("Jwk", jwk);
					await next();
				},
			);
		})(),
		async (c) => {
			const keys = c.var.Jwk;
			return c.json({
				keys: [keys],
			});
		},
	)
	.get("openid-configuration", async (c) => {
		const host = c.var.OauthConfiguration.issuer ?? "localhost";
		const response_types_supported = c.var.OauthConfiguration.responseTypes;
		const scopes_supported = c.var.OauthConfiguration.scopes;
		const subject_types_supported = c.var.OauthConfiguration.subjectTypes;

		return c.json({
			issuer: host,
			frontchannel_logout_supported: false,
			response_types_supported,
			scopes_supported,
			subject_types_supported,
			token_endpoint_auth_methods_supported: [
				"client_secret_basic",
				"client_secret_post",
			],
			jwks_uri: envsubst(`${host}/.well-known/jwks.json`),
			authorization_endpoint: envsubst(
				`${host}/${HTTP_BASE_PATH}/${QureauAuthorizationEndpoint}`,
			),
			end_session_endpoint: envsubst(
				`${host}/${HTTP_BASE_PATH}/${QureauEndSessionEndpoint}`,
			),
			revocation_endpoint: envsubst(
				`${host}/${HTTP_BASE_PATH}/${QureauRevokeEndpoint}`,
			),
			token_endpoint: envsubst(
				`${host}/${HTTP_BASE_PATH}/${QureauTokenEndpoint}`,
			),
			userinfo_endpoint: envsubst(
				`${host}/${HTTP_BASE_PATH}/${QureauUserinfoEndpoint}`,
			),
		} satisfies OpenIdConfiguration);
	});
