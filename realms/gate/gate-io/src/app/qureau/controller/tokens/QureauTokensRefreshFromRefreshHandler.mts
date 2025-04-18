import { validator } from "hono/validator";
import type { JWTVerifyResult } from "jose";
import { serializeError } from "serialize-error";
import { withQuery } from "ufo";
import { prettifyError } from "zod";
import {
	LoginWithIdRequest,
	type LoginWithIdResponse,
} from "../../../../_protocols/qureau/tsnode/domain/login/withId/login.withId.js";
import { TokenCreateExt } from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import { Qureau } from "../../Qureau.mjs";
import { qureauLoginService } from "../../service/QureauLogin.mjs";
import { LoginQueryParamsZod } from "../login/LoginQueryParams.mjs";

export const QureauTokensRefreshFromRefreshHandler = Qureau().createHandlers(
	validator("query", async (s, c) => {
		const query = await LoginQueryParamsZod.safeParseAsync(s);
		if (!query.success) {
			return c.redirect(
				withQuery("/oauth2/login", {
					error: "invalid_request",
					error_description: prettifyError(query.error),
				}),
			);
		}

		return query.data;
	}),
	async (c) => {
		const query = c.req.valid("query");
		let verified: JWTVerifyResult | undefined;
		let error: unknown | undefined = undefined;

		if (query.grant_type === "authorization_code") {
			const { code } = query;
			try {
				verified = await c.var.JwtVerification.jwtVerify?.(
					query.code ?? "",
					{},
				);
			} catch (e) {
				error = serializeError(e);
				c.var.Logging.withMetadata({ error: e }).withError(e);
			}
			c.var.Logging.withMetadata({
				QureauLoginHandler: {
					code,
					verified,
					query,
					error,
				},
			}).info("ATOKO authorization_code");
		}

		if (query.grant_type === "refresh_token") {
			const { refresh_token } = query;
			try {
				verified = await c.var.JwtVerification.jwtVerify?.(
					refresh_token ?? "",
					{},
				);
			} catch (e) {
				error = serializeError(e);
				c.var.Logging.withMetadata({ error: e }).withError(e);
			}
			c.var.Logging.withMetadata({
				QureauLoginHandler: {
					refresh_token,
					verified,
					query,
					error,
				},
			}).info("ATOKO refresh_token");
		}

		const data: LoginWithIdResponse = await qureauLoginService.LoginWithId({
			request: LoginWithIdRequest.create({}),
			inferred: undefined, // TODOExtractInferred(headers, "1"),
			ext: TokenCreateExt.fromJSON({
				nonce: "",
				// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
			}),
		});

		if (!data.authenticated) {
			return c.redirect("/oauth2/login?error=access_denied");
		}
		// TODO: redirect_uri
		return c.redirect(
			`/?code=${data.authenticated.token}&state=${data.authenticated.state}`,
		);
	},
);
