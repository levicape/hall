import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
import { cuidKeygen } from "@levicape/spork/server/security/IdKeygen";
import type { Context } from "hono";
import { validator } from "hono/validator";
import type { JWTVerifyResult } from "jose";
import { serializeError } from "serialize-error";
import { withQuery } from "ufo";
import { prettifyError } from "zod";
import { TokenRefreshRetrieveByIdWithId } from "../../../../_protocols/qureau/tsnode/domain/token/refresh/retrieveByIdWithId/token.refresh.retrieveByIdWithId.js";
import { Qureau, type QureauVariables } from "../../Qureau.mjs";

export const QureauTokensRefreshFromRefreshHandler = Qureau().createHandlers(
	validator("form", async (s, c: Context<{ Variables: QureauVariables }>) => {
		const { entrypoint, errorUri } = c.var.Qureau;
		const form = c.var.QureauQuery.token(s);
		if (!form.success) {
			return c.redirect(
				withQuery(errorUri, {
					...s,
					entrypoint,
					error: "invalid_request",
					error_description: prettifyError(form.error),
				}),
			);
		}

		return form.data;
	}),
	async (c) => {
		const query = c.req.valid("form");
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

		const data = await c.var.QureauTokens.RetrieveTokenByIdWithId(
			TokenRefreshRetrieveByIdWithId.create({
				request: {
					tokenId: verified?.payload?.jti,
				},
			}),
		);

		if (!data.jwt) {
			return c.json(
				withQuery(c.var.Qureau.errorUri, {
					error: "invalid_request",
				}),
				400,
			);
		}

		return c.json({
			access_token: c.var.QureauJwt.access((token) =>
				token.setJti(cuidKeygen.srand()).setSubject(data.jwt?.userId ?? ""),
			),
			token_type: "Bearer",
			expires_in: c.var.QureauJwt.accessSeconds,
			refresh_token: c.var.QureauJwt.refresh((token) =>
				token.setJti(data.jwt?.id ?? "").setSubject(data.jwt?.userId ?? ""),
			),
		});
	},
);
