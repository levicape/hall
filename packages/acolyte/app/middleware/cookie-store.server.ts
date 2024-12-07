import { parse, serialize } from "cookie";
import { sign, unsign } from "cookie-signature";
import type {
	CookieOptions,
	Session,
	SessionData,
	SessionIdStorageStrategy,
	SessionStorage,
} from "./providers/provider.js";

export type SignFunction = (value: string, secret: string) => Promise<string>;
export type UnsignFunction = (
	cookie: string,
	secret: string,
) => Promise<string | false>;

interface CookieSessionStorageOptions {
	/**
	 * The Cookie used to store the session data on the client, or options used
	 * to automatically create one.
	 */
	cookie?: SessionIdStorageStrategy["cookie"];
}
export type CreateCookieSessionStorageFunction = <
	Data = SessionData,
	FlashData = Data,
>(
	options?: CookieSessionStorageOptions,
) => SessionStorage<Data, FlashData>;

function flash(name: string) {
	return `__flash_${name}__`;
}
/**
 * Creates a new Session object.
 *
 * Note: This function is typically not invoked directly by application code.
 * Instead, use a `SessionStorage` object's `getSession` method.
 *
 * @see https://remix.run/utils/sessions#createsession
 */
const createSession = (initialData = {}, id = ""): Session => {
	const map = new Map(Object.entries(initialData));
	return {
		get id() {
			return id;
		},
		get data() {
			return Object.fromEntries(map);
		},
		has(name) {
			return map.has(name) || map.has(flash(name));
		},
		get(name): any {
			if (map.has(name)) return map.get(name);
			const flashName = flash(name);
			if (map.has(flashName)) {
				const value = map.get(flashName);
				map.delete(flashName);
				return value;
			}
			return undefined;
		},
		set(name, value) {
			map.set(name, value);
		},
		flash(name, value) {
			map.set(flash(name), value);
		},
		unset(name) {
			map.delete(name);
		},
	};
};
/**
 * Returns true if an object is a Remix session.
 *
 * @see https://remix.run/utils/sessions#issession
 */
const isSession = (
	object: unknown & {
		data: unknown;
		id: unknown;
		has: unknown;
		get: unknown;
		set: unknown;
		flash: unknown;
		unset: unknown;
	},
) => {
	return (
		object != null &&
		typeof object.id === "string" &&
		typeof object.data !== "undefined" &&
		typeof object.has === "function" &&
		typeof object.get === "function" &&
		typeof object.set === "function" &&
		typeof object.flash === "function" &&
		typeof object.unset === "function"
	);
};

/**
 * SessionStorage stores session data between HTTP requests and knows how to
 * parse and create cookies.
 *
 * A SessionStorage creates Session objects using a `Cookie` header as input.
 * Then, later it generates the `Set-Cookie` header to be used in the response.
 */

/**
 * SessionIdStorageStrategy is designed to allow anyone to easily build their
 * own SessionStorage using `createSessionStorage(strategy)`.
 *
 * This strategy describes a common scenario where the session id is stored in
 * a cookie but the actual session data is stored elsewhere, usually in a
 * database or on disk. A set of create, read, update, and delete operations
 * are provided for managing the session data.
 */

/**
 * A HTTP cookie.
 *
 * A Cookie is a logical container for metadata about a HTTP cookie; its name
 * and options. But it doesn't contain a value. Instead, it has `parse()` and
 * `serialize()` methods that allow a single instance to be reused for
 * parsing/encoding multiple different values.
 *
 * @see https://remix.run/utils/cookies#cookie-api
 */

/**
 * Creates a logical container for managing a browser cookie from the server.
 *
 * @see https://remix.run/utils/cookies#createcookie
 */
