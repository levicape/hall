import type {
	BaseError,
	ServiceError,
} from "@levicape/spork/server/exceptions";
import { Logger } from "@levicape/spork/server/logging";
import {
	type JwtTools,
	LoginToken,
	jwtTools,
} from "@levicape/spork/server/security";
import KSUID from "ksuid";
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

export class QureauTokens implements QureauTokenService {
	static executorId: string = KSUID.randomSync().string;
	constructor(
		private readonly jwtTools: JwtTools,
		// private readonly token: ITable<QureauTaskRow, QureauTaskKey>,
		// private readonly tokenByTenant: ITable<QureauTaskRow, QureauTaskKey>,
	) {}

	IssueJwtWithId(
		request: TokenIssueJwtWithId,
	): Promise<TokenIssueJwtWithIdResponse> {
		throw new Error("Method not implemented.");
	}

	private async storeRefreshTokenInDB(
		refreshTokenId: string,
		refreshToken: string,
	): Promise<void> {
		// Placeholder for actual database storage logic
		// This should be replaced with actual implementation
		Logger.log(
			`Storing refresh token with ID ${refreshTokenId} in the database.`,
		);
		// Example: await this.token.put({ refreshTokenId, refreshToken });
	}

	private async retrieveRefreshTokenFromDB(
		refreshTokenId: string,
	): Promise<string> {
		// Placeholder for actual database retrieval logic
		// This should be replaced with actual implementation
		return "mocked-refresh-token";
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

			const idTokenPayload = LoginToken.player(principalId);
			const accessTokenPayload = LoginToken.anonymous(principalId);
			const idToken = await this.jwtTools.generateLogin(idTokenPayload);
			const accessToken = await this.jwtTools.generateLogin(accessTokenPayload);
			const refreshToken = await this.jwtTools.generateRefresh(principalId);
			const refreshTokenId = KSUID.randomSync().string;

			// TODO: Store refresh token in database
			await this.storeRefreshTokenInDB(refreshTokenId, refreshToken);

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
			const { sub: principalId, xid: refreshTokenId } =
				await this.jwtTools.verify(refreshToken ?? "", "REFRESH");
			if (
				request.inferred?.principalId !== "" &&
				request.inferred?.principalId !== principalId
			) {
				Logger.warn({
					QureauToken: {
						error: "Principal ID mismatch",
						IssueJWTWithId: {
							principalId,
							request,
						},
					},
				});
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Principal ID mismatch",
				});
			}

			// biome-ignore lint/style/noNonNullAssertion:
			const idTokenPayload = LoginToken.player(principalId!);
			// biome-ignore lint/style/noNonNullAssertion:
			const accessTokenPayload = LoginToken.anonymous(principalId!);
			const accessToken = await this.jwtTools.generateLogin(accessTokenPayload);
			// biome-ignore lint/style/noNonNullAssertion:
			const newRefreshToken = await this.jwtTools.generateRefresh(principalId!);

			// Store the new refresh token
			await this.storeRefreshTokenInDB(refreshTokenId, newRefreshToken);

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

	async RetrieveRefreshTokenByIdWithId(
		request: TokenRefreshRetrieveByIdWithId,
	): Promise<TokenRefreshRetrieveByIdWithIdResponse> {
		try {
			if (!request.request) {
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Request is undefined",
				});
			}

			const { tokenId } = request.request;
			if (!tokenId) {
				throw new QureauTokenError(400, {
					code: "INVALID_REQUEST",
					reason: "Token ID is undefined",
				});
			}
			// Retrieve the refresh token from the database
			const refreshToken = await this.retrieveRefreshTokenFromDB(tokenId);

			// Mocked response, replace with actual data retrieval logic
			return {
				jwt: {
					id: tokenId,
					userId: "mocked-user-id",
					tenantId: "mocked-tenant-id",
					token: refreshToken,
					applicationId: "mocked-application-id",
					data: {},
					insertInstant: Date.now(),
					metaData: {
						data: {},
						device: {
							description: "mocked-device",
							lastAccessedAddress: "mocked-address",
							lastAccessedInstant: Date.now(),
							name: "mocked-device-name",
							type: "mocked-device-type",
						},
						scopes: [{ scope: "mocked-scope" }],
					},
					startInstant: Date.now(),
				},
			};
		} catch (error) {
			throw new QureauTokenError(500, error as BaseError);
		}
	}
}

export const qureauTokenService = new QureauTokens(
	jwtTools,
	// qureauTokenTable,
	// qureauTokenByTenant,
);
