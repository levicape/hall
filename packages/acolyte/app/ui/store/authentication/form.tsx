import { useEffect } from "react";
// import { useForm } from "react-hook-form";
import { DebugCard } from "~/ui/debug/DebugCard.js";
import {
	type AuthenticationAction,
	type AuthenticationState,
	useAuthenticationState,
} from "./reducer.js";

const DEFAULT: ReturnType<typeof useAuthenticationState> = [
	{ id: "", token: "" },
	() => {},
] as const;
export type AuthenticationFormProps = { readonly?: boolean };
export const AuthenticationForm = () => {
	const [state, reducer] = useAuthenticationState() ?? DEFAULT;
	// const { watch } = useForm<Partial<AuthenticationState>>({
	// 	mode: "all",
	// 	values: state,
	// });

	// useEffect(() => {
	// 	return (
	// 		({ unsubscribe }) =>
	// 		() => {
	// 			unsubscribe();
	// 		}
	// 	)(
	// 		// watch((formState, { name }) => {
	// 		// 	if (name !== undefined) {
	// 		// 		reducer({
	// 		// 			authentication: {
	// 		// 				...formState,
	// 		// 				token: "",
	// 		// 			},
	// 		// 		} satisfies AuthenticationAction);
	// 		// 	}
	// 		//pnpm iu }),
	// 	);
	// }, [watch, reducer]);

	return (
		<DebugCard
			title={`store.authentication.reducer.form`}
			extra={undefined}
			horizontalCollapse
		>
			<pre
				className={
					"max-w-lg break-before-all break-after-all whitespace-pre-wrap text-wrap break-all"
				}
			>
				{JSON.stringify(state, null, 4)}
			</pre>
		</DebugCard>
		// <Form
		//   layout={"vertical"}
		//   variant={"borderless"}
		//   size={"small"}
		// >
		//   <legend>Authentication context</legend>
		//   <Form.Item
		//     name={"id"}
		//     label={"store.authentication.id"}
		//   >
		//     <Controller
		//       name="id"
		//       control={control}
		//       render={({ field: { onChange, value } }) => (
		//         <Input
		//           onChange={onChange}
		//           value={value}
		//           disabled={readonly === true}
		//         />
		//       )}
		//     />
		//   </Form.Item>
		//   <Form.Item
		//     name={"token"}
		//     label={"store.authentication.token"}
		//   >
		//     <Controller
		//       name="token"
		//       control={control}
		//       render={({ field: { onChange, value } }) => (
		//         <Input.TextArea
		//           disabled
		//           onChange={onChange}
		//           value={value}
		//         />
		//       )}
		//     />
		//   </Form.Item>
		// </Form>
	);
};
