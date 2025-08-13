import type { AuthorizeQueryParams } from "@levicape/hall-gate-io/app/qureau/controller/login/AuthorizeQueryParams";
import { ErrorBoundary, type FC, Fragment, Suspense, useMemo } from "hono/jsx";
import { parseQuery } from "ufo";
import { SUSPENSE_GUARD } from "../../../ui/ClientSuspense";
import { ErrorFallback, Loader } from "../_design";

const Logout: FC<{ query: AuthorizeQueryParams }> = ({ query }) => {
	if (query.error) {
		const url = new URL(window.location.href);
		url.searchParams.delete("error");
		url.searchParams.delete("error_description");
		window.history.pushState(null, "", url.toString());
		throw query.error_description ?? query.error ?? "Unknown error";
	}

	return <Fragment />;
};

export function LogoutPage() {
	const { location } =
		typeof window !== "undefined"
			? window
			: ({} as { location?: { search?: string } });

	const [query] = useMemo(() => {
		const { search } = location ?? {};
		const query = parseQuery(search ?? "") ?? {};
		return [query as AuthorizeQueryParams] as const;
	}, [location?.search]);

	return (
		<ErrorBoundary
			fallbackRender={(error: unknown) => {
				if (error === SUSPENSE_GUARD) {
					return <Loader />;
				}
				return <ErrorFallback error={error} />;
			}}
		>
			<Suspense fallback={<Loader />}>
				<Logout query={query} />
			</Suspense>
		</ErrorBoundary>
	);
}
