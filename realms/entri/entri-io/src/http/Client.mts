import { hc } from "hono/client";
import type { HonoApp } from "./HonoApp.mjs";

const $client$ = hc<HonoApp>("");
export type HonoClient = typeof $client$;
export const client = (...args: Parameters<typeof hc>): HonoClient =>
	hc<HonoApp>(...args);
