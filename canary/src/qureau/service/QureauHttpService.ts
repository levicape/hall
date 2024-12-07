import type { ServiceLocatorState } from "../../ServiceLocatorContext.js";
import type { QureauHttpServiceContext } from "./QureauHttpService.context.js";

export abstract class QureauHttpService {
	constructor(protected serviceLocator: ServiceLocatorState) {}
	static fetch =
		(context: QureauHttpServiceContext, token?: string) =>
		async (url: RequestInfo | URL, options?: RequestInit) => {
			const root = context.rootUrl();
			const resolvedUrl = url.toString().startsWith("/")
				? `${root}${url}`
				: `${root}${url.toString().replace(/.*?\//, "/")}`;
			const resolvedOptions = {
				...options,
				headers: {
					...options?.headers,
					"Content-Type": "application/json",
					leaftoken:
						context.token ??
						encodeURIComponent(
							"porfavorabracadabraAAAa012392ssSWWWSSwwFFHHTYCEEFGWFBEFBWFBCDewd",
						),
					Authorization: token
						? `Bearer ${token}`
						: (undefined as unknown as string),
				},
			};
			console.debug({
				QureauHttpService: {
					resolvedUrl,
					resolvedHeaders: resolvedOptions.headers,
					root,
				},
			});
			return fetch(resolvedUrl, resolvedOptions);
		};
	public withServiceLocator(
		serviceLocator: ServiceLocatorState,
	): QureauHttpService {
		this.serviceLocator = serviceLocator;
		return this;
	}
}
