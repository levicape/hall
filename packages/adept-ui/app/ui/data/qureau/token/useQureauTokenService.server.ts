import { QueryClient } from "@tanstack/react-query";
import type { TokenCreateCommand } from "~/_protocols/qureau/tsnode/domain/token/create/token.create.js";
import type { QureauTokenServiceRemote } from "~/_protocols/qureau/tsnode/service/token/qureau.token.remote.js";
import type {
	ResolvedUrl,
	ServiceLocatorState,
} from "../../ServiceLocatorContext.js";
import { QureauHttpService } from "../QureauHttpService.js";
import { QureauTokenHttpService } from "./QureauTokenHttpService.js";

// biome-ignore lint/complexity/noBannedTypes:
type UseQureauTokenServiceQueryKeys = {};
type UseQureauTokenServiceProps = {
	entityKey: UseQureauTokenServiceQueryKeys;
};

const mutationFns = (service: QureauTokenServiceRemote) => ({
	create: async (request: TokenCreateCommand) => {
		return service.CreateToken(request);
	},
});
const serverQureauTokenHttpService = new QureauTokenHttpService({
	fetch: QureauHttpService.fetch(),
	resolveUrl: (path: RequestInfo | URL): ResolvedUrl => {
		return [path.toString(), ["~/v1/Accounts/Tokens/", {}]];
	},
} satisfies ServiceLocatorState);

const serverMutationFns = mutationFns(serverQureauTokenHttpService);
const queryFns = (service: QureauTokenServiceRemote) => ({});
const serverQueryFns = queryFns(serverQureauTokenHttpService);
const queryClient = new QueryClient();

export const useStaticQureauTokenService = (
	props: UseQureauTokenServiceProps,
) => {
	queryClient.setMutationDefaults(["token"], {
		scope: {
			id: "token",
		},
		mutationFn: serverMutationFns.create,
	});

	return {
		...serverMutationFns,
		...serverQueryFns,
	};
};
