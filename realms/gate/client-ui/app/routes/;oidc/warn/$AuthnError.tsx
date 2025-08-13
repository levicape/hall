import { type CSSProperties, useEffect, useMemo } from "hono/jsx";
import { useOidcClient } from "../../../atoms/authentication/OidcClientAtom.js";

export const AuthnError = () => {
	const { oidc } = useOidcClient();

	return (
		<object
			aria-hidden
			typeof={"AuthnClose"}
			data-oidc={oidc ? "true" : "false"}
			suppressHydrationWarning
		/>
	);
};
