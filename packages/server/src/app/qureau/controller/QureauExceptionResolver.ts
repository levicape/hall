// import type { QureauOnErrorHandler } from "../QureauRouter.js";
// import type { QQUsersError } from "../service/QureauUser.js";
// import { Logger } from "@levicape/spork/server/logging";
// import {
// 	QureauResponse,
// 	QureauResponse_ErrorResponse,
// } from "../../../_protocols/qureau/tsnode/service/qureau._.js";
// import {
// 	QureauResponseVersionEnum,
// 	QureauVersionEnum,
// } from "../../../_protocols/qureau/tsnode/service/version.js";

// const isParseableError = (error: unknown): error is QQUsersError => {
// 	return (
// 		(error as QQUsersError).status !== undefined &&
// 		(error as QQUsersError).cause !== undefined
// 	);
// };
// export const QureauExceptionResolver: QureauOnErrorHandler = ({
// 	headers,
// 	path,
// 	request,
// 	set,
// 	code,
// 	error,
// }) => {
// 	if (code === "NOT_FOUND") {
// 		set.status = `I'm a teapot`;
// 		return QureauResponse.toJSON({
// 			response: {
// 				$case: "error",
// 				value: {
// 					code: "UNPROCESSABLE_ENTITY",
// 					message: "Could not process the request",
// 					cause: undefined,
// 					validations: [],
// 				},
// 			},
// 			version: {
// 				response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 				qureau: QureauVersionEnum.QUREAU_V_V1,
// 			},
// 		});
// 	}

// 	if (code === "UNKNOWN") {
// 		if (isParseableError(error)) {
// 			const root: QureauResponse_ErrorResponse = {
// 				code: error.cause.code,
// 				cause: undefined,
// 				validations: [],
// 				unrecoverable: false,
// 			};

// 			set.status = error.status;

// 			return QureauResponse.toJSON({
// 				response: {
// 					$case: "error",
// 					value: {
// 						code: `${error.cause.code}`,
// 						message: "Validation error",
// 						cause: root,
// 						validations:
// 							error.validations?.map(({ code, field, message }) => {
// 								return QureauResponse_ErrorResponse.fromJSON({
// 									code,
// 									field,
// 									message,
// 								});
// 							}) ?? [],
// 						unrecoverable: false,
// 					},
// 				},
// 				version: {
// 					response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 					qureau: QureauVersionEnum.QUREAU_V_V1,
// 				},
// 			});
// 		}
// 	}

// 	Logger.warn({
// 		QureauExceptionResolver: {
// 			ip:
// 				headers["X-Forwarded-For"] ??
// 				headers["x-forwarded-for"] ??
// 				headers["x-real-ip"] ??
// 				headers["x-real-ip"],
// 			path,
// 			method: request.method,
// 			body: request.body,
// 			code,
// 			error: {
// 				splat: {
// 					...(error as unknown as object),
// 				},
// 				json: JSON.stringify(error),
// 				string: error?.toString(),
// 				stack:
// 					(error as unknown as { stack: string }).stack !== undefined
// 						? (error as unknown as { stack: string }).stack
// 						: undefined,
// 			},
// 			timestamp: Date.now(),
// 		},
// 	});
// 	set.status = "Internal Server Error";
// 	return QureauResponse.toJSON({
// 		response: {
// 			$case: "error",
// 			value: {
// 				code: "INTERNAL_SERVER_ERROR",
// 				message: "Could not process the request",
// 				cause: undefined,
// 				validations: [],
// 			},
// 		},
// 		version: {
// 			response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 			qureau: QureauVersionEnum.QUREAU_V_V1,
// 		},
// 	});
// };

// // export const QureauErrorHandler = errorHandler({
// // 	500: ({ error }) => {
// // 		Logger.warn({
// // 			QureauRouter: {
// // 				UnhandledException: {
// // 					error,
// // 					string: JSON.stringify(error),
// // 					splat: {
// // 						...error,
// // 					},
// // 				},
// // 			},
// // 		});
// // 		return QureauResponse.toJSON({
// // 			response: {
// // 				$case: "error",
// // 				value: {
// // 					code: "INTERNAL_SERVER_ERROR",
// // 					message: "Internal Server Error",
// // 					cause: undefined,
// // 					validations: [],
// // 				},
// // 			},
// // 			version: {
// // 				response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// // 				qureau: QureauVersionEnum.QUREAU_V_V1,
// // 			},
// // 		});
// // 	},
// // });
