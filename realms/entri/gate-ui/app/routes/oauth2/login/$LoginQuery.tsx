import { type CSSProperties, useMemo } from "hono/jsx";

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
const isValidParam = (key: string): key is keyof LoginQueryParams => {
	return validParams.includes(key);
};

export function LoginQuery() {
	const style: CSSProperties = useMemo(
		() => ({
			display: "none",
			pointerEvents: "none",
			touchAction: "none",
			position: "fixed",
			visibility: "hidden",
			width: 0,
			height: 0,
			top: 0,
			left: 0,
			zIndex: -1,
		}),
		[],
	);

	const isServer = typeof window === "undefined";
	if (isServer) {
		return (
			<object
				aria-hidden
				suppressHydrationWarning
				typeof={"LoginQuery"}
				style={style}
			/>
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
			style={style}
			typeof={"LoginQuery"}
			suppressHydrationWarning
			{...dataAttributes}
		/>
	);
}
