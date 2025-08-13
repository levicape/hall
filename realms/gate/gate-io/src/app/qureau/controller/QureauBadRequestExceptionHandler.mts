import type { ZodError } from "zod";
import type { QureauResponse_ErrorResponse } from "../../../_protocols/qureau/tsnode/service/qureau._.js";

export const qqZodError = (
	error: ZodError,
): QureauResponse_ErrorResponse | undefined => {
	return {
		code: "BAD_REQUEST",
		message: "Invalid request",
		cause: undefined,
		validations:
			error?.issues.map((issue) => ({
				code: issue.code,
				message: issue.message,
				cause: {
					code: "unknown",
					message: issue.path.join("."),
					cause: undefined,
					validations: [],
				},
				validations: [],
			})) || [],
	};
};
