import type {
	ResolvedUrl,
	ServiceLocatorState,
} from "../../../ServiceLocatorContext.js";
import { UserRetrieveCommand } from "../../../_protocols/qureau/ts/domain/user/retrieve/user.retrieve.js";
import { UserRetrieveWithIdCommand } from "../../../_protocols/qureau/ts/domain/user/retrieveWithId/user.retrieveWithId.js";
import type { UserSearchByQueryCommand } from "../../../_protocols/qureau/ts/domain/user/searchByQuery/user.searchByQuery.js";
import { QureauResponse } from "../../../_protocols/qureau/ts/service/qureau._.js";
import type { QureauUserServiceRemote } from "../../../_protocols/qureau/ts/service/user/qureau.user.remote.js";
import { UserRetrievePrincipalCommand } from "../../../_protocols/qureau/tsnode/domain/user/retrievePrincipal/user.retrievePrincipal.remote.js";
import { QureauHttpServiceContext } from "../QureauHttpService.context.js";
import { QureauHttpService } from "../QureauHttpService.js";

export class QureauUserHttpService
	extends QureauHttpService
	implements QureauUserServiceRemote
{
	static readonly PREFIX = "/~/v1/Qureau/Users";
	static readonly PRINCIPAL = () => `/~/`;
	static readonly DESCRIBE = (userId: string) => `/!!/${userId}`;
	static readonly VIEW = () => `/-/`;

	PrincipalUser = (
		request: UserRetrievePrincipalCommand,
	): Promise<QureauResponse> => {
		return this.rpc(
			`${QureauUserHttpService.PREFIX}${QureauUserHttpService.PRINCIPAL()}`,
			"POST",
			JSON.stringify(UserRetrievePrincipalCommand.toJSON(request)),
		);
	};

	RetrieveUser(request: UserRetrieveCommand): Promise<QureauResponse> {
		const url = `${QureauUserHttpService.PREFIX}${QureauUserHttpService.VIEW()}`;
		return this.rpc(
			url,
			"POST",
			JSON.stringify(UserRetrieveCommand.toJSON(request)),
		);
	}
	RetrieveUserWithId(
		request: UserRetrieveWithIdCommand,
	): Promise<QureauResponse> {
		return this.rpc(
			`${QureauUserHttpService.PREFIX}${QureauUserHttpService.DESCRIBE(request.request?.userId ?? "")}`,
			"POST",
			JSON.stringify(
				UserRetrieveWithIdCommand.toJSON({
					request: {},
					ext: request.ext,
				}),
			),
		);
	}
	SearchUsersByQueryWithId(
		request: UserSearchByQueryCommand,
	): Promise<QureauResponse> {
		throw new Error("Method not implemented.");
	}

	// This should return [status, body]
	private rpc = async (
		path: string,
		method: "POST" | "GET",
		body?: string,
	): Promise<QureauResponse> => {
		const { fetch, resolveUrl } = this.serviceLocator;
		const [url] = resolveUrl(path);
		// console.debug({
		// 	QureauUserHttpService: {
		// 		url,
		// 		method,
		// 		body,
		// 	},
		// });
		const response = await fetch(url, {
			method,
			body,
		}).catch((e) => {
			console.error(e);
			throw e;
		});
		const json = await response.json();

		// console.debug({
		// 	QureauUserHttpService: {
		// 		response: {
		// 			status: response.status,
		// 			statusText: response.statusText,
		// 			json,
		// 			headers: response.headers,
		// 			ok: response.ok,
		// 		},
		// 	},
		// });
		return QureauResponse.fromJSON(json);
	};
}

export const QureauUserHttpServiceFactory =
	(rootUrl: string) => (token?: string) =>
		new QureauUserHttpService({
			fetch: QureauHttpService.fetch(
				new QureauHttpServiceContext(rootUrl),
				token,
			),
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			resolveUrl: (path: RequestInfo | URL): ResolvedUrl => {
				return [path.toString(), ["~/v1/Qureau/Users/!~!/Registration/", {}]];
			},
		} satisfies ServiceLocatorState);
