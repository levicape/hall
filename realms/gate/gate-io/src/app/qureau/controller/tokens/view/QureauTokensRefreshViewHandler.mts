import { TokenRefreshRetrieveByIdWithId } from "../../../../../_protocols/qureau/tsnode/domain/token/refresh/retrieveByIdWithId/token.refresh.retrieveByIdWithId.js";

export const QureauTokensRefreshViewHandler = async (
	request: Request,
	response: Response,
) => {
	// const data = await qureauTokenService.RetrieveRefreshTokenByIdWithId(
	// 	TokenRefreshRetrieveByIdWithId.fromJSON(
	// 		{
	// 			request: {},
	// 			inferred: {},
	// 			ext: {},
	// 		},
	// 		// satisfies UserRetrieveWithId
	// 	),
	// );
	// response.status(200);
	// response.json(
	// 	QureauResponse.toJSON(
	// 		QureauResponse.fromJSON({
	// 			data: {
	// 				token: {
	// 					refreshRetrieveByIdWithId: {
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
