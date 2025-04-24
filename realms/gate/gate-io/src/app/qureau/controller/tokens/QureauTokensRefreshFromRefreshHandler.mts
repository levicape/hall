import {
	cuidKeygen,
	ulidKeygen,
} from "@levicape/spork/server/security/IdKeygen";
import type { Context } from "hono";
import { validator } from "hono/validator";
import type { JWTVerifyResult } from "jose";
import { serializeError } from "serialize-error";
import { withQuery } from "ufo";
import { prettifyError } from "zod";
import { TokenRefreshRetrieveByIdWithId } from "../../../../_protocols/qureau/tsnode/domain/token/refresh/retrieveByIdWithId/token.refresh.retrieveByIdWithId.js";
import { Qureau, type QureauVariables } from "../../Qureau.mjs";
import type { QureauBaseClaims } from "../../QureauJwt.mjs";

export const QureauTokensRefreshFromRefreshHandler = Qureau().createHandlers(
	validator("form", async (s, c: Context<{ Variables: QureauVariables }>) => {
		const { login: entrypoint, errorUri } = c.var.Qureau;
		const form = c.var.Query.token(s);
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
		let verified: JWTVerifyResult["payload"] | undefined;
		let error: unknown | undefined = undefined;

		switch (query.grant_type) {
			case "authorization_code": {
				const { code } = query;
				try {
					verified = await c.var.Jwt?.decode?.(
						Buffer.from(code ?? "", "base64").toString("ascii"),
						query.client_id,
					);
				} catch (e) {
					error = serializeError(e);
					c.var.Logging.withMetadata({ error: e }).withError(e);
				}
				if ((verified as QureauBaseClaims)?.token_use !== "code") {
					c.var.Logging.withMetadata({
						QureauLoginHandler: {
							verified,
							query,
							error,
						},
					}).warn("Token use is not code");
					return c.json(
						withQuery(c.var.Qureau.errorUri, {
							error: "invalid_request",
						}),
						400,
					);
				}
				break;
			}
			case "refresh_token": {
				const { refresh_token } = query;
				try {
					verified = (
						await c.var.JwtVerification.jwtVerify?.(refresh_token ?? "", {})
					)?.payload;
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
				if ((verified as QureauBaseClaims)?.token_use !== "refresh") {
					c.var.Logging.withMetadata({
						QureauLoginHandler: {
							verified,
							query,
							error,
						},
					}).warn("Token use is not refresh");
					return c.json(
						withQuery(c.var.Qureau.errorUri, {
							error: "invalid_request",
						}),
						400,
					);
				}
				break;
			}
			default: {
				c.var.Logging.withMetadata({
					QureauLoginHandler: {
						query,
						error,
					},
				}).warn("Unknown grant type");
				return c.json(
					withQuery(c.var.Qureau.errorUri, {
						error: "invalid_request",
					}),
					400,
				);
			}
		}

		const data = await c.var.Tokens.RetrieveTokenByIdWithId(
			TokenRefreshRetrieveByIdWithId.create({
				request: {
					tokenId: verified?.jti,
				},
				inferred: {
					principalId: verified?.sub,
				},
			}),
		);

		if (!data.jwt) {
			c.var.Logging.withMetadata({
				QureauLoginHandler: {
					data,
					query,
					error,
				},
			}).warn("Revoked token requested");
			return c.json(
				withQuery(c.var.Qureau.errorUri, {
					error: "invalid_request",
				}),
				400,
			);
		}

		const session = ulidKeygen.ksort();
		return c.json({
			access_token: await c.var.Jwt.access((token) =>
				token
					.setJti(cuidKeygen.srand())
					.setSubject(data.jwt?.userId ?? "")
					.setAudience(query.client_id),
			),
			id_token: await c.var.Jwt.id(query.nonce ?? "<NONE>", (token) =>
				token
					.setSubject(data.jwt?.userId ?? "")
					.setAudience(query.client_id)
					.setJti(session),
			),
			token_type: "Bearer",
			expires_in: c.var.Jwt.accessSeconds,
			refresh_token: await c.var.Jwt.refresh((token) =>
				token
					.setJti(data.jwt?.id ?? "")
					.setSubject(session)
					.setAudience(query.client_id),
			),
		});
	},
);
