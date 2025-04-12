import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
import { StatusCodes } from "http-status-codes";
import type { RegistrationRegister } from "../../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { QureauResponse } from "../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../_protocols/qureau/tsnode/service/version.js";
import { Qureau } from "../../Qureau.mjs";
import {
	type KSUIDGenerator,
	ksuidGenerator,
} from "../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauRegistrationService } from "../../service/QureauRegistration.mjs";
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
		// zugV1: request.header("Xz-V1") ?? ksuidGenerator.syncString(),
	};
};

export const QureauRegistrationAnonymousHandler = Qureau().createHandlers(
	HonoGuardAuthentication(async ({ principal }) => {
		return principal.$case === "anonymous";
	}),
	async ({ body, json }) => {
		const { success, error, data } =
			await QureauRegistrationRegisterCommandZod.safeParseAsync(body);

		if (!success || data === undefined) {
			return json(
				QureauResponse.toJSON({
					error: qqZodError(error),
					version: {
						response: QureauResponseVersionEnum.QUREAU_R_LATEST,
						qureau: QureauVersionEnum.QUREAU_V_V1,
					},
				}) as QureauResponse,
				StatusCodes.BAD_REQUEST,
			);
		}

		const { user, generateAuthenticationToken } = data.request;

		const registerResponse = await qureauRegistrationService.Register({
			request: {
				user: {
					timezone: user.timezone,
					firstName: user.firstName,
					middleName: user.middleName,
					lastName: user.lastName,
					fullName: user.fullName,
					birthDate: user.birthDate,
					mobilePhone: user.mobilePhone,
					passwordChangeRequired: user.passwordChangeRequired,
					password: ksuidGenerator.syncString(),
					preferredLanguages: [],
					data: {},
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
				generateAuthenticationToken,
			},
			inferred: undefined, //registrationRegisterInfers(headers, ksuidGenerator),
			ext: data.ext,
		});

		return json(
			QureauResponse.toJSON({
				data: {
					registration: {
						register: registerResponse,
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
