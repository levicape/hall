import { Logger } from "@levicape/spork/server/logging";
import KSUID from "ksuid";
import {
	TokenCreateExt,
	type TokenCreateInferred,
	TokenCreateRequest,
} from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import { qureauTokenService } from "../../service/QureauToken.js";

export const TODOExtractInferred = (
	request: Request,
	resourceVersion: string,
): TokenCreateInferred => {
	return {
		principalId: KSUID.randomSync().string,
		principalService: KSUID.randomSync().string,
		resourceVersion: resourceVersion,
		idempotencyId: KSUID.randomSync().string,
		requestId: KSUID.randomSync().string,
		responseId: KSUID.randomSync().string,
	};
};

export const QureauTokensRefreshCreateHandler = async (
	request: Request,
	response: Response,
) => {
	const data = await qureauTokenService.CreateToken({
		request: TokenCreateRequest.fromJSON({}),
		inferred: TODOExtractInferred(request, "1"),
		ext: TokenCreateExt.fromJSON({
			nonce: "",
			// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
		}),
	});

	Logger.debug({
		QureauTokensRefreshCreateHandler: {
			response: JSON.stringify(data),
		},
	});
	// response.status(StatusCodes.CREATED);
	// response.json(
	// 	QureauResponse.toJSON(
	// 		QureauResponse.fromJSON({
	// 			data: {
	// 				token: {
	// 					create: {
	// 						...data,
	// 					},
	// 				},
	// 			},
	// 			version: {
	// 				response: qureauResponseVersionEnumToJSON(
	// 					QureauResponseVersionEnum.QUREAU_R_LATEST,
	// 				) as unknown as QureauResponseVersionEnum,
	// 				qureau: qureauVersionEnumToJSON(
	// 					QureauVersionEnum.QUREAU_V_V1,
	// 				) as unknown as QureauVersionEnum,
	// 			},
	// 		} satisfies QureauResponse),
	// 	),
	// );
};
