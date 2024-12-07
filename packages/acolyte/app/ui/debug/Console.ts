declare global {
	interface Window {
		__CONSOLE_FLAG?: FlagSetters;
	}
}

type Flag = [key: string, get: () => boolean, set: (v: boolean) => void];
type Flags = {
	receive: Flag;
	send: Flag;
	timing: Flag;
	usewebsocket: Flag;
	navigation: Flag;
	authentication: Flag;
	delay: Flag;
};
type FlagSetters = Record<keyof Flags, Flag[2]>;
const flagObjectKey = (key: keyof Flags, enabled: boolean): Flag => {
	const value = enabled;
	const get = () => {
		return value;
	};
	const set = () => {
		return value;
	};
	return [key, get, set];
};

const LOCALHOST_HOSTS = ["localhost", "127.0.0.1", "goland"];
const LOCALHOST_SETTING = [
	["receive", true],
	["send", true],
	["timing", true],
	["usewebsocket", true],
	["navigation", true],
	["authentication", true],
	["delay", false],
] satisfies [keyof Flags, boolean][];

const flags = {
	receive: flagObjectKey("receive", false),
	send: flagObjectKey("send", false),
	timing: flagObjectKey("timing", false),
	usewebsocket: flagObjectKey("usewebsocket", true),
	navigation: flagObjectKey("navigation", true),
	authentication: flagObjectKey("authentication", true),
	delay: flagObjectKey("delay", false),
} as const;

if (typeof window !== "undefined") {
	window.__CONSOLE_FLAG = Object.fromEntries(
		Object.entries(flags).map(([key, value]) => {
			return [key, value[2]];
		}),
	) as FlagSetters;
	if (
		LOCALHOST_HOSTS.some((h) => {
			return window.location.host.includes(h);
		})
	) {
		for (const [key, value] of LOCALHOST_SETTING) {
			window.__CONSOLE_FLAG[key](value);
		}
	}

	const debug = window.console.debug.bind(window.console);
	const allFlags = Object.values(flags);
	window.console.debug = ((...args: unknown[]) => {
		if (typeof args[0] === "object") {
			const properties = Object.getOwnPropertyNames(args[0]);
			if (
				allFlags.every(([key, isEnabled]) => {
					if (isEnabled()) {
						return true;
					}
					return properties.every((p) => {
						return p.toLowerCase() !== key;
					});
				})
			) {
				debug(...args);
			}
		} else {
			debug(...args);
		}
	}).bind(window.console);
}

export const getConsoleFlags = () => {
	return flags;
};