const createCookieFactory =
	({
		sign,
		unsign,
	}: {
		sign: SignFunction;
		unsign: UnsignFunction;
	}) =>
	({ name, ...cookieOptions }: any) => {
		const { secrets = [], ...options } = {
			path: "/",
			sameSite: "lax",
			...cookieOptions,
		};

		return {
			get name() {
				return name;
			},
			get isSigned() {
				return secrets.length > 0;
			},
			get expires() {
				// Max-Age takes precedence over Expires
				return typeof options.maxAge !== "undefined"
					? new Date(Date.now() + options.maxAge * 1000)
					: options.expires;
			},
			async parse(cookieHeader: any, parseOptions: any) {
				if (!cookieHeader) return null;
				const cookies = parse(cookieHeader, {
					...options,
					...parseOptions,
				});
				return name in cookies
					? cookies[name] === ""
						? ""
						: await decodeCookieValue(unsign, cookies[name], secrets)
					: null;
			},
			async serialize(value: string, serializeOptions: any) {
				return serialize(
					name,
					value === "" ? "" : await encodeCookieValue(sign, value, secrets),
					{
						...options,
						...serializeOptions,
					},
				);
			},
		};
	};
/**
 * Returns true if an object is a Remix cookie container.
 *
 */
// biome-ignore lint/suspicious/noExplicitAny:
const isCookie = (
	object:
		| { name: any; isSigned: any; parse: any; serialize: any }
		| null
		| undefined,
) => {
	return (
		object != null &&
		typeof object.name === "string" &&
		typeof object.isSigned === "boolean" &&
		typeof object.parse === "function" &&
		typeof object.serialize === "function"
	);
};
async function encodeCookieValue(
	sign: {
		(value: string, secret: string): Promise<string>;
		(arg0: string, arg1: any): string | PromiseLike<string>;
	},
	value: any,
	secrets: string | any[],
) {
	let encoded = encodeData(value);
	if (secrets.length > 0) {
		encoded = await sign(encoded, secrets[0]);
	}
	return encoded;
}
async function decodeCookieValue(
	unsign: {
		(value: string, secret: string): Promise<string | false>;
		(arg0: any, arg1: any): any;
	},
	value: any,
	secrets: string | any[],
) {
	if (secrets.length > 0) {
		for (const secret of secrets) {
			const unsignedValue = await unsign(value, secret);
			if (unsignedValue !== false) {
				return decodeData(unsignedValue);
			}
		}
		return null;
	}
	return decodeData(value);
}
function encodeData(value: any) {
	return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))));
}
function decodeData(value: string) {
	try {
		return JSON.parse(decodeURIComponent(myEscape(atob(value))));
	} catch (error) {
		return {};
	}
}

// See: https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.escape.js
function myEscape(value: string) {
	const str = value.toString();
	let result = "";
	let index = 0;
	let chr, code;
	while (index < str.length) {
		chr = str.charAt(index++);
		if (/[\w*+\-./@]/.exec(chr)) {
			result += chr;
		} else {
			code = chr.charCodeAt(0);
			if (code < 256) {
				result += "%" + hex(code, 2);
			} else {
				result += "%u" + hex(code, 4).toUpperCase();
			}
		}
	}
	return result;
}
function hex(code: { toString: (arg0: number) => any }, length: number) {
	let result = code.toString(16);
	while (result.length < length) result = "0" + result;
	return result;
}

// See: https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.unescape.js
function myUnescape(value: string) {
	const str = value.toString();
	let result = "";
	let index = 0;
	let chr, part;
	while (index < str.length) {
		chr = str.charAt(index++);
		if (chr === "%") {
			if (str.charAt(index) === "u") {
				part = str.slice(index + 1, index + 5);
				if (/^[\da-f]{4}$/i.exec(part)) {
					result += String.fromCharCode(Number.parseInt(part, 16));
					index += 5;
					continue;
				}
			} else {
				part = str.slice(index, index + 2);
				if (/^[\da-f]{2}$/i.exec(part)) {
					result += String.fromCharCode(Number.parseInt(part, 16));
					index += 2;
					continue;
				}
			}
		}
		result += chr;
	}
	return result;
}
/**
 * Creates a SessionStorage object using a SessionIdStorageStrategy.
 *
 * Note: This is a low-level API that should only be used if none of the
 * existing session storage options meet your requirements.
 *
 */
