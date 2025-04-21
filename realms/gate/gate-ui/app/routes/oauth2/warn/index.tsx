import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { AnonymousLoginPage } from "./$Warn.js";

export default function OidcAnonymous(_c: Context) {
	return (
		<Fragment>
			<AnonymousLoginPage />
		</Fragment>
	);
}
