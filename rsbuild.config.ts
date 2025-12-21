import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { pluginSvgr } from '@rsbuild/plugin-svgr';


export default defineConfig({
    html: {
        title: '겜구 - 롤 실시간 듀오 매칭 | GAMEGOO'
    },
    source: {
        entry: {
            index: './src/index',
        },
    },
    plugins: [pluginReact(), pluginSvgr(), ],

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
        port: 3000,
    },
});
