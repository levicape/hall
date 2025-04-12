import { randomUUID } from "node:crypto";
import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import VError from "verror";
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
import { Qureau } from "../../../Qureau.mjs";
import { ksuidGenerator } from "../../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauUserService } from "../../../service/QureauUser.mjs";
import { qqZodError } from "../../QureauBadRequestExceptionHandler.mjs";
import { QureauUsersPrincipalViewHandlerInfers } from "./QureauUsersPrincipalViewHandler.infers.mjs";

export const UsersPrincipalCommandZod = z.object({
	request: z.object({}),
	ext: z.object({
		nonce: z.string().max(255).default("TODO: sync with header"),
	}),
});

const version = {
	response: QureauResponseVersionEnum.QUREAU_R_LATEST,
	qureau: QureauVersionEnum.QUREAU_V_V1,
};
export const QureauUsersPrincipalViewHandler = Qureau().createHandlers(
	HonoGuardAuthentication(async ({ principal }) => {
		return principal.$case !== "anonymous";
	}),
	async (c: Context) => {
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
			throw new VError("Assertion failed: principal is anonymous");
		}

		const { success, error, data } = UsersPrincipalCommandZod.safeParse(body);
		if (error || data === undefined) {
			return c.json(
				QureauResponse.toJSON({
					error: qqZodError(error),
					version,
				}) as QureauResponse,
				StatusCodes.BAD_REQUEST,
			);
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

		return c.json(
			QureauResponse.toJSON({
				data: {
					user: {
						retrieveWithId,
					},
				},
				version: {
					response: QureauResponseVersionEnum.QUREAU_R_LATEST,
					qureau: QureauVersionEnum.QUREAU_V_V1,
				},
			}) as QureauResponse,
		);
	},
);
