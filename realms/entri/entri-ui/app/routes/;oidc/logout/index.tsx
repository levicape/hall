import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnLogout } from "./$AuthnLogout.js";
import { LogoutProgress } from "./$LogoutProgress.js";

export default function Callback() {
	return (
		<Fragment>
			<LogoutProgress />
			<AuthnLogout />
		</Fragment>
	);
}
