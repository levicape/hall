import { HonoGuardAuthentication } from "@levicape/spork/router/hono/guard/security/HonoGuardAuthentication";
import {
	LoginWithIdRequest,
	type LoginWithIdResponse,
} from "../../../../_protocols/qureau/tsnode/domain/login/withId/login.withId.js";
import { TokenCreateExt } from "../../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import { QureauResponse } from "../../../../_protocols/qureau/tsnode/service/qureau._.js";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../../../_protocols/qureau/tsnode/service/version.js";
import { Qureau } from "../../Qureau.mjs";
import { qureauLoginService } from "../../service/QureauLogin.mjs";

// export const TODOExtractInferred = (
// 	headers: Record<string, string | undefined>,
// 	resourceVersion: string,
// 	props: {
// 		ksuidGenerator: KSUIDGenerator;
// 	},
// ): LoginWithIdInferred => {
// 	const { ksuidGenerator } = props;
// 	return {
// 		rootId: ksuidGenerator.syncString(),
// 		meeloId: ksuidGenerator.syncString(),
// 		requestId: ksuidGenerator.syncString(),
// 		responseId: ksuidGenerator.syncString(),
// 		zugV1: ksuidGenerator.syncString(),
// 	};
// };

export const QureauLoginPath = "/Login/Authorize";
export const QureauLoginHandler = Qureau().createHandlers(
	HonoGuardAuthentication(async ({ principal }) => {
		return principal.$case === "anonymous";
	}),
	async (c) => {
		const data: LoginWithIdResponse = await qureauLoginService.LoginWithId({
			request: LoginWithIdRequest.fromJSON({}),
			inferred: undefined, // TODOExtractInferred(headers, "1"),
			ext: TokenCreateExt.fromJSON({
				nonce: "",
				// (request.headers["x-nonce"] as string) ?? KSUID.randomSync().string,
			}),
		});

		if (!data.authenticated) {
			return c.redirect("/oauth2/login?error=access_denied");
		}
		// TODO: redirect_uri
		return c.redirect(
			`/?code=${data.authenticated.token}&state=${data.authenticated.state}`,
		);
	},
);
