import { clsx } from "clsx";
import {
	type FC,
	type PropsWithChildren,
	useCallback,
	useContext,
} from "hono/jsx";
import { useOidcClient } from "../../../atoms/authentication/OidcClientAtom.js";
// import { useFormatMessage } from "../../../atoms/localization/I18nAtom.js";
import { Button } from "../../daisy/action/Button.js";
import { HeaderMenuOpenContextExport } from "./HeaderContext.js";

const HeaderMenuOpenContext = HeaderMenuOpenContextExport();

export type HeaderMenuButtonProps = {
	className?: string;
};

export const HeaderMenuButton: FC<PropsWithChildren<HeaderMenuButtonProps>> = (
	props,
) => {
	const { user } = useOidcClient();
	const [menuOpen, setHeaderMenuOpen] = useContext(HeaderMenuOpenContext);

	const { className, children } = props;

	const menuButtonOnClick = useCallback(() => {
		setHeaderMenuOpen();
	}, [setHeaderMenuOpen]);

	return (
		<Button
			role={"menubar"}
			color={"neutral"}
			variant={"ghost"}
			square
			className={clsx(
				menuOpen ? "invisible" : "visible",
				user ? clsx("opacity-100") : clsx("opacity-0"),
				className,
			)}
			onClick={menuButtonOnClick}
		>
			{children}
		</Button>
	);
};
