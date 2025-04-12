import { Topology } from "../../http/Atlas.mjs";
import { QureauLoginPath } from "../qureau/controller/login/QureauLoginHandler.mjs";
import { Gate } from "./Gate.mjs";
import type { JSONWebKeySet } from "./controller/jwks/JsonWebKey.mjs";
import type { OpenIdConfiguration } from "./controller/openid-configuration/OpenIdConfiguration.mjs";

export const WellknownRouter = Gate()
	.createApp()
	.get("jwks.json", async (c) => {
		return c.json({} as unknown as JSONWebKeySet);
	})
	.get("openid-configuration", async (c) => {
		const host = Topology["/~/Frontend/Hostname"].url();
		return c.json({
			issuer: host,
			frontchannel_logout_supported: false,
			response_types_supported: ["code", "token"],
			scopes_supported: ["openid", "profile", "email"],
			subject_types_supported: ["public"],
			token_endpoint_auth_methods_supported: [
				"client_secret_basic",
				"client_secret_post",
			],
			jwks_uri: `${host}/.well-known/jwks.json`,
			authorization_endpoint: `${host}/${QureauLoginPath}`,
			end_session_endpoint: `${host}/${QureauLoginPath}`,
			revocation_endpoint: `${host}/${QureauLoginPath}`,
			token_endpoint: `${host}/${QureauLoginPath}`,
			userinfo_endpoint: `${host}/${QureauLoginPath}`,
		} satisfies OpenIdConfiguration);
	});
