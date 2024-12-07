// import Button from "_cloudscape/src/button";
// // import {
// // 	Button,
// // 	DescriptionList,
// // 	Divider,
// // 	FormLayout,
// // 	TextField,
// // } from "@shopify/polaris";
// import { useRequest } from "ahooks";
// import {
// 	type FunctionComponent,
// 	type ReactElement,
// 	useCallback,
// 	useEffect,
// 	useMemo,
// 	type useState,
// } from "react";
// import { type Control, useController } from "react-hook-form";
// import { DebugCard } from "~/ui/debug/DebugCard";
// import {
// 	Delay,
// 	INTERACTION_LOAD,
// 	INTERACTION_MICRO,
// 	INTERACTION_NANO,
// 	INTERACTION_SLOW,
// } from "~/ui/debug/Delay";
// import { StateText } from "~/ui/display/StateText";
// import { useServiceLocator } from "../ServiceLocatorContext";
// import { PROFILE_SERVICE_URL } from "./component";
// import type { ProfilesLoadResponse, ProfilesLoadUseState } from "./load";

// type ProfileNamePutRequestBody = {
// 	name?: string;
// };
// type ProfileNamePutRequestFn = (name?: string) => void;
// export type ProfileNamePutState = {
// 	request?: ReturnType<typeof useRequest>;
// 	response?: { profiles: ProfilesLoadResponse["data"]["profiles"][number] };
// 	putProfileName: ProfileNamePutRequestFn;
// };
// export type ProfileNamePutUseState = ReturnType<
// 	typeof useState<ProfileNamePutState | undefined>
// >;

// const ProfileServiceNamePutMethod = "PUT";
// export const ProfileServiceNamePutUrl = () => `${PROFILE_SERVICE_URL}/~/name`;
// const usePutProfileName = (): ProfileNamePutState => {
// 	const { fetch } = useServiceLocator();
// 	const request = useRequest<
// 		NonNullable<ProfileNamePutState>["response"],
// 		Parameters<ProfileNamePutRequestFn>
// 	>(
// 		useCallback(
// 			async (name?: string) => {
// 				const delay = new Delay(Date.now());
// 				const response = await fetch(ProfileServiceNamePutUrl(), {
// 					method: ProfileServiceNamePutMethod,
// 					body: JSON.stringify({
// 						name,
// 					} satisfies ProfileNamePutRequestBody),
// 				});

// 				try {
// 					const json = await response.json();
// 					if (json.data === undefined) {
// 						if (json.error !== undefined) {
// 							throw json.error;
// 						} else {
// 							throw new Error(`Invalid response ${JSON.stringify(json)}`);
// 						}
// 					}

// 					await delay.atLeast(INTERACTION_LOAD / 2);

// 					return json.data;
// 				} catch (e) {
// 					if ((e as unknown as { code: object })?.code !== undefined) {
// 						throw e;
// 					}
// 					throw {
// 						message: e?.toString(),
// 					};
// 				}
// 			},
// 			[fetch],
// 		),
// 		useMemo(
// 			() => ({
// 				manual: true,
// 				debounceWait: INTERACTION_NANO,
// 				debounceMaxWait: INTERACTION_MICRO,
// 				throttleWait: INTERACTION_SLOW,
// 			}),
// 			[],
// 		),
// 	);
// 	const { data, run } = request;

// 	return useMemo(
// 		() => ({ response: data, putProfileName: run, request }),
// 		[data, run, request],
// 	);
// };

// export const ProfileNamePutFormRequest = {
// 	name: "data.profile.name.put.request.name",
// };
// export const ProfileNamePutForm: FunctionComponent<{
// 	control: Control;
// 	state?: ProfileNamePutUseState;
// 	loadProfiles?: ProfilesLoadUseState;
// }> = ({ control, state, loadProfiles }) => {
// 	const [stateProfile, update] = state ?? [];
// 	const { response, putProfileName, request } =
// 		usePutProfileName() ??
// 		({
// 			putProfileName: () => {
// 				console.warn({ ProfileNamePutForm: { putProfileName: "stub" } });
// 			},
// 		} satisfies ReturnType<typeof usePutProfileName>);

// 	const { field: nameField } = useController({
// 		control,
// 		name: ProfileNamePutFormRequest.name,
// 	});

// 	const onFormSubmit = useCallback(
// 		async (event?: { preventDefault: () => void }) => {
// 			event?.preventDefault();
// 			putProfileName(nameField.value);
// 		},
// 		[putProfileName, nameField],
// 	);

// 	const actions: ReactElement[] = useMemo(
// 		() => [
// 			<Button
// 				key={"new"}
// 				variant={"primary"}
// 				loading={request?.loading}
// 				onClick={onFormSubmit}
// 			>
// 				{"data.profile.name.put.request.new"}
// 			</Button>,
// 		],
// 		[onFormSubmit, request?.loading],
// 	);

// 	useEffect(() => {
// 		if (
// 			stateProfile?.request?.loading !== request?.loading ||
// 			stateProfile?.response !== response ||
// 			stateProfile?.putProfileName !== putProfileName
// 		) {
// 			update?.({
// 				request,
// 				response,
// 				putProfileName,
// 			});

// 			const [loadProfilesState] = loadProfiles ?? [];
// 			const { profiles: updated } = response ?? {};
// 			if (loadProfilesState !== undefined && updated !== undefined) {
// 				const profileIds =
// 					loadProfilesState.response?.profiles.map(({ id }) => id) ?? [];

// 				const shouldRefetch = loadProfilesState.response?.profiles?.some(
// 					({ id, versionKey }) => {
// 						return (
// 							id === updated.id &&
// 							Number(versionKey) < Number(updated.versionKey)
// 						);
// 					},
// 				);

// 				if (shouldRefetch) {
// 					loadProfilesState.loadProfiles(profileIds);
// 				}
// 			}
// 		}
// 	}, [
// 		update,
// 		request,
// 		response,
// 		putProfileName,
// 		loadProfiles,
// 		stateProfile?.request,
// 		stateProfile?.response,
// 		stateProfile?.putProfileName,
// 	]);

// 	return (
// 		<DebugCard
// 			title={`${ProfileServiceNamePutMethod} ${ProfileServiceNamePutUrl()}`}
// 			extra={actions}
// 		>
// 			{/* <FormLayout>
// 				<FormLayout.Group title={"data.profile.name.put.request"}>
// 					<DescriptionList
// 						items={[
// 							{
// 								term: "data.profile.name.put.request.state",
// 								description: StateText(
// 									JSON.stringify({ ...request, data: undefined }, null, 2),
// 								),
// 							},
// 							{
// 								term: "data.profile.name.put.request.name",
// 								description: StateText(
// 									JSON.stringify(nameField.value, null, 2),
// 								),
// 							},
// 						]}
// 					/>
// 				</FormLayout.Group>
// 				<FormLayout>
// 					<TextField
// 						autoComplete="off"
// 						label={ProfileNamePutFormRequest.name}
// 						{...nameField}
// 					/>
// 				</FormLayout>
// 				<Divider />
// 				<FormLayout.Group title={"data.profile.name.put.response"}>
// 					<DescriptionList
// 						items={[
// 							{
// 								term: "data.profile.name.put.response.json",
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
