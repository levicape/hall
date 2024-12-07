import { 
  HonoHttpServerBuilder,
} from "@levicape/spork/router/hono";
import { GreathallHonoApp } from "../app/GreathallHonoApp.mjs";

export default HonoHttpServerBuilder({
  app: await GreathallHonoApp(),
});