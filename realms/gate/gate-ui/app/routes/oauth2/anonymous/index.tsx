import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnSession } from "../../../atoms/authentication/behavior/$AuthnSession.js";
import { AnonymousLoginPage } from "./$Anonymous.js";

export default function OidcAnonymous(_c: Context) {
	return (
		<Fragment>
			<AnonymousLoginPage />
			<AuthnSession />
		</Fragment>
	);
}
