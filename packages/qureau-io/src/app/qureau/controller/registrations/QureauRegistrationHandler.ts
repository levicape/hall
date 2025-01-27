import { Logger } from "@levicape/spork/server/logging";
import { StatusCodes } from "http-status-codes";
import { QureauRegistrationRegisterCommandZod } from "../../../../_models/qureau/registration/QureauRegistrationRegisterCommandZod.js";
import {
	type RegistrationRegister,
	RegistrationRegisterRequest,
	type RegistrationRegisterResponse,
} from "../../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { QureauResponse } from "../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../_protocols/qureau/tsnode/service/version.js";
import {
	type KSUIDGenerator,
	ksuidGenerator,
} from "../../repository/users/QureauUserRepository.Registration.js";
import { qureauRegistrationService } from "../../service/QureauRegistration.js";
import { QQUsersError } from "../../service/QureauUser.js";
import { qureauFormattedError } from "../QureauBadRequestExceptionHandler.js";

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

const translated = async (_: string, strings: Record<string, string>) => {
	return (key: string) => {
		return strings[key] ?? key;
	};
};

const en = translated("en", {
	QQ_BAD_REQUEST: "Invalid request body",
	"QQ_MANUAL_AUTHENTICATION_TOKEN_REQUIRED:":
		"Authentication token must be provided if generateAuthenticationToken is false",
	"registration.register.request.user.username.format":
		"Username must be alphanumeric",
	"registration.register.request.user.password.uppercase_required":
		"Password must contain an uppercase letter",
	"registration.register.request.user.password.lowercase_required":
		"Password must contain a lowercase letter",
	"registration.register.request.user.password.number_required":
		"Password must contain a number",
	"registration.register.request.user.password.symbol_required":
		"Password must contain a symbol",
}).then((t) => (key: string) => t(key) ?? key);

// export const QureauRegistrationHandler: Handler = async ({
// 	body,
// 	headers,
// 	set,
// }) => {
// 	// TODO: Http/Observability/Headers proto
// 	// const headerNonce = request.header("X-Nonce");

// 	const { success, error, data } =
// 		await QureauRegistrationRegisterCommandZod.safeParseAsync(body);
// 	const requestLoggingEnabled = isRequestLoggingEnabled();
// 	requestLoggingEnabled &&
// 		Logger.request({
// 			QureauRegistrationHandler: {
// 				request: {
// 					body: process.env.NODE_ENV === "production" ? data : body,
// 					headers,
// 					error: requestLoggingEnabled
// 						? JSON.stringify(error?.errors ?? {})
// 						: error?.errors,
// 				},
// 			},
// 		});

// 	if (error || data === undefined) {
// 		throw qureauFormattedError(success, error, await en);
// 	}

// 	if (
// 		data?.request.generateAuthenticationToken === false &&
// 		true
// 		// TODO: Uncomment this when the protocol is updated
// 		// data?.request.registration.authenticationToken === undefined
// 	) {
// 		throw new QQUsersError(StatusCodes.BAD_REQUEST, {
// 			code: (await en)("QQ_MANUAL_AUTHENTICATION_TOKEN_REQUIRED"),
// 			reason: "QQ_MANUAL_AUTHENTICATION_TOKEN_REQUIRED",
// 		});
// 	}
// 	// if (headerNonce !== body.ext.nonce) {
// 	//   throw new QQUsersError(
// 	//     StatusCodes.EXPECTATION_FAILED,
// 	//     {
// 	//       code: "QQ_BAD_REQUEST",
// 	//       reason: "QQ_NONCE_MISMATCH",
// 	//     },
// 	//   );
// 	// }

// 	const register: RegistrationRegisterResponse = await qureauRegistrationService
// 		.Register(
// 			RegistrationRegister.fromPartial({
// 				request: RegistrationRegisterRequest.fromJSON(data.request),
// 				inferred: registrationRegisterInfers(headers, ksuidGenerator),
// 				ext: data.ext,
// 			}),
// 		)
// 		.catch((error) => {
// 			throw error;
// 		});

// 	set.status = "Created";
// 	return QureauResponse.toJSON({
// 		response: {
// 			$case: "data",
// 			value: {
// 				qureau: {
// 					$case: "registration",
// 					value: {
// 						registration: {
// 							$case: "register",
// 							value: register,
// 						},
// 					},
// 				},
// 			},
// 		},
// 		version: {
// 			response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 			qureau: QureauVersionEnum.QUREAU_V_V1,
// 		},
// 	});
// };
