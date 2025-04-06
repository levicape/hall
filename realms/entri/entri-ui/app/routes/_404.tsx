import { clsx } from "clsx";
import type { NotFoundHandler } from "hono";
import { AppBody } from "../ui/AppBody.js";

const handler: NotFoundHandler = (c) => {
	return c.render(
		<AppBody header={false}>
			<h1>Page Not Found</h1>
			<p>The page you are looking for does not exist.</p>
			<a
				href="/"
				className={clsx(
					"btn",
					"btn-primary",
					"btn-sm",
					"btn-outline",
					"btn-wide",
					"mt-4",
					"rounded-field",
					"border-2",
					"border-primary",
					"border-opacity-20",
				)}
			>
				Go to Home
			</a>
		</AppBody>,
	);
};

export default handler;
