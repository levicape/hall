import { useMount } from "ahooks";
import { useCallback, useState } from "react";
import { INTERACTION_SPIN } from "~/ui/debug/Delay.js";

// TODO: Language support
export const useImmediateTranslatedBlock = (input: Record<string, string>) => {
	return (key: string) => {
		return input[key] ?? key;
	};
};

// TODO: Language support
export const useStaticTranslatedBlock = (
	input: Record<string, string>,
): [Record<string, string>, (input: Record<string, string>) => void] => {
	const [d, sd] = useState<Record<string, string>>(input);

	return [d, sd];
};

export const useTranslatedBlock = (
	input: Record<string, string>,
): [Record<string, string>, (input: Record<string, string>) => void] => {
	const [d, sd] = useState<Record<string, string>>({});

	useMount(() => {
		setTimeout(() => {
			sd({
				...input,
			});
		}, Math.random() * INTERACTION_SPIN);
	});

	return [d, sd];
};

export const serverTranslatedElement =
	// Todo statically infer input type so that the translate callback only accepts keys from the input
		(input: Record<string, string>) =>
		<Return,>(
			skeleton?: Return,
			serverRender: Return | string | undefined = "",
		) => {
			const [element, setElement] = useState<Return | string | undefined>(
				serverRender,
			);

			const [d] = useStaticTranslatedBlock(input);
			const t = useCallback(
				(key: string) => {
					return (d[key] as Return) ?? element ?? key;
				},
				[d, element],
			);

			useMount(() => {
				setElement(skeleton);
			});

			return t;
		};

export const anchorTranslatedElement =
	(input: Record<string, string>) =>
	<Return,>(
		skeleton?: Return,
		serverRender: Return | string | undefined = "",
	) => {
		const [element, setElement] = useState<Return | string | undefined>(
			serverRender,
		);

		const [d] = useTranslatedBlock(input);
		const t = useCallback(
			(key: string) => {
				return (d[key] as Return) ?? element ?? key;
			},
			[d, element],
		);

		useMount(() => {
			setElement(skeleton);
		});

		return t;
	};

export const DefaultClientPlaceholder = () => (
	<div
		suppressHydrationWarning
		className={
			"text-transparent bg-slate-400 animate-pulse min-w-24 max-w-32 min-h-4 inline-block"
		}
	/>
);

export const DefaultServerPlaceholder = () => (
	<div
		suppressHydrationWarning
		className={
			"text-transparent bg-slate-400 animate-pulse min-w-24 max-w-32 min-h-4 inline-block"
		}
	/>
);
