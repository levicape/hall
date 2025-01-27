// import SpaceBetween from "@cloudscape-design/components/space-between";
export const InlineStack = (props: {
	children: React.ReactNode;
	justifyContent?:
		| "start"
		| "end"
		| "center"
		| "space-between"
		| "space-around";
	[key: string]: unknown;
}) => {
	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				justifyContent: props.justifyContent ?? "start",
				gap: "0.5rem",
			}}
		>
			{props.children}
		</div>
	);
};
