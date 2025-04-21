#!/usr/bin/env -S node --no-warnings --watch

import { Atlas } from "@levicape/spork-atlas";
import { env } from "std-env";

const { CLIENT_UI_HOST } = env;

export const Topology = Atlas.routes({
	["/"]: {
		$kind: "StaticRouteResource",
		hostname: `${CLIENT_UI_HOST}`,
		protocol: "http",
	},
});
