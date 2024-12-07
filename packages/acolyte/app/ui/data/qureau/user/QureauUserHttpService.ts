import { useCreation, useUpdateEffect } from "ahooks";
import { useMemo } from "react";
import { UserRetrieveCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieve/user.retrieve.js";
import { UserRetrievePrincipalCommand } from "~/_protocols/qureau/tsnode/domain/user/retrievePrincipal/user.retrievePrincipal.remote.js";
import { UserRetrieveWithIdCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import type { UserSearchByQueryCommand } from "~/_protocols/qureau/tsnode/domain/user/searchByQuery/user.searchByQuery.js";
import type { QureauResponse } from "~/_protocols/qureau/tsnode/service/qureau._.js";
import type { QureauUserServiceRemote } from "~/_protocols/qureau/tsnode/service/user/qureau.user.remote.js";
import { useServiceLocator } from "~/ui/data/ServiceLocatorContext.js";
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

	SearchUsersByQueryWithId(
		request: UserSearchByQueryCommand,
	): Promise<QureauResponse> {
		throw new Error("Method not implemented.");
	}

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

	// This should return [status, body]
	private rpc = async (
		path: string,
		method: "POST" | "GET",
		body?: string,
	): Promise<QureauResponse> => {
		const { fetch, resolveUrl } = this.serviceLocator;
		const [url] = resolveUrl(path);
		console.debug({
			QureauUserHttpService: {
				url,
				method,
				body,
			},
		});
		const response = await fetch(url, {
			method,
			body,
		}).catch((e) => {
			console.error(e);
			throw e;
		});
		const json = await response.json();

		console.debug({
			QureauUserHttpService: {
				response: {
					status: response.status,
					statusText: response.statusText,
					json,
					headers: response.headers,
					ok: response.ok,
				},
			},
		});
		return json;
	};
}

export type UseQureauUserClientState = {
	service: QureauUserServiceRemote;
};
export const useQureauUserClient = (): UseQureauUserClientState => {
	const serviceLocator = useServiceLocator();
	const service = useCreation(
		() => new QureauUserHttpService(serviceLocator),
		[],
	);

	useUpdateEffect(() => {
		service.withServiceLocator(serviceLocator);
	}, [service, serviceLocator]);

	return useMemo(
		() => ({
			service,
		}),
		[service],
	);
};
