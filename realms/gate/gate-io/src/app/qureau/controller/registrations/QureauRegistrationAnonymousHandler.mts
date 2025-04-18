import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
import {
	type KeygenKsort,
	cuidKeygen,
	ulidKeygen,
} from "@levicape/spork/server/security/IdKeygen";
import { createMiddleware } from "hono/factory";
import { validator } from "hono/validator";
import {
	filterQuery,
	normalizeURL,
	withQuery,
	withoutFragment,
	withoutTrailingSlash,
} from "ufo";
import { prettifyError } from "zod";
import type { RegistrationRegister } from "../../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { Qureau } from "../../Qureau.mjs";
import { LoginQueryParamsZod } from "../login/LoginQueryParams.mjs";
import { QureauRegistrationRegisterCommandZod } from "./QureauRegistrationCommand.mjs";

const registrationRegisterInfers = (
	headers: Record<string, string | undefined>,
	keygen: KeygenKsort,
): RegistrationRegister["inferred"] => {
	return {
		requestId: headers.X_Request_Id ?? keygen.ksort(),
		rootId: headers.X_Root_Id ?? keygen.ksort(),
		responseId: keygen.ksort(),
		// meeloId: request.header("X-Koala-Id") ?? ksuidGenerator.syncString(),
		// zugV1: request.header("Xz-V1") ?? ksuidGenerator.syncString(),
	};
};

export type QureauLoginQueryParams = {
	errorUri: string;
};
export const QureauErrorRedirectMiddleware = (props: QureauLoginQueryParams) =>
	createMiddleware<{
		Variables: {
			ErrorRedirect: string;
		};
	}>(async (c, next) => {
		c.set("ErrorRedirect", props.errorUri);
		await next();
	});

export const ERROR_REDIRECT_URI = async () => "/oauth2/anonymous";
export const QureauRegistrationAnonymousHandler = Qureau().createHandlers(
	HonoGuardAuthentication(async ({ principal }) => {
		return principal.$case === "anonymous";
	}),
	QureauErrorRedirectMiddleware({
		errorUri: await ERROR_REDIRECT_URI(),
	}),
	validator("query", async (s, c) => {
		const query = await LoginQueryParamsZod.safeParseAsync(s);
		if (!query.success) {
			return c.redirect(
				withQuery(c.var.ErrorRedirect, {
					...s,
					error: "invalid_request",
					error_description: prettifyError(query.error),
				}),
			);
		}

		return query.data;
	}),
	async (c) => {
		const body = structuredClone(await c.req.parseBody({ dot: true })) ?? {};
		const form =
			await QureauRegistrationRegisterCommandZod.safeParseAsync(body);
		if (!form.success) {
			return c.redirect(
				withQuery(c.var.ErrorRedirect, {
					...c.req.valid("query"),
					error: "invalid_request",
					error_description: prettifyError(form.error),
				}),
			);
		}

		const { ext } = form.data;
		const salt = cuidKeygen.srand();
		const registerResponse = await c.var.QureauRegistrationService.Register({
			request: {
				user: {
					timezone: undefined,
					firstName: ulidKeygen.ksort(),
					middleName: undefined,
					lastName: undefined,
					fullName: undefined,
					birthDate: undefined,
					mobilePhone: undefined,
					passwordChangeRequired: false,
					password: salt,
					preferredLanguages: [],
					data: {
						salt,
					},
					twoFactor: undefined,
					memberships: [],
					registrations: [],
				},
				registration: {
					preferredLanguages: [],
					roles: [],
				},
				eventInfo: {
					data: undefined,
					location: undefined,
				},
				generateAuthenticationToken: true,
			},
			inferred: registrationRegisterInfers(c.req.header(), ulidKeygen),
			ext,
		});
		if (!registerResponse.registered) {
			c.var.Logging.withMetadata({
				QureauRegistrationAnonymousHandler: {
					registerResponse,
				},
			}).warn("Registration failed");

			return c.redirect(
				withQuery(c.var.ErrorRedirect, {
					...c.req.valid("query"),
					error: "access_denied",
					error_description: "Registration failed",
				}),
			);
		}

		const code = await c.var.QureauJwt.code((jwt) =>
			jwt.setSubject(registerResponse.registered?.refreshTokenId ?? "<RT>"),
		);

		const { state, redirect_uri } = c.req.valid("query");
		const url = withQuery(
			withoutTrailingSlash(
				normalizeURL(filterQuery(withoutFragment(redirect_uri), () => false)),
				true,
			),
			{
				code,
				state,
			},
		);
		return c.redirect(url);
	},
);
