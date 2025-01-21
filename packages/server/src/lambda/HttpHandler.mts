import { handle } from "hono/aws-lambda";
import { GreathallHonoApp } from "../app/GreathallHonoApp.mjs";

export const LambdaHandler = handle(
	await GreathallHonoApp()
)