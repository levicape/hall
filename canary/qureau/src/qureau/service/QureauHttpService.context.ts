import { z } from "zod";

// TODO: Remove
const QureauManifestDataSchema = z.object({
	ComputeComponent: z.object({
		manifest: z.object({
			ok: z.boolean(),
			routes: z
				.object({
					lambda: z.undefined().optional(),
					k8s: z.object({
						"/~/v1/Qureau": z.object({
							serviceName: z.string(),
							port: z.number(),
						}),
					}),
				})
				.or(
					z.object({
						k8s: z.undefined().optional(),
						lambda: z.object({
							"/~/v1/Qureau": z.object({
								lambdaName: z.string(),
								url: z.string(),
								protocol: z.string(),
								parameter: z.string().optional(),
							}),
						}),
					}),
				),
			frontend: z
				.object({
					website: z
						.object({
							service: z.string().optional(),
							protocol: z.string().optional(),
						})
						.optional(),
					hostnames: z.array(z.string()).catch([]),
				})
				.optional(),
		}),
	}),
});

const isProduction = process.env.NODE_ENV === "production";

export type QureauManifestData = z.infer<typeof QureauManifestDataSchema>;
export class QureauHttpServiceContext {
	public manifest: QureauManifestData["ComputeComponent"]["manifest"] | null =
		null;
	public refresh: () => Promise<void> = async () => {};
	public token: string | null = null;

	constructor(private root: string) {
		this.readManifest();
		this.readToken();
	}
	private readManifest = async () => {
		let decodedManifest: string | undefined = undefined;
		let parsedManifest = undefined;
		let manifest: string | undefined = undefined;
		try {
			manifest = process.env.LEAF_MANIFEST;
			if (!manifest) {
				throw new Error("No manifest found");
			}
			decodedManifest = Buffer.from(manifest, "base64").toString("utf-8");

			// biome-ignore lint/style/noNonNullAssertion:
			parsedManifest = JSON.parse(decodedManifest!);
			this.manifest =
				QureauManifestDataSchema.parse(
					parsedManifest,
				).ComputeComponent.manifest;

			if (!this.manifest.routes.k8s && !this.manifest.routes.lambda) {
				throw new Error("No routes found");
			}

			if (this.manifest.routes.lambda) {
				if (!this.manifest.routes.lambda["/~/v1/Qureau"]) {
					throw new Error("No lambda found for /~/v1/Qureau");
				}
				this.refresh = async () => {
					// const { parameter } = this.manifest?.routes?.lambda?.["/~/v1/Qureau"];
					// 	const { Parameter } = await getParameter({
					// 		Name: parameter,
					// 	});
				};
			}
		} catch (error) {
			console.error({
				QureauHttpServiceContext: {
					manifest: isProduction ? manifest?.slice(0, 20) : manifest,
					parsedManifest: JSON.stringify(parsedManifest),
					error,
				},
			});
		}
	};
	private readToken = () => {
		try {
			const token = process.env.LEAF_TOKEN;
			if (!token) {
				throw new Error("No token found");
			}
			this.token = token;
		} catch (error) {
			// console.error({
			// 	QureauHttpServiceContext: {
			// 		token: isProduction
			// 			? this.token?.slice(Math.max(this.token?.length - 6, 0))
			// 			: this.token,
			// 		error,
			// 	},
			// });
		}
	};
	public rootUrl(): string {
		if (!this.manifest) {
			return this.root;
		}

		const { k8s, lambda } = this.manifest.routes;
		if (k8s) {
			const { protocol } = this.manifest.frontend?.website ?? {
				protocol: "http",
			};
			return `${protocol}://${this.manifest.routes.k8s["/~/v1/Qureau"].serviceName}:${this.manifest.routes.k8s["/~/v1/Qureau"].port}`;
		}
		if (lambda) {
			const { url, protocol } = lambda["/~/v1/Qureau"];
			return `${protocol}://${url}`;
		}

		return "";
	}
}
