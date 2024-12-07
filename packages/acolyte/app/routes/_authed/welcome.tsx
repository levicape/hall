import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/welcome")({
	component: WelcomePage,
});

function WelcomePage() {
	return (
		<div>
			<h1>Welcome to the site!</h1>
		</div>
	);
}
