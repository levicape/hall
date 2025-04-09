import { StatusCodes } from "http-status-codes";
import { QureauRegistrationRegisterCommandZod } from "../../../../_models/qureau/registration/QureauRegistrationRegisterCommandZod.js";
import type { RegistrationRegister } from "../../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { QureauResponse } from "../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../_protocols/qureau/tsnode/service/version.js";
import {
	type KSUIDGenerator,
	ksuidGenerator,
} from "../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauRegistrationService } from "../../service/QureauRegistration.mjs";

const registrationRegisterInfers = (
	headers: Record<string, string | undefined>,
	ksuidGenerator: KSUIDGenerator,
): RegistrationRegister["inferred"] => {
	return {
		requestId: headers.X_Request_Id ?? ksuidGenerator.syncString(),
		rootId: headers.X_Root_Id ?? ksuidGenerator.syncString(),
		responseId: ksuidGenerator.syncString(),
		// meeloId: request.header("X-Koala-Id") ?? ksuidGenerator.syncString(),
		// zugV1: request.header("Xz-V1") ?? ksuidGenerator.syncString(),
	};
};

// export const QureauRegistrationAnonymousHandler: Handler = async ({
// 	body,
// 	headers,
// }) => {
// 	const { success, error, data } =
// 		await QureauRegistrationRegisterCommandZod.safeParseAsync(body);

// 	if (!success || data === undefined) {
// 		return {
// 			status: StatusCodes.BAD_REQUEST,
// 			body: QureauResponse.toJSON({
// 				response: {
// 					$case: "error",
// 					value: {
// 						code: "BAD_REQUEST",
// 						message: "Invalid request body",
// 						cause: undefined,
// 						validations:
// 							error?.errors.map((issue) => ({
// 								code: issue.code,
// 								message: issue.message,
// 								cause: {
// 									code: "unknown",
// 									message: issue.path.join("."),
// 									cause: undefined,
// 									validations: [],
// 								},
// 								validations: [],
// 							})) || [],
// 					},
// 				},
// 				version: {
// 					response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 					qureau: QureauVersionEnum.QUREAU_V_V1,
// 				},
// 			}),
// 		};
// 	}

// 	const { user, generateAuthenticationToken } = data.request;

// 	const registerResponse = await qureauRegistrationService.Register({
// 		request: {
// 			user: {
// 				timezone: user.timezone,
// 				firstName: user.firstName,
// 				middleName: user.middleName,
// 				lastName: user.lastName,
// 				fullName: user.fullName,
// 				birthDate: user.birthDate,
// 				mobilePhone: user.mobilePhone,
// 				passwordChangeRequired: user.passwordChangeRequired,
// 				password: ksuidGenerator.syncString(),
// 				preferredLanguages: [],
// 				data: {},
// 				twoFactor: undefined,
// 				memberships: [],
// 				registrations: [],
// 			},
// 			registration: {
// 				preferredLanguages: [],
// 				roles: [],
// 			},
// 			eventInfo: {
// 				data: undefined,
// 				location: undefined,
// 			},
// 			generateAuthenticationToken,
// 		},
// 		inferred: registrationRegisterInfers(headers, ksuidGenerator),
// 		ext: data.ext,
// 	});

// 	return {
// 		status: StatusCodes.CREATED,
// 		body: QureauResponse.toJSON({
// 			response: {
// 				$case: "data",
// 				value: {
// 					qureau: {
// 						$case: "registration",
// 						value: {
// 							registration: {
// 								$case: "register",
// 								value: registerResponse,
// 							},
// 						},
// 					},
// 				},
// 			},
// 			version: {
// 				response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 				qureau: QureauVersionEnum.QUREAU_V_V1,
// 			},
// 		}),
// 	};
// };
