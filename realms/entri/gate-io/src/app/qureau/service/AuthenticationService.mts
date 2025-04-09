import { LoginToken } from "@levicape/spork/server/security/model/LoginToken";
import type { User } from "../../../_protocols/qureau/tsnode/domain/user/user._._.js";

export class AuthenticationService {
	fromUser(user: User): Promise<LoginToken> {
		if (!user.verified) {
			return Promise.resolve(LoginToken.anonymous(user.id ?? "qq"));
		}
		return Promise.resolve(LoginToken.player(user.id ?? "qq"));
	}

	fromAccessToken(token: LoginToken): Promise<LoginToken> {
		return Promise.resolve(LoginToken.fromToken(token));
	}
}

export const authenticationService = new AuthenticationService();
