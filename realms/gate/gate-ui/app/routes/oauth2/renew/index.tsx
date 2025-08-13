import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { LogoutPage } from "./$Renew.js";

export default function OidcRenew(_c: Context) {
	return (
		<Fragment>
			<LogoutPage />
		</Fragment>
	);
}
