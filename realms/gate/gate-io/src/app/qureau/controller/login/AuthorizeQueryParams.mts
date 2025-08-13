import { HonoRequestLoggingStorage } from "@levicape/spork/router/hono/middleware/log/HonoRequestLogger";
import type { JwtVerificationInterface } from "@levicape/spork/server/security/JwtVerification";
import VError from "verror";
import Zod from "zod";
import type { HttpMiddleware } from "../../../../http/HonoApp.mjs";

const validParams = [
	"response_type",
	"client_id",
	"redirect_uri",
	"scope",
	"state",
	"code_challenge",
	"code_challenge_method",
	"nonce",
	"prompt",
	"access_type",
	"hd",
	"approval_prompt",
	"access_token",
	"grant_type",
	"code",
	"error",
	"error_description",
	"refresh_token",
] as const;
const validSubjectTypes = ["public"] as const;
const validScopes = [
	"openid",
	"profile",
	"email",
	"offline_access",
	"address",
	"phone",
	"groups",
	"roles",
	"permissions",
	"custom",
] as const;
const validResponseTypes = ["code", "token", "id_token"] as const;
const validPrompt = ["none", "login", "consent", "select_account"] as const;
const validCodeChallengeMethod = ["plain", "S256"] as const;
const validAccessType = ["online", "offline"] as const;
const validApprovalPrompt = ["auto", "force"] as const;

export type AuthorizeQueryParamResponseType =
	(typeof validResponseTypes)[number];
export type AuthorizeQueryParamScope = (typeof validScopes)[number];
export type AuthorizeQueryParamSubjectType = (typeof validSubjectTypes)[number];
export type AuthorizeQueryParamPrompt = (typeof validPrompt)[number];
export type AuthorizeQueryParamCodeChallengeMethod =
	(typeof validCodeChallengeMethod)[number];
export type AuthorizeQueryParamAccessType = (typeof validAccessType)[number];
export type AuthorizeQueryParamApprovalPrompt =
	(typeof validApprovalPrompt)[number];

export type AuthorizeQueryParams = Partial<
	Record<(typeof validParams)[number], string | undefined>
>;

export type AuthorizeQueryParamsRequired = AuthorizeQueryParams & {
	response_type: string;
	client_id: string;
	redirect_uri: string;
	scope: string;
};

export type AuthorizeQueryConfiguration = {
	scopes: ReadonlyArray<AuthorizeQueryParamScope>;
	responseTypes: Array<AuthorizeQueryParamResponseType>;
	subjectTypes: ReadonlyArray<AuthorizeQueryParamSubjectType>;
	prompt: Array<AuthorizeQueryParamPrompt>;
	codeChallengeMethod: Array<AuthorizeQueryParamCodeChallengeMethod>;
	approvalPrompt: Array<AuthorizeQueryParamApprovalPrompt>;
	accessType: Array<AuthorizeQueryParamAccessType>;
	clients: ReadonlyArray<{
		clientId: string;
		redirectUrls: ReadonlyArray<string>;
	}>;
};

export const AuthorizeQueryParamsZod = (
	config: AuthorizeQueryConfiguration,
	oauthConfiguration: HttpMiddleware["Variables"]["OauthConfiguration"],
	jwtVerification: JwtVerificationInterface,
) => {
	const scopes = new Set(config.scopes);
	const redirectUris = Object.fromEntries(
		config.clients.map((client) => {
			return [client.clientId, new Set(client.redirectUrls)];
		}),
	);

	return Zod.object({
		response_type: Zod.literal(config.responseTypes),
		client_id: Zod.string().refine(
			(clientId) => {
				return redirectUris[clientId] !== undefined;
			},
			{
				error: "Client ID is not valid",
			},
		),
		redirect_uri: Zod.string().optional(),
		scope: Zod.string()
			.transform((val) => val.split(" ").filter(Boolean))
			.refine((scopes) => scopes.includes("openid"), {
				error: `Scope must include "openid"`,
			})
			.refine(
				(parsed) =>
					parsed.every((scope) =>
						scopes.has(scope as AuthorizeQueryParamScope),
					),
				{
					error: `Scope must only contain supported values: ${config.scopes.join(", ")}`,
				},
			)
			.transform((scopes) => scopes.join(" ")),
		state: Zod.string().optional(),
		code_challenge: Zod.string().optional(),
		code_challenge_method: Zod.literal(config.codeChallengeMethod).optional(),
		nonce: Zod.string().optional(),
		hd: Zod.string().optional(),
		prompt: Zod.literal(config.prompt).optional(),
		access_type: Zod.literal(config.accessType).optional(),
		approval_prompt: Zod.literal(config.approvalPrompt).optional(),
		grant_type: Zod.literal(["authorization_code", "refresh_token"]).optional(),
		access_token: Zod.string().optional(),
		refresh_token: Zod.string().optional(),
		code: Zod.string().optional(),
		error: Zod.string().optional(),
		error_description: Zod.string().optional(),
	})
		.refine(
			(data) => {
				if (data.redirect_uri === undefined) {
					return true;
				}

				const clientId = data.client_id;
				const redirectUri = data.redirect_uri;
				if (redirectUris[clientId]) {
					return redirectUris[clientId].has(redirectUri);
				}
				return false;
			},
			{
				message: "Redirect URI is not valid for the given client ID",
			},
		)
		.extend(
			Zod.object({
				redirect_uri: Zod.string().optional(),
			}),
		);
};
