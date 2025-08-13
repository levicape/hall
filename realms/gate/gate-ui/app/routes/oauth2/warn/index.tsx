import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { OAuth2Warning } from "./$Warn.js";

export default function OidcWarnPage(_c: Context) {
	return (
		<Fragment>
			<OAuth2Warning />
		</Fragment>
	);
}
