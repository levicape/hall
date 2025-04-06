import { clsx } from "clsx";
import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { LoginPage } from "./$LoginForm.js";
import { LoginQuery } from "./$LoginQuery.js";

export default function OidcLogin(_c: Context) {
	return (
		<Fragment>
			<main
				className={clsx(
					"grid",
					"grid-flow-dense",
					"auto-rows-auto",
					"grid-cols-6",
					"p-10",
				)}
			>
				<LoginPage />
			</main>
			<LoginQuery />
		</Fragment>
	);
}
