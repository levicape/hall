import { LoginToken } from "@levicape/spork/server/security/model/LoginToken";
import { ulid } from "ulidx";
import {
	type RegistrationRegister,
	RegistrationRegisterResponse,
} from "../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import type { RegistrationRegisterUserResponse } from "../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.user._.response.js";
import type { RegistrationRegisterUserRegistrationResponse } from "../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.user.registration.response.js";
import { RefreshToken } from "../../../_protocols/qureau/tsnode/domain/token/token._._.js";
import { User } from "../../../_protocols/qureau/tsnode/domain/user/user._._.js";
import type { QureauRegistrationService } from "../../../_protocols/qureau/tsnode/service/registration/qureau.registration.js";
import {
	type KSUIDGenerator,
	type QureauUserRegistrationRepository,
	ksuidGenerator,
	qureauUserRegistrationRepository,
} from "../repository/users/QureauUserRepository.Registration.mjs";

export class QureauRegistration implements QureauRegistrationService {
	constructor(
		// Probably belongs to QureauToken
		// private readonly jwtTools: JwtTools,
		private readonly ksuidGenerator: KSUIDGenerator,
		private readonly userApplicationRegistrations: QureauUserRegistrationRepository,
		// private readonly userRole: ITable<QureauUserRoleRow, QureauUserRoleKey>,
		// private readonly userRegistration: ITable<QureauUserRegistrationRow, QureauUserRegistrationKey>,
		// private readonly token: ITable<QureauTaskRow, QureauTaskKey>,
		// private readonly tokenByTenant:
	) {}

	Register = async (
		request: RegistrationRegister,
	): Promise<RegistrationRegisterResponse> => {
		const {
			user,
			registration,
			generateAuthenticationToken,
			// sendSetPasswordEmail,
			// skipVerification, // default false
			// TODO: update request body
			// eventInfo,
			// skipRegistrationVerification, // wont support
			// disableDomainBlock, // wont support
		} = request.request ?? {};

		const { applicationId, authenticationToken } = registration ?? {};

		const { requestId, responseId, rootId, meeloId, zugV1 } =
			request.inferred ?? {};

		const { nonce } = request.ext ?? {
			nonce: ulid(),
		};

		const userId = this.ksuidGenerator.syncString();
		// TODO: RegistrationRegisterUserRequest -> User mapping
		// Make sure enums are the same
		const userProto = User.fromPartial({
			...(user as User),
			id: userId,
			// deprecate
			uniqueUsername: `qureau;${userId}`,
		}) as User & { id: string };

		const nowunix = Date.now();
		const identity = RefreshToken.fromPartial({
			id: userId,
			userId,
			applicationId,
			startInstant: nowunix,
		});
		const refresh = RefreshToken.fromPartial({
			id: this.ksuidGenerator.syncString(),
			userId,
			applicationId,
			token: "", // await this.jwtTools.generateRefresh(userId),
			startInstant: nowunix,
		}) as RefreshToken & { id: string; userId: string };
		let authentication: RefreshToken & { id: string; userId: string };
		if (
			authenticationToken !== undefined &&
			authenticationToken !== "" &&
			authenticationToken !== null &&
			authenticationToken.length > 0 &&
			authenticationToken.length <= 1600
			// authenticationToken is JWT
		) {
			authentication = RefreshToken.fromPartial({
				id: this.ksuidGenerator.syncString(),
				userId,
				applicationId,
				token: authenticationToken,
				startInstant: nowunix,
			}) as RefreshToken & { id: string; userId: string };
		} else {
			authentication = RefreshToken.fromPartial({
				id: this.ksuidGenerator.syncString(),
				userId,
				applicationId,
				token: "", // await this.jwtTools.generateLogin(LoginToken.anonymous(userId)),
				startInstant: nowunix,
			}) as RefreshToken & { id: string; userId: string };
		}

		const {
			data: { registration: registrationData },
		} = await this.userApplicationRegistrations.createUserAndRegister(
			{
				applicationId: applicationId ?? "uwuqq1",
				user: userProto,
				genIdentityToken: async () => {
					return identity;
				},
				genAuthenticationToken: async () => {
					return authentication;
				},
				genRefreshToken: async () => {
					return refresh;
				},
			},
			{
				domain: {
					principal: {
						principalId: userId,
						principalAccess: "*",
						principalService: "qureau",
					},
					request: {
						idempotencyId: nonce,
						requestId,
						responseId,
						resourceVersion: new Date().toISOString(),
						executorId: rootId,
						now: nowunix.toString(),
					},
					scrypt: {
						components_: undefined,
						signature_: undefined,
						signingKey_: undefined,
						signatureFromHmacSha256StringToSignUsingSigningKey: "",
					},
				},
			},
		);

		return RegistrationRegisterResponse.fromPartial({
			registered: {
				refreshToken: refresh.token,
				refreshTokenId: refresh.id,
				registration: {
					...registrationData,
					insertInstant: nowunix,
				} as unknown as RegistrationRegisterUserRegistrationResponse,
				registrationVerificationId: "TODO: ",
				registrationVerificationOneTimeCode: "",
				token: authentication.token,
				tokenExpirationInstant: 0,
				user: {
					...userProto,
					insertInstant: nowunix,
					registrations: [...(user?.registrations ?? []), registrationData],
				} as unknown as RegistrationRegisterUserResponse,
			},
		} satisfies RegistrationRegisterResponse);
	};
}

export const qureauRegistrationService = new QureauRegistration(
	// jwtTools,
	ksuidGenerator,
	qureauUserRegistrationRepository,
);
