import {
	Logger,
	isRequestLoggingEnabled,
} from "@levicape/spork/server/logging";
// import type { ElysiaHttpAuthenticatedHandler } from "src/app/ElysiaHttpAuthentication";
import z from "zod";
import {
	UserRetrieveWithId,
	type UserRetrieveWithIdCommand,
	type UserRetrieveWithIdResponse,
} from "../../../../../_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import { QureauResponse } from "../../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../../_protocols/qureau/tsnode/service/version.js";
import { ksuidGenerator } from "../../../repository/users/QureauUserRepository.Registration.js";
import { qureauUserService } from "../../../service/QureauUser.js";
import { qureauFormattedError } from "../../QureauBadRequestExceptionHandler.js";
import { QureauUsersByIdViewHandlerInfers } from "./QureauUsersByIdViewHandler.infers.js";

export const UsersByIdCommandZod = z.object({
	request: z.object({}),
	ext: z.object({
		nonce: z.string().max(255).default("TODO: sync with header"),
	}),
});

export const UsersByIdUserIdSchema = z.string().max(255).min(12);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const translated = async (_: string, strings: Record<string, string>) => {
	return (key: string) => {
		return strings[key] ?? key;
	};
};

const en = translated("en", {
	QQ_BAD_REQUEST: "Invalid request body",
}).then((t) => (key: string) => t(key));

// export const QureauUsersByIdViewHandler: ElysiaHttpAuthenticatedHandler =
// 	async ({ body, headers, principal, params: { userId } }) => {
// 		if (principal.$case === "anonymous") {
// 			throw new Error(`Unauthenticated: ${JSON.stringify(principal)}`);
// 		}

// 		const schemas = [
// 			[body, UsersByIdCommandZod, true],
// 			[userId, UsersByIdUserIdSchema],
// 		] as const;
// 		let command: UserRetrieveWithIdCommand | undefined = undefined;
// 		for (const [request, schema, save] of schemas) {
// 			const { success, error, data } = await schema.safeParseAsync(request);
// 			if (error) {
// 				throw qureauFormattedError(success, error, await en);
// 			}

// 			if (save) {
// 				command = data as UserRetrieveWithIdCommand;
// 			}
// 		}

// 		if (command === undefined) {
// 			throw new Error("Assertion failed: command is undefined");
// 		}

// 		const requestLoggingEnabled = isRequestLoggingEnabled();
// 		requestLoggingEnabled &&
// 			Logger.request({
// 				request: {
// 					body: JSON.stringify(body),
// 					headers: headers,
// 					// error: JSON.stringify(error?.errors ?? {})
// 				},
// 			});

// 		if (principal.$case === "user") {
// 			// TODO: RBAC
// 			if (principal.value.id !== userId) {
// 				throw new Error("Unauthorized");
// 			}
// 		}

// 		const retrieveWithId: UserRetrieveWithIdResponse =
// 			await qureauUserService.RetrieveUserWithId(
// 				UserRetrieveWithId.toJSON({
// 					request: {
// 						userId,
// 					},
// 					inferred: QureauUsersByIdViewHandlerInfers(
// 						headers,
// 						ksuidGenerator,
// 						{
// 							principalId: principal.value.id,
// 							principalService: principal.value.host,
// 						},
// 						{
// 							resourceVersion: new Date().toISOString(),
// 							idempotencyId: ksuidGenerator.syncString(),
// 						},
// 					),
// 					ext: command.ext,
// 				} satisfies UserRetrieveWithId) as UserRetrieveWithId,
// 			);

// 		return QureauResponse.toJSON({
// 			response: {
// 				$case: "data",
// 				value: {
// 					qureau: {
// 						$case: "user",
// 						value: {
// 							user: {
// 								$case: "retrieveWithId",
// 								value: retrieveWithId,
// 							},
// 						},
// 					},
// 				},
// 			},
// 			version: {
// 				response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 				qureau: QureauVersionEnum.QUREAU_V_V1,
// 			},
// 		});
// 	};
