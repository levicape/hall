// import {
// 	Button,
// 	DescriptionList,
// 	Divider,
// 	FormLayout,
// 	TextField,
// } from "@shopify/polaris";
import type { useMutation } from "@tanstack/react-query";
import { type ReactElement, useCallback, useMemo } from "react";
// import {
// 	type Control,
// 	type FieldValues,
// 	type UseFormReturn,
// 	useController,
// 	useForm,
// } from "react-hook-form";
import { z } from "zod";
import { RegistrationRegisterCommand } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import type { QureauResponse } from "~/_protocols/qureau/tsnode/service/qureau._.js";
import { anchorTranslatedElement } from "~/i18n/useTranslatedElement.js";
import { DebugCard } from "~/ui/debug/DebugCard.js";

const i18nMap = {
	"data.registration.register": "Register User",
	"data.registration.register.request": "Request",
	"data.registration.register.response": "Response",
	"data.registration.load.request": "Request",
	"data.registration.register.request.state": "State",
	"data.registration.register.request.body": "Body",
	"data.registration.register.response.json": "JSON",
	"data.registration.register.request.user.username": "Username",
	"data.registration.register.request.user.username.too_short":
		"Username must be between 4 and 36 characters.",
	"data.registration.register.request.user.username.format":
		"Username must contain only alphanumeric characters and underscores.",
	"data.registration.register.request.user.password": "Password",
	"data.registration.register.request.user.password.uppercase_required":
		"Password must contain at least one uppercase letter.",
	"data.registration.register.request.user.password.lowercase_required":
		"Password must contain at least one lowercase letter.",
	"data.registration.register.request.user.password.number_required":
		"Password must contain at least one number.",
	"data.registration.register.request.user.password.symbol_required":
		"Password must contain at least one symbol.",
	"data.registration.register.request.user.password.length_required":
		"Password must be at least 8 characters long.",
	"data.registration.register.request.user.preferredLanguages":
		"Preferred Languages",
};
const useTranslate = anchorTranslatedElement(i18nMap);

const Button = (props: any) => {
	return <button {...props} />;
};

export type RegistrationRegisterI18n = keyof typeof i18nMap;
export type I18nKey = keyof typeof i18nMap;

export const RegistrationRegisterCommandValidatorZod = z.object({
	request: z.object({
		user: z.object({
			preferredLanguages: z.array(z.string().max(12).min(2)).optional(),
			timezone: z.string().max(64).min(1).optional(),
			firstName: z.string().max(55).min(1).optional(),
			middleName: z.string().max(55).min(1).optional(),
			lastName: z.string().max(55).min(1).optional(),
			fullName: z.string().max(165).min(1).optional(),
			birthDate: z.string().datetime().optional(),
			mobilePhone: z.string().max(15).min(7).optional(),
			passwordChangeRequired: z.boolean().default(false),
			username: z
				.string()
				.max(36)
				.min(4)
				.refine(
					(v) => {
						return /^[a-zA-Z0-9_]+$/.test(v);
					},
					{
						message:
							"data.registration.register.request.user.username.format" as I18nKey,
					},
				),
			email: z.string().max(255).email().optional(),
			password: z
				.string()
				.max(5635)
				.refine(
					(v) => {
						return /(?=.*[A-Z])/.test(v);
					},
					// TODO: Is there a protocol somewhere in here for forms
					{
						message:
							"data.registration.register.request.user.password.uppercase_required" as I18nKey,
					},
				)
				.refine(
					(v) => {
						return /(?=.*[a-z])/.test(v);
					},
					{
						message:
							"data.registration.register.request.user.password.lowercase_required",
					},
				)
				.refine(
					(v) => {
						return /(?=.*[0-9])/.test(v);
					},
					{
						message:
							"data.registration.register.request.user.password.number_required",
					},
				)
				.refine(
					(v) => {
						return /(?=.*[^A-Za-z0-9])/.test(v);
					},
					{
						message:
							"data.registration.register.request.user.password.symbol_required",
					},
				)
				.refine(
					(v) => {
						return v.length >= 8;
					},
					{
						message:
							"data.registration.register.request.user.password.length_required",
					},
				),
			// TODO: password emails
			//.optional(),
			// sendSetPasswordEmail: z.boolean().default(false),
			twoFactor: z
				.object({
					methods: z.array(
						z.union([
							z.object({
								method: z.literal("email"),
								email: z.string().email(),
							}),
							z.object({
								method: z.literal("sms"),
								mobilePhone: z.string().max(32),
							}),
						]),
					),
				})
				.optional(),
		}),
		registration: z.object({
			// TODO: Application entity
			applicationId: z
				.literal("tsk")
				.or(z.literal("qru"))
				.or(z.literal("uwu"))
				.default("uwu"),
			// authenticationToken: z.string().max(131072).base64().optional(),
		}),
		generateAuthenticationToken: z.boolean().default(true),
	}),
	ext: z.object({
		nonce: z.string().max(255).default("TODO: sync with header"),
	}),
});
export const RegistrationRegisterCommandFormZod =
	RegistrationRegisterCommandValidatorZod;

