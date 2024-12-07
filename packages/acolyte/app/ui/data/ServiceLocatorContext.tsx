import React, {
	type FunctionComponent,
	type PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { useAuthenticationState } from "../store/authentication/reducer.js";
import {
	type HttpServiceDiscoveryRoute,
	useServiceDiscovery,
} from "../store/service/reducer.js";

export type ResolvedUrl = [
	string,
	[string, HttpServiceDiscoveryRoute] | undefined,
];

export type ServiceLocatorContext = {
	rootUrl: () => string;
};

export type ServiceLocatorState = {
	fetch: typeof fetch;
	resolveUrl: (path: RequestInfo | URL) => ResolvedUrl;
};
export const ServiceLocatorContext = Object.assign(
	React.createContext({
		fetch,
		resolveUrl: (path: RequestInfo | URL) =>
			[path.toString(), undefined] as ResolvedUrl,
	} satisfies ServiceLocatorState),
	{
		instance: (headers: Headers): string | undefined => {
			return headers.get("Fly-Instance-Id") ?? undefined;
		},
	},
);

const normalizeUrl = (url: string) => {
	return url.endsWith("/") ? url.slice(0, url.length - 1) : url;
};

export const ServiceLocatorProvider: FunctionComponent<PropsWithChildren> = ({
	children,
}) => {
	const [authentication] = useAuthenticationState() ?? [{}];
	const { token } = authentication ?? {};
	const [serviceDiscovery, setServiceDiscovery] = useServiceDiscovery();
	const { routes } = serviceDiscovery ?? {};
	const routePaths: [string, HttpServiceDiscoveryRoute][] = useMemo(() => {
		return Object.entries(routes ?? {}).flatMap(([, routes]) => {
			return Object.entries(routes);
		});
	}, [routes]);

	const resolveUrl = useCallback(
		(path: RequestInfo | URL): ResolvedUrl => {
			let requestUrl = path.toString();
			let currentRoute: [string, HttpServiceDiscoveryRoute] | undefined;

			if (routes !== undefined) {
				const route =
					routePaths.find(([routePath]) =>
						path.toString().startsWith(routePath),
					) ?? undefined;
				currentRoute = route;
				if (route) {
					const { cdn, protocol, url } = route[1];
					if (protocol !== undefined) {
						if (cdn !== undefined) {
							requestUrl = `${protocol}://${normalizeUrl(cdn)}${path}`;
						} else {
							if (url !== undefined) {
								requestUrl = `${protocol}://${normalizeUrl(url)}${path}`;
							}
						}
					}
				}
			}

			return [requestUrl, currentRoute];
		},
		[routes, routePaths],
	);

	const fetchWithAuth: typeof fetch = useCallback(
		async (path, options, ...args: unknown[]) => {
			const [requestUrl, currentRoute] = resolveUrl(path);
			const { instance } = currentRoute?.[1] ?? {};
			let authorization: string | undefined;

			if (typeof options?.headers?.entries === "function") {
				for (const [key, value] of options?.headers?.entries() ??
					[].entries()) {
					if (key === "Authorization") {
						if (typeof value === "string") {
							authorization = value;
						} else {
							authorization = value[0];
						}
					}
				}
			} else {
				if (typeof options?.headers === "object") {
					authorization = (
						options.headers as unknown as { Authorization?: string }
					).Authorization;
				}
			}
			if (options?.headers !== undefined) {
				delete (options?.headers as unknown as { Authorization?: string })
					.Authorization;
			}

			return fetch(
				requestUrl,
				{
					mode: "cors",
					...options,
					headers: {
						...(token !== undefined && authorization !== ""
							? { Authorization: `Bearer ${token}` }
							: authorization !== undefined && authorization !== ""
								? {
										Authorization: authorization,
									}
								: {}),
						...(instance !== undefined
							? {
									"Fly-Instance-Id": instance,
								}
							: {}),
						"Content-Type": "application/json",
						...(options?.headers ?? {}),
					},
				},
				// @ts-expect-error
				...args,
			).then((response) => {
				const instance = ServiceLocatorContext.instance(response.headers);

				if (instance !== undefined && currentRoute !== undefined) {
					setServiceDiscovery({
						routes: [
							{
								path: currentRoute[0],
								route: {
									...currentRoute[1],
									instance,
								},
							},
						],
					});
				}

				return response;
			});
		},
		[token, setServiceDiscovery, resolveUrl],
	);

	const state = useMemo(() => {
		return { fetch: fetchWithAuth, resolveUrl };
	}, [fetchWithAuth, resolveUrl]);

	return (
		<ServiceLocatorContext.Provider value={state}>
			{children}
		</ServiceLocatorContext.Provider>
	);
};

export const useServiceLocator = (): ServiceLocatorState => {
	return useContext(ServiceLocatorContext);
};
