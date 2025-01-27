import { useEffect } from "react";
// import { useForm } from "react-hook-form";
import { DebugCard } from "~/ui/debug/DebugCard.js";
import {
	type ServiceDiscoveryAction,
	type ServiceDiscoveryState,
	useServiceDiscovery,
} from "./reducer.js";

export const ServiceDiscoveryForm = () => {
	const [serviceDiscovery, reducer] = useServiceDiscovery();
	const { routes, version, frontend } = serviceDiscovery ?? {};
	// const { watch } = useForm<ServiceDiscoveryState>({
	// 	mode: "all",
	// 	values: { routes, version, frontend },
	// 	disabled: true,
	// });

	// useEffect(() => {
	// 	return (
	// 		({ unsubscribe }) =>
	// 		() => {
	// 			unsubscribe();
	// 		}
	// 	)(
	// 		watch((formState, { name }) => {
	// 			if (name !== undefined) {
	// 				reducer({
	// 					service: {
	// 						...formState,
	// 					} as ServiceDiscoveryAction["service"],
	// 				});
	// 			}
	// 		}),
	// 	);
	// }, [watch, reducer]);

	return (
		<DebugCard
			title={"store.service.reducer.form"}
			extra={undefined}
			horizontalCollapse
		>
			<pre
				className={
					"max-w-lg break-before-all break-after-all whitespace-pre-wrap text-wrap break-all"
				}
			>
				{JSON.stringify({ routes, version, frontend }, null, 4)}
			</pre>
		</DebugCard>
		// <Form
		//   layout={"vertical"}
		//   variant={"borderless"}
		//   size={"small"}
		// >
		//   <legend>Service context</legend>
		//   <Form.Item<ServiceDiscoveryState>
		//     name={"frontend"}
		//     label={"store.service.frontend"}
		//   >
		//     <Controller
		//       name="frontend"
		//       control={control}
		//       render={({ field: { onChange, value } }) => (
		//         <Input.TextArea
		//           onChange={onChange}
		//           value={JSON.stringify(value)}
		//         />
		//       )}
		//     />
		//   </Form.Item>
		//   <Form.Item<ServiceDiscoveryState>
		//     name={"routes"}
		//     label={"store.service.routes"}
		//   >
		//     <Controller
		//       name="routes"
		//       control={control}
		//       render={({ field: { onChange, value } }) => (
		//         <Input.TextArea
		//           onChange={onChange}
		//           value={JSON.stringify(value)}
		//         />
		//       )}
		//     />
		//   </Form.Item>
		//   <Form.Item<ServiceDiscoveryState>
		//     name={"version"}
		//     label={"store.service.version"}
		//   >
		//     <Controller
		//       name="version"
		//       control={control}
		//       render={({ field: { onChange, value } }) => (
		//         <Input.TextArea
		//           onChange={onChange}
		//           value={JSON.stringify(value)}
		//         />
		//       )}
		//     />
		//   </Form.Item>
		// </Form>
	);
};