type NestedObject = {
	[key: string]: string | number | NestedObject | NestedObject[];
};

type FormErrors = {
	// biome-ignore lint/suspicious/noExplicitAny:
	[key: string]: any;
};

interface FieldConfig {
	name: string;
	value: string | number;
	onChange: (e: string) => void;
	onBlur: () => void;
	label: string;
	disabled: boolean;
	error?: string;
}

const generateFields = (
	obj: NestedObject,
	form: unknown, //UseFormReturn<FieldValues>,
	t: ReturnType<typeof useTranslate<string>>,
	parentKey = "",
): FieldConfig[] => {
	// biome-ignore lint/suspicious/noExplicitAny:
	const errors: FormErrors = (form as any).formState.errors;
	const fieldNames = new Set<string>();

	const getError = (fieldName: string): string | undefined => {
		const error = fieldName
			.split(".")
			.reduce((acc: FormErrors | undefined, key) => {
				if (typeof acc === "object" && acc !== undefined) {
					return acc[key];
				}
				return acc;
			}, errors);

		if (typeof error === "object" && error !== undefined) {
			if (typeof error.type === "string") {
				const errorKey = `data.registration.register.${fieldName}`;
				switch (error.type) {
					case "custom":
						return t(error.message);
					default:
						return t(`${errorKey}.${error.type}`);
				}
			}
		}
		const defaultError = JSON.stringify(error ?? "");
		if (
			defaultError === "{}" ||
			defaultError === "null" ||
			defaultError === "undefined" ||
			defaultError === ""
		) {
			return undefined;
		} else {
			if (error !== undefined) {
				console.warn({
					QureauRegisterRegistrationCard: {
						defaultError,
						error,
						fieldName,
					},
				});
			}
			return;
		}
	};

	const fields: FieldConfig[] = [];

	const generate = (obj: NestedObject, parentKey = ""): void => {
		Object.entries(obj).forEach(([key, value]) => {
			const fieldName = parentKey ? `${parentKey}.${key}` : key;

			if (fieldNames.has(fieldName)) return;
			fieldNames.add(fieldName);

			if (typeof value === "string" || typeof value === "number") {
				const error = getError(fieldName);
				fields.push({
					name: fieldName,
					value,
					onChange: (e: string) => {
						// form.clearErrors(fieldName);
						// form.setValue(fieldName, e);
					},
					onBlur: () => {
						// form.trigger();
					},
					label: fieldName,
					disabled: false,
					error,
				});
			} else if (Array.isArray(value)) {
				value.forEach((item, index) => {
					const arrayFieldName = `${fieldName}[${index}]`;
					if (fieldNames.has(arrayFieldName)) return;
					fieldNames.add(arrayFieldName);

					if (typeof item === "string" || typeof item === "number") {
						const error = getError(arrayFieldName);
						fields.push({
							name: arrayFieldName,
							value: item,
							onChange: (v) => {
								// form.setValue(arrayFieldName, v);
							},
							onBlur: () => {}, //form.trigger(arrayFieldName),
							label: arrayFieldName,
							disabled: false,
							error,
						});
					} else if (typeof item === "object" && item !== null) {
						generate(item as NestedObject, arrayFieldName);
					}
				});
			} else if (typeof value === "object" && value !== null) {
				generate(value as NestedObject, fieldName);
			}
		});
	};

	generate(obj, parentKey);

	return fields;
};

