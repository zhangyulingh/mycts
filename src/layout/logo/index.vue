<template>
  <div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-medium-img" alt="logo" />
    <span class="text">{{ themeConfig.globalTitle }}</span>
  </div>
  <div class="layout-logo-size" v-else @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-size-img" alt="logo" />
  </div>
</template>

<script setup lang="ts" name="layoutLogo">
import {computed} from "vue"
import {storeToRefs} from "pinia"
import {useThemeConfig} from "@/stores/themeConfig"
import logoMini from "@/assets/img/logo.png"

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const {themeConfig} = storeToRefs(storesThemeConfig)

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
  let {isCollapse, layout} = themeConfig.value
  return !isCollapse || layout === "classic" || document.body.clientWidth < 1000
})
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
  if (themeConfig.value.layout === "transverse") return false
  themeConfig.value.isCollapse = !themeConfig.value.isCollapse
}
</script>

<style scoped lang="scss">
.layout-logo {
  width: 260px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 10px;
  box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
  color: var(--el-color-primary);
  font-size: 16px;
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;
  span {
    white-space: nowrap;
    display: inline-block;
  }
  &:hover {
    span {
      color: var(--color-primary-light-2);
    }
  }
  &-medium-img {
    width: 30px;
    margin-right: 8px;
  }
}
.layout-logo-size {
  width: 100%;
  height: 70px;
  display: flex;
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;
  &-img {
    width: 26px;
    margin: auto;
  }
  &:hover {
    img {
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}
.text {
  background: linear-gradient(263deg, #f5f9ff 0%, #16baaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  line-height: 28px;
}
</style>
