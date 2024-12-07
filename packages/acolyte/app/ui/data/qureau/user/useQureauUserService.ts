import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { UserRetrieveCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieve/user.retrieve.js";
import type { UserRetrieveWithIdCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import type { QureauUserServiceRemote } from "~/_protocols/qureau/tsnode/service/user/qureau.user.remote.js";
import { useQureauUserClient } from "./QureauUserHttpService.js";

type UserKey = "user";
type UserId = string;
type UseQureauUserServiceQueryKeys = {
	user: [UserKey, UserId];
};
type UseQureauUserServiceProps = {
	entityKey: UseQureauUserServiceQueryKeys;
};

const buildQueryKey = (userId: UserId[]) => [
	"user",
	"retrieve",
	"userId",
	...userId,
];
const retrieveUserId = (queryKey: string[]) => queryKey.slice(3);
// eslint-disable-next-line @ts-eslint/no-unused-vars
const mutationFns = (service: QureauUserServiceRemote) => ({});
const queryFns = (service: QureauUserServiceRemote) => ({
	retrieveWithId: async (request: UserRetrieveWithIdCommand) => {
		return service.RetrieveUserWithId(request);
	},
	retrieve: async ({ queryKey }: { queryKey: string[] }) => {
		const [userId] = retrieveUserId(queryKey);
		const request = UserRetrieveCommand.fromJSON({} as UserRetrieveCommand);
		console.log({
			userId,
			request,
		});
		return service.RetrieveUser(request);
	},
});

export const useQureauUserService = (
	// eslint-disable-next-line @ts-eslint/no-unused-vars
	{ entityKey }: UseQureauUserServiceProps = {
		entityKey: {
			user: ["user", ""],
		},
	},
) => {
	const { service } = useQureauUserClient();
	const { retrieve, retrieveWithId } = useMemo(
		() => queryFns(service),
		[service],
	);

	return {
		retrieve: useQuery({
			queryKey: buildQueryKey(entityKey?.user ?? ["___"]),
			queryFn: retrieve,
			enabled: entityKey?.user !== undefined,
		}),
	};
};
