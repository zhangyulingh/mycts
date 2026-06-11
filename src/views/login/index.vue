<script setup lang="ts" name="loginIndex">
import {onMounted, computed} from "vue"
import {storeToRefs} from "pinia"
import {useThemeConfig} from "@/stores/themeConfig"
import {NextLoading} from "@/utils/loading"
import PswLogin from "./components/PswLogin.vue"
import logoImg from "@/assets/img/logo.png"

const storesThemeConfig = useThemeConfig()
const {themeConfig} = storeToRefs(storesThemeConfig)

const getThemeConfig = computed(() => {
  return themeConfig.value
})

onMounted(() => {
  NextLoading.done()
})
</script>

<template>
  <div
    class="relative min-h-100vh min-h-100dvh w-full overflow-x-hidden bg-[url(/images/bg_login.png)] bg-cover bg-center bg-no-repeat">
    <div
      class="absolute top-12 left-0 right-0 z-1 flex w-full flex-col items-center  gap-8px px-12px text-center md:top-15 md:left-15 md:right-auto md:w-auto md:max-w-[calc(100%-30px)] md:flex-row md:items-center md:gap-10px md:px-0 md:text-left">
      <img :src="logoImg" class="h-72px w-72px shrink-0 object-contain md:h-64px md:w-64px" alt="logo" />
      <div class="text-#16baaa max-w-full break-words text-4xl font-bold leading-snug">
        {{ getThemeConfig.globalTitle }}
      </div>
    </div>

    <div
      class="relative z-1 box-border flex min-h-100vh min-h-100dvh w-full min-w-0 items-center justify-center px-12px py-24px pt-[clamp(80px,18vw,120px)] pb-[clamp(24px,5vw,32px)] md:px-16px">
      <div
        class="box-border w-full min-w-0 max-w-400px text-#16baaa bg-[url(/images/login_bg.png)] bg-[length:100%_100%] bg-center bg-no-repeat px-16px py-24px md:px-[clamp(24px,6vw,48px)] md:py-[clamp(28px,6vw,55px)]">
        <div class="mb-[clamp(12px,3vw,16px)] text-center text-4xl font-bold leading-snug">
          用户登录
        </div>
        <PswLogin class="w-full min-w-0" />
      </div>
    </div>
  </div>
</template>
