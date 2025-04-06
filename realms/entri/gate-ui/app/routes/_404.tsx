import type { NotFoundHandler } from "hono";
import { AppBody } from "../ui/AppBody.js";

const handler: NotFoundHandler = (c) => {
	return c.render(
		<AppBody header={false}>
			<h1>Page Not Found</h1>
			<p>The page you are looking for does not exist.</p>
		</AppBody>,
	);
};

export default handler;
