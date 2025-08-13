import type {
	JwtSignFnJose,
	JwtSignatureInterface,
} from "@levicape/spork/server/security/JwtSignature";
import type { EncryptJWT, JWTPayload } from "jose";
import VError from "verror";

export type QureauTokenType = "access" | "refresh" | "id" | "code";

export interface QureauJwtProps {
	issuer?: string;
	jwtSignature: JwtSignatureInterface<QureauBaseClaims>;
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
type QureauEncryptFn = (jwt: EncryptJWT) => EncryptJWT;

export function QureauJwt(props: QureauJwtProps) {
	function withDefaults(
		token_use: QureauTokenType,
		configure: QureauConfigureFn,
		claims?: Record<string, string | undefined>,
	) {
		if (!props.jwtSignature.sign) {
			throw new VError("JwtSignature sign() is not available");
		}

		return props.jwtSignature.sign({ token_use, ...claims }, (token) => {
			return configure(token);
		});
	}

	return {
		async code(
			clientId: string,
			configure?: QureauEncryptFn,
			claims?: Record<string, string | undefined>,
		) {
			if (!props.jwtSignature.encrypt) {
				throw new VError("JwtSignature encrypt() not available");
			}

			return props.jwtSignature.encrypt(
				{
					...claims,
					token_use: "code",
				},
				(token) =>
					(configure?.(token) ?? token)
						.setAudience(clientId)
						.setExpirationTime("2m"),
			);
		},
		async decode(jwt: string, clientId: string) {
			if (!props.jwtSignature.decrypt) {
				throw new VError("JwtSignature decrypt() not available");
			}

			return (
				await props.jwtSignature.decrypt(jwt, {
					issuer: props.issuer,
					audience: clientId,
				})
			).payload as QureauBaseClaims;
		},
		accessSeconds: 60 * 60 * 3,
		async access(configure?: QureauConfigureFn) {
			return withDefaults("access", (token) => {
				return configure?.(token.setExpirationTime("1h")) ?? token;
			});
		},
		async refresh(configure?: QureauConfigureFn) {
			return withDefaults("refresh", (token) => {
				return configure?.(token) ?? token;
			});
		},
		async id(nonce: string, configure?: QureauConfigureFn) {
			return withDefaults(
				"id",
				(token) => {
					return configure?.(token) ?? token;
				},
				{
					nonce,
				},
			);
		},
	};
}
export type QureauJwts = ReturnType<typeof QureauJwt>;
