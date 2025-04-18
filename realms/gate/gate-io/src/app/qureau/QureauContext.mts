import type {
	ITableContext,
	PostgresString,
} from "@levicape/spork/server/client/table/ITable";
import { process } from "std-env";
import {
	QureauDatabaseUsersTable,
	qureauDatabaseUsersTableToJSON,
} from "../../_protocols/qureau/tsnode/table/user/table.user._.js";

export class QureauContext {
	static QUREAU_DATABASE__NAME = "QUREAU_DATABASE__NAME" as const;
	static QUREAU_DATABASE__READ = "QUREAU_DATABASE__READ" as const;
	static QUREAU_DATABASE__REGION = "QUREAU_DATABASE__REGION" as const;
	static QUREAU_DATABASE__DB_0 = "QUREAU_DATABASE__DB_0" as const;
	static QUREAU_DATABASE__SCHEMA = "QUREAU_DATABASE__SCHEMA" as const;
	static QUREAU_DATABASE__INDEX___GSIS =
		"QUREAU_DATABASE__INDEX___GSIS" as const;
	static QUREAU_DATABASE__INDEX___GSIP =
		"QUREAU_DATABASE__INDEX___GSIP" as const;

	static QUREAU_DATABASE__INDEX___GSI1__QUREAU_USERS_GSI1PKTENANT =
		"QUREAU_DATABASE__INDEX___GSI1__QUREAU_TASKS_GSI1PKTENANT" as const;

	static QUREAU_DATABASE__INDEX___GSI1__QUREAU_USERS_GSI1SKPK =
		"QUREAU_DATABASE__INDEX___GSI1__QUREAU_TASKS_GSI1SKPK" as const;

	static QUREAU_DATABASE__INDEX___GSI2__QUREAU_USERS_GSI2PKUSERNAME =
		"QUREAU_DATABASE__INDEX___GSI2__QUREAU_TASKS_GSI2PKUSERNAME" as const;

	static QUREAU_DATABASE__INDEX___GSI3__QUREAU_USERS_GSI3PKPKAPPLICATIONIDEMAIL =
		"QUREAU_DATABASE__INDEX___GSI3__QUREAU_TASKS_GSI3PKPKAPPLICATIONIDEMAIL" as const;

	static QUREAU_DATABASE__INDEX___GSI4__QUREAU_USERS_GSI4PKPKAPPLICATIONIDPROVIDERRESOLVEDID =
		"QUREAU_DATABASE__INDEX___GSI4__QUREAU_TASKS_GSI4PKPKAPPLICATIONIDPROVIDERRESOLVEDID" as const;

	static QUREAU_DATABASE__INDEX___GSI5__QUREAU_USERS_GSI5PKPKAPPLICATIONIDTOKENID =
		"QUREAU_DATABASE__INDEX___GSI5__QUREAU_TASKS_GSI5PKPKAPPLICATIONIDTOKENID" as const;

	static QUREAU_DATABASE__INDEX___GSI6__QUREAU_USERS_GSI6PKPKAPPLICATIONIDUSERREGISTRATIONID =
		"QUREAU_DATABASE__INDEX___GSI6__QUREAU_TASKS_GSI6PKPKAPPLICATIONIDUSERREGISTRATIONID" as const;

	static QUREAU_DATABASE__INDEX___GSI7__QUREAU_USERS_GSI7PKPKAPPLICATIONIDUSERNAME =
		"QUREAU_DATABASE__INDEX___GSI7__QUREAU_TASKS_GSI7PKPKAPPLICATIONIDUSERNAME" as const;

	static QUREAU_DATABASE__DB_0__READER_username =
		"QUREAU_DATABASE__DB_0__READER_username" as const;
	static QUREAU_DATABASE__DB_0__READER_password =
		"QUREAU_DATABASE__DB_0__READER_password" as const;
	static QUREAU_DATABASE__DB_0__WRITER_username =
		"QUREAU_DATABASE__DB_0__WRITER_username" as const;
	static QUREAU_DATABASE__DB_0__WRITER_password =
		"QUREAU_DATABASE__DB_0__WRITER_password" as const;
	static QUREAU_DATABASE__DB_0__OWNER_username =
		"QUREAU_DATABASE__DB_0__OWNER_username" as const;
	static QUREAU_DATABASE__DB_0__OWNER_password =
		"QUREAU_DATABASE__DB_0__OWNER_password" as const;

