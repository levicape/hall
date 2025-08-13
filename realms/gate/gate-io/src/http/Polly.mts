#!/usr/bin/env -S node --no-warnings --watch

import { Polly } from "@levicape/spork-polly";
import { env } from "std-env";

const { GATE_UI_HOST, GATE_HTTP_HOST } = env;

export const HTTP_BASE_PATH = "~/Hall/Gate";
export const Topology = Polly.routes({
	["/"]: {
		$kind: "StaticRouteResource",
		hostname: `${GATE_UI_HOST}`,
		protocol: "http",
	},
	["/.well-known" as "/~/.well-known"]: {
		$kind: "StaticRouteResource",
		hostname: `${GATE_HTTP_HOST}`,
		protocol: "http",
	},
	[`/${HTTP_BASE_PATH}`]: {
		$kind: "StaticRouteResource",
		hostname: `${GATE_HTTP_HOST}`,
		protocol: "http",
	},
	["/~/Frontend/Hostname"]: {
		$kind: "StaticRouteResource",
		hostname: `${GATE_HTTP_HOST}`,
		protocol: "http",
	},
});
