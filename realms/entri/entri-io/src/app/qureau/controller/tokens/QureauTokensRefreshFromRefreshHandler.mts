import { ulid } from "ulidx";
import { TokenCreateExt } from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import {
	type TokenIssueJwtWithIdInferred,
	TokenIssueJwtWithIdRequest,
} from "../../../../_protocols/qureau/tsnode/domain/token/issueJwtWithId/token.issueJwtWithId.js";
import { qureauTokenService } from "../../service/QureauToken.mjs";

export const TODOExtractInferred = (
	request: Request,
	resourceVersion: string,
): TokenIssueJwtWithIdInferred => {
	return {
		principalId: ulid(),
		principalService: ulid(),
		resourceVersion: resourceVersion,
		idempotencyId: ulid(),
		requestId: ulid(),
		responseId: ulid(),
	};
};

export const QureauTokensRefreshFromRefreshHandler = async (
	request: Request,
	response: Response,
) => {
	const data = await qureauTokenService.IssueJWTWithId({
		request: TokenIssueJwtWithIdRequest.fromJSON({
			applicationId: "TODO: ",
			refreshToken: "TODO:",
		}),
		inferred: TODOExtractInferred(request, "1"),
		ext: TokenCreateExt.fromJSON({
			nonce: "",
			// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
		}),
	});

	// Logger.debug({
	// 	QureauTokensRefreshFromRefreshHandler: {
	// 		response: JSON.stringify(data),
	// 	},
	// });
	// response.status(StatusCodes.CREATED);
	// response.json(
	// 	QureauResponse.toJSON(
	// 		QureauResponse.fromJSON({
	// 			data: {
	// 				token: {
	// 					issueJwtWithId: {
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
