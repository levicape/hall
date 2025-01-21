import { z } from "zod";

export const GreathallQureauHttpStackExportsZod = z.object({
	greathall_qureau_http_s3: z.object({
		build: z.object({
			bucket: z.string(),
		}),
		deploy: z.object({
			bucket: z.string(),
		}),
		artifactStore: z.object({
			bucket: z.string(),
		}),
		assets: z.object({
			bucket: z.string(),
		}),
	}),
	greathall_qureau_http_cloudwatch: z.object({
		loggroup: z.object({
			arn: z.string(),
		}),
	}),
	greathall_qureau_http_lambda: z.object({
		role: z.object({
			arn: z.string(),
			name: z.string(),
		}),
		function: z.object({
			arn: z.string(),
			name: z.string(),
			initialVersion: z.string(),
			alias: z.object({
				arn: z.string(),
				name: z.string(),
				version: z.string(),
			}),
		}),
		codedeploy: z.object({
			deploymentGroup: z.object({
				arn: z.string(),
				name: z.string(),
			}),
		}),
	}),
	greathall_qureau_http_cloudmap: z.object({
		service: z.object({
			arn: z.string(),
			name: z.string(),
		}),
		instance: z.object({
			id: z.string(),
		}),
	}),
	greathall_qureau_http_codebuild: z.object({
		project: z.object({
			arn: z.string(),
			name: z.string(),
		}),
	}),
	greathall_qureau_http_pipeline: z.object({
		pipeline: z.object({
			arn: z.string(),
			name: z.string(),
		}),
	}),
	greathall_qureau_http_eventbridge: z.object({
		EcrImageAction: z.object({
			rule: z.object({
				arn: z.string(),
				name: z.string(),
			}),
			targets: z.object({
				pipeline: z.object({
					arn: z.string(),
					targetId: z.string(),
				}),
			}),
		}),
	}),
});
