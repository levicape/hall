import type { Timings } from "../timing.server.js";
/**
 * Basic HTTP cookie parser and serializer for HTTP servers.
 */

/**
 * Additional serialization options
 */
export interface CookieSerializeOptions {
	name?: string | undefined;
	/**
	 * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.3|Domain Set-Cookie attribute}. By default, no
	 * domain is set, and most clients will consider the cookie to apply to only
	 * the current domain.
	 */
	domain?: string | undefined;

	/**
	 * Specifies a function that will be used to encode a cookie's value. Since
	 * value of a cookie has a limited character set (and must be a simple
	 * string), this function can be used to encode a value into a string suited
	 * for a cookie's value.
	 *
	 * The default function is the global `encodeURIComponent`, which will
	 * encode a JavaScript string into UTF-8 byte sequences and then URL-encode
	 * any that fall outside of the cookie range.
	 */
	encode?(value: string): string;

	/**
	 * Specifies the `Date` object to be the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.1|`Expires` `Set-Cookie` attribute}. By default,
	 * no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete
	 * it on a condition like exiting a web browser application.
	 *
	 * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
	 * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
	 * possible not all clients by obey this, so if both are set, they should
	 * point to the same date and time.
	 */
	expires?: Date | undefined;
	/**
	 * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.6|`HttpOnly` `Set-Cookie` attribute}.
	 * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
	 * default, the `HttpOnly` attribute is not set.
	 *
	 * *Note* be careful when setting this to true, as compliant clients will
	 * not allow client-side JavaScript to see the cookie in `document.cookie`.
	 */
	httpOnly?: boolean | undefined;
	/**
	 * Specifies the number (in seconds) to be the value for the `Max-Age`
	 * `Set-Cookie` attribute. The given number will be converted to an integer
	 * by rounding down. By default, no maximum age is set.
	 *
	 * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
	 * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
	 * possible not all clients by obey this, so if both are set, they should
	 * point to the same date and time.
	 */
	maxAge?: number | undefined;
	/**
	 * Specifies the `boolean` value for the [`Partitioned` `Set-Cookie`](rfc-cutler-httpbis-partitioned-cookies)
	 * attribute. When truthy, the `Partitioned` attribute is set, otherwise it is not. By default, the
	 * `Partitioned` attribute is not set.
	 *
	 * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
	 * This also means many clients may ignore this attribute until they understand it.
	 *
	 * More information about can be found in [the proposal](https://github.com/privacycg/CHIPS)
	 */
	partitioned?: boolean | undefined;
	/**
	 * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.4|`Path` `Set-Cookie` attribute}.
	 * By default, the path is considered the "default path".
	 */
	path?: string | undefined;
	/**
	 * Specifies the `string` to be the value for the [`Priority` `Set-Cookie` attribute][rfc-west-cookie-priority-00-4.1].
	 *
	 * - `'low'` will set the `Priority` attribute to `Low`.
	 * - `'medium'` will set the `Priority` attribute to `Medium`, the default priority when not set.
	 * - `'high'` will set the `Priority` attribute to `High`.
	 *
	 * More information about the different priority levels can be found in
	 * [the specification][rfc-west-cookie-priority-00-4.1].
	 *
	 * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
	 * This also means many clients may ignore this attribute until they understand it.
	 */
	priority?: "low" | "medium" | "high" | undefined;
	/**
	 * Specifies the boolean or string to be the value for the {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|`SameSite` `Set-Cookie` attribute}.
	 *
	 * - `true` will set the `SameSite` attribute to `Strict` for strict same
	 * site enforcement.
	 * - `false` will not set the `SameSite` attribute.
	 * - `'lax'` will set the `SameSite` attribute to Lax for lax same site
	 * enforcement.
	 * - `'strict'` will set the `SameSite` attribute to Strict for strict same
	 * site enforcement.
	 *  - `'none'` will set the SameSite attribute to None for an explicit
	 *  cross-site cookie.
	 *
	 * More information about the different enforcement levels can be found in {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|the specification}.
	 *
	 * *note* This is an attribute that has not yet been fully standardized, and may change in the future. This also means many clients may ignore this attribute until they understand it.
	 */
	sameSite?: true | false | "lax" | "strict" | "none" | undefined;
	/**
	 * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.5|`Secure` `Set-Cookie` attribute}. When truthy, the
	 * `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
	 *
	 * *Note* be careful when setting this to `true`, as compliant clients will
	 * not send the cookie back to the server in the future if the browser does
	 * not have an HTTPS connection.
	 */
	secure?: boolean | undefined;
}

