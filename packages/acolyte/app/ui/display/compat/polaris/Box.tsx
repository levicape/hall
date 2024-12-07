// import CsBox from "@cloudscape-design/components/box";
import clsx from "clsx";

const CsBox = (props: {
	children?: React.ReactNode;
	background?: string;
	className?: string;
	[key: string]: unknown;
}) => {
	const { children, background, className } = props;
	return (
		<div className={clsx(className, background)}>{children}</div>
	);
}

export const Box = (props: {
	children?: React.ReactNode;
	background?: string;
	className?: string;
	[key: string]: unknown;
}) => {
	const { minWidth, minHeight, background, className } = {
		minHeight: "unset",
		minWidth: "6em",
		...props,
	};
	return (
		<div
			style={{ minWidth, minHeight }}
			className={clsx(className, background)}
		>
			<CsBox color={"text-status-success"} {...props} />
		</div>
	);
};
