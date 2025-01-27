import cuid2 from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import { RegistrationRegisterCommand } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { useStaticQureauRegistrationService } from "~/ui/data/qureau/registration/useQureauRegistrationService.server.js";
import { SESSION_EXPIRATION_TIME } from "./auth.server.js";

const QureauRegistration = useStaticQureauRegistrationService({
	entityKey: {},
});

export type AuthMiddlewareUser = {
	id: string;
	email: string;
	username: string;
	name: string;
};

export type AuthMiddlewareConnection = {
	providerId: string;
	providerName: string;
};

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10);
	return hash;
}

export async function resetUserPassword({
	username,
	password,
}: {
	username: AuthMiddlewareUser["username"];
	password: string;
}) {
	const hashedPassword = await getPasswordHash(password);
	// return prisma.user.update({
	// 	where: { username },
	// 	data: {
	// 		password: {
	// 			update: {
	// 				hash: hashedPassword,
	// 			},
	// 		},
	// 	},
	// })
}

export async function signup({
	email,
	username,
	password,
	name,
}: {
	email: AuthMiddlewareUser["email"];
	username: AuthMiddlewareUser["username"];
	name: AuthMiddlewareUser["name"];
	password: string;
}) {
	const session = await QureauRegistration.register(
		RegistrationRegisterCommand.fromPartial({
			request: {
				registration: {
					applicationId: "bq",
				},
				user: {
					email,
					username,
					fullName: name,
					password,
				},
			},
			ext: {},
		}),
	);

	if (session.response?.$case === "error") {
		throw session.response.value;
	}

	if (
		session.response?.$case !== "data" ||
		session.response.value.qureau?.$case !== "registration" ||
		session.response.value.qureau.value.registration?.$case !== "register"
	) {
		console.warn({
			AuthSignupServer: {
				session: JSON.stringify(session),
			},
		});
		throw new Error("Unexpected response from registration service");
	}

	const { user, registration, tokenExpirationInstant } =
		session.response.value.qureau.value.registration.value.registered ?? {};
	const response = {
		id: user?.id,
		expirationDate: tokenExpirationInstant,
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			id: user?.id,
			username: user?.username,
		},
		userId: user?.id,
	};
	console.debug({
		AuthSignupServer: {
			response: JSON.stringify(response),
		},
	});

	return response;
}

export async function signupWithConnection({
	email,
	username,
	name,
	providerId,
	providerName,
	imageUrl,
}: {
	email: AuthMiddlewareUser["email"];
	username: AuthMiddlewareUser["username"];
	name: AuthMiddlewareUser["name"];
	providerId: AuthMiddlewareConnection["providerId"];
	providerName: AuthMiddlewareConnection["providerName"];
	imageUrl?: string;
}) {
	// const session = await prisma.session.create({
	// 	data: {
	// 		expirationDate: getSessionExpirationDate(),
	// 		user: {
	// 			create: {
	// 				email: email.toLowerCase(),
	// 				username: username.toLowerCase(),
	// 				name,
	// 				roles: { connect: { name: 'user' } },
	// 				connections: { create: { providerId, providerName } },
	// 				image: imageUrl
	// 					? { create: await downloadFile(imageUrl) }
	// 					: undefined,
	// 			},
	// 		},
	// 	},
	// 	select: { id: true, expirationDate: true },
	// })

	// return session
	const expirationDate = new Date(Date.now() + SESSION_EXPIRATION_TIME);
	return {
		id: " TODO: ",
		expirationDate,
	};
}