/**
 * Additional parsing options
 */
export interface CookieParseOptions {
	/**
	 * Specifies a function that will be used to decode a cookie's value. Since
	 * the value of a cookie has a limited character set (and must be a simple
	 * string), this function can be used to decode a previously-encoded cookie
	 * value into a JavaScript string or other object.
	 *
	 * The default function is the global `decodeURIComponent`, which will decode
	 * any URL-encoded sequences into their byte representations.
	 *
	 * *Note* if an error is thrown from this function, the original, non-decoded
	 * cookie value will be returned as the cookie's value.
	 */
	decode?(value: string): string;
}

export interface CookieSignatureOptions {
	/**
	 * An array of secrets that may be used to sign/unsign the value of a cookie.
	 *
	 * The array makes it easy to rotate secrets. New secrets should be added to
	 * the beginning of the array. `cookie.serialize()` will always use the first
	 * value in the array, but `cookie.parse()` may use any of them so that
	 * cookies that were signed with older secrets still work.
	 */
	secrets?: string[];
}
export type CookieOptions = CookieParseOptions &
	CookieSerializeOptions &
	CookieSignatureOptions;
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
export interface Cookie {
	/**
	 * The name of the cookie, used in the `Cookie` and `Set-Cookie` headers.
	 */
	readonly name: string;
	/**
	 * True if this cookie uses one or more secrets for verification.
	 */
	readonly isSigned: boolean;
	/**
	 * The Date this cookie expires.
	 *
	 * Note: This is calculated at access time using `maxAge` when no `expires`
	 * option is provided to `createCookie()`.
	 */
	readonly expires?: Date;
	/**
	 * Parses a raw `Cookie` header and returns the value of this cookie or
	 * `null` if it's not present.
	 */
	parse(
		cookieHeader: string | null,
		options?: CookieParseOptions,
		// biome-ignore lint/suspicious/noExplicitAny:
	): Promise<any>;
	/**
	 * Serializes the given value to a string and returns the `Set-Cookie`
	 * header.
	 */
	// biome-ignore lint/suspicious/noExplicitAny:
	serialize(value: any, options?: CookieSerializeOptions): Promise<string>;
}
export type CreateCookieFunction = (
	name: string,
	cookieOptions?: CookieOptions,
) => Cookie;
// biome-ignore lint/suspicious/noExplicitAny:
export type IsCookieFunction = (object: any) => object is Cookie;
/**
 * An object of name/value pairs to be used in the session.
 */
export interface SessionData {
	// biome-ignore lint/suspicious/noExplicitAny:
	[name: string]: any;
}
/**
 * Session persists data across HTTP requests.
 *
 * @see https://remix.run/utils/sessions#session-api
 */
