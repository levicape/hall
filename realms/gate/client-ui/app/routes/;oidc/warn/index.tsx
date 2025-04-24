import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnError } from "./$AuthnError.js";
import { WarnProgress } from "./$WarnProgress.js";

export default function OidcErrorPage() {
	return (
		<Fragment>
			<WarnProgress />
			<AuthnError />
		</Fragment>
	);
}
