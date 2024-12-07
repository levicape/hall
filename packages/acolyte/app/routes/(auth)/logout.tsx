import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";
import { z } from "zod";
import { logout } from "~/middleware/security/auth-login.server.js";
import { useAppSession } from "~/middleware/session/session.server.js";

const logoutZod = z.object({
	fromInvalidRoute: z.boolean().optional(),
});

export const logoutFn = createServerFn()
	.validator((props: unknown) => {
		return logoutZod.parse(props);
	})
	.handler(async (ctx) => {
		const { fromInvalidRoute } = ctx.data;
		const session = await useAppSession();
		const {
			data: { token },
		} = session;
		const { id: sessionId } = token ?? {};
		session.clear();
		await logout({
			sessionId,
		});
		setCookie("_tanstack_form_internals", "");

		throw redirect({
			to: "/login",
			search: {
				loggedOut: sessionId ? 1 : 0,
				fromInvalidRoute: fromInvalidRoute ? 1 : undefined,
			},
			replace: true,
		});
	});

export const Route = createFileRoute("/(auth)/logout")({
	preload: false,
	validateSearch: z.object({
		fromInvalidRoute: z.union([z.literal(1), z.literal(0)]).catch(0),
	}),
	loaderDeps: ({ search }) => {
		return {
			fromInvalidRoute: search.fromInvalidRoute === 1,
		};
	},
	loader: ({ deps }) =>
		logoutFn({
			data: {
				fromInvalidRoute: deps.fromInvalidRoute,
			},
		}),
});