export const createSessionStorageFactory =
	(createCookie: (arg0: any, arg1: any) => any) =>
	(
		cookieArg: any,
		{
			createData,
			readData,
			updateData,
			deleteData,
		}: {
			createData: (data: any, expires: Date) => Promise<string>;
			readData: (id: string) => Promise<any>;
			updateData: (id: string, data: any, expires: Date) => Promise<void>;
			deleteData: (id: string) => Promise<void>;
		},
	) => {
		const cookie = isCookie(cookieArg)
			? cookieArg
			: createCookie(
					(cookieArg === null || cookieArg === void 0
						? void 0
						: cookieArg.name) || "__session",
					cookieArg,
				);
		return {
			async getSession(cookieHeader: any, options: any) {
				const id = cookieHeader && (await cookie.parse(cookieHeader, options));
				const data = id && (await readData(id));
				return createSession(data || {}, id || "");
			},
			async commitSession(
				session: { id: any; data: any },
				options: { maxAge: number; expires: any } | null | undefined,
			) {
				let { id, data } = session;
				const expires =
					(options === null || options === void 0 ? void 0 : options.maxAge) !=
					null
						? new Date(Date.now() + (options?.maxAge ?? 0) * 1000)
						: (options === null || options === void 0
									? void 0
									: options.expires) != null
							? options?.expires
							: cookie.expires;
				if (id) {
					await updateData(id, data, expires);
				} else {
					id = await createData(data, expires);
				}
				return cookie.serialize(id, options);
			},
			async destroySession(session: { id: any }, options: any) {
				await deleteData(session.id);
				return cookie.serialize("", {
					...options,
					maxAge: undefined,
					expires: new Date(0),
				});
			},
		};
	};
/**
 * Creates and returns a SessionStorage object that stores all session data
 * directly in the session cookie itself.
 *
 * This has the advantage that no database or other backend services are
 * needed, and can help to simplify some load-balanced scenarios. However, it
 * also has the limitation that serialized session data may not exceed the
 * browser's maximum cookie size. Trade-offs!
 *
 * @see https://remix.run/utils/sessions#createcookiesessionstorage
 */
const createCookieSessionStorageFactory =
	(createCookie: {
		({
			name,
			...cookieOptions
		}: any): {
			readonly name: any;
			readonly isSigned: boolean;
			readonly expires: any;
			parse(cookieHeader: any, parseOptions: any): Promise<any>;
			serialize(value: string, serializeOptions: any): Promise<string>;
		};
		(arg0: any, arg1: any): any;
	}) =>
	(cookieArg: any) => {
		const cookie = isCookie(cookieArg)
			? cookieArg
			: createCookie(
					(cookieArg === null || cookieArg === void 0
						? void 0
						: cookieArg.name) || "__session",
					cookieArg,
				);

		return {
			async getSession(cookieHeader?: string | undefined, options?: CookieOptions) {
				return createSession(
					(cookieHeader && (await cookie.parse(cookieHeader, options))) || {},
				);
			},
			async commitSession(session: { data: any }, options?: { expires?: Date; maxAge?: number }) {
				const serializedCookie = await cookie.serialize(session.data, options);
				if (serializedCookie.length > 4096) {
					throw new Error(
						"Cookie length will exceed browser maximum. Length: " +
							serializedCookie.length,
					);
				}
				return serializedCookie;
			},
			async destroySession(_session: any, options?: {}) {
				return cookie.serialize(cookieArg.name, {
					...options,
					maxAge: undefined,
					expires: new Date(0),
				});
			},
		};
	};

const createCookie = createCookieFactory({
	sign: async (value: string, secret: string) => sign(value, secret),
	unsign: async (cookie: string, secret: string) => unsign(cookie, secret),
});
export const createCookieSessionStorage =
	createCookieSessionStorageFactory(createCookie);
export const createSessionStorage = createSessionStorageFactory(createCookie);

//   export const createMemorySessionStorage = createMemorySessionStorageFactory(createSessionStorage);
