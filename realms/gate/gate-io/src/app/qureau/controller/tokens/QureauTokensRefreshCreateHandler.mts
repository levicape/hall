import {
	type KeygenKsort,
	ulidKeygen,
} from "@levicape/spork/server/security/IdKeygen";
import {
	TokenCreateExt,
	type TokenCreateInferred,
	TokenCreateRequest,
} from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";

export const TODOExtractInferred = (
	request: Request,
	resourceVersion: string,
	keygen: KeygenKsort,
): TokenCreateInferred => {
	return {
		principalId: keygen.ksort(),
		principalService: keygen.ksort(),
		resourceVersion: resourceVersion,
		idempotencyId: keygen.ksort(),
		requestId: keygen.ksort(),
		responseId: keygen.ksort(),
	};
};

export const QureauTokensRefreshCreateHandler = async (
	request: Request,
	response: Response,
) => {
	// const data = await qureauTokenService.CreateToken({
	// 	request: TokenCreateRequest.fromJSON({}),
	// 	inferred: TODOExtractInferred(request, "1", ulidKeygen),
	// 	ext: TokenCreateExt.fromJSON({
	// 		nonce: "",
	// 		// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
	// 	}),
	// });
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
