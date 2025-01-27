import { Logger } from "@levicape/spork/server/logging";
import KSUID from "ksuid";
import {
	type LoginWithIdInferred,
	LoginWithIdRequest,
	type LoginWithIdResponse,
} from "../../../../_protocols/qureau/tsnode/domain/login/withId/login.withId.js";
import { TokenCreateExt } from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import { QureauResponse } from "../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../_protocols/qureau/tsnode/service/version.js";
import { qureauLoginService } from "../../service/QureauLogin.js";

export const TODOExtractInferred = (
	headers: Record<string, string | undefined>,
	resourceVersion: string,
): LoginWithIdInferred => {
	return {
		rootId: KSUID.randomSync().string,
		meeloId: KSUID.randomSync().string,
		requestId: KSUID.randomSync().string,
		responseId: KSUID.randomSync().string,
		zugV1: KSUID.randomSync().string,
	};
};

// export const QureauLoginHandler: Handler = async ({ body, headers }) => {
// 	const data: LoginWithIdResponse = await qureauLoginService.LoginWithId({
// 		request: LoginWithIdRequest.fromJSON({}),
// 		inferred: TODOExtractInferred(headers, "1"),
// 		ext: TokenCreateExt.fromJSON({
// 			nonce: "",
// 			// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
// 		}),
// 	});

// 	Logger.debug({
// 		QureauLoginHandler: {
// 			response: JSON.stringify(data),
// 		},
// 	});

// 	return QureauResponse.toJSON({
// 		response: {
// 			$case: "data",
// 			value: {
// 				qureau: {
// 					$case: "login",
// 					value: {
// 						login: {
// 							$case: "withId",
// 							value: data,
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
