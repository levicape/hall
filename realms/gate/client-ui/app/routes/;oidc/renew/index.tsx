import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnRenew } from "./$AuthnRenew.js";

export default async function Renew() {
	return (
		<Fragment>
			{/* <Loading className={"loading-spinner bg-clip-content"} size={"xl"} /> */}
			<AuthnRenew />
		</Fragment>
	);
}
