import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";
import TextContent from "@cloudscape-design/components/text-content";
import Toggle from "@cloudscape-design/components/toggle";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import {
	type ReactNode,
	useLoaderData,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useEffect } from "react";
import { z } from "zod";
import {
	DefaultClientPlaceholder,
	DefaultServerPlaceholder,
	anchorTranslatedElement,
} from "~/i18n/useTranslatedElement.js";
import { PasswordSchema, UsernameSchema } from "~/schema/_auth/login.js";
import { cn } from "~/style/Cn.js";
import { Divider } from "~/ui/display/compat/polaris/Divider.js";
import { InlineStack } from "~/ui/display/compat/polaris/InlineStack.js";
import { LoginFormOpts, LoginFormSchema, loginFn } from "./login.js";

const useTranslate = anchorTranslatedElement({
	"routes.login.page.header": "Welcome back!",
	"routes.login.page.subheader": "Please enter your credentials to continue.",
	"routes.login.page.username": "Username",
	"routes.login.page.password": "Password",
	"routes.login.page.forgotPassword": "Forgot your password?",
	"routes.login.page.submit": "Login",
	"routes.login.page.newhereask": "New here?",
	"routes.login.page.signup": "Sign up",
	"routes.login.page.rememberMe": "Remember me",
	"routes.login.page.form.username.label": "Username",
	"routes.login.page.form.username.description": "Please enter your username.",
	"routes.login.page.form.password.label": "Password",
	"routes.login.page.form.password.description": "Please enter your password.",
	"routes.login.page.form.rememberMe.label": "Remember me",
	"routes.login.page.form.rememberMe.description":
		"Remember me on this device.",
});

export function LoginPage() {
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
		...LoginFormOpts,
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state ?? {}),
			[state],
		),
	});
	const formErrors = form.useStore((formState) => formState.errors);
	const { href, origin } = new URL(loginFn.url);
	const loginFnUrl = href.replace(origin, "");

	useEffect(() => {
		router.invalidate({
			filter: (route) => route.fullPath === "/login",
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
									<SpaceBetween size="xs" direction={"horizontal"}>
										<TextContent className={"text-white"}>
											<span className="text-white">
												{t.ele("routes.login.page.newhereask")}
											</span>
										</TextContent>
										<Link
											onFollow={(event) => {
												event.preventDefault();
												navigate({
													to: "/signup",
												});
											}}
										>
											{t.ele("routes.login.page.signup")}
										</Link>
									</SpaceBetween>
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
												{t.ele("routes.login.page.submit")}
											</Button>
										)}
									</form.Subscribe>
								</SpaceBetween>
							</span>
						}
						header={
							<Header variant="h2">
								<span className="text-white">
									{t.ele("routes.login.page.subheader")}
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
											onChange: UsernameSchema,
											onChangeAsyncDebounceMs: 500,
											onChangeAsync: z.string().refine(
												async (value) => {
													await new Promise((resolve) =>
														setTimeout(resolve, 1000),
													);
													return !value.startsWith("admin");
												},
												{
													message: "No 'admin*' allowed in username",
												},
											),
										}}
									>
										{(field) => {
											return (
												<FormField
													label={t.ele("routes.login.page.form.username.label")}
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
											onChange: PasswordSchema,
											onChangeAsyncDebounceMs: 500,
										}}
									>
										{(field) => {
											return (
												<FormField
													label={t.ele("routes.login.page.form.password.label")}
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
									<Divider />
									<InlineStack justifyContent={"start"}>
										<SpaceBetween size="s" direction={"horizontal"}>
											<form.Field
												name="remember"
												validatorAdapter={zodValidator()}
												validators={{
													onChange: LoginFormSchema.shape.remember,
													onChangeAsyncDebounceMs: 500,
												}}
											>
												{(field) => {
													return (
														<FormField
															label={t.ele(
																"routes.login.page.form.rememberMe.label",
															)}
															errorText={field.state.meta.errors[0]}
															info={
																<Toggle
																	name={field.name}
																	checked={field.state.value as boolean}
																	onChange={({ detail: { checked } }) => {
																		field.handleChange(checked);
																	}}
																/>
															}
														/>
													);
												}}
											</form.Field>
										</SpaceBetween>
									</InlineStack>

									<Box display={"block"} textAlign={"right"}>
										<Link
											onFollow={(event) => {
												event.preventDefault();
												navigate({
													to: "/(auth)/forgot-password" as "/",
												});
											}}
										>
											{t.ele("routes.login.page.forgotPassword")}
										</Link>
									</Box>
									<form.Field
										name="redirectTo"
										validatorAdapter={zodValidator()}
										validators={{
											onChange: LoginFormSchema.shape.redirectTo,
											onChangeAsyncDebounceMs: 500,
										}}
									>
										{(field) => {
											return (
												<input
													type="hidden"
													name={field.name}
													value={field.state.value as string}
												/>
											);
										}}
									</form.Field>
								</SpaceBetween>
							</>
							{/* <Box>
									{providerNames.map((providerName) => (
										<li key={providerName}>
											<ProviderConnectionForm
												type="Login"
												providerName={providerName}
												redirectTo={redirectTo}
											/>
										</li>
									))}
								</Box> */}
						</Container>
					</Form>
				</form>
			</SpaceBetween>
		</>
	);
}
