import type { KeygenSrand } from "@levicape/spork/server/security/IdKeygen";
import type { UserRetrieveWithId } from "../../../../../_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";

export const QureauUsersByIdViewHandlerInfers = (
	headers: Record<string, string | undefined>,
	ksuidGenerator: KeygenSrand,
	{
		principalId,
		principalService,
	}: { principalId: string; principalService: string },
	{
		resourceVersion,
		idempotencyId,
	}: { resourceVersion: string; idempotencyId: string },
): UserRetrieveWithId["inferred"] => {
	return {
		requestId: headers.X_Request_ID ?? ksuidGenerator.srand(),
		responseId: ksuidGenerator.srand(),
		principalId,
		principalService,
		resourceVersion,
		idempotencyId,
	};
};