	private constructor(readonly users?: ITableContext) {
		// const copy = {
		// 	tasks: {
		// 		...users,
		// 		postgres: {
		// 			...users?.postgres,
		// 			writer: {
		// 				...users?.postgres?.writer,
		// 				password: "REDACTED",
		// 			},
		// 			reader: {
		// 				...users?.postgres?.reader,
		// 				password: "REDACTED",
		// 			},
		// 			owner: {
		// 				...users?.postgres?.owner,
		// 				password: "REDACTED",
		// 			},
		// 		},
		// 	},
		// };
	}

	private static instance: QureauContext;
	static fromEnvironmentVariables(): QureauContext {
		if (QureauContext.instance === undefined) {
			const users =
				process.env[QureauContext.QUREAU_DATABASE__NAME] === undefined
					? undefined
					: {
							namespace:
								process.env[QureauContext.QUREAU_DATABASE__REGION] ??
								process.env.AWS_REGION ??
								"~",
							// biome-ignore lint/style/noNonNullAssertion:
							service: process.env[QureauContext.QUREAU_DATABASE__NAME]!,
							...(process.env[QureauContext.QUREAU_DATABASE__SCHEMA]
								? {
										postgres: {
											// biome-ignore lint/style/noNonNullAssertion:
											master: process.env[
												QureauContext.QUREAU_DATABASE__NAME
											]! as PostgresString,
											// biome-ignore lint/style/noNonNullAssertion:
											replica: process.env[
												QureauContext.QUREAU_DATABASE__READ
											]! as PostgresString,
											database:
												// biome-ignore lint/style/noNonNullAssertion:
												process.env[QureauContext.QUREAU_DATABASE__DB_0]!,
											schema:
												// biome-ignore lint/style/noNonNullAssertion:
												process.env[QureauContext.QUREAU_DATABASE__SCHEMA]!,
											reader: {
												username:
													// biome-ignore lint/style/noNonNullAssertion:
													process.env[
														QureauContext.QUREAU_DATABASE__DB_0__READER_username
													]!,
												password:
													// biome-ignore lint/style/noNonNullAssertion:
													process.env[
														QureauContext.QUREAU_DATABASE__DB_0__READER_password
													]!,
											},
											writer: {
												username:
													// biome-ignore lint/style/noNonNullAssertion:
													process.env[
														QureauContext.QUREAU_DATABASE__DB_0__WRITER_username
													]!,
												password:
													// biome-ignore lint/style/noNonNullAssertion:
													process.env[
														QureauContext.QUREAU_DATABASE__DB_0__WRITER_password
													]!,
											},
											owner: {
												username:
													// biome-ignore lint/style/noNonNullAssertion:
													process.env[
														QureauContext.QUREAU_DATABASE__DB_0__OWNER_username
													]!,
												password:
													// biome-ignore lint/style/noNonNullAssertion:
													process.env[
														QureauContext.QUREAU_DATABASE__DB_0__OWNER_password
													]!,
											},
										},
									}
								: {}),
							gsi: {
								GSIS:
									process.env[QureauContext.QUREAU_DATABASE__INDEX___GSIS] ??
									"",
								GSIP:
									process.env[QureauContext.QUREAU_DATABASE__INDEX___GSIP] ??
									"",
								GSI1:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI1__QUREAU_USERS_GSI1PKTENANT
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi1,
									),
								GSI2:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI1__QUREAU_USERS_GSI1PKTENANT
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi2,
									),
								GSI3:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI3__QUREAU_USERS_GSI3PKPKAPPLICATIONIDEMAIL
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi3,
									),
								GSI4:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI4__QUREAU_USERS_GSI4PKPKAPPLICATIONIDPROVIDERRESOLVEDID
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi4,
									),
								GSI5:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI5__QUREAU_USERS_GSI5PKPKAPPLICATIONIDTOKENID
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi5,
									),
								GSI6:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI6__QUREAU_USERS_GSI6PKPKAPPLICATIONIDUSERREGISTRATIONID
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi6,
									),
								GSI7:
									process.env[
										QureauContext
											.QUREAU_DATABASE__INDEX___GSI7__QUREAU_USERS_GSI7PKPKAPPLICATIONIDUSERNAME
									] ??
									qureauDatabaseUsersTableToJSON(
										QureauDatabaseUsersTable.qureau_users_by_gsi7,
									),
							},
						};

			QureauContext.instance = new QureauContext(users);
		}
		return QureauContext.instance;
	}
}
