import {
	type TokenCreateCommand,
	TokenCreateRequest,
} from "../../../_protocols/qureau/tsnode/domain/token/create/token.create.js";
import type { TokenIssueJwtWithIdCommand } from "../../../_protocols/qureau/tsnode/domain/token/issueJwtWithId/token.issueJwtWithId.js";
import type { TokenRefreshRetrieveByIdWithIdCommand } from "../../../_protocols/qureau/tsnode/domain/token/refresh/retrieveByIdWithId/token.refresh.retrieveByIdWithId.js";
import type { QureauResponse } from "../../../_protocols/qureau/tsnode/service/qureau._.js";
import type { QureauTokenServiceRemote } from "../../../_protocols/qureau/tsnode/service/token/qureau.token.remote.js";
import { QureauHttpService } from "../QureauHttpService.js";

export class QureauTokenHttpService
	extends QureauHttpService
	implements QureauTokenServiceRemote
{
	static readonly PREFIX = "/~/v1/Qureau/Tokens/";

	IssueJwtWithId(request: TokenIssueJwtWithIdCommand): Promise<QureauResponse> {
		throw new Error("Method not implemented.");
	}
	RetrieveRefreshTokenByIdWithId(
		request: TokenRefreshRetrieveByIdWithIdCommand,
	): Promise<QureauResponse> {
		throw new Error("Method not implemented.");
	}
	CreateToken(request: TokenCreateCommand): Promise<QureauResponse> {
		return this.rpc(
			`${QureauTokenHttpService.PREFIX}`,
			"POST",
			JSON.stringify(TokenCreateRequest.toJSON(request)),
		);
	}

	private rpc = async (
		path: string,
		method: "POST" | "GET",
		body?: string,
	): Promise<QureauResponse> => {
		const { fetch, resolveUrl } = this.serviceLocator;
		const [url] = resolveUrl(path);
		const response = await (
			await fetch(url, {
				method,
				body,
			})
		).json();
		return response;
	};
}
