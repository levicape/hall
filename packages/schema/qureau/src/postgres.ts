// import { QureauDatabaseTable, qureauDatabaseTableToJSON } from "../../src/_protocols/qureau/tsnode/table/table._._.js";
// import { QureauContext } from "../../src/app/qureau/QureauContext.js";
// import { Logger } from "@levicape/spork/module/app/index.js";
// import Postgres from 'knex';

// const { users } = QureauContext.fromEnvironmentVariables();
// if (users !== undefined) {
// 	const { service, namespace } = users;
// 	Logger.log({
// 		qureauUsersTable: {
// 			[QureauContext.QUREAU_DATABASE__NAME]: {
// 				service,
// 				namespace,
// 			},
// 		},
// 		now: Date.now(),
// 	});

// 	if (service.startsWith("postgresql://")) {
// 		const { postgres } = users;

// 		const knex = Postgres({
// 			client: 'pg',
// 			connection: {
// 				host: postgres?.master,
// 				user: postgres?.owner?.username,
// 				password: postgres?.owner?.password,
// 				database: postgres?.database,
// 				port: 5432
// 			},
// 			searchPath: [postgres?.schema ?? "public"]
						
// 		})
// 		const table = qureauDatabaseTableToJSON(QureauDatabaseTable.qureau_users);
// 		knex.schema.hasTable(table).then(function (exists) {
// 			if (!exists) { // TODO: Knex migrations
// 			  return knex.schema.createTable(table, function (t) {
// 				t.string('pk').notNullable();
// 				t.string('sk').notNullable();
// 				t.integer('gsis_pk___shard').notNullable().defaultTo(0);
// 				t.integer('gsip_pk___perimeter').notNullable().defaultTo(0);
// 				t.string('gsi1_pk___tenant');
// 				t.string('gsi1_sk___pk');
// 				t.string('gsi2_pk__pk___username');
// 				t.string('gsi7_pk__pk___applicationid__username');
// 				t.string('gsi3_pk__pk___pk__applicationid__email');
// 				t.string('gsi4_pk__pk___pk__applicationid__providerresolvedid');
// 				t.string('gsi5_pk__pk___pk__applicationid__tokenid');
// 				t.string('gsi6_pk__pk___pk__applicationid__userregistrationid');
// 				t.jsonb('jsondata');
// 				t.binary('binpb');
// 				t.bigInteger('protocol').notNullable();
// 				t.bigInteger('application').notNullable();
// 				t.timestamp('created').notNullable();
// 				t.timestamp('updated');
// 				t.timestamp('deleted');
// 				t.bigInteger('expiry_unix_second');
// 				t.bigInteger('monotonic').notNullable();
// 				t.jsonb('owner_blob');
// 				t.jsonb('principal_blob');
// 				t.jsonb('genesis_blob');
// 				t.jsonb('request_blob');
// 				t.jsonb('signature_blob');
// 				t.binary('signature_salt');
// 				t.jsonb('scrypt_blob');
// 				t.binary('owner_pb');
// 				t.binary('principal_pb');
// 				t.binary('genesis_pb');
// 				t.binary('request_pb');
// 				t.binary('signature_pb');
// 				t.binary('scrypt_pb');
// 			  });
// 			}
// 		  }).catch(function (error) { 
// 			console.warn({
// 				QureauPostgresTable: {
// 					[QureauContext.QUREAU_DATABASE__NAME]: {
// 						service,
// 						namespace,
// 						error
// 					},
// 				},
// 			});
// 			process.exit(1);
// 		  });
// 	} else {
// 		throw new Error(`Unsupported service: ${service}`);
// 	}
// }