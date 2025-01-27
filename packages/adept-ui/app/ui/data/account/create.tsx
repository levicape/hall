// import {
// 	Button,
// 	DescriptionList,
// 	Divider,
// 	FormLayout,
// 	TextField,
// } from "@shopify/polaris";
import { useRequest } from "ahooks";
import {
	type FunctionComponent,
	useCallback,
	useMemo,
	type useState,
} from "react";
// import { type Control, useController } from "react-hook-form";
import { RegistrationRegisterCommand } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register";
import type { RegistrationRegisterUserRequest } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register.user._.request";
import type { RegistrationRegisterUserRegistrationRequest } from "~/_protocols/qureau/tsnode/domain/registration/register/registration.register.user.registration.request";
import { useServiceLocator } from "~/ui/data/ServiceLocatorContext";
import { DebugCard } from "~/ui/debug/DebugCard";
import { Delay, INTERACTION_SPIN } from "~/ui/debug/Delay";
import { useAuthenticationState } from "~/ui/store/authentication/reducer";
import { useQureauRegistrationClient } from "../qureau/registration/QureauRegistrationHttpService.js";

const ACCOUNTS_CREATE_URL = `/~/v1/Qureau/Users/Registration/!+!/`;
type AccountPostResponse = {
	data: {
		authentication: {
			id: string;
			token: string;
			refresh: string;
		};
	};
	error?: {
		code: number;
		error: string;
		message: string;
	};
};

export type AccountCreateState = {
	request: ReturnType<typeof useRequest>;
	account?: AccountPostResponse["data"];
	createAccount: () => void;
};
export type CreateAccountUseState = ReturnType<
	typeof useState<AccountCreateState | undefined>
>;

const useCreateAccount = (): AccountCreateState => {
	const { fetch } = useServiceLocator();
	const qureauService = useQureauRegistrationClient();
	const request = useRequest<AccountPostResponse["data"], []>(
		useCallback(async () => {
			const delay = new Delay(Date.now());
			try {
				const response = (
					await qureauService.service.Register(
						RegistrationRegisterCommand.toJSON({
							request: {
								user: {
									username: Date.now().toString(),
									password: `asdfpassword!2P`,
								} as RegistrationRegisterUserRequest,
								registration: {
									applicationId: "tsk",
								} as RegistrationRegisterUserRegistrationRequest,
								generateAuthenticationToken: true,
								disableDomainBlock: false,
								sendSetPasswordEmail: false,
								skipVerification: false,
								skipRegistrationVerification: false,
								eventInfo: undefined,
							},
							ext: {
								nonce: "nonce",
							},
						} satisfies RegistrationRegisterCommand) as RegistrationRegisterCommand,
					)
				).response;
				if (response?.$case === "error") {
					throw response.value;
				}
				if (response?.value?.qureau?.$case !== "registration") {
					// TODO: Global protobuf error handling
					throw new Error();
				}

				await delay.atLeast(INTERACTION_SPIN);

				return {
					authentication: {
						id:
							response?.value?.qureau?.value.registration?.value.registered
								?.user?.id ?? "userId",
						token:
							response?.value?.qureau?.value.registration?.value.registered
								?.token ?? "access",
						refresh:
							response?.value?.qureau?.value.registration?.value.registered
								?.refreshToken ?? "refresh",
					},
				};
			} catch (error) {
				throw {
					error,
					message: error?.toString(),
				};
			}
		}, [qureauService]),
		useMemo(
			() => ({
				manual: true,
				throttleWait: 2000,
			}),
			[],
		),
	);

	const { data, run } = request;
	return useMemo(
		() => ({
			account: data,
			createAccount: run,
			request,
		}),
		[data, request, run],
	);
};

export const ACCOUNT_CREATE_REQUEST_FORM = {
	name: "data.account.create.request.name",
};

export const AccountCreateForm: FunctionComponent<{
	state?: CreateAccountUseState;
	// control?: Control;
}> = (props) => {
	// const { state, control } = props;
	// const [create, update] = state ?? [];
	const [authentication, dispatch] = useAuthenticationState() ?? [];
	const { account, createAccount, request } = useCreateAccount();
	// const { field: nameField } = useController({
	// 	control,
	// 	name: ACCOUNT_CREATE_REQUEST_FORM.name,
	// });
	// @@@biome-ignore lint/suspicious/noExplicitAny:
	// delete (nameField as unknown as any).ref;

	const {
		authentication: { id },
	} = account ?? { authentication: {} };

	const onFormSubmit = useCallback(async () => {
		createAccount();
	}, [createAccount]);

	// const accountActions: ReactElement[] = useMemo(
	// 	() => [
	// 		<Button
	// 			key={"new"}
	// 			variant={"primary"}
	// 			loading={create?.request.loading}
	// 			onClick={onFormSubmit}
	// 		>
	// 			{"data.accounts.create.request.new"}
	// 		</Button>,
	// 	],
	// 	[onFormSubmit, create?.request.loading],
	// );

	// useEffect(() => {
	// 	if (
	// 		create === undefined ||
	// 		account !== state?.[0]?.account ||
	// 		request.loading !== state?.[0]?.request.loading ||
	// 		createAccount !== state?.[0]?.createAccount
	// 	) {
	// 		update?.({
	// 			request,
	// 			account,
	// 			createAccount,
	// 		});
	// 	}

	// 	if (account !== undefined) {
	// 		const { id, token, refresh } = authentication ?? {};
	// 		if (
	// 			account.authentication.id !== id ||
	// 			account.authentication.token !== token ||
	// 			account.authentication.refresh !== refresh
	// 		) {
	// 			dispatch?.({
	// 				...account,
	// 			});
	// 		}
	// 	}
	// }, [
	// 	update,
	// 	create,
	// 	account,
	// 	state,
	// 	createAccount,
	// 	dispatch,
	// 	request,
	// 	authentication,
	// ]);

	return (
		<DebugCard title={`POST ${ACCOUNTS_CREATE_URL} API`} extra={<>{}</>}>
			{/* <FormLayout>
				<FormLayout.Group title={"data.account.create.request"}>
					<DescriptionList
						items={[
							{
								term: "data.account.create.request.state",
								description: StateText(
									JSON.stringify({ ...request, data: undefined }, null, 2),
								),
							},
						]}
					/>
					<FormLayout>
						<TextField
							autoComplete="off"
							label={ACCOUNT_CREATE_REQUEST_FORM.name}
							{...nameField}
						/>
					</FormLayout>
				</FormLayout.Group>
				<Divider />
				<FormLayout.Group title={"data.account.create.response"}>
					<DescriptionList
						items={[
							{
								term: "data.account.create.response.json",
								description: StateText(JSON.stringify({ ...account }, null, 2)),
							},
							{
								term: "data.account.create.response.account_id",
								description: id,
							},
						]}
					/>
				</FormLayout.Group>
			</FormLayout> */}
		</DebugCard>
	);
};
