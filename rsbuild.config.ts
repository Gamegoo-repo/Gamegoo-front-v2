import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';


export default defineConfig({
    source: {
        entry: {
            index: './src/index',
        },
    },
    plugins: [pluginReact(), pluginSvgr(), pluginBasicSsl()],
    tools: {
        rspack: {
            plugins: [
                tanstackRouter({
                    target: 'react',
                    autoCodeSplitting: true,
                    routesDirectory: './src/pages',
                    generatedRouteTree: './src/shared/lib/@generated/routeTree.gen.ts',
                    routeFileIgnorePrefix: '-',
                    quoteStyle: 'single',
                }),
            ],
        },
    },
    server: {
        port: 443,
    },
});
