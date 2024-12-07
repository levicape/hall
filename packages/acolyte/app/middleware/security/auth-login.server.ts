import cuid2 from "@paralleldrive/cuid2";
import { useStaticQureauTokenService } from "~/ui/data/qureau/token/useQureauTokenService.server.js";
import type { AuthMiddlewareUser } from "./auth-signup.server.js";

type Password = {
	hash: string;
};

export async function verifyUserPassword(
	where: Pick<AuthMiddlewareUser, "username"> | Pick<AuthMiddlewareUser, "id">,
	password: Password["hash"],
) {
	// QureauLoginService.LoginWithId

	// const userWithPassword = await prisma.user.findUnique({
	// 	where,
	// 	select: { id: true, password: { select: { hash: true } } },
	// })
	const userWithPassword:
		| undefined
		| { id: string; password: { hash: string } } = undefined as unknown as {
		id: string;
		password: { hash: string };
	};

	// if (!userWithPassword || !userWithPassword.password) {
	// 	return null
	// }

	// const isValid = await bcrypt.compare(
	// 	password,
	// 	password, //userWithPassword?.password.hash,
	// );

	// if (!isValid) {
	// 	return null;
	// }

	// return { id: userWithPassword.id }
	return { id: "abc" };
}

const QureauTokens = useStaticQureauTokenService({
	entityKey: {},
});

export async function login({
	username,
	password,
}: {
	username: AuthMiddlewareUser["username"];
	password: string;
}) {
	const user = await verifyUserPassword({ username }, password);
	if (!user) return null;

	return {
		id: cuid2.createId(),
		expirationDate: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		user: {
			id: "abc",
			username: "abc",
		},
		userId: "abc",
	};
}

export async function logout({
	sessionId,
}: {
	sessionId?: string;
}) {
	// if this fails, we still need to delete the session from the user's browser
	if (sessionId) {
		// TODO: token_service.proto
		// RevokeToken
		// the .catch is important because that's what triggers the query.
	}
}
