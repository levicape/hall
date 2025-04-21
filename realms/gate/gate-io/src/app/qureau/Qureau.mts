import { cuidKeygen } from "@levicape/spork/server/security/IdKeygen";
import type { JwtSignFnJose } from "@levicape/spork/server/security/JwtSignature";
import { createFactory } from "hono/factory";
import type { ParsedFormValue } from "hono/types";
import type { QureauResponse } from "../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../_protocols/qureau/tsnode/service/version.js";
import type { HttpMiddleware } from "../../http/HonoApp.mjs";
import {
	type QureauBaseClaims,
	QureauJwt,
	type QureauJwts,
} from "./QureauJwt.mjs";
import {
	type AuthorizeQueryConfiguration,
	AuthorizeQueryParamsZod,
} from "./controller/login/AuthorizeQueryParams.mjs";
import { TokenQueryParamsZod } from "./controller/tokens/TokenQueryParams.mjs";
import { qureauUserRegistrationRepository } from "./repository/users/QureauUserRepository.Registration.mjs";
import { QureauRegistration } from "./service/QureauRegistration.mjs";
import { QureauTokens } from "./service/QureauToken.mjs";

// https://gate.platform:10000/oauth2/anonymous?response_type=code&client_id=test&redirect_uri=/oauth2/redirect&scope=openid
export type QureauVariables = {
	Qureau: {
		entrypoint: `/oauth2/${"login" | "anonymous"}`;
		errorUri: `/oauth2/${"warn" | "logout"}`;
	};
	QureauQuery: {
		authorize: (
			query: Record<
				string,
				string[] | string | undefined | ParsedFormValue | ParsedFormValue[]
			>,
		) => ReturnType<ReturnType<typeof AuthorizeQueryParamsZod>["safeParse"]>;
		token: (
			query: Record<
				string,
				string[] | string | undefined | ParsedFormValue | ParsedFormValue[]
			>,
		) => ReturnType<ReturnType<typeof TokenQueryParamsZod>["safeParse"]>;
	};
	QureauJwt: ReturnType<typeof QureauJwt>;
	QureauRegistrationService: QureauRegistration;
	QureauTokens: QureauTokens;
};

const factory = createFactory<
	HttpMiddleware & {
		Variables: QureauVariables;
	}
>({
	initApp(app) {
		let authorize: QureauVariables["QureauQuery"]["authorize"] | undefined;
		let token: QureauVariables["QureauQuery"]["token"] | undefined;
		let qureauJwt: QureauJwts | undefined;
		let qureauRegistrationService: QureauRegistration | undefined;
		let qureauTokenService: QureauTokens | undefined;

		const qureau = {
			entrypoint: "/oauth2/anonymous",
			errorUri: "/oauth2/warn",
		} as const;

		app.use(async function QureauService(c, next) {
			c.set("Qureau", qureau);

			if (!authorize || !token) {
				const queryConfiguration: AuthorizeQueryConfiguration = {
					accessType: ["offline"],
					approvalPrompt: ["auto"],
					codeChallengeMethod: ["plain", "S256"],
					prompt: ["none", "login", "consent", "select_account"],
					subjectTypes: c.var.OauthConfiguration.subjectTypes,
					clients: c.var.OauthClients,
					responseTypes: [...c.var.OauthConfiguration.responseTypes],
					scopes: c.var.OauthConfiguration.scopes,
				};
				const authorizeQuery = AuthorizeQueryParamsZod(queryConfiguration);
				const tokenQuery = TokenQueryParamsZod(authorizeQuery);
				authorize = (query) => {
					return authorizeQuery.safeParse(query);
				};
				token = (query) => {
					return tokenQuery.safeParse(query);
				};
			}
			c.set("QureauQuery", {
				authorize,
				token,
			});

			const jwtSigner = c.var.JwtSignature as JwtSignFnJose<QureauBaseClaims>;
			if (!qureauJwt) {
				qureauJwt = QureauJwt({
					issuer: c.var.OauthConfiguration.issuer,
					jwtSigner,
				});
			}
			c.set("QureauJwt", qureauJwt);

			if (!qureauRegistrationService) {
				qureauRegistrationService = new QureauRegistration(
					qureauJwt,
					cuidKeygen,
					qureauUserRegistrationRepository,
				);
			}
			c.set("QureauRegistrationService", qureauRegistrationService);

			if (!qureauTokenService) {
				qureauTokenService = new QureauTokens(
					qureauJwt,
					// qureauTokenTable,
					// qureauTokenByTenant,
				);
			}
			c.set("QureauTokens", qureauTokenService);

			await next();
		});
	},
});

export const Qureau = () => {
	return factory;
};

export const version = {
	response: QureauResponseVersionEnum.QUREAU_R_LATEST,
	qureau: QureauVersionEnum.QUREAU_V_V1,
} as const satisfies QureauResponse["version"];

export const QureauAuthorizationEndpoint = "Login/Oauth2";
export const QureauEndSessionEndpoint = "Login/Session/Close";
export const QureauRevokeEndpoint = "Login/Session/Revoke";
export const QureauTokenEndpoint = "Login/Session/Token";
export const QureauUserinfoEndpoint = "Login/Session/Userinfo";
