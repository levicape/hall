// import Box from "@cloudscape-design/components/box";

const Box = (props: {} & { children?: React.ReactNode }) => {
	return <div>{props.children}</div>;
};

export const Bleed = (props: {
	children?: React.ReactNode;
	[key: string]: unknown;
}) => {
	return <Box>{props.children}</Box>;
};
