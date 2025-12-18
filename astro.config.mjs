// @ts-check
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/static";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: 'https://magicalball.top',
  output: "static",
  adapter: vercel({}),
  integrations: [preact(), mdx()],
  // 关键性能优化配置
  devToolbar: {
    enabled: false, // 禁用开发工具栏减少资源加载
  },
  build: {
    inlineStylesheets: "auto",
    // HTML压缩配置
    format: "file",
  },
  // HTML压缩（Astro内置）
  compressHTML: true,
  vite: {
    build: {
      // CSS代码分割和压缩
      cssCodeSplit: true,
      cssMinify: true,
      // JS压缩配置
      minify: "terser",
      // 关键请求链优化
      target: "esnext", // 现代浏览器目标，减少polyfill
      reportCompressedSize: false, // 跳过压缩大小报告，加快构建
      // 资源内联优化
      assetsInlineLimit: 4096, // 4KB以下资源内联
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除console
          drop_debugger: true, // 移除debugger
          pure_funcs: ["console.log", "console.info"], // 移除特定函数调用
          passes: 2, // 多次压缩优化
        },
        mangle: {
          safari10: true, // Safari 10兼容性
        },
      },
      rollupOptions: {
        output: {
          // 优化代码分割策略
          manualChunks: (id) => {
            // 第三方库单独打包
            if (id.includes('node_modules')) {
              if (id.includes('preact')) {
                return 'preact';
              }
              return 'vendor';
            }
            // 组件按功能分组
            if (id.includes('src/components/Virtual')) {
              return 'virtual-list';
            }
            if (id.includes('src/components/Notice') || id.includes('src/components/DateTime')) {
              return 'interactive';
            }
          },
          // 压缩后的文件命名
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/i.test(assetInfo.name)) {
              return `css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
        // 外部化大型依赖（如果有CDN）
        external: [],
      },
    },
    // 开发环境优化
    server: {
      hmr: {
        overlay: false, // 禁用错误覆盖层
      },
    },
  },
});
