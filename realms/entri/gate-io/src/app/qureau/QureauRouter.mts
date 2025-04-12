import { QureauResponse } from "../../_protocols/qureau/tsnode/service/qureau._.js";
import { Qureau, version } from "./Qureau.mjs";
import {
	QureauLoginHandler,
	QureauLoginPath,
} from "./controller/login/QureauLoginHandler.mjs";
import { QureauRegistrationAnonymousHandler } from "./controller/registrations/QureauRegistrationAnonymousHandler.mjs";
import { QureauRegistrationHandler } from "./controller/registrations/QureauRegistrationHandler.mjs";
import { QureauUsersPrincipalViewHandler } from "./controller/users/principal/QureauUsersPrincipalViewHandler.mjs";

export const QureauRouter = Qureau()
	.createApp()
	.post(QureauLoginPath, ...QureauLoginHandler)
	.post("/Login/Anonymous", ...QureauRegistrationAnonymousHandler)
	// .post("/Login/EndSession", anonymous, QureauLoginHandler)
	// .post("/Login/Revoke", anonymous, QureauLoginHandler)
	.post("/Login/Token", ...QureauLoginHandler)
	.post("/Login/Userinfo", ...QureauUsersPrincipalViewHandler)
	.post("/Users/Registration", ...QureauRegistrationHandler);

export const QureauNotFound = Qureau().createHandlers(async (c) => {
	return c.json(
		QureauResponse.toJSON({
			error: {
				code: "UNPROCESSABLE_ENTITY",
				message: "Could not process the request",
				cause: undefined,
				validations: [],
			},
			version,
		}) as QureauResponse,
		409,
	);
});
