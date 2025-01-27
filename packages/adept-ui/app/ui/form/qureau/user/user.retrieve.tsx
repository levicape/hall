// import {
// 	Button,
// 	DescriptionList,
// 	Divider,
// 	FormLayout,
// 	TextField,
// } from "@shopify/polaris";
import type { useQuery } from "@tanstack/react-query";
import { type ReactElement, useCallback, useMemo } from "react";
// import type { useForm } from "react-hook-form";
import { z } from "zod";
import type { UserRetrieveCommand } from "~/_protocols/qureau/tsnode/domain/user/retrieve/user.retrieve.js";
import type { QureauResponse } from "~/_protocols/qureau/tsnode/service/qureau._.js";
import { anchorTranslatedElement } from "~/i18n/useTranslatedElement.js";
import { DebugCard } from "~/ui/debug/DebugCard.js";
import { StateText } from "~/ui/display/StateText.js";
import { Button } from "~/ui/input/Button.js";

const useTranslate = anchorTranslatedElement({
	"data.user.retrieve": "Retrieve User",
	"data.user.retrieve.request": "Request",
	"data.user.retrieve.response": "Response",
	"data.user.retrieve.request.state": "State",
	"data.user.retrieve.request.body": "Body",
});

export const UserRetrieveCommandFormZod = z.object({});
export const UserRetrieveCommandValidatorZod = z.object({
	request: z.object({}),
	ext: z.object({
		nonce: z.string().min(1).max(128),
	}),
});

export const QureauRetrieveUserCard = ({
	query,
}: {
	// control: ReturnType<typeof useForm>["control"];
	query: ReturnType<typeof useQuery<QureauResponse, Error>>;
}) => {
	const t = useTranslate("");

	const body = useMemo(() => {
		try {
			const body: UserRetrieveCommand = {
				request: {
					// TODO: UserRetrieveCommand
				} as UserRetrieveCommand["request"],
				ext: {
					nonce: Date.now().toString(),
				},
			};
			return body;
		} catch (e) {
			return {};
		}
	}, []);

	const onClickRetrieveUser = useCallback(async () => {
		const { success, error, data } =
			UserRetrieveCommandValidatorZod.safeParse(body);
		if (success) {
			await query.refetch();
		} else {
			console.error({
				RetrieveUserCard: {
					error,
					data,
					body,
				},
			});
		}
	}, [body, query]);

	const fields = useMemo(() => {
		// eslint-disable-next-line @ts-eslint/no-explicit-any
		return [] as [string, object][];
		// return Object.entries(body).reduce((acc, [key, value]: any) => {
		//   if (typeof value === "string") {
		//     return [
		//       ...acc,
		//       [
		//         key,
		//         useController({
		//           control,
		//           name: key,
		//           defaultValue: value,
		//         }),
		//       ],
		//     ];
		//   }
		// })
	}, []);

	const actions: ReactElement[] = useMemo(
		() => [
			<Button
				key={"new"}
				loading={query.isPending}
				onClick={onClickRetrieveUser}
			>
				{t("data.user.retrieve.request")}
			</Button>,
		],
		[onClickRetrieveUser, query.isPending, t],
	);

	return (
		<DebugCard title={t("data.user.retrieve")} extra={actions}>
			{/* <FormLayout>
				<FormLayout.Group title={t("data.user.load.request")}>
					<DescriptionList
						items={[
							{
								term: t("data.user.retrieve.request.state"),
								description: StateText(
									JSON.stringify({ ...query, data: undefined }, null, 2),
								),
							},

							{
								term: t("data.user.retrieve.request.body"),
								description: StateText(JSON.stringify({ ...body }, null, 2)),
							},
						]}
					/>
					<FormLayout>
						{...fields.map(([key, value]) => {
							return (
								<TextField
									label={t(`data.user.retrieve.request.${key}`)}
									autoComplete="off"
									key={key}
									{...value}
								/>
							);
						})}
					</FormLayout>
				</FormLayout.Group>
				<Divider />
				<FormLayout.Group title={t("data.user.retrieve.response")}>
					<DescriptionList
						items={[
							{
								term: t("data.user.retrieve.response.json"),
								description: StateText(
									JSON.stringify(
										useMemo(() => ({ ...(query.data ?? {}) }), [query.data]),
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
