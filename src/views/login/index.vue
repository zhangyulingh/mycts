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
    <div class="loginCard">
      <div class="loginCard__title">登录</div>
      <PswLogin />
    </div>
  </div>
  <div class="absolute bottom-15 left-0 right-0 text-center text-#6B6B6B"></div>
</template>
<style scoped lang="scss">
.loginContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  padding: clamp(72px, 12vw, 96px) clamp(16px, 5vw, 24px) clamp(24px, 5vw, 32px);
  box-sizing: border-box;
  background: url(/images/bg_login.png) center / cover no-repeat;
}

.loginCard {
  width: min(100%, 400px);
  min-height: auto;
  padding: clamp(28px, 6vw, 55px) clamp(24px, 6vw, 48px);
  box-sizing: border-box;
  color: #16baaa;
  background: url(/images/login_bg.png) center / contain no-repeat;
}

.loginCard__title {
  margin-bottom: clamp(12px, 3vw, 16px);
  font-size: clamp(20px, 5vw, 24px);
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.leftText {
  --at-apply: text-white font-bold text-32px text-#16baaa;
  font-size: clamp(18px, 4vw, 32px);
  line-height: 1.3;
}

.login-logo {
  width: clamp(32px, 8vw, 40px);
  height: clamp(32px, 8vw, 40px);
  object-fit: contain;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .absolute.flex.items-center.gap-10px {
    left: 12px;
    right: 12px;
    top: 12px;
  }
}
</style>
