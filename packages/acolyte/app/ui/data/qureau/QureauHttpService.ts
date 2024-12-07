import type { ServiceLocatorState } from "../ServiceLocatorContext.js";
import { QureauHttpServiceContext } from "./QureauHttpService.context.js";

const serverContext = new QureauHttpServiceContext();

export abstract class QureauHttpService {
	constructor(protected serviceLocator: ServiceLocatorState) {}
	static fetch =
		(context: QureauHttpServiceContext = serverContext) =>
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
