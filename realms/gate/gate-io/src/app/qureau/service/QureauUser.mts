import type { BaseError, ServiceError } from "@levicape/spork/server/Error";
import type {
	UserRetrieve,
	UserRetrieveResponse,
} from "../../../_protocols/qureau/tsnode/domain/user/retrieve/user.retrieve.js";
import {
	type UserRetrieveWithId,
	UserRetrieveWithIdResponse,
	UserRetrieveWithIdResponse_UserResponse,
} from "../../../_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import {
	type UserSearchByQueryCommand,
	UserSearchByQueryResponse,
} from "../../../_protocols/qureau/tsnode/domain/user/searchByQuery/user.searchByQuery.js";
import type { User } from "../../../_protocols/qureau/tsnode/domain/user/user._._.js";
import type { QureauUserService } from "../../../_protocols/qureau/tsnode/service/user/qureau.user.js";
import type { QureauUserRepository } from "../repository/users/QureauUserRepository.mjs";
import { QureauUserRow } from "../repository/users/user/QureauUserRow.mjs";

export class QQUserNotFoundError implements BaseError {
	readonly code: string;
	readonly reason: string;

	constructor(reason: string) {
		this.code = "QQUSER_NOT_FOUND";
		this.reason = reason;
	}
}

export class QQUserNameExistsError implements BaseError {
	readonly code: string;
	readonly reason: string;

	constructor(reason: string) {
		this.code = "QQUSER_NAME_EXISTS";
		this.reason = reason;
	}
}

export class QQUsersError extends Error implements ServiceError {
	error: { rootCauses?: BaseError[] } & BaseError;

	constructor(
		readonly status: number,
		readonly cause: BaseError,
		readonly validations?: BaseError[],
		message?: string,
		readonly field?: string,
	) {
		super("QQUSERS_ERROR");
		if (message) {
			this.message = message;
		}

		this.error = {
			code: "QQUSERS_ERROR",
			reason: "Service error",
			rootCauses: [cause],
			date: new Date().toISOString(),
		};
	}
}

export class QureauUser implements QureauUserService {
	private readonly users: QureauUserRepository;
	constructor(users: QureauUserRepository) {
		this.users = users;
	}
	SearchUsersByQueryWithId = async (
		request: UserSearchByQueryCommand,
	): Promise<UserSearchByQueryResponse> => {
		const {
			filters = [] as string[],
			orderBy = "default",
			continuation,
			limit,
		} = request.request ?? {};
		const top = limit ?? 10;
		const skip = 0;
		const users = await this.users.searchUsers("&User!;", {
			filters: filters as string[],
			orderBy: orderBy as string,
			top,
			skip,
			continuationToken: continuation,
		});

		return UserSearchByQueryResponse.create({
			result: users.map((user) => QureauUserRow.toData(user)),
			token: users.length === top ? users[users.length - 1]?.pk : undefined,
		});
	};

	RetrieveUserWithId = async (
		request: UserRetrieveWithId,
	): Promise<UserRetrieveWithIdResponse> => {
		const { userId } = request.request ?? {};
		if (!userId) {
			throw new Error("Invalid request");
		}

		const withId: User | undefined = await this.users.readById(userId);
		if (!withId) {
			throw new QQUserNotFoundError("User not found");
		}

		const response: UserRetrieveWithIdResponse_UserResponse =
			UserRetrieveWithIdResponse_UserResponse.fromPartial({
				...withId,
				password: "",
				salt: "",
				memberships: [],
				// TODO: this.userRegistrations
				registrations: [],
			});

		return UserRetrieveWithIdResponse.create({
			withId: response,
		});
	};

	RetrieveUser = async (
		request: UserRetrieve,
	): Promise<UserRetrieveResponse> => {
		const {
			qqTenantId,
			username,
			verificationId,
			changePasswordId,
			email,
			loginId,
		} = request.request ?? {};
		let user: QureauUserRow | undefined;

		// LoginId is either username or email

		// if (username) {
		//     user = await users.findByUsername(username);
		// } else if (email) {
		//     user = await users.findByEmail(email);
		// } else if (loginId) {
		//     user = await users.findByLoginId(loginId);
		// } else if (verificationId) {
		//     user = await users.findByVerificationId(verificationId);
		// } else if (changePasswordId) {
		//     user = await users.findByChangePasswordId(changePasswordId);
		// } else {
		//     throw new Error("Invalid request");
		// }

		if (!user) {
			throw new Error("User not found");
		}

		return {
			retrieved: {
				active: true,
				birthDate: "2000-01-01",
				breachedPasswordLastCheckedInstant: 0,
				breachedPasswordStatus: 0,
				cleanSpeakId: "mocked-clean-speak-id",
				data: undefined,
				email: "mocked-email@example.com",
				expiry: 0,
				firstName: "Mocked",
				fullName: "Mocked User",
				id: "mocked-id",
				imageUrl: "mocked-image-url",
				insertInstant: 0,
				lastName: "User",
				lastUpdateInstant: 0,
				memberships: [],
				middleName: "Mocked",
				mobilePhone: "1234567890",
				parentEmail: "mocked-parent-email@example.com",
				registrations: [],
				salt: "mocked-salt",
				tenantId: "mocked-tenant-id",
				timezone: "UTC",
				twoFactor: undefined,
				uniqueUsername: "mocked-unique-username",
				username: "mocked-username",
				usernameStatus: 0,
				verified: true,
				verifiedInstant: 0,
				preferredLanguages: [],
				connectorId: "mocked-connector-id",
				encryptionScheme: "mocked-encryption-scheme",
				factor: 0,
				lastRegistrationInstant: 0,
				password: "mocked-password",
				passwordChangeReason: 0,
				passwordChangeRequired: true,
				passwordLastUpdateInstant: 0,
			},
		};
	};
}
