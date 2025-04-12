// import { type JwtTools, jwtTools } from "@levicape/spork/server/security/model/";
import VError from "verror";
import type {
	LoginWithId,
	LoginWithIdResponse,
} from "../../../_protocols/qureau/tsnode/domain/login/withId/login.withId.js";
import type { QureauLoginService } from "../../../_protocols/qureau/tsnode/service/login/qureau.login.js";

export class QureauLogin implements QureauLoginService {
	constructor(
		// private readonly jwtTools: JwtTools,
		// private readonly token: ITable<QureauTaskRow, QureauTaskKey>,
		// private readonly tokenByTenant: ITable<QureauTaskRow, QureauTaskKey>,
	) {}
	LoginWithId = async (request: LoginWithId): Promise<LoginWithIdResponse> => {
		throw new VError("Method not implemented.");
	};
}

export const qureauLoginService = new QureauLogin(
	// jwtTools,
	// token,
	// tokenByTenant
);
