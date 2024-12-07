import {
	type FunctionComponent,
	type PropsWithChildren,
	createContext,
	useState,
} from "react";
import { getConsoleFlags } from "./Console.js";
declare global {
	interface Window {
		__DEBUG__?: (v: boolean) => void;
	}
}
let value = true;
let state:
	| [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	| undefined = undefined;
export const DebugContext = createContext(value);
export const DebugWindowProvider: FunctionComponent<PropsWithChildren> = ({
	children,
}) => {
	const innerState = useState<boolean>(value);
	state = innerState;
	return (
		<DebugContext.Provider value={state[0]}>{children}</DebugContext.Provider>
	);
};
if (typeof window === "object") {
	window.__DEBUG__ = (n: boolean) => {
		value = n;
		state?.[1](value);
		console.debug({
			__DEBUG__: {
				flags: {
					...getConsoleFlags(),
				},
				cards: value,
			},
		});
	};
}
