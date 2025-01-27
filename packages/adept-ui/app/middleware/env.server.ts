import { z } from "zod";

const schema = z.object({
	NODE_ENV: z.enum(["production", "development", "test"] as const),
	DATABASE_PATH: z.optional(z.string()),
	DATABASE_URL: z.optional(z.string()),
	SESSION_SECRET: z.string().default("ev04QPaIMZ4QfGG33ZtqjOzgvYXZ22DH"),
	INTERNAL_COMMAND_TOKEN: z
		.string()
		.default("ev04QPaIMZ4QfGG33ZtqjOzgvYXZ22DH"),
	HONEYPOT_SECRET: z.string().default("ev04QPaIMZ4QfGG33ZtqjOzgvYXZ22DH"),
	CACHE_DATABASE_PATH: z.optional(z.string()),
	// If you plan on using Sentry, uncomment this line
	// SENTRY_DSN: z.string(),
	// If you plan to use Resend, uncomment this line
	// RESEND_API_KEY: z.string(),
	// If you plan to use GitHub auth, remove the default:
	GITHUB_CLIENT_ID: z.string().default("MOCK_GITHUB_CLIENT_ID"),
	GITHUB_CLIENT_SECRET: z.string().default("MOCK_GITHUB_CLIENT_SECRET"),
	GITHUB_TOKEN: z.string().default("MOCK_GITHUB_TOKEN"),
	ALLOW_INDEXING: z.enum(["true", "false"]).optional(),
	LEAF_MANIFEST: z.string().optional(),
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

export function init() {
	const parsed = schema.safeParse(process.env);

	if (parsed.success === false) {
		console.error(
			"❌ Invalid environment variables:",
			parsed.error.flatten().fieldErrors,
		);

		throw new Error("Invalid environment variables");
	}
}

/**
 * This is used in both `entry.server` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
	return {
		MODE: process.env.NODE_ENV,
		ALLOW_INDEXING: process.env.ALLOW_INDEXING,
	};
}

type ENV = ReturnType<typeof getEnv>;

declare global {
	// eslint-disable-next-line no-var
	var ENV: ENV;
	interface Window {
		ENV: ENV;
	}
}
