import type { UserRetrieveWithId } from "../../../../../_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import type { KSUIDGenerator } from "../../../repository/users/QureauUserRepository.Registration.js";

export const QureauUsersQueryHandlerInfers = (
	headers: Record<string, string | undefined>,
	ksuidGenerator: KSUIDGenerator,
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
		requestId: headers.X_Request_ID ?? ksuidGenerator.syncString(),
		responseId: ksuidGenerator.syncString(),
		principalId,
		principalService,
		resourceVersion,
		idempotencyId,
	};
};
