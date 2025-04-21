// import { StatusCodes } from "http-status-codes";
// import { QQUsersError } from "../service/QureauUser.mjs";
// import type { ZodError } from "zod";

// export const qureauFormattedError = (
// 	success: boolean,
// 	error: ZodError,
// 	en: (key: string) => string,
// ): QQUsersError | undefined => {
// 	if (!success) {
// 		return new QQUsersError(
// 			StatusCodes.BAD_REQUEST,
// 			{
// 				// TODO: Enums
// 				// TODO: codes protos (probably in domain)
// 				code: "QQ_ERROR",
// 				reason: en("QQ_ERROR"),
// 			},
// 			error.flatMap(({ message, path, code }) => {
// 				const fullPath = path.join(".").replace(/\./g, "_").toUpperCase();
// 				return {
// 					code,
// 					field: fullPath,
// 					reason: "",
// 					message: en(message),
// 				};
// 			}),
// 		);
// 	}
// 	return undefined;
// };
