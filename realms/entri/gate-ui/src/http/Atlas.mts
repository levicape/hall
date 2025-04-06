#!/usr/bin/env -S node --no-warnings --watch

import { Atlas } from "@levicape/spork-atlas";
import type { Prefix } from "@levicape/spork-atlas/route/RouteResource";
import { env } from "std-env";

const { ENTRI_GATE } = env;

export const GateTopology = Atlas.routes<Prefix>({
	["/oauth2" as "/"]: {
		$kind: "StaticRouteResource",
		hostname: `gate:${ENTRI_GATE}`,
		protocol: "http",
	},
} as const);
