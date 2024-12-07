import { createId as cuid } from "@paralleldrive/cuid2/index";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { createCookieSessionStorage } from "./cookie-store.server.js";
import { combineHeaders } from "./http.js";

export const toastKey = "toast";

const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(["message", "success", "error"]).default("message"),
});

export type Toast = z.infer<typeof ToastSchema>;
export type ToastInput = z.input<typeof ToastSchema>;

export const toastSessionStorage = createCookieSessionStorage({
	cookie: {
		name: "en_toast",
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: (
			process.env.SESSION_SECRET ?? "ev04QPaIMZ4QfGG33ZtqjOzgvYXZ22DH"
		).split(","),
		secure: process.env.NODE_ENV === "production",
	},
});

export async function redirectWithToast(
	url: string,
	toast: ToastInput,
	init?: ResponseInit,
) {
	return redirect({
		to: url,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
	});
}

export async function createToastHeaders(toastInput: ToastInput) {
	const session = await toastSessionStorage.getSession();
	const toast = ToastSchema.parse(toastInput);
	session.flash(toastKey, toast);
	const cookie = await toastSessionStorage.commitSession(session);
	return new Headers({ "set-cookie": cookie });
}

export async function getToast(headers: Headers) {
	const session = await toastSessionStorage.getSession(
		headers.get("cookie") ?? "",
	);
	const result = ToastSchema.safeParse(session.get(toastKey));
	const toast = result.success ? result.data : null;
	return {
		toast,
		cookie: toast ? await toastSessionStorage.destroySession("") : null,
	};
}
