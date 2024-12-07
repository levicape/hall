import {
	formOptions,
	mergeForm,
	useForm,
	useTransform,
} from "@tanstack/react-form";
import {
	ServerValidateError,
	createServerValidate,
	getFormData,
} from "@tanstack/react-form/start";
import {
	type ReactNode,
	createFileRoute,
	useLoaderData,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useEffect } from "react";
import { getWebRequest } from "vinxi/http";
import { z } from "zod";
import { QureauRegistrationRegisterCommandZod } from "~/_zod/qureau/registrations/QureauRegistrationRegisterCommandZod.js";
import {
	DefaultClientPlaceholder,
	DefaultServerPlaceholder,
	anchorTranslatedElement,
	useImmediateTranslatedBlock,
} from "~/i18n/useTranslatedElement.js";
import { signup } from "~/middleware/security/auth-signup.server.js";
import { useAppSession } from "~/middleware/session/session.server.js";
import { cn } from "~/style/Cn.js";

const Button = (props: any) => {
	return <button {...props} />;
}

const Container = (props: any) => {
	return <div {...props} />;
}

const Form = (props: any) => {
	return <form {...props} />;
}

const FormField = (props: any) => {
	return <div {...props} />;
}

const Input = (props: any) => {
	return <input {...props} />;
}

const Header = (props: any) => {
	return <header {...props} />;
}

const SpaceBetween = (props: any) => {
	return <div {...props} />;
}

// TODO: Find a way to z.infer the type of valid strings and type t
const t = useImmediateTranslatedBlock({
	"routes._authed.message.not_authenticated": "Not authenticated",
	"routes._authed.message.internal_error": "There was an internal error",
	"routes._authed.message.invalid_credentials": "Invalid username or password",
	"routes._authed.message.username_not_available":
		"Server validation: Username not available",
	"routes._authed.message.ok|": "Login successful. Redirecting...|OK",
});

const useTranslate = anchorTranslatedElement({
	"routes.signup.page.header": "Welcome!",
	"routes.signup.page.subheader": "",
	"routes.signup.page.username": "Username",
	"routes.signup.page.password": "Password",
	"routes.signup.page.submit": "Sign up",
	"routes.signup.page.form.username.label": "Username",
	"routes.signup.page.form.username.description": "Please enter your username.",
	"routes.signup.page.form.password.label": "Password",
	"routes.signup.page.form.password.description": "Please enter your password.",
	"routes.signup.page.form.rememberMe.label": "Remember me",
	"routes.signup.page.form.rememberMe.description":
		"Remember me on this device.",
	"routes.signup.page.form.email.label": "Email",
	"routes.signup.page.form.email.description": "Please enter your email.",
	"routes.signup.page.form.name.label": "Name",
	"routes.signup.page.form.name.description": "Please enter your name.",
});

export const getFormDataFromServer = createServerFn().handler(async () => {
	const request = getWebRequest();
	return getFormData(await request.formData());
});

export const Route = createFileRoute("/(auth)/signup")({
	component: SignupComp,
	loader: async () => ({
		state: await getFormDataFromServer(),
	}),
});

const { shape } = QureauRegistrationRegisterCommandZod;
const SignupFormSchema = z.object({
	username: shape.request.shape.user.shape.username,
	password: shape.request.shape.user.shape.password,
	email: shape.request.shape.user.shape.email,
	name: shape.request.shape.user.shape.fullName,
});

export const SignupFormOpts = formOptions({
	defaultValues: {
		username: "",
		password: "",
		email: "",
		name: "",
	},
});

const signupFormValidate = createServerValidate({
	...SignupFormOpts,
	onServerValidate: async (props) => {
		const { value } = props;
		if (value.username === "atoko") {
			return t("routes._authed.message.username_not_available");
		}

		const {
			value: { username, password, email, name },
		} = props;

		const token = await signup({
			username,
			password,
			email,
			name,
		});

		if (!token) {
			return t("routes._authed.message.invalid_credentials");
		}

		const session = await useAppSession();
		const { id, expirationDate, user, userId } = token;
		await session.update({
			token: {
				...token,
				id: id ?? "what",
				expirationDate: new Date(expirationDate ?? "0"),
				user: {
					id: user.id ?? "what",
					username: user.username,
				},
				userId: userId ?? "what",
			},
		});
	},
});

