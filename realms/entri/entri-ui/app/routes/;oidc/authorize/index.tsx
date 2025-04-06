import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnAuthorize } from "./$AuthnAuthorize.js";
import { AuthorizeProgress } from "./$AuthorizeProgress.js";

export default function Authorize() {
	return (
		<Fragment>
			<AuthorizeProgress />
			<AuthnAuthorize />
		</Fragment>
	);
}
