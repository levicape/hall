import type { JwtSignFnJose } from "@levicape/spork/server/security/JwtSignature";
import type { JWTPayload } from "jose";

export type QureauTokenType = "access" | "refresh" | "id" | "code";

export interface QureauJwtProps {
	jwtSigner: JwtSignFnJose<QureauBaseClaims>;
}

export type QureauBaseClaims = JWTPayload & {
	token_use: QureauTokenType;
};

export type QureauJwtInput = Omit<
	QureauBaseClaims,
	"iss" | "aud" | "exp" | "token_use"
> & {
	/**
	 * Verified user identifier.
	 * @example "username"
	 */
	vid?: string;
	/**
	 * Hashed rateid.
	 * @example ""
	 */
	rid?: string;
};
type QureauConfigureFn = Parameters<JwtSignFnJose<QureauBaseClaims>>[1];
export function QureauJwt(props: QureauJwtProps) {
	function withDefaults(
		token_use: QureauTokenType,
		configure: QureauConfigureFn,
	) {
		return props.jwtSigner({ token_use }, (token) => {
			return configure(token);
		});
	}

	return {
		code(configure?: QureauConfigureFn) {
			return withDefaults("code", (token) => {
				return configure?.(token.setExpirationTime("2m")) ?? token;
			});
		},
		access(configure?: QureauConfigureFn) {
			return withDefaults("access", (token) => {
				return configure?.(token.setExpirationTime("3h")) ?? token;
			});
		},
		refresh(configure?: QureauConfigureFn) {
			return withDefaults("refresh", (token) => {
				return configure?.(token) ?? token;
			});
		},
		id(configure?: QureauConfigureFn) {
			return withDefaults("id", (token) => {
				return configure?.(token) ?? token;
			});
		},
	};
}
export type QureauJwts = ReturnType<typeof QureauJwt>;
