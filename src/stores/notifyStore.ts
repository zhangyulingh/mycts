import {defineStore} from "pinia"
import {AppInfo} from "@/views/home/types/AppInfo"

/**
 * 通知列表
 */
export const notifyStore = defineStore("list", {
  state: (): {list: AppInfo[]} => ({
    list: [],
  }),
})