export const QureauRegisterRegistrationCard = ({
	// form,
	mutation,
	onClickRegisterRegistration,
}: {
	// form: UseFormReturn<FieldValues>;
	mutation: ReturnType<
		typeof useMutation<
			QureauResponse,
			Error,
			RegistrationRegisterCommand,
			unknown
		>
	>;
	onClickRegisterRegistration: (body: RegistrationRegisterCommand) => void;
}) => {
	const t = useTranslate("");
	// const formControl: Control = form.control as Control;

	// const usernameFieldValue = useController({
	// 	control: formControl,
	// 	name: "request.user.username",
	// 	defaultValue: "",
	// }).field.value;

	// const passwordFieldValue = useController({
	// 	control: formControl,
	// 	name: "request.user.password",
	// 	defaultValue: "!@APb234109PpKJdidIforgetAnythnglol",
	// }).field.value;

	// biome-ignore lint/complexity/noBannedTypes:
	const body: RegistrationRegisterCommand | {} = useMemo(() => {
		try {
			const body = RegistrationRegisterCommand.toJSON({
				request: {
					user: {
						// username: usernameFieldValue,
						// password: passwordFieldValue,
					},
					registration: {
						applicationId: "qru",
						authenticationToken: undefined,
						// TODO: Trim request
					} as unknown as NonNullable<
						RegistrationRegisterCommand["request"]
					>["registration"],
					disableDomainBlock: false,
					generateAuthenticationToken: true,
					skipRegistrationVerification: false,
					sendSetPasswordEmail: false,
					skipVerification: false,
					eventInfo: undefined,
				} as RegistrationRegisterCommand["request"],
				ext: {
					nonce: Date.now().toString(),
				},
			});

			return body as unknown as RegistrationRegisterCommand;
		} catch (e) {
			return {};
		}
		// }, [usernameFieldValue, passwordFieldValue]);
	}, []);

	// const fields = useMemo(() => {
	// 	return generateFields(body, form, t, "");
	// }, [body, form, t]);

	const onClickRequest = useCallback(() => {
		// biome-ignore lint/suspicious/noExplicitAny:
		if (typeof (body as unknown as any).request !== "undefined") {
			onClickRegisterRegistration(body as RegistrationRegisterCommand);
		}
	}, [body, onClickRegisterRegistration]);

	const actions: ReactElement[] = useMemo(
		() => [
			<Button
				key={"new"}
				variant={"primary"}
				loading={mutation.isPending}
				onClick={onClickRequest}
			>
				{t("data.registration.register.request")}
			</Button>,
		],
		[onClickRequest, mutation.isPending, t],
	);

	return (
		<DebugCard title={t("data.registration.register")} extra={actions}>
			{/* <FormLayout>
				<FormLayout.Group title={t("data.registration.load.request")}>
					<DescriptionList
						items={[
							{
								term: t("data.registration.register.request.state"),
								description: StateText(
									JSON.stringify({ ...mutation, data: undefined }, null, 2),
								),
							},

							{
								term: t("data.registration.register.request.body"),
								description: StateText(JSON.stringify({ ...body }, null, 2)),
							},
						]}
					/>
					<FormLayout>
						<FormLayout.Group>
							{fields.map((field) => (
								<TextField
									key={field.name}
									autoComplete={"off"}
									label={field.label}
									value={field.value.toString()}
									onChange={field.onChange}
									onBlur={field.onBlur}
									disabled={field.disabled}
									error={field.error}
								/>
							))}
						</FormLayout.Group>
					</FormLayout>
				</FormLayout.Group>
				<Divider />
				<FormLayout.Group title={t("data.registration.register.response")}>
					<DescriptionList
						items={[
							{
								term: t("data.registration.register.response.json"),
								description: StateText(
									JSON.stringify(
										useMemo(
											() => ({ ...(mutation.data ?? {}) }),
											[mutation.data],
										),
										null,
										4,
									),
								),
							},
						]}
					/>
				</FormLayout.Group>
			</FormLayout> */}
		</DebugCard>
	);
};
