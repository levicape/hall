import type { ErrorHandler } from "hono";

const handler: ErrorHandler = (e, c) => {
	if ("getResponse" in e) {
		return e.getResponse();
	}

	console.trace(e.message);
	c.status(500);
	return c.render(
		<body header={false}>
			<h1>Internal Server Error</h1>
			<p>Something went wrong. Please try again later.</p>
		</body>,
	);
};

export default handler;
