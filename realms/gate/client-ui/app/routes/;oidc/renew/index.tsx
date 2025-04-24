import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnRenew } from "./$AuthnRenew.js";

export default async function OidcRenewPage() {
	return (
		<Fragment>
			{/* <Loading className={"loading-spinner bg-clip-content"} size={"xl"} /> */}
			<AuthnRenew />
		</Fragment>
	);
}
