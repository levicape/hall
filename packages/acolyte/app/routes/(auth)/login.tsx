import { formOptions } from "@tanstack/react-form";
import {
	ServerValidateError,
	createServerValidate,
	getFormData,
} from "@tanstack/react-form/start";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";
import { z } from "zod";
import { useImmediateTranslatedBlock } from "~/i18n/useTranslatedElement";
import { login } from "~/middleware/security/auth-login.server.js";
import { useAppSession } from "~/middleware/session/session.server.js";
import { PasswordSchema, UsernameSchema } from "~/schema/_auth/login.js";
import { LoginPage } from "./-login.page.js";

const t = useImmediateTranslatedBlock({
	"routes._authed.message.not_authenticated": "Not authenticated",
	"routes._authed.message.internal_error": "There was an internal error",
	"routes._authed.message.invalid_credentials": "Invalid username or password",
	"routes._authed.message.username_not_available":
		"Server validation: Username not available",
	"routes._authed.message.ok|": "Login successful. Redirecting...|OK",
});

export const Route = createFileRoute("/(auth)/login")({
	component: LoginPage,
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({
				to: "/",
				search: {
					authenticated: "true",
				},
				replace: true,
				resetScroll: true,
			});
		}
	},
	loader: async () => {
		return {
			state: await LoginFormFromServer(),
		};
	},
});

export const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	redirectTo: z.string().optional(),
	remember: z.boolean().optional(),
});

export const LoginFormOpts = formOptions({
	defaultValues: {
		username: "",
		password: "",
		remember: false,
		redirectTo: "",
	},
});

const loginFormValidate = createServerValidate({
	...LoginFormOpts,
	onServerValidate: async (props) => {
		const {
			value: { username, password },
		} = props;
		const token = await login({
			username,
			password,
		});
		if (!token) {
			return t("routes._authed.message.invalid_credentials");
		}
		const session = await useAppSession();
		await session.update({
			token,
		});
	},
});
export const loginFn = createServerFn().handler(
	// @ts-expect-error
	async (ctx) => {
		try {
			const request = getWebRequest();
			await loginFormValidate(ctx, await request.formData());
		} catch (e) {
			if (e instanceof ServerValidateError) {
				return e.response;
			}
			console.error(e);
			return new Response("There was an internal error", {
				status: 500,
			});
		}

		return new Response(t("routes._authed.message.ok"), {
			status: 302,
			headers: {
				Location: "/welcome",
			},
		});
	},
);

export const LoginFormFromServer = createServerFn({ method: "GET" }).handler(
	async (ctx) => {
		const request = getWebRequest();
		const cookies = request.headers.get("Cookie");
		if (request.headers.get("Content-Type") !== "application/x-www-form-urlencoded") {
			return undefined;
		}
		
		const formData = getFormData(await request.formData());
		console.warn({
			cookies,
			formData: await formData,
		});
		return formData;
	},
);

export type LoginRoute = typeof Route;
