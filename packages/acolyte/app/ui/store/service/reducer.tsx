import {
	type FunctionComponent,
	type PropsWithChildren,
	type Reducer,
	createContext,
	useContext,
	useReducer,
} from "react";
import type { MANIFEST_RESPONSE_DATA } from "~/ui/data/manifest/component.js";
import type { ManifestLoadResponse } from "~/ui/data/manifest/load.js";

export type HttpServicePathPrefix = `/${string}/v${number}`;
export type HttpServicePath = `/${string}/v${number}/${string}`;
export type HttpServiceTuple = [string, HttpServicePathPrefix];
export type HttpServiceDiscoveryRoute = {
	url?: string;
	cdn?: string;
	protocol?: string;
	instance?: string;
};

export type Accounts = ["accounts", "/~/v1/Accounts"];
export type Qureau = ["qureau", "/~/v1/Qureau"];
export type Gamehost = ["worlds", "~/v1/Worlds" | "/-i/v1/Worlds/Sessions"];
export type AllServices =
	| [Accounts[0], Accounts]
	| [Gamehost[0], Gamehost]
	| [Qureau[0], Qureau];
export type Routes = Record<
	AllServices[0],
	Record<
		AllServices[1][1] extends HttpServicePath ? AllServices[1][1] : never,
		HttpServiceDiscoveryRoute
	>
>;
export type ServiceDiscoveryState = {
	frontend?: {
		hostnames?: string[];
	};
	routes?: {
		[service: string]: {
			[path: HttpServicePath]: HttpServiceDiscoveryRoute;
		};
	};
	version?: {
		sequence: string;
		build: string;
		stage: string;
	};
};
export type ServiceDiscoveryAction = {
	service?: Partial<ServiceDiscoveryState>;
	manifest?: ManifestLoadResponse[typeof MANIFEST_RESPONSE_DATA];
	routes?: {
		service?: string;
		path: string;
		route: HttpServiceDiscoveryRoute;
	}[];
};
export type ServiceDiscoveryReducer = [
	ServiceDiscoveryState | undefined,
	React.Dispatch<ServiceDiscoveryAction>,
];

const ServiceDiscoveryContext = createContext<
	ServiceDiscoveryReducer | undefined
>(undefined);

const serviceDiscoveryReducer: Reducer<
	ServiceDiscoveryState,
	ServiceDiscoveryAction
> = (
	state: ServiceDiscoveryState,
	{ service, manifest }: ServiceDiscoveryAction,
): ServiceDiscoveryState => {
	if (service !== undefined) {
		return {
			...state,
			...service,
		};
	}

	if (manifest !== undefined) {
		const component = manifest;
		const {
			manifest: { ok, routes, frontend, version },
		} = component;
		if (ok) {
			return {
				...state,
				frontend,
				routes,
				version,
			};
		}
		return {
			...state,
		};
	}

	return state;
};
export const useServiceDiscovery = (): ServiceDiscoveryReducer => {
	const context = useContext(ServiceDiscoveryContext);
	if (context === undefined) {
		throw new Error(
			"useServiceDiscovery must be used within a ServiceDiscoveryProvider",
		);
	}

	return context;
};
export const ServiceDiscoveryProvider: FunctionComponent<PropsWithChildren> = ({
	children,
}) => {
	const reducer = useReducer(serviceDiscoveryReducer, {});

	return (
		<ServiceDiscoveryContext.Provider value={reducer}>
			{children}
		</ServiceDiscoveryContext.Provider>
	);
};
