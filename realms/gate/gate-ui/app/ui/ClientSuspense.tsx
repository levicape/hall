export const SUSPENSE_GUARD = "<SUSPENSE_GUARD>";

export function SuspendPromise<T>(promise: () => Promise<T>) {
	let promised: Promise<T> | null = null;
	let reset: () => void = () => void 0;

	return [
		() => {
			promised = SuspenseGuard(promised) ?? promise();
			reset =
				reset ??
				(() => {
					promised = null;
				});

			return [promised, reset] as [Promise<T>, () => void];
		},
		() => reset(),
	] as const;
}

export const SuspenseGuard = <T,>(a: T) => {
	if (typeof window === "undefined") {
		throw SUSPENSE_GUARD;
	}

	return a;
};
