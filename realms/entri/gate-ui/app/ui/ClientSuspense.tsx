export const SUSPENSE_GUARD = "<SUSPENSE_GUARD>";

export function SuspendPromise<T>(fetchFn: () => Promise<T>) {
	let promise: Promise<T> | null = null;

	return () => {
		promise = SuspenseGuard(promise) ?? fetchFn();
		return promise;
	};
}

export const SuspenseGuard = <T,>(a: T) => {
	if (typeof window === "undefined") {
		throw SUSPENSE_GUARD;
	}

	return a;
};
