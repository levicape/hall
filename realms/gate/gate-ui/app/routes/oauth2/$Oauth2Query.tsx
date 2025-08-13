import type { AuthorizeQueryParams } from "@levicape/hall-gate-io/app/qureau/controller/login/AuthorizeQueryParams";
import { useMemo } from "hono/jsx";

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
const isValidParam = (key: string): key is keyof AuthorizeQueryParams => {
	return validParams.includes(key);
};

export function Oauth2Query() {
	const isServer = typeof window === "undefined";
	if (isServer) {
		return (
			<object aria-hidden suppressHydrationWarning typeof={"Oauth2Query"} />
		);
	}

	const dataAttributes = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		const data: Record<string, string> = {};
		for (const [key, value] of params) {
			if (isValidParam(key)) {
				data[`data-${key}`] = value;
			}
		}
		return data;
	}, [window.location.search]);

	return (
		<object
			aria-hidden
			typeof={"Oauth2Query"}
			suppressHydrationWarning
			{...dataAttributes}
		/>
	);
}
