import { Alltest } from "@levicape/paloma";
import { expect } from "expect";
import KSUID from "ksuid";
import { RegistrationRegisterCommand } from "../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { UserRetrievePrincipalCommand } from "../_protocols/qureau/tsnode/domain/user/retrievePrincipal/user.retrievePrincipal.remote.js";
import { QureauRegistrationHttpServiceFactory } from "../qureau/service/registration/QureauRegistrationHttpService.js";
import { QureauUserHttpServiceFactory } from "../qureau/service/user/QureauUserHttpService.js";

// TODO: Env variable from stack reference / cloudmap
const rootUrl = "http://localhost:5555";
const qureauClient = {
	registration: QureauRegistrationHttpServiceFactory(rootUrl),
	user: QureauUserHttpServiceFactory(rootUrl),
};

export const test = new Alltest(
	{
		prepare: async () => {
			return {
				userId: KSUID.randomSync().string,
			};
		},
	},
	{
		validation: {
			test: async ({ actions, clients }) => {
				const cases = [
					[
						{
							email: "not@email",
							username: "usern ame",
							fullName: undefined,
							password: "",
						},
						[
							{
								field: "REQUEST_USER_EMAIL",
								code: "invalid_string",
								message: "email",
							},
							{ field: "REQUEST_USER_USERNAME", code: "custom" },
							{
								field: "REQUEST_USER_PASSWORD",
								code: "custom",
								message: "uppercase letter",
							},
							{
								field: "REQUEST_USER_PASSWORD",
								code: "custom",
								message: "lowercase letter",
							},
							{
								field: "REQUEST_USER_PASSWORD",
								code: "custom",
								message: "symbol",
							},
							{
								field: "REQUEST_USER_PASSWORD",
								code: "custom",
								message: "number",
							},
							{
								field: "REQUEST_USER_PASSWORD",
								code: "custom",
								message: "length",
							},
						],
					] as const,
					// [
					// 	{
					// 		email: undefined,
					// 		username:
					// 			"usermorethan40characterslongusermorethan40characterslong",
					// 		fullName:
					// 			"fullnameMoreThan4000CharactersLongSoItWillFailValidationOnTheServerSide",
					// 		password: [...Array(5000)].map(() => "a").join(""),
					// 	},
					// 	[
					// { field: "REQUEST_USER_USERNAME", code: "too_big" },
					// ] as const,
				] as const;

				for (const [user, expected] of cases) {
					const session = await qureauClient.registration.Register(
						RegistrationRegisterCommand.fromPartial({
							request: {
								registration: {
									applicationId: "bq",
								},
								user,
							},
							ext: {},
						}),
					);
					const { log } = clients;
					log.debug({
						session,
					});

					for (let i = 0; i < expected.length; i++) {
						try {
							expect(session.response?.$case).toBe("error");
							if (session.response?.$case === "error") {
								const { value } = session.response;
								const { code, validations } = value;
								expect(code).toBe("QQ_ERROR");
								expect(validations.length).toBe(expected.length);
								const message = (expected[i] as { message: string }).message;
								if (message) {
									(expected[i] as { message: unknown }).message =
										expect.stringContaining(message);
								}
								expect(validations[i]).toMatchObject(
									expect.objectContaining(expected[i]),
								);
							}
						} catch (error) {
							log.warn({
								Qureau: {
									validation: {
										error,
									},
								},
							});
							return actions.fail({
								message: error?.toString().replace(/[^a-zA-Z ]/g, "") ?? "",
							});
						}
					}
				}

				return actions.continue({
					to: "register",
					funnel: "unit",
				});
			},
		},
		register: {
			test: async ({ actions, clients, prepared }) => {
				const session = await qureauClient.registration.Register(
					RegistrationRegisterCommand.fromPartial({
						request: {
							registration: {
								applicationId: "bq",
							},
							user: {
								email: `${prepared.userId}@test.com`,
								username: `user${prepared.userId}`,
								fullName: `User ${prepared.userId}`,
								password: "P@ssw0rd",
							},
						},
						ext: {},
					}),
				);

				const { log } = clients;
				log.debug({
					session,
				});

				let registered: unknown | undefined;
				try {
					expect(session.response?.$case).toBe("data");
					if (session.response?.$case === "data") {
						const { value } = session.response;
						expect(value).toBeDefined();

						expect(value?.qureau?.$case).toBe("registration");
						expect(
							value?.qureau?.$case === "registration" &&
								value?.qureau?.value.registration?.value?.registered,
						).toBeDefined();
						if (
							value?.qureau?.$case === "registration" &&
							value?.qureau?.value?.registration?.value?.registered?.user
						) {
							const { registered: response } =
								value.qureau.value.registration.value;
							registered = response;
							expect(response).toMatchObject({
								user: {
									email: `${prepared.userId}@test.com`,
									username: `user${prepared.userId}`,
									fullName: `User ${prepared.userId}`,
								},
							});
						}
					}
				} catch (error) {
					log.warn({
						Qureau: {
							register: {
								error,
							},
						},
					});
					return actions.fail({
						message: error?.toString().replace(/[^a-zA-Z ]/g, "") ?? "",
					});
				}

				return actions.continue({
					to: "principal",
					funnel: "unit",
					data: {
						registered: registered as { user: { id: string } },
					},
				});
			},
			async cleanup(opts) {},
		},
		principal: {
			// TODO: Typeguard for Previous
			test: async ({ actions, prepared, previous, clients }) => {
				if (previous?.kind !== "continue") {
					throw new Error("Expected previous action to be continue");
				}
				const {
					token,
					user: { id },
				} = previous?.data?.registered as {
					token?: string;
					refreshToken?: string;
					user: { id: string };
				};
				const user = await qureauClient.user(token).PrincipalUser(
					UserRetrievePrincipalCommand.fromPartial({
						request: {},
						ext: {},
					}),
				);

				const { log } = clients;
				log.debug({
					user,
				});

				let principal: unknown | undefined;
				try {
					expect(user.response?.$case).toBe("data");
					if (user.response?.$case === "data") {
						const { value } = user.response;
						expect(value).toBeDefined();

						expect(value?.qureau?.$case).toBe("user");
						expect(
							value?.qureau?.$case === "user" &&
								value?.qureau?.value?.user?.$case,
						).toBe("retrieveWithId");

						if (
							value?.qureau?.$case === "user" &&
							value?.qureau?.value?.user?.value &&
							value?.qureau?.value?.user?.$case === "retrieveWithId"
						) {
							const { withId: response } = value.qureau.value.user.value;
							principal = response;
							expect(response).toMatchObject({
								id,
								email: `${prepared.userId}@test.com`,
								username: `user${prepared.userId}`,
								fullName: `User ${prepared.userId}`,
							});
						}
					}
				} catch (error) {
					log.warn({
						Qureau: {
							principal: {
								error,
							},
						},
					});
					return actions.fail({
						message: error?.toString().replace(/[^a-zA-Z ]/g, "") ?? "",
					});
				}

				return actions.pass({
					result: {},
				});
			},
		},
	},
	{
		name: "Qureau Registration",
		entry() {
			return "register";
		},
		// TODO: Encrypt action, result, prepared, resolved before storing in the database.
		// async keypair({ context, setup, hash }) {
		// 	return (await staticKey)
		// },
	},
);

export const LambdaHandler = test.handler;
