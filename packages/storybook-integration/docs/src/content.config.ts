import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { docsLoader } from '@astrojs/starlight/loaders';
const mode = await import("virtual:storybook-index")
let indexEndpoint = mode?.index;

export const collections = {
  docs: defineCollection({ 
    loader: {
        name: 'my-loader',
        load: async (context) => {
            const { config, store, logger, parseData, meta, generateDigest, renderMarkdown, } = context;;
            docsLoader().load(context);
            console.log('log', indexEndpoint?.entries)
            Object.entries(indexEndpoint?.entries).forEach(async ([storyId, value]) => {
                if (value.type !== 'docs') {
                    return;
                }
                const id = value.title;
                const data = await parseData({
                    id,
                    data: {
                        title: value.title,
                        tableOfContents: false,
                        
                    },
                    
                });

                const iframeSrc = import.meta.env.DEV
                        ? `http://localhost:6006/iframe.html?id=${storyId}&viewMode=docs`
                        : `${import.meta.env.BASE_URL}/static/iframe.html?id=${storyId}&viewMode=docs`;

                store.set({
                    id,
                    data: data,
                    rendered: {
                        html:`
                        <!-- Google tag (gtag.js) -->
                        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q9LMW56C6V"></script>
                        <script>
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-Q9LMW56C6V');
                        </script>
                        <style>
                            .doc-iframe-wrapper {
                            width: 100%;
                            height: 80vh;
                            min-height: 400px;
                            margin: 0;
                            padding: 0;
                            background: transparent;
                            overflow: hidden;
                            box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
                            }
                            .doc-iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                            outline: none;
                            background: transparent;
                            display: block;
                            overflow: hidden;
                            }
                            @media (max-width: 600px) {
                            .doc-iframe-wrapper {
                                height: 60vh;
                                min-height: 220px;
                            }
                            .doc-iframe {
    
                            }
                            }
                            </style>
                            <div class="doc-iframe-wrapper">
                            <iframe src="${iframeSrc}" class="doc-iframe" allowfullscreen loading="lazy"></iframe>
                            </div>
                    `},
                })

            });
        },
    }, schema: docsSchema() }),
};