export interface Session<Data = SessionData, FlashData = Data> {
	/**
	 * A unique identifier for this session.
	 *
	 * Note: This will be the empty string for newly created sessions and
	 * sessions that are not backed by a database (i.e. cookie-based sessions).
	 */
	readonly id: string;
	/**
	 * The raw data contained in this session.
	 *
	 * This is useful mostly for SessionStorage internally to access the raw
	 * session data to persist.
	 */
	readonly data: FlashSessionData<Data, FlashData>;
	/**
	 * Returns `true` if the session has a value for the given `name`, `false`
	 * otherwise.
	 */
	has(name: (keyof Data | keyof FlashData) & string): boolean;
	/**
	 * Returns the value for the given `name` in this session.
	 */
	get<Key extends (keyof Data | keyof FlashData) & string>(
		name: Key,
	):
		| (Key extends keyof Data ? Data[Key] : undefined)
		| (Key extends keyof FlashData ? FlashData[Key] : undefined)
		| undefined;
	/**
	 * Sets a value in the session for the given `name`.
	 */
	set<Key extends keyof Data & string>(name: Key, value: Data[Key]): void;
	/**
	 * Sets a value in the session that is only valid until the next `get()`.
	 * This can be useful for temporary values, like error messages.
	 */
	flash<Key extends keyof FlashData & string>(
		name: Key,
		value: FlashData[Key],
	): void;
	/**
	 * Removes a value from the session.
	 */
	unset(name: keyof Data & string): void;
}
export type FlashSessionData<Data, FlashData> = Partial<
	Data & {
		[Key in keyof FlashData as FlashDataKey<Key & string>]: FlashData[Key];
	}
>;
type FlashDataKey<Key extends string> = `__flash_${Key}__`;
export type CreateSessionFunction = <Data = SessionData, FlashData = Data>(
	initialData?: Data,
	id?: string,
) => Session<Data, FlashData>;
/**
 * Creates a new Session object.
 *
 * Note: This function is typically not invoked directly by application code.
 * Instead, use a `SessionStorage` object's `getSession` method.
 *
 * @see https://remix.run/utils/sessions#createsession
 */
export declare const createSession: CreateSessionFunction;
// biome-ignore lint/suspicious/noExplicitAny:
export type IsSessionFunction = (object: any) => object is Session;
/**
 * Returns true if an object is a Remix session.
 *
 * @see https://remix.run/utils/sessions#issession
 */
export declare const isSession: IsSessionFunction;
/**
 * SessionStorage stores session data between HTTP requests and knows how to
 * parse and create cookies.
 *
 * A SessionStorage creates Session objects using a `Cookie` header as input.
 * Then, later it generates the `Set-Cookie` header to be used in the response.
 */
export interface SessionStorage<Data = SessionData, FlashData = Data> {
	/**
	 * Parses a Cookie header from a HTTP request and returns the associated
	 * Session. If there is no session associated with the cookie, this will
	 * return a new Session with no data.
	 */
	getSession: (
		cookieHeader?: string | null,
		options?: CookieParseOptions,
	) => Promise<Session<Data, FlashData>>;
	/**
	 * Stores all data in the Session and returns the Set-Cookie header to be
	 * used in the HTTP response.
	 */
	commitSession: (
		session: Session<Data, FlashData>,
		options?: CookieSerializeOptions,
	) => Promise<string>;
	/**
	 * Deletes all data associated with the Session and returns the Set-Cookie
	 * header to be used in the HTTP response.
	 */
	destroySessionCookie: (
		session: Session<Data, FlashData>,
		options?: CookieSerializeOptions,
	) => Promise<Cookie>;
	/**
	 * Deletes all data associated with the Session and returns the Set-Cookie
	 * header to be used in the HTTP response.
	 */
	destroySession: (
		session: Session<Data, FlashData>,
		options?: CookieSerializeOptions,
	) => Promise<string>;
}
/**
 * SessionIdStorageStrategy is designed to allow anyone to easily build their
 * own SessionStorage using `createSessionStorage(strategy)`.
 *
 * This strategy describes a common scenario where the session id is stored in
 * a cookie but the actual session data is stored elsewhere, usually in a
 * database or on disk. A set of create, read, update, and delete operations
 * are provided for managing the session data.
 */
export interface SessionIdStorageStrategy<
	Data = SessionData,
	FlashData = Data,
