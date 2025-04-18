import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { LoginPage } from "./$LoginPage.js";

export default function OidcLogin(_c: Context) {
	return (
		<Fragment>
			<LoginPage />
		</Fragment>
	);
}
