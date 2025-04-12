import Zod from "zod";

const allowAnonymous = true; //ServerContext.fromEnvironmentVariables().users.ALLOW_ANONYMOUS_REGISTRATION;

// TODO: QureauContext

export const QureauRegistrationRegisterCommandZod = Zod.object({
	request: Zod.object({
		user: Zod.object({
			preferredLanguages: Zod.array(Zod.string().max(12).min(2)).optional(),
			timezone: Zod.string().max(64).min(1).optional(),
			firstName: Zod.string().max(55).min(1).optional(),
			middleName: Zod.string().max(55).min(1).optional(),
			lastName: Zod.string().max(55).min(1).optional(),
			fullName: Zod.string().max(165).min(1).optional(),
			birthDate: Zod.string().datetime().optional(),
			mobilePhone: Zod.string().max(15).min(7).optional(),
			passwordChangeRequired: Zod.boolean().default(false),
			username: allowAnonymous
				? Zod.string().optional()
				: Zod.string()
						.max(36)
						.min(4)
						.refine(
							(v) => {
								return /^[a-zA-Z0-9_]+$/.test(v);
							},
							{
								message: "registration.register.request.user.username.format",
							},
						),
			email: allowAnonymous
				? Zod.string().optional()
				: Zod.string().max(255).email().optional(),
			password: Zod.string()
				.refine(
					(v) => {
						return /(?=.*[A-Z])/.test(v);
					},
					// TODO: Is there a protocol somewhere in here for forms
					{
						message:
							"registration.register.request.user.password.uppercase_required",
					},
				)
				.refine(
					(v) => {
						return /(?=.*[a-z])/.test(v);
					},
					{
						message:
							"registration.register.request.user.password.lowercase_required",
					},
				)
				.refine(
					(v) => {
						return /(?=.*[0-9])/.test(v);
					},
					{
						message:
							"registration.register.request.user.password.number_required",
					},
				)
				.refine(
					(v) => {
						return /(?=.*[^A-Za-z0-9])/.test(v);
					},
					{
						message:
							"registration.register.request.user.password.symbol_required",
					},
				)
				.refine(
					(v) => {
						return v.length >= 8;
					},
					{
						message:
							"registration.register.request.user.password.length_required",
					},
				)
				.refine(
					(v) => {
						return v.length <= 255;
					},
					{ message: "registration.register.request.user.password.length_max" },
				),

			// TODO: password emails
			//.optional(),
			// sendSetPasswordEmail: Zod.boolean().default(false),
			twoFactor: Zod.object({
				methods: Zod.array(
					Zod.union([
						Zod.object({
							method: Zod.literal("email"),
							email: Zod.string().email(),
						}),
						Zod.object({
							method: Zod.literal("sms"),
							mobilePhone: Zod.string().max(32),
						}),
					]),
				).min(1),
			}).optional(),
		}),
		registration: Zod.object({
			applicationId: Zod.literal("tsk")
				.or(Zod.literal("qru"))
				.or(Zod.literal("bq"))
				.or(Zod.literal("yyzyxyy"))
				.default("yyzyxyy"),
			// authenticationToken: Zod.string().max(131072).base64().optional(),
		}),
		generateAuthenticationToken: Zod.boolean().default(true),
	}),
	ext: Zod.object({
		nonce: Zod.string().min(4).max(255).default("TODO: sync with header"),
	}),
});
