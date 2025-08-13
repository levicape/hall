import { clsx } from "clsx";
import { type FC, Fragment, type PropsWithChildren, useMemo } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { ApplicationHead } from "../../../variant/ApplicationHead.js";
import { HeaderDrawer, type HeaderDrawerProps } from "./$HeaderDrawer.js";

export type HeaderLayoutProps = {
	drawer?: false | Exclude<HeaderDrawerProps, "vars" | "requestPath">;
	vars: {
		appHeight: string;
	};
};

export const HeaderLayoutCssVars = {
	appHeight: "--app-height",
} as const;

export const HeaderLayout: FC<PropsWithChildren<HeaderLayoutProps>> = (
	props,
) => {
	const c = useRequestContext();
	const { vars, children, drawer } = props;
	const { appHeight } = vars;
	const style = useMemo(() => {
		return { height: `var(${appHeight})` };
	}, [appHeight]);
	return (
		<div style={style}>
			{/* <!-- Header --> */}
			{drawer !== false ? (
				<HeaderDrawer vars={vars} requestPath={c?.req?.path} {...drawer}>
					{ApplicationHead.title.default}
				</HeaderDrawer>
			) : (
				<Fragment />
			)}
			<div
				className={clsx(
					"m-auto",
					"-mt-1",
					"max-w-5xl",
					"pb-1",
					"md:p-3",
					"md:pb-1",
				)}
			>
				{children}
			</div>
		</div>
	);
};
