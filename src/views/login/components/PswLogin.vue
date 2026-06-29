<script setup lang="ts">
import type {FormInstance, FormRules} from "element-plus"
import {useRoute, useRouter} from "vue-router"
import {reactive, ref, watch} from "vue"
import {ElInput, ElMessage} from "element-plus"
import {Session} from "@/utils/storage"
import {NextLoading} from "@/utils/loading"
import {initFrontEndControlRoutes} from "@/router/frontEnd"
import {Key, User, Message} from "@element-plus/icons-vue"
import generateRandomString from "@/utils/loginCode"
import {dynamicRoutes} from "@/router/route"

const captcha = ref(generateRandomString(4))

watch(captcha, (newCaptcha: any, oldCaptcha: any) => {
  if (newCaptcha !== oldCaptcha) {
  }
})
const showLoading = ref(false)
const router = useRouter()
const route = useRoute()
const remenber = ref<boolean>(true)

const formRef = ref<FormInstance>()

const formData = reactive({
  userName: "",
  pwd: "",
  code: "",
})
const rules = reactive<FormRules>({
  userName: [{required: true, message: "请输入用户名", trigger: "blur"}],
  pwd: [{required: true, message: "请输入密码", trigger: "blur"}],
  code: [
    {
      required: true,
      message: "请输入正确的验证码",
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captcha.value.toLowerCase()) {
          callback(new Error("验证码错误"))
        } else {
          callback()
        }
      },
    },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      gotoLogin()
    }
  })
}
const isPasswordError = ref(false)

async function doLogin(username: string, password: string) {
  const {accountLogin} = await import("@/api/account")
  return accountLogin({account: username, password: password})
}

// 模拟登录 - 不调用真实接口
async function gotoLogin() {
  showLoading.value = true
  const originalPassword = formData.pwd

  try {
    const accountUser = await doLogin(formData.userName, formData.pwd)
    if (!accountUser) throw new Error("用户名或密码错误")

    const isAdmin = accountUser.role === "admin"
    const isPrimaryAdmin = accountUser.username === "admin"
    const mockUser: UserInfos = {
      token: "mock_token_" + Date.now(),
      loginName: accountUser.username || formData.userName,
      name: accountUser.nickname || accountUser.username || formData.userName,
      userName: accountUser.username || formData.userName,
      full_name: accountUser.nickname || accountUser.username || formData.userName,
      time: Date.now(),
      roles: isAdmin ? ["admin"] : ["user"],
      authBtnList: [],
      isAdmin,
      isPrimaryAdmin,
      id: accountUser.id,
      role: accountUser.role,
      actionCodeList: "device:list,device:add,device:edit,device:delete",
    }

    Session.set("token", mockUser.token, remenber.value)
    Session.set("userInfo", mockUser, remenber.value)

    const isNoPower = await initFrontEndControlRoutes()
    signInSuccess(isNoPower)
  } catch (error) {
    console.error("Login error:", error)
    formData.pwd = originalPassword
    isPasswordError.value = true
    ElMessage.error("用户名或密码错误")
  } finally {
    showLoading.value = false
  }
}

// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
  if (isNoPower) {
    ElMessage.warning("抱歉，您没有登录权限")
    Session.clear()
  } else {
    if (route.query?.redirect) {
      router.push({
        path: <string>route.query?.redirect,
        query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : "",
      })
    } else {
      router.push("/")
    }
    NextLoading.start()
  }
}
const refreshCaptcha = () => {
  captcha.value = generateRandomString(4)
}
</script>
<template>
  <el-form ref="formRef" :model="formData" :rules="rules" class="w-full min-w-0">
    <el-form-item prop="userName" class="captcha-input w-full">
      <ElInput
        v-model="formData.userName"
        placeholder="请输入用户名"
        class="h-50px w-full min-w-0 md:h-60px"
        clearable
        :prefix-icon="User"
        @keyup.enter="submitForm(formRef)" />
    </el-form-item>
    <el-form-item prop="pwd" class="captcha-input w-full">
      <ElInput
        v-model="formData.pwd"
        placeholder="请输入密码"
        class="h-50px w-full min-w-0 md:h-60px"
        :class="{error: isPasswordError}"
        clearable
        show-password
        :prefix-icon="Key"
        @keyup.enter="submitForm(formRef)" />
    </el-form-item>
    <el-form-item prop="code" class="captcha-input w-full">
      <div class="flex w-full min-w-0 flex-col items-stretch gap-12px md:flex-row md:items-center">
        <ElInput
          v-model="formData.code"
          placeholder="请输入验证码"
          class="h-50px w-full min-w-0 flex-1 md:h-60px"
          clearable
          :prefix-icon="Message"
          @keyup.enter="submitForm(formRef)" />
        <div class="w-full cursor-pointer select-none py-4px text-center md:w-auto md:min-w-72px md:shrink-0 md:py-0"
          @click="refreshCaptcha">
          <span class="flow-colorful">{{ captcha }}</span>
        </div>
      </div>
    </el-form-item>
    <el-button
      type="primary"
      :loading="showLoading"
      class="mt-[clamp(24px,6vw,44px)] min-h-50px w-full text-[clamp(16px,4vw,18px)]"
      @click="submitForm(formRef)"
      size="large">
      登 录
    </el-button>
  </el-form>
</template>
<style lang="scss" scoped>
.captcha-input {
  width: 100%;
  min-width: 0;
  :deep(.el-form-item__content) {
    width: 100%;
    min-width: 0;
  }
  :deep(.el-input__wrapper) {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    box-shadow: none;
    padding: 0px;
  }
  :deep(.el-input__inner) {
    transition: background-color 9999s ease-out 0.5s;
    -webkit-text-fill-color: #16baaa;
    border-bottom: 1px solid #16baaa !important;
  }
  :deep(.el-input__icon) {
    color: #16baaa;
  }
  .error :deep(.el-input__inner) {
    -webkit-text-fill-color: red;
    color: red !important;
  }
}
.flow-colorful {
  display: inline-block;
  line-height: 1.2;
  background: linear-gradient(45deg, #00ffec, #75f4e4, #7886f4, #1086f4);
  animation: text-animation 1s ease-in-out infinite;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  font-size: clamp(18px, 5vw, 24px);
  font-weight: 700;
  letter-spacing: 2px;
  text-decoration: line-through solid rgba(0, 0, 0, 0.5) 1px !important;
}
@keyframes text-animation {
  from { filter: hue-rotate(0deg); }
  to { filter: hue-rotate(360deg); }
}
</style>