> {
	/**
	 * The Cookie used to store the session id, or options used to automatically
	 * create one.
	 */
	cookie?:
		| Cookie
		| (CookieOptions & {
				name?: string;
		  });
	/**
	 * Creates a new record with the given data and returns the session id.
	 */
	createData: (
		data: FlashSessionData<Data, FlashData>,
		expires?: Date,
	) => Promise<string>;
	/**
	 * Returns data for a given session id, or `null` if there isn't any.
	 */
	readData: (id: string) => Promise<FlashSessionData<Data, FlashData> | null>;
	/**
	 * Updates data for the given session id.
	 */
	updateData: (
		id: string,
		data: FlashSessionData<Data, FlashData>,
		expires?: Date,
	) => Promise<void>;
	/**
	 * Deletes data for a given session id from the data store.
	 */
	deleteData: (id: string) => Promise<void>;
}
export type CreateSessionStorageFunction = <
	Data = SessionData,
	FlashData = Data,
>(
	strategy: SessionIdStorageStrategy<Data, FlashData>,
) => SessionStorage<Data, FlashData>;

export type AuthenticateCallback<User> = (user: User) => Promise<Response>;
/**
 * Extra options for the authenticator.
 */
export interface AuthenticatorOptions {
	sessionKey?: AuthenticateOptions["sessionKey"];
	sessionErrorKey?: AuthenticateOptions["sessionErrorKey"];
	sessionStrategyKey?: AuthenticateOptions["sessionStrategyKey"];
	throwOnError?: AuthenticateOptions["throwOnError"];
}
export declare class Authenticator<User = unknown> {
	private sessionStorage;
	/**
	 * A map of the configured strategies, the key is the name of the strategy
	 * @private
	 */
	private strategies;
	readonly sessionKey: NonNullable<AuthenticatorOptions["sessionKey"]>;
	readonly sessionErrorKey: NonNullable<
		AuthenticatorOptions["sessionErrorKey"]
	>;
	readonly sessionStrategyKey: NonNullable<
		AuthenticateOptions["sessionStrategyKey"]
	>;
	private readonly throwOnError;
	/**
	 * Create a new instance of the Authenticator.
	 *
	 * It receives a instance of the SessionStorage. This session storage could
	 * be created using any method exported by Remix, this includes:
	 * - `createSessionStorage`
	 * - `createFileSystemSessionStorage`
	 * - `createCookieSessionStorage`
	 * - `createMemorySessionStorage`
	 *
	 * It optionally receives an object with extra options. The supported options
	 * are:
	 * - `sessionKey`: The key used to store and read the user in the session storage.
	 * @example
	 * import { sessionStorage } from "./session.server";
	 * let authenticator = new Authenticator(sessionStorage);
	 * @example
	 * import { sessionStorage } from "./session.server";
	 * let authenticator = new Authenticator(sessionStorage, {
	 *   sessionKey: "token",
	 * });
	 */
	constructor(sessionStorage: SessionStorage, options?: AuthenticatorOptions);
	/**
	 * Call this method with the Strategy, the optional name allows you to setup
	 * the same strategy multiple times with different names.
	 * It returns the Authenticator instance for concatenation.
	 * @example
	 * authenticator
	 *  .use(new SomeStrategy({}, (user) => Promise.resolve(user)))
	 *  .use(new SomeStrategy({}, (user) => Promise.resolve(user)), "another");
	 */
	use(strategy: Strategy<User, never>, name?: string): Authenticator<User>;
	/**
	 * Call this method with the name of the strategy you want to remove.
	 * It returns the Authenticator instance for concatenation.
	 * @example
	 * authenticator.unuse("another").unuse("some");
	 */
	unuse(name: string): Authenticator;
	/**
	 * Call this to authenticate a request using some strategy. You pass the name
	 * of the strategy you want to use and the request to authenticate.
	 * @example
	 * async function action({ request }: ActionFunctionArgs) {
	 *   let user = await authenticator.authenticate("some", request);
	 * };
	 * @example
	 * async function action({ request }: ActionFunctionArgs) {
	 *   return authenticator.authenticate("some", request, {
	 *     successRedirect: "/private",
	 *     failureRedirect: "/login",
	 *   });
	 * };
	 */
	authenticate(
		strategy: string,
		request: Request,
		options: Pick<
			AuthenticateOptions,
			"failureRedirect" | "throwOnError" | "context"
		> & {
			successRedirect: AuthenticateOptions["successRedirect"];
		},
	): Promise<never>;
	authenticate(
		strategy: string,
		request: Request,
		options: Pick<
			AuthenticateOptions,
			"successRedirect" | "throwOnError" | "context"
		> & {
			failureRedirect: AuthenticateOptions["failureRedirect"];
		},
	): Promise<User>;
	authenticate(
		strategy: string,
		request: Request,
		options?: Pick<
			AuthenticateOptions,
			"successRedirect" | "failureRedirect" | "throwOnError" | "context"
		>,
	): Promise<User>;
	/**
	 * Call this to check if the user is authenticated. It will return a Promise
	 * with the user object or null, you can use this to check if the user is
	 * logged-in or not without triggering the whole authentication flow.
	 * @example
	 * async function loader({ request }: LoaderFunctionArgs) {
	 *   // if the user is not authenticated, redirect to login
	 *   let user = await authenticator.isAuthenticated(request, {
	 *     failureRedirect: "/login",
	 *   });
	 *   // do something with the user
	 *   return json(privateData);
	 * }
	 * @example
	 * async function loader({ request }: LoaderFunctionArgs) {
	 *   // if the user is authenticated, redirect to /dashboard
	 *   await authenticator.isAuthenticated(request, {
	 *     successRedirect: "/dashboard"
	 *   });
	 *   return json(publicData);
	 * }
	 * @example
	 * async function loader({ request }: LoaderFunctionArgs) {
	 *   // manually handle what happens if the user is or not authenticated
	 *   let user = await authenticator.isAuthenticated(request);
	 *   if (!user) return json(publicData);
	 *   return sessionLoader(request);
	 * }
	 */
	isAuthenticated(
		request: Request | Session,
		options?: {
			successRedirect?: never;
			failureRedirect?: never;
			headers?: never;
		},
	): Promise<User | null>;
	isAuthenticated(
		request: Request | Session,
		options: {
			successRedirect: string;
			failureRedirect?: never;
			headers?: HeadersInit;
		},
	): Promise<null>;
	isAuthenticated(
		request: Request | Session,
		options: {
			successRedirect?: never;
			failureRedirect: string;
			headers?: HeadersInit;
		},
	): Promise<User>;
	isAuthenticated(
		request: Request | Session,
		options: {
			successRedirect: string;
			failureRedirect: string;
			headers?: HeadersInit;
		},
	): Promise<null>;
	/**
	 * Destroy the user session throw a redirect to another URL.
	 * @example
	 * async function action({ request }: ActionFunctionArgs) {
	 *   await authenticator.logout(request, { redirectTo: "/login" });
	 * }
	 */
	logout(
		request: Request | Session,
		options: {
			redirectTo: string;
			headers?: HeadersInit;
		},
	): Promise<never>;
}

