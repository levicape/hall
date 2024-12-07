import clsx from "clsx";
import type {
	ButtonHTMLAttributes,
	FunctionComponent,
	PropsWithChildren,
} from "react";

export const Button: FunctionComponent<
	PropsWithChildren<
		ButtonHTMLAttributes<HTMLButtonElement> & {
			loading?: boolean;
		}
	>
> = ({ children, className, ...buttonProps }) => {
	return (
		<button
			className={clsx(
				"border",
				"border-white",
				"border-opacity-40",
				"px-4",
				"py-2",
				"font-bold",
				"text-white",
				"hover:bg-zinc-800",
				className,
				buttonProps.disabled ? "bg-zinc-800" : "bg-zinc-900",
				buttonProps.loading ? "animate-pulse" : "",
				className,
			)}
			{...buttonProps}
		>
			{children}
		</button>
	);
};
