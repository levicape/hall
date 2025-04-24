/*

⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠤⠀⠄⢀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡠⢧⣾⣷⣿⣿⣵⣿⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⢱⡿⠟⠛⠛⠉⠙⢿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⡇⣤⣤⡀⢠⡄⣸⢿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢨⡼⡇⠈⠉⣡⠀⠉⢈⣞⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠱⢢⡄⠀⣬⣤⠀⣾⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡎⡇⠀⠈⣿⢻⡋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣀⣤⣶⣿⣧⢃⠀⠠⣶⣿⢻⣶⣤⣤⣀⠀⠀⠀
⢀⣤⣶⣿⣿⣿⣿⣿⣿⡤⠱⢀⣹⠋⠈⣿⣿⣿⣿⣿⣦⠀
⣾⣿⣿⣿⣿⡿⢛⣿⣿⣧⣔⣂⣄⠠⣴⣿⣿⣿⣿⣿⣿⡇
⡿⣿⣿⣿⣿⣳⠫⠈⣙⣻⡧⠔⢺⣛⣿⣿⣿⣿⣿⣿⣿⡇
⣿⣿⣿⣿⣿⠄⠀⢀⣨⣿⡯⠭⢭⣶⣿⣿⣿⣿⣿⣿⣿⡇

*/

import type { ITable } from "@levicape/spork/server/client/table/ITable";
import { MemoryTable } from "@levicape/spork/server/client/table/MemoryTable";
import { DynamoTable } from "@levicape/spork/server/client/table/aws/DynamoTable";
import { PostgresTable } from "@levicape/spork/server/client/table/postgres/PostgresTable";
import { QureauDatabaseUsersTable } from "../../../../../_protocols/qureau/tsjson/table/user/table.user._.js";
import {
	QureauDatabaseTable,
	qureauDatabaseTableToJSON,
} from "../../../../../_protocols/qureau/tsnode/table/table._._.js";
import { QureauContext } from "../../../QureauContext.mjs";
import type { QureauUserApplicationRow } from "./QureauUserRow.Application.mjs";
import { type QureauUserKey, QureauUserRow } from "./QureauUserRow.mjs";

const { users } = QureauContext.fromEnvironmentVariables();
let table: ITable<QureauUserRow, QureauUserKey> | undefined;
if (users !== undefined) {
	const { service, namespace } = users;

	if (service.startsWith("postgresql://")) {
		const { postgres } = users;
		PostgresTable.SSL_MODE = "";
		table = (await PostgresTable.for(
			{
				master: postgres?.master ?? "",
				replica: postgres?.replica ?? postgres?.master ?? "",
				databaseName: postgres?.database ?? "qureau",
				schemaName: postgres?.schema ?? "public",
				tableName: qureauDatabaseTableToJSON(QureauDatabaseTable.qureau_users),
				writer: {
					username: postgres?.writer.username ?? "postgres",
					password: postgres?.writer.password ?? "",
				},
				reader: {
					username: postgres?.reader.username ?? "postgres",
					password: postgres?.reader.password ?? "",
				},
			},
			QureauUserRow.getKey,
		)) as unknown as ITable<QureauUserRow<`qureau@${string}`>, QureauUserKey>;
	}

	if (service.startsWith("dynamodb://")) {
		const [, tableName] = service.split("://");
		table = new DynamoTable(tableName ?? "", namespace, QureauUserRow.getKey);
	}
}

if (table === undefined) {
	// Logger.warn({
	// 	qureauUsersTable: {
	// 		[QureauContext.QUREAU_DATABASE__NAME]: {
	// 			service: "mock",
	// 			namespace: "mock",
	// 		},
	// 	},
	// 	now: Date.now(),
	// });
}

export const qureauUsersTable =
	table ??
	new MemoryTable(QureauUserRow.getKey, ({ pk, sk }) => ({
		pk,
		sk,
	}));

export const qureauUsersApplicationsTable = qureauUsersTable as ITable<
	QureauUserApplicationRow,
	QureauUserKey
>;

export const qureauUsersByTenant = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi1,
);

export const qureauUsersByApplicationIdUsername = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi7,
);

export const qureauUsersByUsername = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi2,
);

export const qureauUsersByEmail = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi3,
);

export const qureauUsersByTokenId = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi5,
);

export const qureauUsersByProviderResolvedId = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi4,
);

export const qureauUsersByUserRegistrationId = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi6,
);

export const qureauUsersSearchIndex = qureauUsersTable.forGsi(
	users?.gsi?.GSI1 ?? QureauDatabaseUsersTable.qureau_users_by_gsi6,
);
