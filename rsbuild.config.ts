import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

const GA_ID = process.env.PUBLIC_GOOGLE_ANALYTICS;
const GTM_ID = process.env.PUBLIC_GOOGLE_TAG_MANAGER;

export default defineConfig({
    html: {
        title: '겜구 - 롤 실시간 듀오 매칭 | GAMEGOO',
        favicon: './public/icon.png',
        meta: {
            charset: { charset: 'UTF-8' },
            viewport: 'width=device-width, initial-scale=1',
            description:
                '겜구(GAMEGOO)는 리그 오브 레전드 유저를 위한 실시간 듀오 매칭 서비스입니다. 롤 듀오 찾기, 게임 친구 매칭, 실시간 채팅으로 원하는 파트너를 바로 찾아보세요.',
            keywords:
                '겜구, gamegoo, 롤 듀오, 리그오브레전드, 롤 매칭, 게임 친구, 듀오 찾기, 롤 파트너, 게임 매칭, 롤 실시간 매칭',
            author: '겜구(GAMEGOO)',
            robots: 'index, follow',
            googlebot: 'index, follow',
            'google-adsense-account': 'ca-pub-5702098734359773',
            'naver-site-verification': 'ffa0048fc4e837b7019446343a3dba2234c400bc',
            'og:title': {
                property: 'og:title',
                content: '겜구 - 롤 실시간 듀오 매칭 | GAMEGOO',
            },
            'og:description': {
                property: 'og:description',
                content:
                    '겜구(GAMEGOO)는 리그 오브 레전드 유저를 위한 실시간 듀오 매칭 서비스입니다. 롤 듀오 찾기, 게임 친구 매칭, 실시간 채팅으로 원하는 파트너를 바로 찾아보세요.',
            },
            'og:type': { property: 'og:type', content: 'website' },
            'og:site_name': { property: 'og:site_name', content: '겜구(GAMEGOO)' },
            'og:locale': { property: 'og:locale', content: 'ko_KR' },
        },
        tags: [
            ...(GTM_ID
                ? [
                        // Google Tag Manager
                        {
                            tag: 'script',
                            attrs: {},
                            children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
                            head: true,
                        },
                        {
                            tag: 'noscript',
                            append: false,
                            head: false,
                            children: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                        },
                    ]
                : []),
            ...(GA_ID
                ? [
                        // Google Analytics (GA4)
                        {
                            tag: 'script',
                            attrs: {
                                async: true,
                                src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
                            },
                            head: true,
                        },
                        {
                            tag: 'script',
                            attrs: {},
                            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`,
                            head: true,
                        },
                    ]
                : []),
        ],
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
