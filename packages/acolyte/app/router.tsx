import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./ui/behavior/exception/DefaultCatchBoundary.js";
import { useStaticQureauRegistrationService } from "./ui/data/qureau/registration/useQureauRegistrationService.server.js";
import { useStaticQureauTokenService } from "./ui/data/qureau/token/useQureauTokenService.server.js";
import { useStaticQureauUserService } from "./ui/data/qureau/user/useQureauUserService.server.js";
import { NotFound } from "./ui/display/NotFound.js";

export function createRouter() {
	const RootQueryClient = new QueryClient();
	const QureauTokens = useStaticQureauTokenService({
		entityKey: {},
	});
	const QureauRegistration = useStaticQureauRegistrationService({
		// queryClient: RootQueryClient,
		entityKey: {},
	});
	const QureauUsers = useStaticQureauUserService({
		entityKey: {},
	});

	const router = createTanStackRouter({
		routeTree,
		// defaultPreload: "intent",
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		context: {
			RootQueryClient,
			QureauTokens,
			QureauRegistration,
			QureauUsers,
		},
		defaultPreloadStaleTime: 0,
		Wrap: ({ children }) => {
			return (
				<QueryClientProvider client={RootQueryClient}>
					{children}
				</QueryClientProvider>
			);
		},
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
