import crypto from "node:crypto";
import type { ITable } from "@levicape/spork/server/client/table/ITable";

export interface MagicLinkRow {
	magicLinkId: string;
	userId: string;
	expirationTime: string;
}

export interface MagicLinkKey {
	magicLinkId: string;
}

export class MagicLinkService {
	constructor(
		private readonly magicLinkTable: ITable<MagicLinkRow, MagicLinkKey>,
	) {}

	async generateMagicLinkToken(userId: string): Promise<string> {
		const token = crypto.randomBytes(32).toString("hex");
		const expirationTime = new Date(
			Date.now() + 24 * 60 * 60 * 1000,
		).toISOString();

		await this.magicLinkTable.post({
			magicLinkId: token,
			userId,
			expirationTime,
		});

		return token;
	}

	async verifyMagicLinkToken(token: string): Promise<string | null> {
		const rows = await this.magicLinkTable.getByMultiplePartitionIds([token]);
		const link = rows.find(() => true);
		if (!link) {
			return null;
		}

		const { userId, expirationTime } = link;
		if (new Date(expirationTime) < new Date()) {
			return null;
		}

		return userId;
	}
}
