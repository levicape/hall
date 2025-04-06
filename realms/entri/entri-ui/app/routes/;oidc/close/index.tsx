import { Fragment } from "hono/jsx/jsx-runtime";
import { AuthnClose } from "./$AuthnClose.js";
import { CloseProgress } from "./$CloseProgress.js";

export default function Close() {
	return (
		<Fragment>
			<CloseProgress />
			<AuthnClose />
		</Fragment>
	);
}
