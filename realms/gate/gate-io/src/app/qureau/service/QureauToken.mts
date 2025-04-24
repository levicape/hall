import type { BaseError, ServiceError } from "@levicape/spork/server/Error";
import type { ITable } from "@levicape/spork/server/client/table/ITable";
import { LoginToken } from "@levicape/spork/server/security/model/LoginToken";
import { HTTPException } from "hono/http-exception";
import { ulid } from "ulidx";
import {
	type TokenCreate,
	TokenCreateResponse,
	TokenTypeResponse,
} from "../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import type {
	TokenIssueJwtWithId,
	TokenIssueJwtWithIdResponse,
} from "../../../_protocols/qureau/tsnode/domain/token/issueJwtWithId/token.issueJwtWithId.js";
import type {
	TokenRefreshRetrieveByIdWithId,
	TokenRefreshRetrieveByIdWithIdResponse,
} from "../../../_protocols/qureau/tsnode/domain/token/refresh/retrieveByIdWithId/token.refresh.retrieveByIdWithId.js";
import type { QureauTokenService } from "../../../_protocols/qureau/tsnode/service/token/qureau.token.js";
import type { QureauJwts } from "../QureauJwt.mjs";
import type { QureauUserTokenRepository } from "../repository/users/QureauUserRepository.Token.mjs";
import {
	type QureauUserTokenKey,
	QureauUserTokenRow,
} from "../repository/users/user/QureauUserRow.Token.mjs";

export class QureauTokenError extends Error implements ServiceError {
	error: { rootCauses?: BaseError[] } & BaseError;

	constructor(
		readonly status: number,
		readonly cause: BaseError,
	) {
		super("QUREAU_TOKEN_ERROR");
		this.error = {
			code: "QUREAU_TOKEN_ERROR",
			reason: "Service error",
			rootCauses: [cause],
			date: new Date().toISOString(),
		};
	}
}

export class QureauTokens
	implements Omit<QureauTokenService, "RetrieveRefreshTokenByIdWithId">
{
	static executorId: string = ulid();
	constructor(
		private readonly jwtTools: QureauJwts,
		private readonly tokenRepository: QureauUserTokenRepository,
		// private readonly tokenByTenant: ITable<QureauTaskRow, QureauTaskKey>,
	) {}

	IssueJwtWithId(
		request: TokenIssueJwtWithId,
	): Promise<TokenIssueJwtWithIdResponse> {
		throw new Error("Method not implemented.");
	}

	async CreateToken(request: TokenCreate): Promise<TokenCreateResponse> {
		try {
			if (!request.request) {
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Request is undefined",
				});
			}
			const { principalId } = request.inferred ?? {};
			if (!principalId) {
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Principal ID is undefined",
				});
			}

			// const idTokenPayload = LoginToken.player(principalId);
			// const accessTokenPayload = LoginToken.anonymous(principalId);
			const idToken = ""; //await this.jwtTools.generateLogin(idTokenPayload);
			const accessToken = ""; //await this.jwtTools.generateLogin(accessTokenPayload);
			const refreshToken = ""; //await this.jwtTools.generateRefresh(principalId);
			const refreshTokenId = ulid();

			// TODO: Store refresh token in database
			async function storeRefreshTokenInDB(
				refreshTokenId: string,
				refreshToken: string,
			): Promise<void> {
				// Logger.log(
				// 	`Storing refresh token with ID ${refreshTokenId} in the database.`,
				// );
				// Example: await this.token.put({ refreshTokenId, refreshToken });
			}
			await storeRefreshTokenInDB(refreshTokenId, refreshToken);

			return TokenCreateResponse.fromJSON({
				access: {
					expiresIn: 3600,
					idToken,
					accessToken,
					refreshToken,
					refreshTokenId,
					scope: "offline_access",
					tokenType: TokenTypeResponse.TokenTypeResponse_BEARER,
					userId: principalId,
				},
			});
		} catch (error) {
			throw new QureauTokenError(500, error as BaseError);
		}
	}

	async IssueJWTWithId(
		request: TokenIssueJwtWithId,
	): Promise<TokenIssueJwtWithIdResponse> {
		try {
			if (!request.request) {
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Request is undefined",
				});
			}

			const { refreshToken } = request.request;

			// Validate the refresh token
			const { sub: principalId, xid: refreshTokenId } = { sub: "", xid: "" }; //await this.jwtTools.verify(refreshToken ?? "", "REFRESH");
			if (
				request.inferred?.principalId !== "" &&
				request.inferred?.principalId !== principalId
			) {
				// Logger.warn({
				// 	QureauToken: {
				// 		error: "Principal ID mismatch",
				// 		IssueJWTWithId: {
				// 			principalId,
				// 			request,
				// 		},
				// 	},
				// });
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Principal ID mismatch",
				});
			}

			// const idTokenPayload = LoginToken.player(principalId!);
			// const accessTokenPayload = LoginToken.anonymous(principalId!);
			const accessToken = ""; //await this.jwtTools.generateLogin(accessTokenPayload);
			const newRefreshToken = ""; //await this.jwtTools.generateRefresh(principalId!);

			// Store the new refresh token

			async function storeRefreshTokenInDB(
				refreshTokenId: string,
				refreshToken: string,
			): Promise<void> {
				// Logger.log(
				// 	`Storing refresh token with ID ${refreshTokenId} in the database.`,
				// );
				// Example: await this.token.put({ refreshTokenId, refreshToken });
			}
			await storeRefreshTokenInDB(refreshTokenId, newRefreshToken);

			return {
				issued: {
					refreshToken: newRefreshToken,
					token: accessToken,
				},
			};
		} catch (error) {
			throw new QureauTokenError(500, error as BaseError);
		}
	}

	async RetrieveTokenByIdWithId(
		request: TokenRefreshRetrieveByIdWithId,
	): Promise<TokenRefreshRetrieveByIdWithIdResponse> {
		if (!request.request) {
			throw new HTTPException(400, {
				res: new Response(
					JSON.stringify({
						error: {
							code: "INVALID_REQUEST",
							reason: "Request is undefined",
						},
					}),
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				),
			});
		}

		const { tokenId } = request.request;
		if (!tokenId) {
			throw new HTTPException(400, {
				res: new Response(
					JSON.stringify({
						error: {
							code: "INVALID_REQUEST",
							reason: "Token ID is undefined",
						},
					}),
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				),
			});
		}

		const row = await this.tokenRepository.getByUserIdApplicationIdTokenId(
			request.inferred?.principalId ?? "",
			"uwu",
			tokenId,
		);
		if (!row) {
			throw new HTTPException(404, {
				res: new Response(
					JSON.stringify({
						error: {
							code: "NOT_FOUND",
							reason: "Token not found",
						},
					}),
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				),
			});
		}

		const refreshToken = QureauUserTokenRow.toData(row);
		return {
			jwt: {
				id: tokenId,
				userId: refreshToken.userId,
				tenantId: refreshToken.tenantId,
				token: refreshToken.token,
				applicationId: refreshToken.applicationId,
				data: refreshToken.data,
				insertInstant: refreshToken.startInstant,
				startInstant: Date.now(),
				metaData: {
					data: {},
					device: {},
					scopes: [],
				},
			},
		};
	}
}
