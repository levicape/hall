#!/usr/bin/env -S node --no-warnings --watch

import { Polly } from "@levicape/spork-polly";
import { env } from "std-env";

const { ENTRI_UI_HOST, ENTRI_HTTP_HOST } = env;

export const HTTP_BASE_PATH = "/~/Hall/Entri";
export const HallEntriTopology = Polly.routes({
	"/": {
		$kind: "StaticRouteResource",
		hostname: `${ENTRI_UI_HOST}`,
		protocol: "http",
	},
	[HTTP_BASE_PATH]: {
		$kind: "StaticRouteResource",
		hostname: `${ENTRI_HTTP_HOST}`,
		protocol: "http",
	},
});
