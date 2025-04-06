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
import type { KSUIDGenerator } from "../../repository/users/QureauUserRepository.Registration.mjs";
import { ksuidGenerator } from "../../repository/users/QureauUserRepository.Registration.mjs";
import { qureauLoginService } from "../../service/QureauLogin.mjs";

export const TODOExtractInferred = (
	headers: Record<string, string | undefined>,
	resourceVersion: string,
	props: {
		ksuidGenerator: KSUIDGenerator;
	},
): LoginWithIdInferred => {
	const { ksuidGenerator } = props;
	return {
		rootId: ksuidGenerator.syncString(),
		meeloId: ksuidGenerator.syncString(),
		requestId: ksuidGenerator.syncString(),
		responseId: ksuidGenerator.syncString(),
		zugV1: ksuidGenerator.syncString(),
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
