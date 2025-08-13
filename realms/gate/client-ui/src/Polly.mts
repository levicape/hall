#!/usr/bin/env -S node --no-warnings --watch

import { Polly } from "@levicape/spork-polly";
import { env } from "std-env";

const { CLIENT_UI_HOST } = env;

export const Topology = Polly.routes({
	["/"]: {
		$kind: "StaticRouteResource",
		hostname: `${CLIENT_UI_HOST}`,
		protocol: "http",
	},
});
