#!/usr/bin/env -S node --no-warnings --watch

import { Atlas } from "@levicape/spork-atlas";
import { env } from "std-env";

const { GATE_UI_HOST, GATE_HTTP_HOST } = env;

export const HTTP_BASE_PATH = "/~/Hall/Gate";
export const HallGateTopology = Atlas.routes({
	["/"]: {
		$kind: "StaticRouteResource",
		hostname: `${GATE_UI_HOST}`,
		protocol: "http",
	},
	[HTTP_BASE_PATH]: {
		$kind: "StaticRouteResource",
		hostname: `${GATE_HTTP_HOST}`,
		protocol: "http",
	},
});
