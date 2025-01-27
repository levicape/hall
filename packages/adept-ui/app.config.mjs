
import { defineConfig } from '@tanstack/start/config';
import { resolve } from 'node:path/posix';
import tsConfigPaths from 'vite-tsconfig-paths';
import esmodule from 'vite-plugin-esmodule'
const currentDirectory = new URL(import.meta.url).pathname.split('/').slice(0,-1).join('/');
const pathToFlattenChildren = resolve(currentDirectory, "server/shim/flattenChildren.js");

export default defineConfig({
    tsr: {
        appDirectory: "app",
        autoCodeSplitting: true,
        semicolons: true,
        "routeFileIgnorePrefix": "-",        
    },
    server: {        
        compatibilityDate: '2024-11-28',
        prerender: {
            routes: ["/"],
            crawlLinks: true,
        },
        timing: true,
        serveStatic: "node",
        compressPublicAssets: true,
    },
    vite: {
        resolve: {
            alias: {
                "react-keyed-flatten-children": pathToFlattenChildren,
            },
            preserveSymlinks: false,
        },
        dev: {
            port: 5555,
            devtools: false,   
            ws: {
                port: 5556,
            },
        },
        build: {
            cssCodeSplit: true,
            cssMinify: true,
            ssrEmitAssets: true,     
        },
        plugins: [
            tsConfigPaths({
                projects: ['./tsconfig.json']
            }),
            // esmodule(["@cloudscape-design/components"])
        ],
    }
})