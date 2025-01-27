// import {
// 	Button,
// 	DescriptionList,
// 	Divider,
// 	FormLayout,
// 	TextField,
// } from "@shopify/polaris";
import { useRequest } from "ahooks";
import { useCallback, useEffect, useMemo, type useState } from "react";
// import { type Control, useController } from "react-hook-form";
import type { UserRetrieveWithIdResponse_UserResponse } from "~/_protocols/qureau/tsnode/domain/user/retrieveWithId/user.retrieveWithId.js";
import {
	Delay,
	INTERACTION_LOAD,
	INTERACTION_MICRO,
	INTERACTION_NANO,
} from "~/ui/debug/Delay.js";
import { useAuthenticationState } from "~/ui/store/authentication/reducer.js";
import { useServiceLocator } from "../ServiceLocatorContext.js";
import type { AccountCreateState } from "../account/create.js";
import { useQureauUserClient } from "../qureau/user/QureauUserHttpService.js";
import { PROFILE_SERVICE_URL } from "./component.js";

export interface ProfilesLoadResponse {
	data: {
		profiles: Array<{
			id: NonNullable<AccountCreateState["account"]>["authentication"]["id"];
			name: string;
			anonymous: boolean;
			versionKey: string;
		}>;
	};
}
export const ProfileServiceLoadRequestMethod = "POST";
export type ProfileServiceLoadRequestBody = {
	profileIds: Array<string>;
};
type Profile = ProfilesLoadResponse["data"]["profiles"][number];

export type ProfilesLoadState = {
	request?: ReturnType<typeof useRequest>;
	response?: ProfilesLoadResponse["data"];
	loadProfiles: (profileIds: Array<Profile["id"]>) => void;
};
export type ProfilesLoadUseState = ReturnType<
	typeof useState<ProfilesLoadState | undefined>
>;

let __debounceSet: Set<Profile["id"]> | null = new Set();
export const ProfileServiceLoadUrl = () => `${PROFILE_SERVICE_URL}/*/`;

const useLoadProfiles = (): ProfilesLoadState => {
	const { fetch } = useServiceLocator();

	const qureauUserService = useQureauUserClient();
	const request = useRequest<ProfilesLoadResponse["data"], []>(
		useCallback(async () => {
			const [...profileIds] = __debounceSet ?? [];
			__debounceSet = null;
			const delay = new Delay(Date.now());

			try {
				const response = await qureauUserService.service.PrincipalUser({
					request: {
						userId: profileIds[0],
						qqTenantId: "qqTenantId",
					},
					ext: {
						nonce: "nonce",
					},
				});
				await delay.atLeast(INTERACTION_LOAD);
				if (
					response.response?.$case === "error" ||
					response.response?.value?.qureau?.$case !== "user"
				) {
					throw new Error();
				}
				const messages = response.response?.value.qureau?.value?.user;
				let user: UserRetrieveWithIdResponse_UserResponse | undefined;
				let parsedId = "";
				if (messages?.$case === "retrieveWithId") {
					parsedId = messages.value.withId?.id ?? "";
					user = messages.value.withId;
				} else {
					throw new Error();
				}
				parsedId = parsedId?.replace("qureau@", "").replaceAll("|", "");

				return {
					profiles: [
						...(user !== undefined
							? [
									{
										id: parsedId ?? "id",
										name: user.username ?? "name",
										anonymous: user?.verified ?? false,
										versionKey: Date.now().toString() ?? "versionKey",
									},
								]
							: []),
					],
				};
			} catch (e) {
				throw {
					message: e?.toString(),
				};
			} finally {
				__debounceSet = new Set();
			}
		}, [qureauUserService]),
		useMemo(
			() => ({
				manual: true,
				debounceWait: INTERACTION_NANO,
				debounceMaxWait: INTERACTION_MICRO,
				throttleWait: INTERACTION_MICRO * 2,
			}),
			[],
		),
	);
	const { data, run } = request;
	const loadProfiles = useCallback(
		(...args: Parameters<ProfilesLoadState["loadProfiles"]>) => {
			args[0].forEach((profileId) => {
				if (__debounceSet !== null && !__debounceSet.has(profileId)) {
					__debounceSet.add(profileId);
					run();
				}
			});
		},
		[run],
	);

	return useMemo(
		() => ({ response: data, loadProfiles, request }),
		[data, loadProfiles, request],
	);
};

