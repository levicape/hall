import { type FC, useCallback, useEffect, useState } from "hono/jsx";

/**
 * Capture touch events to prevent default behavior.
 * @kind Island
 */
export const CaptureTouchEvents: FC = () => {
	const [mounted, setMounted] = useState(false);
	const noop = useCallback(() => {}, []);
	useEffect(() => {
		if (
			typeof document !== "undefined" &&
			document?.addEventListener !== undefined
		) {
			document.addEventListener("touchstart", noop);
			setMounted(true);
		}

		return () => {
			setMounted(false);
			if (
				typeof document !== "undefined" &&
				document?.removeEventListener !== undefined
			) {
				document.removeEventListener("touchstart", noop);
			}
		};
	}, [noop]);

	return (
		<object
			suppressHydrationWarning
			aria-hidden
			typeof="CaptureTouchEvents"
			data-mounted={String(mounted)}
		/>
	);
};
