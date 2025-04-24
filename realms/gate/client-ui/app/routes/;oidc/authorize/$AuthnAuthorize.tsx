import { type CSSProperties, useEffect, useMemo } from "hono/jsx";
import { useOidcClient } from "../../../atoms/authentication/OidcClientAtom.js";

export type AuthnAuthorizeUserState = {
	signInFrom?: string;
};
export const AuthnAuthorize = () => {
	const { oidc } = useOidcClient();
	const { enabled: discordEnabled } = {} as Record<string, unknown>; //useDiscord();

	useEffect(() => {
		if (!discordEnabled) {
			oidc?.userManager
				.signinRedirect({
					state: { signInFrom: window.navigation?.entries().pop()?.url },
				})
				.then(() => {
					console.debug({
						AuthnAuthorize: {
							message: "Sign-in initiated",
						},
					});
				});
		}
	}, [oidc, discordEnabled]);

	return (
		<object
			aria-hidden
			typeof={"AuthnAuthorize"}
			data-oidc={oidc ? "true" : "false"}
			suppressHydrationWarning
		/>
	);
};
