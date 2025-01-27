import { UserRetrieveCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieve/user.retrieve.js";
import type { UserRetrieveWithIdCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import { QureauResponse } from "~/_protocols/qureau/tsnode/service/qureau._.js";
import type { QureauUserServiceRemote } from "~/_protocols/qureau/tsnode/service/user/qureau.user.remote.js";
import type {
	ResolvedUrl,
	ServiceLocatorState,
} from "../../ServiceLocatorContext.js";
import { QureauHttpService } from "../QureauHttpService.js";
import { QureauUserHttpService } from "./QureauUserHttpService.js";

type UseQureauUserServiceQueryKeys = Record<string, never>;
type UseQureauUserServiceProps = {
	entityKey: UseQureauUserServiceQueryKeys;
};

type UserId = string;
const retrieveQueryKey = (userId: UserId[]) =>
	["user", "retrieve", "userId", ...userId] as const;
type UseQureauUserServiceQueryKey = ReturnType<typeof retrieveQueryKey>;
const QUERY_TYPE = retrieveQueryKey(["9999"]).length - 2;
const USER_ID = retrieveQueryKey(["9999"]).length - 1;

const mutationFns = (service: QureauUserServiceRemote) => ({});
const serverQureauUserHttpService = new QureauUserHttpService({
	fetch: QureauHttpService.fetch(),
	resolveUrl: (path: RequestInfo | URL): ResolvedUrl => {
		return [path.toString(), ["~/v1/Qureau/Users/!~!/User/", {}]];
	},
} satisfies ServiceLocatorState);

const serverMutationFns = mutationFns(serverQureauUserHttpService);
const queryFns = (service: QureauUserServiceRemote) => ({
	retrieveWithId: async (request: UserRetrieveWithIdCommand) => {
		return service.RetrieveUserWithId(request).then((response) => {
			return QureauResponse.fromJSON(response);
		});
	},
	retrieve: async ({ queryKey }: { queryKey: string[] }) => {
		const key = retrieveQueryKey(queryKey);
		const queryType = queryKey[QUERY_TYPE] as "username";
		const userId = queryKey[USER_ID];
		const request = UserRetrieveCommand.fromJSON({
			request: {
				[queryType]: userId,
			},
			ext: {
				nonce: "nonce",
			},
		} as UserRetrieveCommand);
		console.log({
			key,
			queryType,
			userId,
			request,
		});
		return service.RetrieveUser(request).then((response) => {
			return QureauResponse.fromJSON(response);
		});
	},
	principal: async ({ queryKey }: { queryKey: UserId[] }) => {
		const request = UserRetrieveCommand.fromJSON({} as UserRetrieveCommand);
		return service.PrincipalUser(request).then((response) => {
			return QureauResponse.fromJSON(response);
		});
	},
});
const serverQueryFns = queryFns(serverQureauUserHttpService);

export const useStaticQureauUserService = (
	props: UseQureauUserServiceProps,
) => {
	return {
		...serverMutationFns,
		...serverQueryFns,
	};
};
