import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnCallback } from "./$AuthnCallback.js";
import { CallbackProgress } from "./$CallbackProgress.js";

export default function Callback() {
	return (
		<Fragment>
			<CallbackProgress />
			<AuthnCallback />
		</Fragment>
	);
}
