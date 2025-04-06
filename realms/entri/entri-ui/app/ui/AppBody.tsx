import { clsx } from "clsx";
import {
	ErrorBoundary,
	type FC,
	type PropsWithChildren,
	useMemo,
} from "hono/jsx";
import { AuthnSession } from "../atoms/authentication/behavior/$AuthnSession.js";
import { BackgroundBody } from "../variant/BackgroundBody.js";
import { DesignSystem } from "./DesignSystem.js";
import { CaptureTouchEvents } from "./behavior/$CaptureTouchEvents.js";
import { Skeleton } from "./daisy/feedback/Skeleton.js";
import {
	HeaderLayout,
	HeaderLayoutCssVars,
	type HeaderLayoutProps,
} from "./trim/header/HeaderLayout.js";

const { Shell, ContentLayout, Fallback, Footer } = DesignSystem;
const { SoftLight } = BackgroundBody;

export type AppBodyProps = {
	header?: Exclude<HeaderLayoutProps, "vars"> | false;
};

export const AppBody: FC<PropsWithChildren<AppBodyProps>> = (props) => {
	const { children, header } = props;
	const headerProps = useMemo(() => {
		if (header === false) {
			return {
				drawer: false as const,
			};
		}
		return header;
	}, [header]);
	return (
		<body id="app">
			<Shell>
				<SoftLight />
				<HeaderLayout vars={HeaderLayoutCssVars} {...headerProps}>
					<ErrorBoundary fallback={<Fallback />}>
						<ContentLayout>{children}</ContentLayout>
					</ErrorBoundary>
				</HeaderLayout>
				<Footer />
			</Shell>
			<Skeleton
				className={clsx(
					"h-2.5",
					"opacity-0",
					"-translate-y-1.5",
					"transform-gpu",
					"translate-3d",
					"backface-hidden",
					"scale-y-200",
					"will-change-[opacity,transform,translate]",
					"transition-all",
					"duration-[10s]",
				)}
			/>

			<CaptureTouchEvents />
			<AuthnSession />
		</body>
	);
};
