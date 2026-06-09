import vue from "@vitejs/plugin-vue"
import {resolve} from "path"
import {defineConfig, loadEnv, ConfigEnv} from "vite"
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus"
import viteCompression from "vite-plugin-compression"
import {buildConfig} from "./src/utils/build"
import WebConfig from "vite-plugin-web-config"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import UnoCSS from "unocss/vite"
import transformerDirective from "@unocss/transformer-directives"
import {VueAmapResolver} from "@vuemap/unplugin-resolver"
// @ts-ignore
import DefineOptions from "unplugin-vue-define-options/vite"
import {ElementPlusResolver} from "unplugin-vue-components/resolvers"

const viteConfig = defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = command === "serve"
  const plugins = [
    AutoImport({
      resolvers: isDev ? undefined : [ElementPlusResolver({importStyle: "sass"}), VueAmapResolver()],
      imports: ["vue", "vue-router", "@vueuse/core"],
      dts: "types/auto-imports.d.ts",
    }),
    Components({
      resolvers: isDev ? undefined : [ElementPlusResolver({importStyle: "sass"}), VueAmapResolver()],
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      dts: "types/components.d.ts",
    }),
    isDev ? fullImportPlugin() : null,
    UnoCSS({
      transformers: [transformerDirective()],
    }),
  ]
  return {
    plugins: [
      vue(),
      WebConfig(),
      vueSetupExtend(),
      plugins,
      /** DefineOptions 可以更简单的注册组件名称 */
      DefineOptions(),
      viteCompression(),
      JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,
    ],
    root: process.cwd(),
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        "@": resolve(__dirname, "./src"),
      },
    },
    base: command === "serve" ? "./" : env.VITE_PUBLIC_PATH,
    optimizeDeps: {
      exclude: ["vue-demi"],
    },
    server: {
      host: "0.0.0.0",
      port: env.VITE_PORT as unknown as number,
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? "vender"
            }
          },
        },
        ...(JSON.parse(env.VITE_OPEN_CDN) ? {external: buildConfig.external} : {}),
      },
    },
    css: {
      preprocessorOptions: {
        css: {charset: false},
        scss: {
          silenceDeprecations: ["import", "legacy-js-api"],
        },
      },
    },
    define: {
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
    },
  }
})

import type {Plugin, ResolvedConfig} from "vite"
import * as path from "path"

/**
 * 为了解决开发模式下elementUI按需加载卡顿的问题
 */
function fullImportPlugin() {
  let config: ResolvedConfig
  return <Plugin>{
    name: "fullImportElementPlus",
    async configResolved(conf) {
      config = conf
    },
    transform(code, id) {
      // 判断当前处理的是否是 _src/main.ts_
      let b = path.join(config.root, "src/main.ts")
      if (slash(b) === id) {
        const name = "ElementPlus"
        // 引入 ElementPlus 和 样式
        const prepend = `import ${name} from 'element-plus';\nimport 'element-plus/theme-chalk/src/index.scss';\n`
        code = code.replace(".mount(", ($1) => `.use(${name})` + $1)
        return prepend + code
      }
      return code
    },
  }
}
//解决win和mac路径问题
export function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path)
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path)

  if (isExtendedLengthPath || hasNonAscii) {
    return path
  }

  return path.replace(/\\/g, "/")
}

export default viteConfig
