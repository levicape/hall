import type { ITable } from "@levicape/spork/server/client/table";
import { Logger } from "@levicape/spork/server/logging";
import KSUID from "ksuid";
import type { RefreshToken } from "../../../../_protocols/qureau/tsnode/domain/token/token._._.js";
import {
	type User,
	UserContentStatus,
} from "../../../../_protocols/qureau/tsnode/domain/user/user._._.js";
import { UserRegistration } from "../../../../_protocols/qureau/tsnode/domain/user/user._._.registration._._.js";
import { QureauTableUsersEntity } from "../../../../_protocols/qureau/tsnode/table/user/table.user._.js";
import {
	QQUserNameExistsError,
	QQUsersError,
} from "../../service/QureauUser.js";
import {
	type QureauUserTokenRepository,
	qureauUserTokenRepository,
} from "./QureauUserRepository.Token.js";
import {
	type QureauRepositoryProps,
	type QureauUserRepository,
	qureauUserRepository,
} from "./QureauUserRepository.js";
import { QureauUserApplicationRow } from "./user/QureauUserRow.Application.js";
import type { QureauUserTokenRow } from "./user/QureauUserRow.Token.js";
import type { QureauUserKey, QureauUserRow } from "./user/QureauUserRow.js";
import { qureauUsersApplicationsTable } from "./user/QureauUsersTable.js";

export type CreateUserAndRegisterProps = {
	applicationId: string;
	user: User & { id: string };
	genIdentityToken: () => Promise<RefreshToken>;
	genAuthenticationToken: () => Promise<
		RefreshToken & { userId: string; id: string }
	>;
	genRefreshToken: () => Promise<RefreshToken & { userId: string; id: string }>;
};

export type CreateUserAndRegisterResult = {
	rows: {
		user: QureauUserRow;
		registration: QureauUserApplicationRow;
		tokens: QureauUserTokenRow[];
		// credential?: QureauUserCredentialRow
	};
	data: {
		user: User;
		registration: UserRegistration;
		tokens: RefreshToken[];
	};
};

export class QureauUserRegistrationRepository {
	constructor(
		private readonly ksuidGenerator: KSUIDGenerator,
		private readonly users: ITable<QureauUserApplicationRow, QureauUserKey>,
		private readonly userRepository: QureauUserRepository,
		private readonly userTokenRepository: QureauUserTokenRepository,
	) {}

	registrationRowForUserRegistration = async (
		user: User & { id: string },
		userRegistration: UserRegistration,
		props: QureauRepositoryProps,
	): Promise<QureauUserApplicationRow> => {
		const { applicationId } = userRegistration;
		const nowunix = Date.now();
		const nowiso = new Date(nowunix).toISOString();

		const row = new QureauUserApplicationRow(
			applicationId as "uwu",
			user.id,
			user,
			userRegistration,
			nowiso,
			props.domain.principal,
			{
				...props.domain.request,
				resourceVersion: nowiso,
			},
			props.domain.scrypt,
		);

		return row;
	};

	createUserAndRegister = async (
		register: CreateUserAndRegisterProps,
		props: QureauRepositoryProps,
	): Promise<CreateUserAndRegisterResult> => {
		const {
			applicationId,
			user,
			genAuthenticationToken: generateAuthenticationToken,
			genRefreshToken: generateRefreshToken,
		} = register;
		const userrow = QureauTableUsersEntity.toJSON(
			await this.userRepository.userRowForUser(user, props),
		) as QureauUserRow;
		const tokens = {
			authenticationToken: await generateAuthenticationToken(),
			refreshToken: await generateRefreshToken(),
		};

		const registration = UserRegistration.fromPartial({
			applicationId,
			authenticationToken: tokens.authenticationToken?.id ?? "owo",
			cleanSpeakId: undefined,
			id: this.ksuidGenerator.syncString(),
			timezone: "UTC",
			username: user.username,
			usernameStatus: UserContentStatus.UserContentStatus_ACTIVE,
			verified: false,
			verifiedInstant: 0,
			preferredLanguages: user.preferredLanguages,
			lastLoginInstant: undefined,
			lastUpdateInstant: undefined,
			//
			roles: [
				{
					name: "user",
					permissions: [
						{
							entity: user.id,
							resource: userrow.pk,
							access: "*",
						},
					],
				},
			],
		});

		const registrationrow = QureauTableUsersEntity.toJSON(
			await this.registrationRowForUserRegistration(user, registration, props),
		) as QureauUserApplicationRow;
		const tokenrows = [];
		for (const token of Object.values(tokens)) {
			if (token) {
				const tokenrow = await this.userTokenRepository.tokenRowForRefreshToken(
					token,
					props,
				);
				if (tokenrow) {
					tokenrows.push(
						QureauTableUsersEntity.toJSON(tokenrow) as QureauUserTokenRow,
					);
				}
			}
		}

		try {
			await this.users.insert(userrow.pk, [
				userrow,
				registrationrow,
				...(tokenrows ?? []),
			]);
		} catch (error) {
			wrapAndThrow(error);
		}

		return {
			rows: {
				user: userrow,
				registration: registrationrow,
				tokens: tokenrows,
			},
			data: {
				user,
				registration,
				tokens: [tokens.authenticationToken, tokens.refreshToken],
			},
		};
	};
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const wrapAndThrow = (error: unknown) => {
	const dbError = error as { table?: string; constraint?: string };
	if (dbError.table !== undefined && dbError.constraint !== undefined) {
		if (dbError.constraint.includes("pk_unique_key")) {
			throw new QQUsersError(
				400,
				new QQUserNameExistsError("User must have a unique username"),
			);
		}
	}
	Logger.warn({
		QureauUserRegistrationRepository: {
			error: {
				error,
				stringy: JSON.stringify(error),
			},
		},
	});
	throw error;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const ksuidGenerator = {
	syncString: () => KSUID.randomSync().string,
};
export type KSUIDGenerator = typeof ksuidGenerator;
export const qureauUserRegistrationRepository =
	new QureauUserRegistrationRepository(
		ksuidGenerator,
		qureauUsersApplicationsTable,
		qureauUserRepository,
		qureauUserTokenRepository,
	);
