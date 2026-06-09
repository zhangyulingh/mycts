<script setup lang="ts" name="loginIndex">
import {onMounted, computed} from "vue"
import {storeToRefs} from "pinia"
import {useThemeConfig} from "@/stores/themeConfig"
import {NextLoading} from "@/utils/loading"
import PswLogin from "./components/PswLogin.vue"
import logoImg from "@/assets/img/logo.png"

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const {themeConfig} = storeToRefs(storesThemeConfig)

// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value
})
// 页面加载时
onMounted(() => {
  NextLoading.done()
})
</script>
<template>
  <div class="absolute flex items-center gap-10px top-15 left-15">
    <img :src="logoImg" class="login-logo" alt="logo" />
    <div class="leftText">{{ getThemeConfig.globalTitle }}</div>
  </div>
  <div class="loginContainer">
    <div class="loginRight">
      <div class="font-bold text-24px my-2">登录</div>
      <div class="font-bold text-32px"></div>
      <PswLogin />
    </div>
  </div>
  <div class="absolute bottom-15 left-0 right-0 text-center text-#6B6B6B"></div>
</template>
<style scoped lang="scss">
.loginContainer {
  --at-apply: flex justify-start items-center h-full w-full pl-80px bg-cover bg-no-repeat bg-[url(/images/bg_login.png)];
}

.loginRight {
  --at-apply: w-400px h-500px px-60px py-55px text-#16baaa bg-[url(/images/login_bg.png)] bg-center bg-no-repeat bg-contain;
}

.leftText {
  --at-apply: text-white font-bold text-32px text-#16baaa;
}

.login-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
