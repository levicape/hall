import { clsx } from "clsx";
import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnSession } from "../../../atoms/authentication/behavior/$AuthnSession.js";
import { LoginPage } from "./$LoginForm.js";

export default function OidcLogin(_c: Context) {
	return (
		<Fragment>
			<LoginPage />
			<AuthnSession />
		</Fragment>
	);
}
