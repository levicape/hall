import type React from "react";
import {
	type FunctionComponent,
	type PropsWithChildren,
	type Reducer,
	createContext,
	useContext,
	useReducer,
} from "react";

export type AuthenticationState = {
	ready: boolean | null;
	id: string;
	token: string;
	refresh?: string;
};
export type AuthenticationAction = {
	authentication?: Partial<AuthenticationState>;
};
export type AuthenticationReducer = [
	AuthenticationState | undefined,
	React.Dispatch<AuthenticationAction>,
];
const AuthenticationContext = createContext<AuthenticationReducer | undefined>(
	undefined,
);
const authenticationReducer: Reducer<
	AuthenticationState | undefined,
	AuthenticationAction
> = (
	state: AuthenticationState | undefined,
	{ authentication }: AuthenticationAction,
): AuthenticationState | undefined => {
	if (authentication !== undefined) {
		return {
			...(state === undefined ? state : {}),
			...authentication,
			ready: true,
		} as AuthenticationState;
	}

	if (state === undefined) {
		return state;
	} else {
		return {
			...state,
		};
	}
};
export const useAuthenticationState = ():
	| AuthenticationReducer
	| [Partial<AuthenticationState>, AuthenticationReducer[1]] => {
	return (
		useContext(AuthenticationContext) ?? [
			{},
			(action) => {
				console.error({
					AuthenticationProvider: {
						action,
						invalid: true,
					},
				});
			},
		]
	);
};
export const AuthenticationProvider: FunctionComponent<PropsWithChildren> = ({
	children,
}) => {
	const reducer = useReducer(authenticationReducer, undefined);

	return (
		<AuthenticationContext.Provider value={reducer}>
			{children}
		</AuthenticationContext.Provider>
	);
};
