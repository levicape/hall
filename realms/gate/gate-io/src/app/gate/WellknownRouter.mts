import { HTTP_BASE_PATH, Topology } from "../../http/Atlas.mjs";
import {
	QureauAuthorizationEndpoint,
	QureauEndSessionEndpoint,
	QureauRevokeEndpoint,
	QureauTokenEndpoint,
	QureauUserinfoEndpoint,
} from "../qureau/Qureau.mjs";
import {
	Gate,
	GateSubjectTypesSupported,
	GateSupportedResponseTypes,
	GateSupportedScopes,
} from "./Gate.mjs";
import type { JSONWebKeySet } from "./controller/jwks/JsonWebKey.mjs";
import type { OpenIdConfiguration } from "./controller/openid-configuration/OpenIdConfiguration.mjs";

export const WellknownRouter = Gate()
	.createApp()
	.get("jwks.json", async (c) => {
		return c.json({} as unknown as JSONWebKeySet);
	})
	.get("openid-configuration", async (c) => {
		const host = c.get("Topology")["/~/Frontend/Hostname"].url();
		const response_types_supported = await GateSupportedResponseTypes();
		const scopes_supported = await GateSupportedScopes();
		const subject_types_supported = (await GateSubjectTypesSupported()) as [
			"public",
		];

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
			jwks_uri: `${host}/.well-known/jwks.json`,
			authorization_endpoint: `${host}/${HTTP_BASE_PATH}/${QureauAuthorizationEndpoint}`,
			end_session_endpoint: `${host}/${HTTP_BASE_PATH}/${QureauEndSessionEndpoint}`,
			revocation_endpoint: `${host}/${HTTP_BASE_PATH}/${QureauRevokeEndpoint}`,
			token_endpoint: `${host}/${HTTP_BASE_PATH}/${QureauTokenEndpoint}`,
			userinfo_endpoint: `${host}/${HTTP_BASE_PATH}/${QureauUserinfoEndpoint}`,
		} satisfies OpenIdConfiguration);
	});
