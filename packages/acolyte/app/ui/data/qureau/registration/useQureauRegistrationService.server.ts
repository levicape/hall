import { QueryClient } from "@tanstack/react-query";
import type { RegistrationRegisterCommand } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register";
import { QureauResponse } from "~/_protocols/qureau/tsnode/service/qureau._";
import type { QureauRegistrationServiceRemote } from "~/_protocols/qureau/tsnode/service/registration/qureau.registration.remote";
import type {
	ResolvedUrl,
	ServiceLocatorState,
} from "../../ServiceLocatorContext";
import { QureauHttpService } from "../QureauHttpService";
import { QureauRegistrationHttpService } from "./QureauRegistrationHttpService";

// biome-ignore lint/complexity/noBannedTypes:
type UseQureauRegistrationServiceQueryKeys = {};
type UseQureauRegistrationServiceProps = {
	entityKey: UseQureauRegistrationServiceQueryKeys;
};

const mutationFns = (service: QureauRegistrationServiceRemote) => ({
	register: async (request: RegistrationRegisterCommand) => {
		return service.Register(request).then((response) => {
			return QureauResponse.fromJSON(response);
		});
	},
});
const serverQureauRegistrationHttpService = new QureauRegistrationHttpService({
	fetch: QureauHttpService.fetch(),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	resolveUrl: (path: RequestInfo | URL): ResolvedUrl => {
		return [path.toString(), ["~/v1/Qureau/Users/!~!/Registration/", {}]];
	},
} satisfies ServiceLocatorState);

const serverMutationFns = mutationFns(serverQureauRegistrationHttpService);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const queryFns = (service: QureauRegistrationServiceRemote) => ({});
const serverQueryFns = queryFns(serverQureauRegistrationHttpService);

const queryClient = new QueryClient();
export const useStaticQureauRegistrationService = (
	props: UseQureauRegistrationServiceProps,
) => {
	queryClient.setMutationDefaults(["register"], {
		scope: {
			id: "registration",
		},
		mutationFn: serverMutationFns.register,
	});

	return {
		...serverMutationFns,
		...serverQueryFns,
	};
};
