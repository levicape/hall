import {
	type FunctionComponent,
	type PropsWithChildren,
	useCallback,
	useEffect,
} from "react";

export const CaptureTouchEvents: FunctionComponent<PropsWithChildren> = ({
	children,
}) => {
	const noop = useCallback(() => {}, []);
	useEffect(() => {
		document.addEventListener("touchstart", noop);

		return () => {
			document.removeEventListener("touchstart", noop);
		};
	}, [noop]);

	return <>{children}</>;
};
