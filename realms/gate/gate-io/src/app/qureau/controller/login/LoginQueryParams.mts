import type { ZodSafeParseResult } from "zod";
import Zod from "zod";
import { Topology } from "../../../../http/Atlas.mjs";
import {
	GateSupportedResponseTypes,
	GateSupportedScopes,
} from "../../../gate/Gate.mjs";

export type LoginQueryParams = {
	response_type?: string;
	client_id?: string;
	redirect_uri?: string;
	scope?: string;
	state?: string;
	code_challenge?: string;
	code_challenge_method?: string;
	nonce?: string;
	prompt?: string;
	access_type?: string;
	hd?: string;
	approval_prompt?: string;
	access_token?: string;
	grant_type?: string;
	code?: string;
	error?: string;
	error_description?: string;
	refresh_token?: string;
};
export type LoginQueryParamsRequired = LoginQueryParams & {
	response_type: string;
	client_id: string;
	redirect_uri: string;
	scope: string;
};

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
];
export const isValidLoginParam = (
	key: string,
): key is keyof LoginQueryParams => {
	return validParams.includes(key);
};
// https://gate.platform:10000/oauth2/anonymous?response_type=code&client_id=test&redirect_uri=/oauth2/redirect&scope=openid
const SUPPORTED_RESPONSE_TYPES = await GateSupportedResponseTypes();
const SUPPORTED_SCOPES = await GateSupportedScopes();

export const LoginQueryParamsZod = Zod.object({
	response_type: Zod.literal(SUPPORTED_RESPONSE_TYPES),
	client_id: Zod.string().refine(
		async (clientId) => {
			return ["test", "valid", "ok"].includes(clientId);
		},
		{
			error: "Client ID is not valid",
		},
	),
	redirect_uri: Zod.string().refine(
		async (uri) => {
			const host = Topology["/~/Frontend/Hostname"].url();
			return ["oauth2"]
				.map((path) => `${host}/${path}`)
				.some((callback) => uri.startsWith(callback));
		},
		{
			error: "Redirect URI is not valid",
		},
	),
	scope: Zod.string()
		.transform((val) => val.split(" ").filter(Boolean))
		.refine((scopes) => scopes.includes("openid"), {
			error: `Scope must include "openid"`,
		})
		.refine(
			(scopes) => scopes.every((scope) => SUPPORTED_SCOPES.includes(scope)),
			{
				error: `Scope must only contain supported values: ${SUPPORTED_SCOPES.join(", ")}`,
			},
		)
		.transform((scopes) => scopes.join(" ")),
	state: Zod.string().optional(),
	code_challenge: Zod.string().optional(),
	code_challenge_method: Zod.literal(["plain", "S256"] as const).optional(),
	nonce: Zod.string().optional(),
	prompt: Zod.literal([
		"none",
		"login",
		"consent",
		"select_account",
	] as const).optional(),
	access_type: Zod.literal(["online", "offline"] as const).optional(),
	hd: Zod.string().optional(),
	approval_prompt: Zod.literal(["auto", "force"] as const).optional(),
	access_token: Zod.string().optional(),
	grant_type: Zod.literal(["authorization_code", "refresh_token"]).optional(),
	refresh_token: Zod.string().optional(),
	code: Zod.string().optional(),
	error: Zod.string().optional(),
	error_description: Zod.string().optional(),
});

export const zLoginQueryParams = (
	query: Record<string, string | undefined>,
): ZodSafeParseResult<LoginQueryParams> => {
	const filteredQuery = Object.fromEntries(
		Object.entries(query).filter(([key]) => isValidLoginParam(key)),
	);

	return LoginQueryParamsZod.safeParse(filteredQuery);
};
