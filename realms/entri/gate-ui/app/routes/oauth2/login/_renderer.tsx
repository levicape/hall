import { jsxRenderer } from "hono/jsx-renderer";
import { AppBody } from "../../../ui/AppBody.js";

export default jsxRenderer(
	({ children, Layout }) => {
		return (
			<Layout>
				<AppBody header={false}>{children}</AppBody>
			</Layout>
		);
	},
	{ stream: true },
);
