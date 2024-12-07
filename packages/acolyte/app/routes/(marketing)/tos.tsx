import { createFileRoute } from "@tanstack/react-router";
import { useMount } from "ahooks";
import { useCallback, useState } from "react";
import { INTERACTION_SPIN } from "~/ui/debug/Delay.js";

export const Route = createFileRoute("/(marketing)/tos")({
	component: TermsOfServiceRoute,
});

const useTranslate = (
	(input: Record<string, string>) =>
	<Return,>(
		skeleton?: Return,
		serverRender: Return | string | undefined = "",
	) => {
		const [element, setElement] = useState<Return | string | undefined>(
			serverRender,
		);
		const [d, sd] = useState<Record<string, string>>({});

		const t = useCallback(
			(key: string) => {
				return (d[key] as Return) ?? element ?? key;
			},
			[d, element],
		);

		useMount(() => {
			setElement(skeleton);

			setTimeout(
				() => {
					sd({
						...input,
					});
				},
				Math.ceil(Math.random() * INTERACTION_SPIN),
			);
		});

		return t;
	}
)({
	"route.tos.termsofservice": "Terms of Service",
});

export default function TermsOfServiceRoute() {
	const t = useTranslate(<span />);
	return <div>{t("route.tos.termsofservice")}</div>;
}