export const signupFn = createServerFn().handler(
	// @ts-ignore
	async (ctx) => {
		try {
			const request = getWebRequest();
			await signupFormValidate(ctx, await request.formData());
		} catch (e) {
			if (e instanceof ServerValidateError) {
				return e.response;
			}

			// Some other error occurred when parsing the form
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

function SignupComp() {
	const t = {
		s: useTranslate(""),
		ele: useTranslate<ReactNode>(
			DefaultClientPlaceholder,
			DefaultServerPlaceholder,
		),
	};
	const router = useRouter();
	const navigate = useNavigate();
	const loaderData = useLoaderData({
		strict: false,
	});
	console.log({
		loaderData,
	});
	const state = loaderData?.state;
	// @ts-ignore
	const form = useForm({
		...SignupFormOpts,
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state ?? {}),
			[state],
		),
	});
	const formErrors = form.useStore((formState) => formState.errors);
	const { href, origin } = new URL(signupFn.url);
	const loginFnUrl = href.replace(origin, "");

	useEffect(() => {
		router.invalidate({
			filter: (route) => route.fullPath === "/signup",
		});
	}, [router]);

	return (
		<>
			<SpaceBetween size={"s"} alignItems={"start"}>
				<form
					suppressHydrationWarning
					action={loginFnUrl}
					method="post"
					encType={"multipart/form-data"}
				>
					<Form
						actions={
							<span suppressHydrationWarning>
								<SpaceBetween
									size="xxl"
									direction={"horizontal"}
									alignItems={"center"}
								>
									<div
										className={cn("sm:min-w-20", "xs:hidden", "sm:visible")}
									/>
									<form.Subscribe
										selector={(formState) => [
											formState.canSubmit,
											formState.isSubmitting,
										]}
									>
										{([canSubmit, isSubmitting]) => (
											<Button
												iconName={"key"}
												formAction={"submit"}
												disabled={!canSubmit}
												loading={isSubmitting}
											>
												{t.ele("routes.signup.page.submit")}
											</Button>
										)}
									</form.Subscribe>
								</SpaceBetween>
							</span>
						}
						header={
							<Header variant="h2">
								<span className="text-white">
									{t.ele("routes.signup.page.subheader")}
								</span>
							</Header>
						}
						errorText={
							formErrors[0]?.toString().endsWith("|OK")
								? undefined
								: formErrors[0]
						}
					>
						<Container>
							{/* <HoneypotInputs /> */}
							<>
								<SpaceBetween size="s">
									<form.Field
										name="username"
										validatorAdapter={zodValidator()}
										validators={{
											onChange: SignupFormSchema.shape.username,
											onChangeAsyncDebounceMs: 500,
											onChangeAsync: z.string().refine(
												async (value) => {
													await new Promise((resolve) =>
														setTimeout(resolve, 200),
													);
													return !value.startsWith("admin");
												},
												{
													// TODO: Is there a protocol somewhere in here for forms
													message: "No 'admin*' allowed in username",
												},
											),
										}}
									>
										{(field) => {
											return (
												<FormField
													label={t.ele(
														"routes.signup.page.form.username.label",
													)}
													errorText={field.state.meta.errors[0]}
												>
													<Input
														autoComplete={"username"}
														name={field.name}
														onChange={({ detail: { value } }) => {
															field.handleChange(value);
														}}
														onBlur={field.handleBlur}
														value={field.state.value as string}
													/>
												</FormField>
											);
										}}
									</form.Field>
									<form.Field
										name="password"
										validatorAdapter={zodValidator()}
										validators={{
											onChange: SignupFormSchema.shape.password,
											onChangeAsyncDebounceMs: 500,
										}}
									>
										{(field) => {
											return (
												<FormField
													label={t.ele(
														"routes.signup.page.form.password.label",
													)}
													errorText={field.state.meta.errors[0]}
												>
													<Input
														autoComplete={"password"}
														name={field.name}
														onChange={({ detail: { value } }) => {
															field.handleChange(value);
														}}
														onBlur={field.handleBlur}
														value={field.state.value as string}
													/>
												</FormField>
											);
										}}
									</form.Field>
									<form.Field
										name="email"
										validatorAdapter={zodValidator()}
										validators={{
											onChange: SignupFormSchema.shape.email,
											onChangeAsyncDebounceMs: 500,
										}}
									>
										{(field) => {
											return (
												<FormField
													label={t.ele("routes.signup.page.form.email.label")}
													errorText={field.state.meta.errors[0]}
												>
													<Input
														autoComplete={"email"}
														name={field.name}
														onChange={({ detail: { value } }) => {
															field.handleChange(value);
														}}
														onBlur={field.handleBlur}
														value={field.state.value as string}
													/>
												</FormField>
											);
										}}
									</form.Field>
									<form.Field
										name="name"
										validatorAdapter={zodValidator()}
										validators={{
											onChange: SignupFormSchema.shape.name,
											onChangeAsyncDebounceMs: 500,
										}}
									>
										{(field) => {
											return (
												<FormField
													label={t.ele("routes.signup.page.form.name.label")}
													errorText={field.state.meta.errors[0]}
												>
													<Input
														name={field.name}
														onChange={({ detail: { value } }) => {
															field.handleChange(value);
														}}
														onBlur={field.handleBlur}
														value={field.state.value as string}
													/>
												</FormField>
											);
										}}
									</form.Field>
								</SpaceBetween>
							</>
						</Container>
					</Form>
				</form>
			</SpaceBetween>
		</>
	);
}
