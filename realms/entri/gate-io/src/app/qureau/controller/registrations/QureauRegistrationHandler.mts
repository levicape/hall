import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
import { StatusCodes } from "http-status-codes";
import {
	RegistrationRegister,
	RegistrationRegisterRequest,
	type RegistrationRegisterResponse,
} from "../../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { QureauResponse } from "../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../_protocols/qureau/tsnode/service/version.js";
import { Qureau, version } from "../../Qureau.mjs";
import type { KSUIDGenerator } from "../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauRegistrationService } from "../../service/QureauRegistration.mjs";
import { QQUsersError } from "../../service/QureauUser.mjs";
import { qqZodError } from "../QureauBadRequestExceptionHandler.mjs";
import { QureauRegistrationRegisterCommandZod } from "./QureauRegistrationCommand.mjs";

const registrationRegisterInfers = (
	headers: Record<string, string | undefined>,
	ksuidGenerator: KSUIDGenerator,
): RegistrationRegister["inferred"] => {
	return {
		requestId: headers.X_Request_Id ?? ksuidGenerator.syncString(),
		rootId: headers.X_Root_Id ?? ksuidGenerator.syncString(),
		responseId: ksuidGenerator.syncString(),
		// meeloId: request.header("X-Koala-Id") ?? ksuidGenerator.syncString(),
		// zugV1: request.header("X-Zug-V1") ?? ksuidGenerator.syncString(),
	};
};

export const QureauRegistrationHandler = Qureau().createHandlers(
	HonoGuardAuthentication(async ({ principal }) => {
		return principal.$case !== "anonymous";
	}),
	async (c) => {
		// TODO: Http/Observability/Headers proto
		// const headerNonce = request.header("X-Nonce");
		const { body, status, json } = c;
		const { success, error, data } =
			await QureauRegistrationRegisterCommandZod.safeParseAsync(body);
		// const requestLoggingEnabled = isRequestLoggingEnabled();
		// requestLoggingEnabled &&
		// 	Logger.request({
		// 		QureauRegistrationHandler: {
		// 			request: {
		// 				body: process.env.NODE_ENV === "production" ? data : body,
		// 				headers,
		// 				error: requestLoggingEnabled
		// 					? JSON.stringify(error?.errors ?? {})
		// 					: error?.errors,
		// 			},
		// 		},
		// 	});

		if (error || data === undefined) {
			return json(
				QureauResponse.toJSON({
					error: qqZodError(error),
					version,
				}) as QureauResponse,
				StatusCodes.BAD_REQUEST,
			);
		}

		if (
			data?.request.generateAuthenticationToken === false &&
			true
			// TODO: Uncomment this when the protocol is updated
			// data?.request.registration.authenticationToken === undefined
		) {
			return json(
				QureauResponse.toJSON({
					error: {
						code: "QQ_MANUAL_AUTHENTICATION_TOKEN_REQUIRED",
						message:
							"generateAuthenticationToken = false requires a valid authenticationToken",
						cause: undefined,
						validations: [],
					},
					version,
				}) as QureauResponse,
				StatusCodes.BAD_REQUEST,
			);
		}
		// if (headerNonce !== body.ext.nonce) {
		//   throw new QQUsersError(
		//     StatusCodes.EXPECTATION_FAILED,
		//     {
		//       code: "QQ_BAD_REQUEST",
		//       reason: "QQ_NONCE_MISMATCH",
		//     },
		//   );
		// }

		const register: RegistrationRegisterResponse =
			await qureauRegistrationService
				.Register(
					RegistrationRegister.fromPartial({
						request: RegistrationRegisterRequest.fromJSON(data.request),
						// inferred: registrationRegisterInfers(headers, ksuidGenerator),
						ext: data.ext,
					}),
				)
				.catch((error) => {
					throw error;
				});

		return json(
			QureauResponse.toJSON({
				data: {
					registration: {
						register,
					},
				},
				version: {
					response: QureauResponseVersionEnum.QUREAU_R_LATEST,
					qureau: QureauVersionEnum.QUREAU_V_V1,
				},
			}) as QureauResponse,
			StatusCodes.CREATED,
		);
	},
);
