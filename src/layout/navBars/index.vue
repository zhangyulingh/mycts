<template>
  <div class="layout-navbars-container" :class="{hide: !showTitle}">
    <BreadcrumbIndex v-on:mouseleave="() => bus.emit('onHoverTitle', false)" />
    <TagsView v-if="setShowTagsView" />
    <div class="bg-#F6FAFF w-full items-center px-20px py-8px" v-show="!router.currentRoute.value.path.includes(`/info/`)">
      {{ router.currentRoute.value.meta.title }}
    </div>
  </div>
</template>

<script setup lang="ts" name="layoutNavBars">
import {defineAsyncComponent, computed, onMounted, onUnmounted} from "vue"
import {storeToRefs} from "pinia"
import {useThemeConfig} from "@/stores/themeConfig"
import router from "../../router"
import bus from "@/utils/mitt"
import {config} from "@/stores/config"

const {isHoverTitle} = storeToRefs(config())

// 引入组件
const BreadcrumbIndex = defineAsyncComponent(() => import("@/layout/navBars/topBar/index.vue"))
const TagsView = defineAsyncComponent(() => import("@/layout/navBars/tagsView/tagsView.vue"))

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const {themeConfig} = storeToRefs(storesThemeConfig)

const showTitle = computed(() => {
  let b = !router.currentRoute.value.path.includes(`/info/`) || isHoverTitle?.value
  return b
})

onMounted(() => {
  bus.on("onHoverTitle", (on: any) => {
    isHoverTitle.value = on
  })
})

onUnmounted(() => {
  bus.off("onHoverTitle")
})

// 是否显示 tagsView
const setShowTagsView = computed(() => {
  let {layout, isTagsview} = themeConfig.value
  return layout !== "classic" && isTagsview
})
</script>

<style scoped lang="scss">
.layout-navbars-container {
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 67px;

  &.hide {
    height: 0 !important;
  }
}
</style>
