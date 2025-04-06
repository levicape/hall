import { hc } from "hono/client";
import type { NevadaHonoApp } from "./HonoApp.mjs";

const $client$ = hc<NevadaHonoApp>("");
export type NevadaHonoClient = typeof $client$;
export const client = (...args: Parameters<typeof hc>): NevadaHonoClient =>
	hc<NevadaHonoApp>(...args);
