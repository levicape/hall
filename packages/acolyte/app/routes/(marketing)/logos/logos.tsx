import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(marketing)/logos/logos")({
	component: () => <div>{`Hello "/_marketing+/logos/logos!" `}</div>,
});
