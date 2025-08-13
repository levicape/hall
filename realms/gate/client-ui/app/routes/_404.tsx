import type { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
	return c.render(
		<body header={false}>
			<h1>Page Not Found</h1>
			<p>The page you are looking for does not exist.</p>
		</body>,
	);
};

export default handler;
