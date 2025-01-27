// import type { ElysiaHttpAuthenticatedHandler } from "src/app/ElysiaHttpAuthentication.js";
import z from "zod";
import { UserSearchByQuery } from "../../../../../_protocols/qureau/tsnode/domain/user/searchByQuery/user.searchByQuery.js";
import { QureauResponse } from "../../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../../_protocols/qureau/tsnode/service/version.js";
import { ksuidGenerator } from "../../../repository/users/QureauUserRepository.Registration.js";
import { qureauUserService } from "../../../service/QureauUser.js";
import { QureauUsersQueryHandlerInfers } from "./QureauUsersQueryHandler.infers.js";

const UsersQuerySchema = z.object({
	filters: z.array(z.string()),
	orderBy: z.string().catch("createdAt"),
	top: z.number().optional(),
	skip: z.number().optional(),
	continuationToken: z.string().optional(),
});

export const UsersQueryCommandZod = z.object({
	request: UsersQuerySchema,
	ext: z.object({
		nonce: z.string().max(255).default("TODO: sync with header"),
	}),
});

// export const QureauUsersQueryHandler: ElysiaHttpAuthenticatedHandler = async ({
// 	body,
// 	headers,
// 	principal,
// }) => {
// 	if (principal.$case !== "admin") {
// 		throw new Error("Unauthorized");
// 	}

// 	const { success, error, data } = UsersQueryCommandZod.safeParse(body);
// 	if (!success) {
// 		throw new Error("Invalid request");
// 	}

// 	const request = UserSearchByQuery.toJSON({
// 		request: data.request,
// 		inferred: QureauUsersQueryHandlerInfers(
// 			headers,
// 			ksuidGenerator,
// 			{
// 				principalId: principal.value.id,
// 				principalService: principal.value.host,
// 			},
// 			{
// 				resourceVersion: new Date().toISOString(),
// 				idempotencyId: ksuidGenerator.syncString(),
// 			},
// 		),
// 		ext: data.ext,
// 	});

// 	const response = await qureauUserService.SearchUsersByQueryWithId(request);

// 	return {
// 		status: 200,
// 		body: QureauResponse.toJSON({
// 			response: {
// 				$case: "data",
// 				value: {
// 					qureau: {
// 						$case: "user",
// 						value: {
// 							user: {
// 								$case: "searchByQuery",
// 								value: response,
// 							},
// 						},
// 					},
// 				},
// 			},
// 			version: {
// 				response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 				qureau: QureauVersionEnum.QUREAU_V_V1,
// 			},
// 		}),
// 	};
// };
