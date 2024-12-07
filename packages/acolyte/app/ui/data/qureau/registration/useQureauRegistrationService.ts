import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import type { RegistrationRegisterCommand } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register.js";
import type { QureauRegistrationServiceRemote } from "~/_protocols/qureau/tsnode/service/registration/qureau.registration.remote.js";
import { useQureauRegistrationClient } from "./QureauRegistrationHttpService.js";

// biome-ignore lint/complexity/noBannedTypes:
type UseQureauRegistrationServiceQueryKeys = {};
type UseQureauRegistrationServiceProps = {
	entityKey: UseQureauRegistrationServiceQueryKeys;
};

const mutationFns = (service: QureauRegistrationServiceRemote) => ({
	register: async (request: RegistrationRegisterCommand) => {
		return service.Register(request);
	},
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const queryFns = (service: QureauRegistrationServiceRemote) => ({});

export const useQureauRegistrationService = (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	{ entityKey }: UseQureauRegistrationServiceProps = {
		entityKey: {},
	},
) => {
	const { service } = useQureauRegistrationClient();
	const { register } = useMemo(() => mutationFns(service), [service]);

	return {
		register: useMutation({
			scope: {
				id: "registration",
			},
			mutationKey: ["register"],
			mutationFn: register,
		}),
	};
};
