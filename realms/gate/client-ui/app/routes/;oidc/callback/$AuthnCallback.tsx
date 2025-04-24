import { type CSSProperties, useEffect, useMemo } from "hono/jsx";
import { useOidcClient } from "../../../atoms/authentication/OidcClientAtom.js";
import type { AuthnAuthorizeUserState } from "../authorize/$AuthnAuthorize.js";

export const AuthnCallback = () => {
	const { oidc } = useOidcClient();
	const { enabled: discordEnabled } = {} as Record<string, unknown>; //useDiscord();

	useEffect(() => {
		if (!discordEnabled) {
			console.debug({
				AuthnCallback: {
					message: "Processing auth callback",
				},
			});

			oidc?.userManager.signinCallback().then(async (status) => {
				let signinError: unknown;
				console.debug({
					AuthnCallback: {
						message: "Navigating to root after sign-in",
						status: {
							sessionState: status?.session_state,
							state: status?.state,
						},
						signinError,
					},
				});
				let redirectUrl = "/";
				const state = status?.state as AuthnAuthorizeUserState;
				if (state.signInFrom !== undefined) {
					redirectUrl = state.signInFrom;
				} else {
					const navigationEntires = (window.navigation?.entries() ?? [])
						.filter((e) => {
							return (
								!e.sameDocument && e.url !== null && !e.url.includes("/;oidc/")
							);
						})
						.map((e) => {
							return e.url as string;
						})
						.find(() => true);
					if (navigationEntires !== undefined) {
						redirectUrl = navigationEntires;
					}
				}

				setTimeout(
					() => {
						location.assign(redirectUrl);
					},
					Math.random() * 100 + 20,
				);
			});
		}
	}, [oidc, discordEnabled]);

	return (
		<object
			aria-hidden
			typeof={"AuthnCallback"}
			data-oidc={oidc ? "true" : "false"}
			suppressHydrationWarning
		/>
	);
};
