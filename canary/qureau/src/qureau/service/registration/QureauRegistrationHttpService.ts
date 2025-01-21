import type {
	ResolvedUrl,
	ServiceLocatorState,
} from "../../../ServiceLocatorContext.js";
import { RegistrationRegisterCommand } from "../../../_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import { QureauResponse } from "../../../_protocols/qureau/tsnode/service/qureau._.js";
import type { QureauRegistrationServiceRemote } from "../../../_protocols/qureau/tsnode/service/registration/qureau.registration.remote.js";
import { QureauHttpServiceContext } from "../QureauHttpService.context.js";
import { QureauHttpService } from "../QureauHttpService.js";

export class QureauRegistrationHttpService
	extends QureauHttpService
	implements QureauRegistrationServiceRemote
{
	static readonly PREFIX = "/~/v1/Qureau/Users";
	static readonly REGISTER = "/-/Registration/";

	Register(request: RegistrationRegisterCommand): Promise<QureauResponse> {
		return this.rpc(
			`${QureauRegistrationHttpService.PREFIX}${QureauRegistrationHttpService.REGISTER}`,
			"POST",
			JSON.stringify(RegistrationRegisterCommand.toJSON(request)),
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

		return QureauResponse.fromJSON(response);
	};
}

export const QureauRegistrationHttpServiceFactory = (rootUrl: string) =>
	new QureauRegistrationHttpService({
		fetch: QureauHttpService.fetch(new QureauHttpServiceContext(rootUrl)),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		resolveUrl: (path: RequestInfo | URL): ResolvedUrl => {
			return [path.toString(), ["~/v1/Qureau/Users/!~!/Registration/", {}]];
		},
	} satisfies ServiceLocatorState);
