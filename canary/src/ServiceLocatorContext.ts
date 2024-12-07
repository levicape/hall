export type ResolvedUrl = [string, [string, unknown] | undefined];

export type ServiceLocatorContext = {
	rootUrl: () => string;
};

export type ServiceLocatorState = {
	fetch: typeof fetch;
	resolveUrl: (path: RequestInfo | URL) => ResolvedUrl;
};
