import { MagicLinkService } from "../../../magiclink/MagicLinkService.js";
import { QureauMagicLinkTable } from "../../../magiclink/QureauMagicLinkTable.js";
// import type { ElysiaHttpAuthenticatedHandler } from "src/app/ElysiaHttpAuthentication";
// import { QureauRegistrationHandler } from "../registrations/QureauRegistrationHandler.js";

// export class QureauMagicLink {
// 	constructor(private readonly magicLinkService: MagicLinkService) {}

// 	generateMagicLink: ElysiaHttpAuthenticatedHandler = async ({
// 		principal,
// 		body,
// 	}) => {
// 		if (principal.role !== "REGISTERED") {
// 			throw new Error("Unauthorized");
// 		}

// 		const token = await this.magicLinkService.generateMagicLinkToken(
// 			principal.userId,
// 		);
// 		Logger.debug({ token });

// 		return { token };
// 	};

// 	verifyMagicLink: ElysiaHttpAuthenticatedHandler = async ({
// 		params,
// 		body,
// 	}) => {
// 		const { userId } = params;
// 		const { token } = body;

// 		const verifiedUserId =
// 			await this.magicLinkService.verifyMagicLinkToken(token);
// 		if (verifiedUserId !== userId) {
// 			throw new Error("Unauthorized");
// 		}

// 		return QureauRegistrationHandler({ body, headers: {} });
// 	};
// }

// export const QureauMagicLinkHandler = new QureauMagicLink(
// 	new MagicLinkService(QureauMagicLinkTable),
// );
