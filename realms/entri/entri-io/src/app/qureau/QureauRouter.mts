import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
// import {
// 	QureauErrorHandler,
// 	QureauExceptionResolver,
// } from "./controller/QureauExceptionResolver.js";
// import { QureauLoginHandler } from "./controller/login/QureauLoginHandler.js";
// import { QureauRegistrationAnonymousHandler } from "./controller/registrations/QureauRegistrationAnonymousHandler.js";
// import { QureauRegistrationHandler } from "./controller/registrations/QureauRegistrationHandler.js";
// import { QureauUsersByIdViewHandler } from "./controller/users/byId/QureauUsersByIdViewHandler.js";
// import { QureauUsersPrincipalViewHandler } from "./controller/users/principal/QureauUsersPrincipalViewHandler.js";
// import { QureauUsersQueryHandler } from "./controller/users/query/QureauUsersQueryHandler.js";
// import { QureauUsersViewHandler } from "./controller/users/view/QureauUsersViewHandler.js";
import { Hono } from "hono";
// import Elysia, { type ErrorHandler, type InferContext } from "elysia";
// import { pluginGracefulServer } from "graceful-server-elysia";
import { QureauResponse } from "../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../_protocols/qureau/tsnode/service/version.js";

// const unauthorizedResponse = QureauResponse.toJSON({
// 	response: {
// 		$case: "error",
// 		value: {
// 			code: "UNAUTHORIZED",
// 			message: "Forbidden",
// 			cause: undefined,
// 			validations: [],
// 		},
// 	},
// 	version: {
// 		response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 		qureau: QureauVersionEnum.QUREAU_V_V1,
// 	},
// });

const app = () => new Hono();

export const QureauRouter = (root: Hono) =>
	root
		.route(
			"/user",
			new Hono().use(
				HonoGuardAuthentication(async ({ principal }) => {
					return principal.$case === "authenticated";
				}),
			),
		)
		.route(
			"/authenticated",
			app().use(
				HonoGuardAuthentication(async ({ principal }) => {
					return principal.$case !== "anonymous";
				}),
			),
			// .post("/Users/-/", QureauUsersViewHandler)
			// .post("/Users/!!/:userId", QureauUsersByIdViewHandler)
		)
		.route(
			"/Anon",
			app().use(
				HonoGuardAuthentication(async ({ principal }) => {
					return principal.$case === "anonymous";
				}),
			),
			// .post("/Login/~/", QureauLoginHandler)
			// .post("/Login/-/", QureauRegistrationAnonymousHandler)
		);
// .route(
// 	"/NotAdmin",
// 	app().use(
// 		HonoGuardAuthentication(async ({ principal }) => {
// 			return principal.$case !== "admin";
// 		}),
// 	),

// .post("/Users/-/Registration/", QureauRegistrationHandler)
// .post("/Users/!+/", QureauUsersQueryHandler)
// );
