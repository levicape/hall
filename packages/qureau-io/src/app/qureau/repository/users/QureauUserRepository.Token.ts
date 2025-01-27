import type { RefreshToken } from "../../../../_protocols/qureau/tsnode/domain/token/token._._.js";
import type { QureauRepositoryProps } from "./QureauUserRepository.js";
import { QureauUserTokenRow } from "./user/QureauUserRow.Token.js";

export class QureauUserTokenRepository {
	tokenRowForRefreshToken = async (
		refreshToken: RefreshToken & { userId: string; id: string },
		props: QureauRepositoryProps,
	): Promise<QureauUserTokenRow> => {
		const nowunix = Date.now();
		const nowiso = new Date(nowunix).toISOString();

		const row = new QureauUserTokenRow(
			refreshToken.applicationId as "uwu",
			refreshToken.userId,
			refreshToken.id,
			refreshToken,
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
}

export const qureauUserTokenRepository = new QureauUserTokenRepository();
