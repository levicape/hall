import { Logger } from "@levicape/spork/server/logging";
import { type QureauUser, qureauUserService } from "./service/QureauUser.js";

export class QureauPrime {
	private qureauUser: QureauUser;

	constructor(qureauUserService: QureauUser) {
		this.qureauUser = qureauUserService;
	}

	public prime = async (): Promise<void> => {
		let tableReady = false;
		while (!tableReady) {
			try {
				// Create canary and service accts
				// await this.qureauUser.RetrieveUser({
				//   request: {
				//     username: "exampleUsername",
				//     qqTenantId: "exampleTenantId",
				//     verificationId: "exampleVerificationId",
				//     changePasswordId: "exampleChangePasswordId",
				//     email: "exampleEmail",
				//     loginId: "exampleLoginId",
				//   },
				//   inferred: {
				//     principalId: "examplePrincipalId",
				//     principalService: "examplePrincipalService",
				//     resourceVersion: "exampleResourceVersion",
				//     idempotencyId: "exampleIdempotencyId",
				//     requestId: "exampleRequestId",
				//     responseId: "exampleResponseId",
				//   },
				//   ext: {
				//     nonce: "QureauPrime",
				//   },
				// });
				tableReady = true;
			} catch (e) {
				Logger.debug({
					QureauPrime: {
						prime: {
							waitingForTableReady: JSON.stringify({
								error: e,
								json: JSON.stringify(e),
								string: e?.toString() ?? "",
								splat: {
									...(e ?? {}),
								},
							}),
						},
					},
				});
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	};
}

export const qureauPrime = new QureauPrime(qureauUserService);
