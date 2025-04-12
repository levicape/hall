import type { DefaultHonoHttpMiddleware } from "@levicape/spork/router/hono/middleware/HonoHttpMiddleware";
import { createFactory } from "hono/factory";
import {
	QureauResponseVersionEnum,
	QureauVersionEnum,
} from "../../_protocols/qureau/tsnode/service/version.js";
import { Topology } from "../../http/Atlas.mjs";

const factory = createFactory<
	DefaultHonoHttpMiddleware & {
		Variables: {
			Topology: typeof Topology;
		};
	}
>({
	initApp(app) {
		app.use("*", async (c) => {
			c.set("Topology", Topology);
		});
	},
});
export const Qureau = () => {
	return factory;
};
export const version = {
	response: QureauResponseVersionEnum.QUREAU_R_LATEST,
	qureau: QureauVersionEnum.QUREAU_V_V1,
};
