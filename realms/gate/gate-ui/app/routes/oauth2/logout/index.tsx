import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { LogoutPage } from "./$Logout.js";

export default function OidcLogout(_c: Context) {
	return (
		<Fragment>
			<LogoutPage />
		</Fragment>
	);
}
