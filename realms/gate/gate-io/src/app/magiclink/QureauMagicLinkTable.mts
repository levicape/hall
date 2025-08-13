import { DynamoTable } from "@levicape/spork/server/client/table/aws/DynamoTable";
import type { MagicLinkKey, MagicLinkRow } from "./MagicLinkService.mjs";

const region = process.env.AWS_REGION || "us-east-1";
const tableName = "qureau_magic_links";

export const QureauMagicLinkTable = new DynamoTable<MagicLinkRow, MagicLinkKey>(
	tableName,
	region,
	(token) => ({ magicLinkId: token }),
);
