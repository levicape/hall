import { process } from "std-env";
export const ApplicationName = "" as const;

export const ApplicationHead = {
	title: {
		template: `%s | ${ApplicationName}`,
		default: ApplicationName,
	},
	description: [""],
	metadataBase:
		(process?.env.URL !== undefined && new URL(process.env.URL)) || undefined,
	openGraph: {
		type: "website",
		title: ApplicationName,
		url: process.env.URL,
		images: [`${process.env.URL}/static/social/splash.png`],
	},
	footer: {
		default: "",
	},
} as const;
