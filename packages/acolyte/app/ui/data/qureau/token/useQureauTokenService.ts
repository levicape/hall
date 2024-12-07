import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import type { TokenCreateCommand } from "~/_protocols/qureau/tsnode/domain/token/create/token.create.js";
import type { QureauTokenServiceRemote } from "~/_protocols/qureau/tsnode/service/token/qureau.token.remote.js";
import { useQureauTokenClient } from "./QureauTokenHttpService.js";

// biome-ignore lint/complexity/noBannedTypes:
type UseQureauTokenServiceQueryKeys = {};
type UseQureauTokenServiceProps = {
	entityKey: UseQureauTokenServiceQueryKeys;
};

const mutationFns = (service: QureauTokenServiceRemote) => ({
	create: async (request: TokenCreateCommand) => {
		return service.CreateToken(request);
	},
});
const queryFns = (service: QureauTokenServiceRemote) => ({});

export const useQureauTokenService = (
	{ entityKey }: UseQureauTokenServiceProps = {
		entityKey: {},
	},
) => {
	const { service } = useQureauTokenClient();
	const { create } = useMemo(() => mutationFns(service), [service]);

	return {
		create: useMutation({
			scope: {
				id: "token",
			},
			mutationFn: create,
		}),
	};
};
