import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

export default defineConfig({
    source: {
        entry: {
            index: './src/index',
        },
    },
    plugins: [pluginReact()],
    tools: {
        rspack: {
            plugins: [
                TanStackRouterRspack({
                    target: 'react',
                    autoCodeSplitting: true,
                    routesDirectory: './src/app/routes',
                    generatedRouteTree: './src/routeTree.gen.ts',
                    routeFileIgnorePrefix: '-',
                    quoteStyle: 'single',
                }),
            ],
        },
    },
});
