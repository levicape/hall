import { StartClient } from "@tanstack/start";
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router.js";

const router = createRouter();

// @ts-ignore
hydrateRoot(document, <StartClient router={router} />);
