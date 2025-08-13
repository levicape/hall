import { Fragment } from "hono/jsx/jsx-runtime";
import { Loading } from "../../../ui/daisy/feedback/Loading.js";
import { AuthnRenew } from "./$AuthnRenew.js";

export default async function Renew() {
	return (
		<Fragment>
			<Loading className={"loading-spinner bg-clip-content"} size={"xl"} />
			<AuthnRenew />
		</Fragment>
	);
}
