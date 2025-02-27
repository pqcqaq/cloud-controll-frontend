// vite.config.mts
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///D:/Develop/projects/bar-code/bar-code-frontend/node_modules/.pnpm/vite@5.4.9_@types+node@18.19.56_sass@1.79.5/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Develop/projects/bar-code/bar-code-frontend/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.4.9_@types+node@18.19.56_sass@1.79.5__vue@3.5.12_typescript@5.2.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/Develop/projects/bar-code/bar-code-frontend/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.9_@types+node@18.19.56_sass@1.79.5__vue@3.5.12_typescript@5.2.2_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///D:/Develop/projects/bar-code/bar-code-frontend/node_modules/.pnpm/vite-plugin-vue-devtools@7.6.4_rollup@4.24.0_vite@5.4.9_@types+node@18.19.56_sass@1.79.5__vue@3.5.12_typescript@5.2.2_/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import { createSvgIconsPlugin } from "file:///D:/Develop/projects/bar-code/bar-code-frontend/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.9_@types+node@18.19.56_sass@1.79.5_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import viteCompression from "file:///D:/Develop/projects/bar-code/bar-code-frontend/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.4.9_@types+node@18.19.56_sass@1.79.5_/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/Develop/projects/bar-code/bar-code-frontend/vite.config.mts";
var vite_config_default = defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    base: env.VITE_PUBLIC_PATH,
    root,
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      // 使用 svg 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      // 配置 gzip 压缩插件
      viteCompression({
        algorithm: "gzip",
        // 使用 gzip 压缩
        ext: ".gz",
        // 压缩文件扩展名
        threshold: 10240,
        // 只有大于 10 KB 的文件才会被压缩
        deleteOriginFile: false
        // 不删除源文件
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        "package.json": new URL("package.json", __vite_injected_original_import_meta_url).pathname
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          // https://github.com/sass/dart-sass/issues/2395#issuecomment-988870897
          additionalData: `@use "@/styles/element/index.scss" as *;`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT),
      open: env.VITE_OPEN === "true",
      proxy: {
        "/api": {
          target: "http://127.0.0.1:9991/api/",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/api`), ""),
          // https is require secure=false
          .../^https:\/\//.test(env.VITE_API_URL) ? { secure: false } : {}
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRGV2ZWxvcFxcXFxwcm9qZWN0c1xcXFxiYXItY29kZVxcXFxiYXItY29kZS1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGV2ZWxvcFxcXFxwcm9qZWN0c1xcXFxiYXItY29kZVxcXFxiYXItY29kZS1mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0RldmVsb3AvcHJvamVjdHMvYmFyLWNvZGUvYmFyLWNvZGUtZnJvbnRlbmQvdml0ZS5jb25maWcubXRzXCI7Ly8gdml0ZS5jb25maWcubXRzXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIENvbmZpZ0VudiwgVXNlckNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucyc7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcblxuLy8gXHU3NTMxXHU0RThFXHU2MjExXHU0RUVDXHU0RjdGXHU3NTI4XHU3Njg0XHU2NjJGIEVTTVx1RkYwQ1x1NEUwRFx1NTE4RFx1OTcwMFx1ODk4MSBjb25zdCBwYXRoID0gcmVxdWlyZSgnbm9kZTpwYXRoJyk7XG4vLyBcdTc2RjRcdTYzQTVcdTRGN0ZcdTc1MjggaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnOyBcdTUzNzNcdTUzRUZcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XG4gIGNvbnN0IHJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpO1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogZW52LlZJVEVfUFVCTElDX1BBVEgsXG4gICAgcm9vdCxcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIHZ1ZUpzeCgpLFxuICAgICAgdnVlRGV2VG9vbHMoKSxcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOCBzdmcgXHU1NkZFXHU2ODA3XG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucycpXSxcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXG4gICAgICB9KSxcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RSBnemlwIFx1NTM4Qlx1N0YyOVx1NjNEMlx1NEVGNlxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsIC8vIFx1NEY3Rlx1NzUyOCBnemlwIFx1NTM4Qlx1N0YyOVxuICAgICAgICBleHQ6ICcuZ3onLCAvLyBcdTUzOEJcdTdGMjlcdTY1ODdcdTRFRjZcdTYyNjlcdTVDNTVcdTU0MERcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy8gXHU1M0VBXHU2NzA5XHU1OTI3XHU0RThFIDEwIEtCIFx1NzY4NFx1NjU4N1x1NEVGNlx1NjI0RFx1NEYxQVx1ODhBQlx1NTM4Qlx1N0YyOVxuICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSwgLy8gXHU0RTBEXHU1MjIwXHU5NjY0XHU2RTkwXHU2NTg3XHU0RUY2XG4gICAgICB9KSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICAncGFja2FnZS5qc29uJzogbmV3IFVSTCgncGFja2FnZS5qc29uJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zYXNzL2RhcnQtc2Fzcy9pc3N1ZXMvMjM5NSNpc3N1ZWNvbW1lbnQtOTg4ODcwODk3XG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwiQC9zdHlsZXMvZWxlbWVudC9pbmRleC5zY3NzXCIgYXMgKjtgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgcG9ydDogTnVtYmVyKGVudi5WSVRFX1BPUlQpLFxuICAgICAgb3BlbjogZW52LlZJVEVfT1BFTiA9PT0gJ3RydWUnLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6OTk5MS9hcGkvXCIsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHdzOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXi9hcGlgKSwgJycpLFxuICAgICAgICAgIC8vIGh0dHBzIGlzIHJlcXVpcmUgc2VjdXJlPWZhbHNlXG4gICAgICAgICAgLi4uKC9eaHR0cHM6XFwvXFwvLy50ZXN0KGVudi5WSVRFX0FQSV9VUkwpID8geyBzZWN1cmU6IGZhbHNlIH0gOiB7fSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxlQUFlLFdBQVc7QUFDbkMsU0FBUyxjQUFxQyxlQUFlO0FBQzdELE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxxQkFBcUI7QUFSa0wsSUFBTSwyQ0FBMkM7QUFhL1AsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQTZCO0FBQy9ELFFBQU0sT0FBTyxRQUFRLElBQUk7QUFDekIsUUFBTSxNQUFNLFFBQVEsTUFBTSxJQUFJO0FBRTlCLFNBQU87QUFBQSxJQUNMLE1BQU0sSUFBSTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLE9BQU87QUFBQSxNQUNQLFlBQVk7QUFBQTtBQUFBLE1BRVoscUJBQXFCO0FBQUEsUUFDbkIsVUFBVSxDQUFDLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQSxRQUNyRCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUE7QUFBQSxNQUVELGdCQUFnQjtBQUFBLFFBQ2QsV0FBVztBQUFBO0FBQUEsUUFDWCxLQUFLO0FBQUE7QUFBQSxRQUNMLFdBQVc7QUFBQTtBQUFBLFFBQ1gsa0JBQWtCO0FBQUE7QUFBQSxNQUNwQixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxRQUNwRCxnQkFBZ0IsSUFBSSxJQUFJLGdCQUFnQix3Q0FBZSxFQUFFO0FBQUEsTUFDM0Q7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixLQUFLO0FBQUE7QUFBQSxVQUNMLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU0sT0FBTyxJQUFJLFNBQVM7QUFBQSxNQUMxQixNQUFNLElBQUksY0FBYztBQUFBLE1BQ3hCLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLElBQUk7QUFBQSxVQUNKLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sT0FBTyxHQUFHLEVBQUU7QUFBQTtBQUFBLFVBRXZELEdBQUksY0FBYyxLQUFLLElBQUksWUFBWSxJQUFJLEVBQUUsUUFBUSxNQUFNLElBQUksQ0FBQztBQUFBLFFBQ2xFO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
