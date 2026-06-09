import {defineStore} from "pinia"

/**
 * isHoverTitle：是否hover标题
 */
export const config = defineStore("config", {
  state: (): {isHoverTitle?: Boolean; selId?: number | string} => ({
    isHoverTitle: false,
    selId: undefined,
  }),
})
