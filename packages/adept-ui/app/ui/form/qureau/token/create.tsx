// import {
// 	Button,
// 	DescriptionList,
// 	Divider,
// 	FormLayout,
// 	TextField,
// } from "@shopify/polaris";
// import Button from "@cloudscape-design/components/button";
import type { useMutation } from "@tanstack/react-query";
import { type ReactElement, useCallback, useMemo } from "react";
// import type { useForm } from "react-hook-form";
import { z } from "zod";
import type { TokenCreateCommand } from "~/_protocols/qureau/ts/domain/token/create/token.create.js";
import type { QureauResponse } from "~/_protocols/qureau/ts/service/qureau._.js";
import { anchorTranslatedElement } from "~/i18n/useTranslatedElement.js";
import { DebugCard } from "~/ui/debug/DebugCard.js";
import { StateText } from "~/ui/display/StateText.js";

const Button = (props: any) => {
	return <button {...props} />;
};

const useTranslate = anchorTranslatedElement({
	"data.token.create": "Create Token",
	"data.token.create.request": "Request",
	"data.token.create.response": "Response",
	"data.token.create.request.state": "State",
	"data.token.create.request.body": "Body",
});

export const TokenCreateCommandFormZod = z.object({});
export const TokenCreateCommandValidatorZod = z.object({
	request: z.object({}),
	ext: z.object({
		nonce: z.string().min(1).max(128),
	}),
});

export const QureauCreateTokenCard = ({
	mutation,
}: {
	// control: ReturnType<typeof useForm>["control"];
	mutation: ReturnType<
		typeof useMutation<QureauResponse, Error, TokenCreateCommand, unknown>
	>;
}) => {
	const t = useTranslate("");

	const body = useMemo(() => {
		try {
			const body: TokenCreateCommand = {
				request: {},
				ext: {
					nonce: Date.now().toString(),
				},
			};
			return body;
		} catch (e) {
			return {};
		}
	}, []);

	const onClickCreateToken = useCallback(async () => {
		const { success, error, data } =
			TokenCreateCommandValidatorZod.safeParse(body);
		if (success) {
			await mutation.mutateAsync({
				...data,
			});
		} else {
			console.error({
				CreateTokenCard: {
					error,
					data,
					body,
				},
			});
		}
	}, [mutation, body]);

	const fields = useMemo(() => {
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
				variant={"primary"}
				loading={mutation.isPending}
				onClick={onClickCreateToken}
			>
				{t("data.token.create.request")}
			</Button>,
		],
		[onClickCreateToken, mutation.isPending, t],
	);

	return (
		<DebugCard title={t("data.token.create")} extra={actions}>
			{/* <FormLayout>
				<FormLayout.Group title={t("data.token.load.request")}>
					<DescriptionList
						items={[
							{
								term: t("data.token.create.request.state"),
								description: StateText(
									JSON.stringify({ ...mutation, data: undefined }, null, 2),
								),
							},

							{
								term: t("data.token.create.request.body"),
								description: StateText(JSON.stringify({ ...body }, null, 2)),
							},
						]}
					/>
					<FormLayout>
						{...fields.map(([key, value]) => {
							return (
								<TextField
									label={t(`data.token.create.request.${key}`)}
									autoComplete="off"
									key={key}
									{...value}
								/>
							);
						})}
					</FormLayout>
				</FormLayout.Group>
				<Divider />
				<FormLayout.Group title={t("data.token.create.response")}>
					<DescriptionList
						items={[
							{
								term: t("data.token.create.response.json"),
								description: StateText(
									JSON.stringify(
										useMemo(
											() => ({ ...(mutation.data ?? {}) }),
											[mutation.data],
										),
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
