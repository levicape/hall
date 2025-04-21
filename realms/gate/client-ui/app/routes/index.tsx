import type { Context } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { OidcUserLoginCard } from "../atoms/authentication/card/$OidcUserLoginCard";

export default function Home(_c: Context) {
	return (
		<Fragment>
			<div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
				<OidcUserLoginCard />
			</div>
		</Fragment>
	);
}
