import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";
import { getHints } from "~/middleware/client-hints.js";
import { getEnv } from "~/middleware/env.server.js";
import { getDomainUrl } from "~/middleware/http.js";
import { logout } from "~/middleware/security/auth-login.server.js";
import { honeypot } from "~/middleware/security/honeypot.server.js";
import { useAppSession } from "~/middleware/session/session.server.js";
import { makeTimings, time } from "~/middleware/timing.server.js";
import { type Theme, getTheme } from "~/middleware/user/theme.server.js";
import { useStaticQureauUserService } from "~/ui/data/qureau/user/useQureauUserService.server.js";
import { GetRootRoute } from "./__root.js";

const QureauUsers = useStaticQureauUserService({
	entityKey: {},
});

export const rootUserFn = createServerFn().handler(async () => {
	const request = getWebRequest();
	const timings = makeTimings("root loader");
	const session = await useAppSession();
	const { id: sessionId, userId } = session.data.token ?? {};

	console.log({
		Root: {
			request,
		},
	});

	const { response } = userId
		? await time(
				() =>
					QureauUsers.retrieveWithId({
						request: {
							userId,
						},
						ext: {
							nonce: Date.now().toString(),
						},
					}),
				{ timings, type: "find user", desc: "find user in root" },
			)
		: {};

	const user =
		(response?.$case === "data" &&
			response.value.qureau?.$case === "user" &&
			response.value.qureau.value.user?.$case === "retrieveWithId" &&
			response.value.qureau.value.user.value.withId) ??
		undefined;

	if (userId && !user) {
		console.warn({
			Root: {
				message: "User not found",
				userId,
				user,
			},
		});
		await logout({ sessionId });
	}
	// const { toast, cookie } = await getToast(request.headers);
	// if (cookie) {
	// 	setCookie("toast", cookie.name, cookie);
	// }
	const honeyProps = await honeypot.getInputProps();

	return {
		user,
		requestInfo: {
			hints: getHints(request),
			origin: getDomainUrl(request),
			path: new URL(request.url).pathname,
			userPrefs: {
				theme: getTheme(request.headers),
			},
		},
		ENV: getEnv(),
		// toast,
		honeyProps,
		timings: timings.toString(),
	} as {
		user: typeof user;
		requestInfo: {
			hints: ReturnType<typeof getHints>;
			origin: string;
			path: string;
			userPrefs: {
				theme: Theme;
			};
		};
		ENV: ReturnType<typeof getEnv>;
		// toast: typeof toast;
		honeyProps: typeof honeyProps;
		timings: string;
	};
});

export const useRootContextUser = () => {
	return GetRootRoute().useRouteContext().session ?? {};
};
