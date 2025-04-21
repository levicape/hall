import { envsubst } from "@levicape/spork/server/EnvSubst";
import { StatusCodes } from "http-status-codes";
import { HTTP_BASE_PATH } from "../../http/Atlas.mjs";
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
	.get("jwks.json", async (c) => {
		const keys = c.var.JwtVerification?.pubkeys();
		if (!keys) {
			return c.json(
				{
					error: {
						code: "JWKS_ERROR",
						message: "Could not retrieve keys",
					},
				},
				StatusCodes.GONE,
			);
		}
		return c.json(keys);
	})
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
