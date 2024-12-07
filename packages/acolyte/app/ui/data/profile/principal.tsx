import { useMemo } from "react";
import { useAuthenticationState } from "~/ui/store/authentication/reducer";
import { useAutomaticProfilesFetch } from "./load.js";

type ProfilesFetchState = Parameters<typeof useAutomaticProfilesFetch>["1"];
export type UsePrincipalProfileProps = {
	useLoadProfilesState: ProfilesFetchState["useLoadProfilesState"];
};

export const usePrincipalProfile = ({
	useLoadProfilesState,
}: UsePrincipalProfileProps) => {
	const [authentication] = useAuthenticationState();
	const { id: principalId, ready } = authentication ?? {};
	const [profiles] = useLoadProfilesState;

	const profileIds = useMemo(() => {
		if (principalId) {
			return [principalId];
		} else {
			return [];
		}
	}, [principalId]);
	const shouldLoadProfiles = useMemo(() => {
		if (ready === true) {
			const { response } = profiles ?? {};
			if (
				response?.profiles.some(({ id }) => {
					return id === principalId;
				})
			) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}, [principalId, profiles, ready]);
	const opts = useMemo(() => {
		return {
			useLoadProfilesState,
			shouldLoadProfiles,
		};
	}, [useLoadProfilesState, shouldLoadProfiles]);

	useAutomaticProfilesFetch(profileIds, opts);

	const profile = useMemo(() => {
		const [state] = useLoadProfilesState;
		return state?.response?.profiles?.find(({ id }) => {
			return id === principalId;
		});
	}, [useLoadProfilesState, principalId]);

	return useMemo(
		() => ({
			principal: {
				profile,
			},
		}),
		[profile],
	);
};
