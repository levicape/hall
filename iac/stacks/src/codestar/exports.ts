import { z } from "zod";

export const GreathallCodestarStackExportsZod = z.object({
	greathall_codestar_ecr: z.object({
		repository: z.object({
			arn: z.string(),
			url: z.string(),
			name: z.string(),
		}),
	}),
	greathall_codestar_codedeploy: z.object({
		application: z.object({
			arn: z.string(),
			name: z.string(),
		}),
		deploymentConfig: z.object({
			arn: z.string(),
			name: z.string(),
		}),
	}),
});
