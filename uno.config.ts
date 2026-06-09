import {defineConfig, presetAttributify, presetUno, presetIcons} from "unocss"

export default defineConfig({
  theme: {
    colors: {
      primary: "var(--el-color-primary)",
      success: "var(--el-color-success)",
      warning: "var(--el-color-warning)",
      danger: "var(--el-color-danger)",
      info: "var(--el-color-info)",
    },
  },
  rules: [
    [
      /bg-img-(\d)/,
      ([name]) => {
        return {
          "background-image": `url(../img/bg-${name}.png)`,
          "background-repeat": "no-repeat",
        }
      },
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {display: "inline-block"},
    }),
  ],
  shortcuts: [],
})
