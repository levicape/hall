import { useCreation, useUpdateEffect } from "ahooks";
import { useMemo } from "react";
import { RegistrationRegisterCommand } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register";
import type { QureauResponse } from "~/_protocols/qureau/tsnode/service/qureau._";
import type { QureauRegistrationServiceRemote } from "~/_protocols/qureau/tsnode/service/registration/qureau.registration.remote";
import {
	type ServiceLocatorState,
	useServiceLocator,
} from "~/ui/data/ServiceLocatorContext";
import { Delay } from "~/ui/debug/Delay";
import { QureauHttpService } from "../QureauHttpService";

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
		const delay = new Delay(Date.now());
		const [url] = resolveUrl(path);
		const response = await (
			await fetch(url, {
				method,
				body,
			})
		).json();

		await delay.pause();
		return response;
	};
}

export type UseQureauRegistrationClientState = {
	service: QureauRegistrationServiceRemote;
};
export const useQureauRegistrationClient =
	(): UseQureauRegistrationClientState => {
		const serviceLocator = useServiceLocator();
		const service = useCreation(
			() => new QureauRegistrationHttpService(serviceLocator),
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
