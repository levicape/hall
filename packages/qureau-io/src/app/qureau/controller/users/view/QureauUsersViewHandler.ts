// import type { ElysiaHttpAuthenticatedHandler } from "src/app/ElysiaHttpAuthentication";
import {
	UserRetrieve,
	type UserRetrieveResponse,
} from "../../../../../_protocols/qureau/tsnode/domain/user/retrieve/user.retrieve.js";
import { QureauResponse } from "../../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../../_protocols/qureau/tsnode/service/version.js";
import { qureauUserService } from "../../../service/QureauUser.js";

// export const QureauUsersViewHandler: ElysiaHttpAuthenticatedHandler = async ({
// 	body,
// 	headers,
// 	principal,
// }) => {
// 	if (principal.$case === "anonymous") {
// 		throw new Error("Unauthorized");
// 	}
// 	const retrieve: UserRetrieveResponse = await qureauUserService.RetrieveUser(
// 		UserRetrieve.fromJSON({
// 			request: {},
// 			inferred: {},
// 			ext: {},
// 		} satisfies UserRetrieve),
// 	);

// 	return QureauResponse.toJSON({
// 		response: {
// 			$case: "data",
// 			value: {
// 				qureau: {
// 					$case: "user",
// 					value: {
// 						user: {
// 							$case: "retrieve",
// 							value: retrieve,
// 						},
// 					},
// 				},
// 			},
// 		},
// 		version: {
// 			response: QureauResponseVersionEnum.QUREAU_R_LATEST,
// 			qureau: QureauVersionEnum.QUREAU_V_V1,
// 		},
// 	});
// };
