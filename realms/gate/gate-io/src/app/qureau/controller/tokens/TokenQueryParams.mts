import type {
	AuthorizeQueryParams,
	AuthorizeQueryParamsZod,
} from "../login/AuthorizeQueryParams.mjs";

export type TokenQueryParams = AuthorizeQueryParams;

export type TokenQueryParamsRequired = TokenQueryParams & {
	grant_type: string;
};

// https://gate.platform/oauth2/anonymous?response_type=code&client_id=test&redirect_uri=/oauth2/redirect&scope=openid
export const TokenQueryParamsZod = (
	authorize: ReturnType<typeof AuthorizeQueryParamsZod>,
) =>
	authorize.omit({
		scope: true,
		response_type: true,
		approval_prompt: true,
		access_token: true,
	});
