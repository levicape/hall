// app/global.d.ts
import type {} from "hono";

type ContainerStyle = {
	className?: string;
};

declare module "hono" {
	type ContextRenderer = (
		content: string | Promise<string>,
		container?: ContainerStyle,
	) => Response | Promise<Response>;
}
