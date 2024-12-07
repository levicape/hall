// import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
// import { logout, requireUserId } from "~/middleware/security/auth.server";

// export async function loader({ request }: LoaderFunctionArgs) {
// 	// const userId = await requireUserId(request);
// 	await requireUserId(request);
// 	// const user = await prisma.user.findUnique({ where: { id: userId } })
// 	const user = { username: "test" };
// 	if (!user) {
// 		const requestUrl = new URL(request.url);
// 		const loginParams = new URLSearchParams([
// 			["redirectTo", `${requestUrl.pathname}${requestUrl.search}`],
// 		]);
// 		const redirectTo = `/login?${loginParams}`;
// 		await logout({ request, redirectTo });
// 		return redirect(redirectTo);
// 	}
// 	return redirect(`/users/${user.username}`);
// }
