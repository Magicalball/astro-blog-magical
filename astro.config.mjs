// @ts-check
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), mdx()],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            "virtual-list": ["src/components/VirtualBlogList.tsx"],
            interactive: [
              "src/components/Notice.tsx",
              "src/components/DateTime.tsx",
            ],
          },
        },
      },
    },
  },
});
