import type {App} from "vue"
import {useUserInfo} from "@/stores/userInfo"
import {judementSameArr} from "@/utils/arrayOperation"

/**
 * 注册'v-inViewport'  当元素出现在可视范围时添加类名
 */
export function onInViewport(app: App) {
  app.directive("inViewport", {
    mounted(el, binding) {
      // 聚焦元素
      el.addClass = () => {
        const {top} = el.getBoundingClientRect()
        const h = document.documentElement.clientHeight || document.body.clientHeight
        if (top < h) {
          if (el.className.indexOf(binding.value) == -1) {
            // 初次还未绑定过，则新增类名(注意：下面单引号中间是一个空格！！！)
            el.className = binding.value + " " + el.className
          }
          if (el.addClass) {
            window.removeEventListener("scroll", el.addClass)
          }
        }
      }
      window.addEventListener("scroll", el.addClass, true)
      el.addClass()
    },
    unmounted(el, binding) {
      if (binding.value.addClass) {
        window.removeEventListener("scroll", el.addClass)
      }
    },
  })
}
