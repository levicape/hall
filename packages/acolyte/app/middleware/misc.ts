import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { extendedTheme } from "./extended-theme.js";

function formatColors() {
	const colors = [];
	for (const [key, color] of Object.entries(extendedTheme.colors)) {
		if (typeof color === "string") {
			// @ts-ignore
			colors.push(key);
		} else {
			const colorGroup = Object.keys(color).map((subKey) =>
				subKey === "DEFAULT" ? "" : subKey,
			);
			// @ts-ignore
			colors.push({ [key]: colorGroup });
		}
	}
	return colors;
}

const customTwMerge = extendTailwindMerge<string, string>({
	extend: {
		theme: {
			colors: formatColors(),
			borderRadius: Object.keys(extendedTheme.borderRadius),
		},
		classGroups: {
			"font-size": [
				{
					text: Object.keys(extendedTheme.fontSize),
				},
			],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs));
}
