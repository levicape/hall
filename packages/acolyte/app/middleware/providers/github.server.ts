import { createId as cuid } from "@paralleldrive/cuid2/index";
import { redirect } from "@tanstack/react-router";
// import { GitHubStrategy } from "remix-auth-github/build";
import { z } from "zod";
import type { Timings } from "../timing.server.js";
import { connectionSessionStorage } from "./connections.server.js";
import { MOCK_CODE_GITHUB, MOCK_CODE_GITHUB_HEADER } from "./constants.js";
import {
	type AuthProvider,
	type AuthenticateOptions,
	type ProviderUser,
	type SessionStorage,
	Strategy,
	type StrategyVerifyCallback,
} from "./provider.js";
// import { cache, cachified } from "../cache.server";

const GitHubUserSchema = z.object({ login: z.string() });
const GitHubUserParseResult = z
	.object({
		success: z.literal(true),
		data: GitHubUserSchema,
	})
	.or(
		z.object({
			success: z.literal(false),
		}),
	);

const shouldMock =
	process.env.GITHUB_CLIENT_ID?.startsWith("MOCK_") ||
	process.env.NODE_ENV === "test";

// biome-ignore lint/suspicious/noExplicitAny:
class GitHubStrategy<T> extends Strategy<T, any> {
	name: string;

	constructor(
		private options: {
			clientId: string;
			clientSecret: string;
			redirectURI: string;
		},
		// biome-ignore lint/suspicious/noExplicitAny:
		public verify: StrategyVerifyCallback<T, any>,
	) {
		super(verify);
		this.name = "github";
	}

	async authenticate(
		request: Request,
		sessionStorage: SessionStorage,
		options: AuthenticateOptions,
	): Promise<T> {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");

		if (!code || !state) {
			throw new Error("Missing code or state in the callback URL");
		}

		const session = await sessionStorage.getSession(
			request.headers.get("cookie"),
		);
		const storedState = session.get("oauth2:state");

		if (state !== storedState) {
			throw new Error("Invalid state parameter");
		}

		const tokenResponse = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					client_id: this.options.clientId,
					client_secret: this.options.clientSecret,
					code,
					redirect_uri: this.options.redirectURI,
				}),
			},
		);

		if (!tokenResponse.ok) {
			throw new Error("Failed to fetch access token");
		}

		const { access_token } = await tokenResponse.json();

		const profileResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		if (!profileResponse.ok) {
			throw new Error("Failed to fetch user profile");
		}

		const profile = await profileResponse.json();

		return this.verify({ profile });
	}
}
export class GitHubProvider implements AuthProvider {
	getAuthStrategy(): GitHubStrategy<ProviderUser> {
		return new GitHubStrategy(
			{
				clientId: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				redirectURI: "/auth/github/callback",
			},
			// biome-ignore lint/suspicious/noExplicitAny:
			async ({ profile }: any) => {
				const email = profile.emails[0]?.value.trim().toLowerCase();
				if (!email) {
					throw new Error("Email not found");
				}
				const username = profile.displayName;
				const imageUrl = profile.photos[0].value;
				return {
					email,
					id: profile.id,
					username,
					name: profile.name.givenName,
					imageUrl,
				} as ProviderUser;
			},
		);
	}

	async resolveConnectionData(
		providerId: string,
		{ timings }: { timings?: Timings } = {},
	) {
		// const result = (await cachified({
		// 	key: `connection-data:github:${providerId}`,
		// 	cache,
		// 	timings,
		// 	ttl: 1000 * 60,
		// 	swr: 1000 * 60 * 60 * 24 * 7,
		// 	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// 	// @ts-ignore
		// 	async getFreshValue(context: {
		// 		metadata: { ttl: number | null | undefined };
		// 	}) {
		// 		const response = await fetch(
		// 			`https://api.github.com/user/${providerId}`,
		// 			{ headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } },
		// 		);
		// 		const rawJson = await response.json();
		// 		const result = GitHubUserSchema.safeParse(rawJson);
		// 		if (!result.success) {
		// 			// if it was unsuccessful, then we should kick it out of the cache
		// 			// asap and try again.
		// 			context.metadata.ttl = 0;
		// 		}
		// 		return result;
		// 	},
		// 	checkValue: GitHubUserParseResult,
		// })) as z.infer<typeof GitHubUserParseResult>;
		// return {
		// 	displayName: result.success ? result.data.login : "Unknown",
		// 	link: result.success ? `https://github.com/${result.data.login}` : null,
		// } as const;

		//TODO:
		return {
			displayName: "Unknown",
			link: null,
		};
	}

	async handleMockAction(request: Request) {
		if (!shouldMock) return;

		const connectionSession = await connectionSessionStorage.getSession(
			request.headers.get("cookie") || "",
		);
		const state = cuid();
		connectionSession.set("oauth2:state", state);

		const code =
			request.headers.get(MOCK_CODE_GITHUB_HEADER) || MOCK_CODE_GITHUB;
		const searchParams = new URLSearchParams({ code, state });
		throw redirect({
			to: `/auth/github/callback?${searchParams}`,
			headers: {
				"set-cookie":
					await connectionSessionStorage.commitSession(connectionSession),
			},
			statusCode: 302,
		});
	}
}
