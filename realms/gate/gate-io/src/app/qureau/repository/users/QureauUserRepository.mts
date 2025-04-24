import type { ITable } from "@levicape/spork/server/client/table/ITable";
import { User } from "../../../../_protocols/qureau/tsnode/domain/user/user._._.js";
import type { QureauDomainablePrincipalBlob } from "../../../../_protocols/qureau/tsnode/entity/entity._.principal.blob.js";
import type { QureauDomainableRequestBlob } from "../../../../_protocols/qureau/tsnode/entity/entity._.request.blob.js";
import type { QureauDomainableScryptBlob } from "../../../../_protocols/qureau/tsnode/entity/entity._.scrypt.blob.js";
import { QureauTableUsersEntity } from "../../../../_protocols/qureau/tsnode/table/user/table.user._.js";
import {
	QQUserNotFoundError,
	QQUsersError,
} from "../../service/QureauUser.mjs";
import {
	type QureauUserEntity,
	type QureauUserKey,
	QureauUserRow,
} from "./user/QureauUserRow.mjs";

type QureauDomainable = {
	request: QureauDomainableRequestBlob;
	principal: QureauDomainablePrincipalBlob;
	scrypt: QureauDomainableScryptBlob;
};
export type QureauRepositoryProps = {
	domain: QureauDomainable;
};

export class QureauUserRepository {
	constructor(
		private readonly users: ITable<QureauUserRow, QureauUserKey>,
		private readonly usersByApplicationIds: ITable<
			QureauUserRow,
			QureauUserKey
		>,
		private readonly usersByUsernames: ITable<QureauUserRow, QureauUserKey>,
		private readonly usersByEmails: ITable<QureauUserRow, QureauUserKey>,
		private readonly usersByProviderResolvedIds: ITable<
			QureauUserRow,
			QureauUserKey
		>,
		private readonly usersByTokenIds: ITable<QureauUserRow, QureauUserKey>,
		private readonly usersByUserRegistrationIds: ITable<
			QureauUserRow,
			QureauUserKey
		>,
		private readonly userSearchIndex: ITable<QureauUserRow, QureauUserKey>,
	) {}

	async userRowForUser(
		user: User & { id: string },
		props: QureauRepositoryProps,
	): Promise<QureauUserRow> {
		const nowunix = Date.now();
		const nowiso = new Date(nowunix).toISOString();
		const row = new QureauUserRow(
			user.id,
			user,
			nowiso,
			props.domain.principal,
			{
				...props.domain.request,
				resourceVersion: nowiso,
			},
			props.domain.scrypt,
		);

		return row;
	}

	async readById(userId: string, props?: QureauRepositoryProps): Promise<User> {
		const userrow = await this.users.getById(
			userId,
			"&User!;" as QureauUserEntity,
		);
		if (!userrow) {
			throw new QQUsersError(
				410,
				new QQUserNotFoundError(`User not found: ${userId}`),
			);
		}

		return QureauUserRow.toData(QureauUserRow.rowToEntity(userrow));
	}

	async readByUsername(
		username: string,
		props?: QureauRepositoryProps,
	): Promise<QureauUserRow> {
		// TODO: Fix this
		const raw = await this.usersByUsernames.getById(
			username,
			"&User!;" as QureauUserEntity,
		);
		return raw;
	}

	async fullUserEntity(
		userId: string,
		props?: QureauRepositoryProps,
	): Promise<User> {
		const userdata = await this.users.readPartition(userId, "pk", {});
		const userrow = await userdata.next();
		if (userrow.done) {
			throw new QQUsersError(
				410,
				new QQUserNotFoundError(`User not found: ${userId}`),
			);
		}
		bigintToNumber(userdata);

		const rowEntity = QureauTableUsersEntity.toJSON(
			userrow.value,
		) as QureauUserRow;
		const jsondata =
			typeof rowEntity.jsondata === "string"
				? JSON.parse(rowEntity.jsondata)
				: rowEntity.jsondata;
		const user = User.fromJSON(jsondata);

		// Read rest into array
		const alluserdata = [];
		for await (const row of userdata) {
			alluserdata.push(row);
		}

		return user;
	}

	async searchUsers(
		by: QureauUserEntity,
		{
			filters,
			orderBy,
			top,
			skip,
			continuationToken,
		}: {
			filters: string[];
			orderBy: string;
			top?: number;
			skip?: number;
			continuationToken?: string;
		},
	): Promise<QureauUserRow[]> {
		const query = {
			filters,
			orderBy,
			top,
			skip,
			continuationToken,
		};
		const result = await this.userSearchIndex.readPartition(by, "sk", {
			limit: top,
			exclusiveStartKey: continuationToken,
		});
		const users: QureauUserRow[] = [];
		for await (const user of result) {
			users.push(user);
		}
		return users;
	}
}

// biome-ignore lint/suspicious/noExplicitAny:
const bigintToNumber = (row: any) => {
	Object.keys(row).forEach((key) => {
		// biome-ignore lint/suspicious/noExplicitAny:
		if (typeof (row as unknown as any)[key] === "bigint") {
			// biome-ignore lint/suspicious/noExplicitAny:
			(row as unknown as any)[key] = Number((row as unknown as any)[key]);
		}
	});
};
