import {
	type FunctionComponent,
	type MouseEventHandler,
	type PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { DebugContext } from "./DebugContext.js";
// import {
// 	BlockStack,
// 	Card,
// 	CardProps,
// 	Collapsible,
// 	InlineGrid,
// 	Text,
// } from "@shopify/polaris";

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

export type DebugCardProps = PropsWithChildren<{
	title: string;
	extra: React.ReactNode;
	horizontalCollapse?: boolean;
}>;
export const DebugCard: FunctionComponent<DebugCardProps> = (props) => {
	const [hidden, setHidden] = useState(false);
	const globalDebug = useContext(DebugContext);
	const exceptChildren = useMemo(
		() => ({
			...props,
			title: undefined,
			children: undefined,
		}),
		[props],
	);

	const toggleHiddenOnClick: MouseEventHandler = useCallback((event) => {
		event.preventDefault();
		setHidden((h) => !h);
	}, []);

	const captureClick: MouseEventHandler = useCallback((event) => {
		event.preventDefault();
		event.stopPropagation();
	}, []);

	const { title, extra, horizontalCollapse } = props;

	return (
		<div
			className={`mb-4 ml-4 ${
				horizontalCollapse === true
					? hidden
						? ""
						: "max-w-32"
					: "min-w-[65vh]"
			} ${globalDebug ? "" : "hidden"}`}
			style={{ zIndex: "var(--p-z-index-9)" }}
		>
			{props.children}
			{/* <Card {...exceptChildren}>
				<BlockStack gap={"200"}>
					<span className={"cursor-context-menu"} onClick={toggleHiddenOnClick}>
						<InlineGrid columns="1fr auto" gap={"800"}>
							<Text
								as={"strong"}
								variant={horizontalCollapse && !hidden ? "bodySm" : "headingMd"}
							>
								<span className={"cursor-context-menu"}>
									{horizontalCollapse && !hidden
										? title.split(".").at(1)
										: title}
								</span>
							</Text>
							<span onClick={captureClick}>{extra}</span>
						</InlineGrid>
					</span>
					<Collapsible id={title} open={hidden}>
						<div className={"max-h-72 overflow-y-auto text-xs"}>
							{props.children}
						</div>
					</Collapsible>
				</BlockStack>
			</Card> */}
		</div>
	);
};
