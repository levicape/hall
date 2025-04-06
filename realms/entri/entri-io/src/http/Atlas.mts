#!/usr/bin/env -S node --no-warnings --watch

import { Atlas } from "@levicape/spork-atlas";
import { env } from "std-env";

const { ENTRI_UI, ENTRI_HTTP } = env;

export const HTTP_BASE_PATH = "/~/Hall/Entri";
export const HallEntriTopology = Atlas.routes({
	"/": {
		$kind: "StaticRouteResource",
		hostname: `ui:${ENTRI_UI}`,
		protocol: "http",
	},
	[HTTP_BASE_PATH]: {
		$kind: "StaticRouteResource",
		hostname: `http:${ENTRI_HTTP}`,
		protocol: "http",
	},
});
