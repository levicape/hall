import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { Theme } from "./Theme";

function formatColors() {
	const colors = [];
	for (const [key, color] of Object.entries(Theme.colors)) {
		if (typeof color === "string") {
			colors.push(key);
		} else {
			const colorGroup = Object.keys(color).map((subKey) =>
				subKey === "DEFAULT" ? "" : subKey,
			);
			colors.push({ [key]: colorGroup });
		}
	}
	return colors;
}

const customTwMerge = extendTailwindMerge<string, string>({
	extend: {
		theme: {
			colors: formatColors(),
			borderRadius: Object.keys(Theme.borderRadius),
		},
		classGroups: {
			"font-size": [
				{
					text: Object.keys(Theme.fontSize),
				},
			],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs));
}
