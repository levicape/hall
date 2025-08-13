import { type CSSProperties, useMemo } from "react";
import { useOidcClient } from "../OidcClientAtom.js";

export const AuthnSession = () => {
	const { oidc, user } = useOidcClient();
	// const { enabled: discordEnabled } = {} as Record<string, unknown>; //useDiscord();

	const dataAttributes = useMemo(
		() => ({
			"data-oidc": oidc !== null ? "true" : "false",
			"data-session-expired": user?.expired ? JSON.stringify(user.expired) : "",
			"data-session-expires-at": user?.expires_at
				? JSON.stringify(user.expires_at)
				: "",
			"data-session-expires-in": user?.expires_in
				? JSON.stringify(user.expires_in)
				: "",
			"data-session-state": user?.state ? JSON.stringify(user.state) : "",
		}),
		[oidc, user],
	);

	return (
		<object
			aria-hidden
			typeof={"AuthnSession"}
			suppressHydrationWarning
			{...dataAttributes}
		/>
	);
};
