import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { AnonymousLoginPage } from "./$Anonymous.js";

export default function OidcAnonymous(_c: Context) {
	return (
		<Fragment>
			<AnonymousLoginPage />
		</Fragment>
	);
}
