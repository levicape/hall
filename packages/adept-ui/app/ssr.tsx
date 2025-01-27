import { getRouterManifest } from "@tanstack/start/router-manifest";
// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import {
	createStartHandler,
	defaultRenderHandler,
} from "@tanstack/start/server";

import { createRouter } from "./router.js";

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(defaultRenderHandler);
