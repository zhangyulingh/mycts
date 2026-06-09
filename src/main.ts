import {createApp} from "vue"
import pinia from "@/stores/index"
import App from "@/App.vue"
import router from "@/router"
import {directive} from "@/directive"
import other from "@/utils/other"
import "@/theme/index.scss"
import "virtual:uno.css"
// 引入vue-amap
import VueAMap, {initAMapApiLoader} from "@vuemap/vue-amap"
import "@vuemap/vue-amap/dist/style.css"

// 初始化vue-amap
initAMapApiLoader({
  key: "7c72f4b46f8f7268a893b29da65c02de",
  securityJsCode: "c4945f6c8a4ce08172b7dc39d4c19a7e", // 新版key需要配合安全密钥使用
})

const app = createApp(App)
directive(app)
other.elSvg(app)

app.use(pinia).use(VueAMap).use(router).mount("#app")
