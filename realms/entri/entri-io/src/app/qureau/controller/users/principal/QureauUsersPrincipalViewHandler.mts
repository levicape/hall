import { randomUUID } from "node:crypto";
import type { Context } from "hono";
import { createFactory } from "hono/factory";
import type { JSONObject, JSONValue } from "hono/utils/types";
import z from "zod";
import {
	UserRetrieveWithId,
	UserRetrieveWithIdRequest,
	type UserRetrieveWithIdResponse,
} from "../../../../../_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import { QureauResponse } from "../../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../../_protocols/qureau/tsnode/service/version.js";
import { ksuidGenerator } from "../../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauUserService } from "../../../service/QureauUser.mjs";
import { qureauFormattedError } from "../../QureauBadRequestExceptionHandler.mjs";
import { QureauUsersPrincipalViewHandlerInfers } from "./QureauUsersPrincipalViewHandler.infers.mjs";

export const UsersPrincipalCommandZod = z.object({
	request: z.object({}),
	ext: z.object({
		nonce: z.string().max(255).default("TODO: sync with header"),
	}),
});

const translated = async (_: string, strings: Record<string, string>) => {
	return (key: string) => {
		return strings[key] ?? key;
	};
};

const en = translated("en", {
	QQ_BAD_REQUEST: "Invalid request body",
}).then((t) => (key: string) => t(key));

export const QureauUsersPrincipalViewHandler = async (c: Context) => {
	const { req } = c;
	const body = await req.json();
	const headers = req.header();
	// const principal = c.get(HonoHttpAuthenticationBearerKey) as HonoHttpAuthenticationBearerContext;
	const principal = c.get("principal") as {
		$case: string;
		value: {
			id: string;
			host: string;
		};
	};
	if (principal.$case === "anonymous") {
		throw new Error("Assertion failed: principal is anonymous");
	}

	const { success, error, data } = UsersPrincipalCommandZod.safeParse(body);
	if (error || data === undefined) {
		throw qureauFormattedError(success, error, await en);
	}
	const retrieveWithId: UserRetrieveWithIdResponse =
		await qureauUserService.RetrieveUserWithId(
			UserRetrieveWithId.fromPartial({
				request: UserRetrieveWithIdRequest.fromJSON({
					userId: principal.value.id,
					qqTenantId: principal.value.host,
				}),
				inferred: QureauUsersPrincipalViewHandlerInfers(
					headers,
					ksuidGenerator,
					{
						principalId: principal.value.id,
						principalService: principal.value.host,
					},
					{
						resourceVersion: "",
						idempotencyId: randomUUID(),
					},
				),
				ext: data.ext,
			}),
		);

	c.json(
		QureauResponse.toJSON({
			response: {
				$case: "data",
				value: {
					qureau: {
						$case: "user",
						value: {
							user: {
								$case: "retrieveWithId",
								value: retrieveWithId,
							},
						},
					},
				},
			},
			version: {
				response: QureauResponseVersionEnum.QUREAU_R_LATEST,
				qureau: QureauVersionEnum.QUREAU_V_V1,
			},
		}) as JSONObject,
	);
};
