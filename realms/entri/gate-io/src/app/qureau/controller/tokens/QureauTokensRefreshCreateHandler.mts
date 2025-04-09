import {
	TokenCreateExt,
	type TokenCreateInferred,
	TokenCreateRequest,
} from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import type { KSUIDGenerator } from "../../repository/users/QureauUserRepository.Registration.mjs";
import { ksuidGenerator } from "../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauTokenService } from "../../service/QureauToken.mjs";

export const TODOExtractInferred = (
	request: Request,
	resourceVersion: string,
	ksuidGenerator: KSUIDGenerator,
): TokenCreateInferred => {
	return {
		principalId: ksuidGenerator.syncString(),
		principalService: ksuidGenerator.syncString(),
		resourceVersion: resourceVersion,
		idempotencyId: ksuidGenerator.syncString(),
		requestId: ksuidGenerator.syncString(),
		responseId: ksuidGenerator.syncString(),
	};
};

export const QureauTokensRefreshCreateHandler = async (
	request: Request,
	response: Response,
) => {
	const data = await qureauTokenService.CreateToken({
		request: TokenCreateRequest.fromJSON({}),
		inferred: TODOExtractInferred(request, "1", ksuidGenerator),
		ext: TokenCreateExt.fromJSON({
			nonce: "",
			// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
		}),
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
