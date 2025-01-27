// import SpaceBetween from "@cloudscape-design/components/space-between";

const SpaceBetween = (props: {
	children: React.ReactNode;
	[key: string]: unknown;
}) => {
	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				justifyContent: "space-between",
				gap: "0.5rem",
			}}
		>
			{props.children}
		</div>
	);
};

export const BlockStack = (props: {
	children: React.ReactNode;
	[key: string]: unknown;
}) => {
	return (
		<div suppressHydrationWarning>
			<SpaceBetween size={"m"} {...props} />
		</div>
	);
};
