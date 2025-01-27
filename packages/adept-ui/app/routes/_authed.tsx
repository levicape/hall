import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async ({ context }) => {
		const { session } = context;
		if (!session?.user) {
			throw redirect({
				to: "/logout",
				search: {
					fromInvalidRoute: 1,
				},
				resetScroll: true,
			});
		}
	},
});