/**
 * An object of unknown type for route loaders and actions provided by the
 * server's `getLoadContext()` function.  This is defined as an empty interface
 * specifically so apps can leverage declaration merging to augment this type
 * globally: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
export interface AppLoadContext {
	[key: string]: unknown;
}
/**
 * Data for a route that was returned from a `loader()`.
 */
export type AppData = unknown;
/**
 * Extra information from the Authenticator to the strategy
 */
export interface AuthenticateOptions {
	/**
	 * The key of the session used to set the user data.
	 */
	sessionKey: string;
	/**
	 * In what key of the session the errors will be set.
	 * @default "auth:error"
	 */
	sessionErrorKey: string;
	/**
	 * The key of the session used to set the strategy used to authenticate the
	 * user.
	 */
	sessionStrategyKey: string;
	/**
	 * The name used to register the strategy
	 */
	name: string;
	/**
	 * To what URL redirect in case of a successful authentication.
	 * If not defined, it will return the user data.
	 */
	successRedirect?: string;
	/**
	 * To what URL redirect in case of a failed authentication.
	 * If not defined, it will return null
	 */
	failureRedirect?: string;
	/**
	 * Set if the strategy should throw an error instead of a Reponse in case of
	 * a failed authentication.
	 * @default false
	 */
	throwOnError?: boolean;
	/**
	 * The context object received by the loader or action.
	 * This can be used by the strategy if needed.
	 */
	context?: AppLoadContext;
}
/**
 * A function which will be called to find the user using the information the
 * strategy got from the request.
 *
 * @param params The params from the strategy.
 * @returns The user data.
 * @throws {AuthorizationError} If the user was not found. Any other error will be ignored and thrown again by the strategy.
 */
