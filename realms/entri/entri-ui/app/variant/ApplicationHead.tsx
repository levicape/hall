import { process } from "std-env";
export const ApplicationName = "Entri" as const;

export const ApplicationHead = {
	title: {
		template: `%s | ${ApplicationName}`,
		default: ApplicationName,
	},
	description: ["Manage accounts registered to Entri"],
	metadataBase:
		(process?.env.URL !== undefined && new URL(process.env.URL)) || undefined,
	openGraph: {
		type: "website",
		title: ApplicationName,
		url: process.env.URL,
		images: [`${process.env.URL}/static/social/splash.png`],
	},
	footer: {
		default: `Levicape ${new Date().getFullYear()}`,
	},
} as const;