export const useAutomaticProfilesFetch = (
	profileIds: Array<Profile["id"]>,
	{
		shouldLoadProfiles,
		useLoadProfilesState,
	}: {
		shouldLoadProfiles: boolean;
		useLoadProfilesState: ProfilesLoadUseState;
	},
) => {
	const [authentication] = useAuthenticationState();
	const loading = useLoadProfilesState[0]?.request?.loading;
	useEffect(() => {
		if (shouldLoadProfiles && loading === false) {
			if (authentication?.token !== undefined) {
				useLoadProfilesState[0]?.loadProfiles(profileIds);
			}
		}
	}, [
		shouldLoadProfiles,
		useLoadProfilesState,
		loading,
		authentication?.token,
		profileIds,
	]);
};

// export const ProfilesLoadFormRequest = {
// 	profileIds: "data.profiles.load.request.profileIds",
// };
// export const ProfilesLoadForm: FunctionComponent<{
// 	control: Control;
// 	state?: ProfilesLoadUseState;
// }> = ({ control, state }) => {
// 	const [stateProfile, update] = state ?? [];
// 	const { response, loadProfiles, request } =
// 		useLoadProfiles() ??
// 		({
// 			loadProfiles: () => {
// 				console.warn({ ProfilesLoadForm: { loadProfiles: "stub" } });
// 			},
// 		} satisfies ReturnType<typeof useLoadProfiles>);

// 	const { field: profileIdsField } = useController({
// 		control,
// 		name: ProfilesLoadFormRequest.profileIds,
// 	});

// 	const parsedProfileIds = useMemo(() => {
// 		let parsedIds: string[] = [];
// 		const { value } = profileIdsField;
// 		try {
// 			parsedIds = JSON.parse(`[${value}]`) as Array<Profile["id"]>;
// 			parsedIds = parsedIds.filter((v) => {
// 				return !(v === undefined || typeof v !== "string" || v.length <= 0);
// 			});
// 		} catch (e) {
// 			parsedIds = [];
// 		}
// 		return parsedIds;
// 	}, [profileIdsField]);

// 	const onFormSubmit = useCallback(
// 		async (event?: { preventDefault: () => void }) => {
// 			event?.preventDefault();
// 			loadProfiles(parsedProfileIds);
// 		},
// 		[loadProfiles, parsedProfileIds],
// 	);

// 	const actions: ReactElement[] = useMemo(
// 		() => [
// 			<Button
// 				key={"new"}
// 				variant={"primary"}
// 				loading={request?.loading}
// 				onClick={onFormSubmit}
// 			>
// 				{"data.profiles.load.request.new"}
// 			</Button>,
// 		],
// 		[onFormSubmit, request?.loading],
// 	);

// 	useEffect(() => {
// 		if (
// 			stateProfile?.request?.loading !== request?.loading ||
// 			stateProfile?.response !== response ||
// 			stateProfile?.loadProfiles !== loadProfiles
// 		) {
// 			update?.({
// 				request,
// 				response,
// 				loadProfiles,
// 			});
// 		}
// 	}, [
// 		update,
// 		request,
// 		response,
// 		loadProfiles,
// 		stateProfile?.request,
// 		stateProfile?.response,
// 		stateProfile?.loadProfiles,
// 	]);

// 	return (
// 		<DebugCard
// 			title={`${ProfileServiceLoadRequestMethod} ${ProfileServiceLoadUrl()}`}
// 			extra={actions}
// 		>
// 			{/* <FormLayout>
// 				<FormLayout.Group title={"data.profiles.load.request"}>
// 					<DescriptionList
// 						items={[
// 							{
// 								term: "data.profiles.load.request.state",
// 								description: StateText(
// 									JSON.stringify({ ...request, data: undefined }, null, 2),
// 								),
// 							},
// 							{
// 								term: "data.profiles.load.request.profileIds",
// 								description: StateText(
// 									JSON.stringify({ parsedProfileIds }, null, 2),
// 								),
// 							},
// 						]}
// 					/>
// 					<FormLayout>
// 						<TextField
// 							autoComplete="off"
// 							label={ProfilesLoadFormRequest.profileIds}
// 							{...profileIdsField}
// 						/>
// 					</FormLayout>
// 				</FormLayout.Group>
// 				<Divider />
// 				<FormLayout.Group title={"data.profiles.load.response"}>
// 					<DescriptionList
// 						items={[
// 							{
// 								term: "data.profiles.load.response.json",
// 								description: StateText(
// 									JSON.stringify(
// 										useMemo(() => ({ ...response }), [response]),
// 										null,
// 										4,
// 									),
// 								),
// 							},
// 						]}
// 					/>
// 				</FormLayout.Group>
// 			</FormLayout> */}
// 		</DebugCard>
// 	);
// };