export type StrategyVerifyCallback<User, VerifyParams> = (
	params: VerifyParams,
) => Promise<User>;
/**
 * The Strategy class is the base class every strategy should extend.
 *
 * This class receives two generics, a User and a VerifyParams.
 * - User is the type of the user data.
 * - VerifyParams is the type of the params the verify callback will receive from the strategy.
 *
 * This class also defines as protected two methods, `success` and `failure`.
 * - `success` is called when the authentication was successful.
 * - `failure` is called when the authentication failed.
 * These methods helps you return or throw the correct value, response or error
 * from within the strategy `authenticate` method.
 */
export declare abstract class Strategy<User, VerifyOptions> {
	protected verify: StrategyVerifyCallback<User, VerifyOptions>;
	/**
	 * The name of the strategy.
	 * This will be used by the Authenticator to identify and retrieve the
	 * strategy.
	 */
	abstract name: string;
	constructor(verify: StrategyVerifyCallback<User, VerifyOptions>);
	/**
	 * The authentication flow of the strategy.
	 *
	 * This method receives the Request to authenticator and the session storage
	 * to use from the Authenticator. It may receive a custom callback.
	 *
	 * At the end of the flow, it will return a Response to be used by the
	 * application.
	 */
	abstract authenticate(
		request: Request,
		sessionStorage: SessionStorage,
		options: AuthenticateOptions,
	): Promise<User>;
	/**
	 * Throw an AuthorizationError or a redirect to the failureRedirect.
	 * @param message The error message to set in the session.
	 * @param request The request to get the cookie out of.
	 * @param sessionStorage The session storage to retrieve the session from.
	 * @param options The strategy options.
	 * @throws {AuthorizationError} If the throwOnError is set to true.
	 * @throws {Response} If the failureRedirect is set or throwOnError is false.
	 * @returns {Promise<never>}
	 */
	protected failure(
		message: string,
		request: Request,
		sessionStorage: SessionStorage,
		options: AuthenticateOptions,
		cause?: Error,
	): Promise<never>;
	/**
	 * Returns the user data or throw a redirect to the successRedirect.
	 * @param user The user data to set in the session.
	 * @param request The request to get the cookie out of.
	 * @param sessionStorage The session storage to retrieve the session from.
	 * @param options The strategy options.
	 * @returns {Promise<User>} The user data.
	 * @throws {Response} If the successRedirect is set, it will redirect to it.
	 */
	protected success(
		user: User,
		request: Request,
		sessionStorage: SessionStorage,
		options: AuthenticateOptions,
	): Promise<User>;
}

// Define a user type for cleaner typing
export type ProviderUser = {
	id: string;
	email: string;
	username?: string;
	name?: string;
	imageUrl?: string;
};

export interface AuthProvider {
	// biome-ignore lint/suspicious/noExplicitAny:
	getAuthStrategy(): Strategy<ProviderUser, any>;
	handleMockAction(request: Request): Promise<void>;
	resolveConnectionData(
		providerId: string,
		options?: { timings?: Timings },
	): Promise<{
		displayName: string;
		link?: string | null;
	}>;
}

export const normalizeEmail = (s: string) => s.toLowerCase();

export const normalizeUsername = (s: string) =>
	s.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
