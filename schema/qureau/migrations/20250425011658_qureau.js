/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	const table = "qureau_users";
	return knex.schema.createTable(table, function (t) {
		t.string('pk').notNullable();
		t.string('sk').notNullable();
		t.integer('gsis_pk___shard').notNullable().defaultTo(0);
		t.integer('gsip_pk___perimeter').notNullable().defaultTo(0);
		t.string('gsi1_pk___tenant');
		t.string('gsi1_sk___pk');
		t.string('gsi2_pk__pk___username');
		t.string('gsi7_pk__pk___applicationid__username');
		t.string('gsi3_pk__pk___pk__applicationid__email');
		t.string('gsi4_pk__pk___pk__applicationid__providerresolvedid');
		t.string('gsi5_pk__pk___pk__applicationid__tokenid');
		t.string('gsi6_pk__pk___pk__applicationid__userregistrationid');
		t.jsonb('jsondata');
		t.binary('binpb');
		t.bigInteger('protocol').notNullable();
		t.bigInteger('application').notNullable();
		t.timestamp('created').notNullable();
		t.timestamp('updated');
		t.timestamp('deleted');
		t.bigInteger('expiry_unix_second');
		t.bigInteger('monotonic').notNullable();
		t.jsonb('owner_blob');
		t.jsonb('principal_blob');
		t.jsonb('genesis_blob');
		t.jsonb('request_blob');
		t.jsonb('signature_blob');
		t.binary('signature_salt');
		t.jsonb('scrypt_blob');
		t.binary('owner_pb');
		t.binary('principal_pb');
		t.binary('genesis_pb');
		t.binary('request_pb');
		t.binary('signature_pb');
		t.binary('scrypt_pb');

		t.primary(['pk', 'sk']);
		t.index(['sk', 'pk'], 'qureau_users_idx_gsii');
		t.index(['gsis_pk___shard', 'pk', 'sk'], 'qureau_users_idx_gsis');
		t.index(['gsip_pk___perimeter', 'pk', 'sk'], 'qureau_users_idx_gsip');
		t.index(['gsi2_pk__pk___username', 'pk'], 'qureau_users_idx_gsi2');
		t.index(['gsi7_pk__pk___applicationid__username', 'pk'], 'qureau_users_idx_gsi7');
		t.index(['gsi3_pk__pk___pk__applicationid__email', 'pk'], 'qureau_users_idx_gsi3');
		t.index(['gsi4_pk__pk___pk__applicationid__providerresolvedid', 'pk'], 'qureau_users_idx_gsi4');
		t.index(['gsi5_pk__pk___pk__applicationid__tokenid', 'pk'], 'qureau_users_idx_gsi5');
		t.index(['gsi6_pk__pk___pk__applicationid__userregistrationid', 'pk'], 'qureau_users_idx_gsi6');
		t.index(['gsi1_pk___tenant', 'gsi1_sk___pk'], 'qureau_users_idx_gsi1');

	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	const table = "qureau_users";
	return knex.schema.dropTableIfExists(table);
};
