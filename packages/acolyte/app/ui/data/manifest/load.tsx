import Button from "@cloudscape-design/components/button";
// import { Button, DescriptionList, Divider, FormLayout } from "@shopify/polaris";
import { useRequest } from "ahooks";
import {
	type FunctionComponent,
	type ReactElement,
	useCallback,
	useEffect,
	useMemo,
	type useState,
} from "react";
import { DebugCard } from "~/ui/debug/DebugCard";
import { Delay, INTERACTION_LOAD } from "~/ui/debug/Delay";
import { StateText } from "~/ui/display/StateText";
import { useAuthenticationState } from "~/ui/store/authentication/reducer";
import {
	type HttpServiceDiscoveryRoute,
	type Routes,
	useServiceDiscovery,
} from "~/ui/store/service/reducer";
import { useServiceLocator } from "../ServiceLocatorContext";
import {
	type MANIFEST_ASSET_PATH,
	MANIFEST_METHOD,
	MANIFEST_RESPONSE_DATA,
} from "./component";

export type ManifestComputeId = string;
export type ManifestLoadUrl =
	`/~/v1/Worlds/Manifests/${ManifestComputeId}/manifest`;
export const ManifestLoadUrl = (computeId: ManifestComputeId) =>
	`/~/v1/Worlds/Manifests/${computeId}/manifest` as const;
export type ManifestAssetPath = typeof MANIFEST_ASSET_PATH;
export type ManifestLoadResponse = {
	[MANIFEST_RESPONSE_DATA]: {
		manifest: {
			ok: true;
			routes: Routes;
			frontend?: {
				dns?: {
					website: HttpServiceDiscoveryRoute;
				};
				hostnames: string[];
			};
			version: { sequence: string; build: string; stage: string };
		};
	};
};

export type ManifestLoadState = {
	request?: ReturnType<typeof useRequest>;
	response?: ManifestLoadResponse[typeof MANIFEST_RESPONSE_DATA];
	loadManifest: (manifestId: string) => void;
};
export type ManifestLoadUseState = ReturnType<
	typeof useState<ManifestLoadState | undefined>
>;

const useLoadManifest = (): ManifestLoadState => {
	const { fetch } = useServiceLocator();
	const request = useRequest<
		ManifestLoadResponse[typeof MANIFEST_RESPONSE_DATA],
		[ManifestComputeId]
	>(
		useCallback(
			async (computeId: ManifestComputeId) => {
				const delay = new Delay(Date.now());
				const response = await fetch(ManifestLoadUrl(computeId), {
					method: MANIFEST_METHOD,
				});

				try {
					const json = await response.json();
					if (json[MANIFEST_RESPONSE_DATA] === undefined) {
						if (json.error !== undefined) {
							throw json.error;
						} else {
							throw new Error(`Invalid response ${JSON.stringify(json)}`);
						}
					}

					await delay.atLeast(INTERACTION_LOAD);

					return json[MANIFEST_RESPONSE_DATA];
				} catch (e) {
					throw {
						message: e?.toString(),
					};
				}
			},
			[fetch],
		),
		useMemo(
			() => ({
				manual: true,
				throttleWait: 1000,
			}),
			[],
		),
	);
	const { data, run } = request;
	return useMemo(
		() => ({ response: data, loadManifest: run, request }),
		[data, run, request],
	);
};

export const useAutomaticManifestFetch = ({
	shouldLoadManifest,
	useLoadManifestState,
}: {
	shouldLoadManifest: boolean;
	useLoadManifestState: ManifestLoadUseState;
}) => {
	const [authentication] = useAuthenticationState();
	const loading = useLoadManifestState[0]?.request?.loading;
	useEffect(() => {
		if (shouldLoadManifest && loading === false) {
			if (authentication?.token !== undefined) {
				useLoadManifestState[0]?.loadManifest("useAutomaticManifestFetch");
			}
		}
	}, [
		shouldLoadManifest,
		useLoadManifestState,
		loading,
		authentication?.token,
	]);
};

export type ManifestLoadFormProps = {
	state?: ManifestLoadUseState;
};
export const ManifestLoadForm: FunctionComponent<ManifestLoadFormProps> = (
	props: ManifestLoadFormProps,
) => {
	const { state } = props;
	const [stateManifest, update] = state ?? [];
	const [service, dispatch] = useServiceDiscovery() ?? [{}];
	const { response, loadManifest, request } =
		useLoadManifest() ??
		({
			loadManifest: () => {
				console.warn({ ManifestLoadForm: { loadManifest: "stub" } });
			},
		} satisfies ReturnType<typeof useLoadManifest>);
	const { version: storeVersion } = service ?? {};
	const { manifest } = response ?? {};

	const onFormSubmit = useCallback(
		async (event?: { preventDefault: () => void }) => {
			event?.preventDefault();
			loadManifest("onFormSubmit");
		},
		[loadManifest],
	);

	const actions: ReactElement[] = useMemo(
		() => [
			<Button
				key={"new"}
				variant={"primary"}
				loading={request?.loading}
				onClick={onFormSubmit}
			>
				{"data.manifest.load.request.new"}
			</Button>,
		],
		[onFormSubmit, request?.loading],
	);

	useEffect(() => {
		if (
			stateManifest?.request?.loading !== request?.loading ||
			stateManifest?.response !== response ||
			stateManifest?.loadManifest !== loadManifest
		) {
			update?.({
				request,
				response,
				loadManifest,
			});
		}

		if (
			manifest !== undefined &&
			storeVersion?.sequence !== manifest.version.sequence
		) {
			dispatch?.({
				manifest: {
					manifest: {
						...manifest,
						ok: true,
					},
				},
			});
		}
	}, [
		update,
		request,
		response,
		manifest,
		loadManifest,
		dispatch,
		stateManifest?.request,
		stateManifest?.response,
		stateManifest?.loadManifest,
		storeVersion?.sequence,
	]);

	return (
		<DebugCard title={`POST ${ManifestLoadUrl(":computeId")}`} extra={actions}>
			{/* <FormLayout>
				<FormLayout.Group title={"data.manifest.load.request"}>
					<DescriptionList
						items={[
							{
								term: "data.manifest.load.request.state",
								description: StateText(
									JSON.stringify({ ...request, data: undefined }, null, 2),
								),
							},
						]}
					/>
				</FormLayout.Group>
				<Divider />
				<FormLayout.Group title={"data.manifest.load.response"}>
					<DescriptionList
						items={[
							{
								term: "data.manifest.load.response.json",
								description: StateText(
									JSON.stringify(
										useMemo(() => ({ ...manifest }), [manifest]),
										null,
										4,
									),
								),
							},
						]}
					/>
				</FormLayout.Group>
			</FormLayout> */}
		</DebugCard>
	);
};
