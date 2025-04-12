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
];
export const isValidLoginParam = (
	key: string,
): key is keyof LoginQueryParams => {
	return validParams.includes(key);
};
