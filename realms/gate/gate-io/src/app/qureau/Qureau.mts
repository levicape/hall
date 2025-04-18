import { cuidKeygen } from "@levicape/spork/server/security/IdKeygen";
import type { JwtSignFnJose } from "@levicape/spork/server/security/JwtSignature";
import { createFactory } from "hono/factory";
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
import { qureauUserRegistrationRepository } from "./repository/users/QureauUserRepository.Registration.mjs";
import { QureauRegistration } from "./service/QureauRegistration.mjs";
import { QureauTokens } from "./service/QureauToken.mjs";

const factory = createFactory<
	HttpMiddleware & {
		Variables: {
			QureauJwt: ReturnType<typeof QureauJwt>;
			QureauRegistrationService: QureauRegistration;
			QureauTokens: QureauTokens;
		};
	}
>({
	initApp(app) {
		let qureauJwt: QureauJwts | undefined;
		let qureauRegistrationService: QureauRegistration | undefined;
		let qureauTokenService: QureauTokens | undefined;

		app.use(async (c, next) => {
			const jwtSigner = c.var.JwtSignature as JwtSignFnJose<QureauBaseClaims>;
			if (!qureauJwt) {
				qureauJwt = QureauJwt({
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
