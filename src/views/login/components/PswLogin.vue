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
// 定义验证码属性 // 生成随机的 4 位大小写组合的英文验证码
const captcha = ref(generateRandomString(4))

// 监听验证码的变化
watch(captcha, (newCaptcha: any, oldCaptcha: any) => {
  if (newCaptcha !== oldCaptcha) {
    // 验证码变化时，可能需要进行一些其他操作，例如更新界面或验证验证码
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

// 模拟登录 - 不调用真实接口
async function gotoLogin() {
  showLoading.value = true
  const originalPassword = formData.pwd // 保存原始密码

  try {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 固定登录凭据验证
    const validCredentials = [
      {username: "admin", password: "admin@2023", name: "管理员", isAdmin: true},
      {username: "user", password: "User@2023", name: "普通用户", isAdmin: false},
      {username: "test", password: "Test@2023", name: "测试用户", isAdmin: false},
      {username: "demo", password: "Demo@2023", name: "演示用户", isAdmin: false},
      {username: "manager", password: "Manager@2023", name: "经理", isAdmin: true},
      {username: "operator", password: "Operator@2023", name: "操作员", isAdmin: false},
    ]

    const validUser = validCredentials.find((cred) => cred.username === formData.userName && cred.password === formData.pwd)

    if (!validUser) {
      throw new Error("用户名或密码错误")
    }

    // 模拟用户数据
    const mockUser: UserInfos = {
      token: "mock_token_" + Date.now(),
      loginName: formData.userName,
      name: validUser.name,
      userName: formData.userName, // 添加userName字段
      full_name: validUser.name, // 添加full_name字段
      time: Date.now(),
      roles: [],
      authBtnList: [],
      isAdmin: validUser.isAdmin,
      actionCodeList: "device:list,device:add,device:edit,device:delete",
    }

    // 设置角色
    if (mockUser.isAdmin) {
      mockUser.roles = ["admin"]
    } else {
      mockUser.roles = ["user"]
    }

    if (mockUser.actionCodeList) {
      mockUser.roles.push(...mockUser.actionCodeList.split(","))
    }

    // 存储用户信息
    Session.set("token", mockUser.token, remenber.value)
    Session.set("userInfo", mockUser, remenber.value)

    // 设置数据看板链接

    // 初始化路由
    const isNoPower = await initFrontEndControlRoutes()
    signInSuccess(isNoPower)
  } catch (error) {
    console.error("Login error:", error)
    // 保留原始密码
    formData.pwd = originalPassword
    isPasswordError.value = true
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
    // 登录成功，跳到转首页
    // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
    if (route.query?.redirect) {
      router.push({
        path: <string>route.query?.redirect,
        query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : "",
      })
    } else {
      router.push("/")
    }
    // 添加 loading，防止第一次进入界面时出现短暂空白
    NextLoading.start()
  }
}
// 点击验证码刷新
const refreshCaptcha = () => {
  captcha.value = generateRandomString(4)
}
</script>
<template>
  <el-form ref="formRef" :model="formData" :rules="rules">
    <el-form-item prop="userName" class="captcha-input">
      <ElInput
        v-model="formData.userName"
        placeholder="请输入用户名"
        class="h-60px"
        clearable
        :prefix-icon="User"
        @keyup.enter="submitForm(formRef)" />
    </el-form-item>
    <el-form-item prop="pwd" class="captcha-input">
      <ElInput
        v-model="formData.pwd"
        placeholder="请输入密码"
        class="h-60px w-full"
        :class="{error: isPasswordError}"
        clearable
        show-password
        :prefix-icon="Key"
        @keyup.enter="submitForm(formRef)" />
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item prop="code" class="captcha-input">
      <div class="flex items-center">
        <ElInput
          v-model="formData.code"
          placeholder="请输入验证码"
          class="h-60px"
          clearable
          :prefix-icon="Message"
          @keyup.enter="submitForm(formRef)" />
        <div class="ml-10px cursor-pointer" @click="refreshCaptcha">
          <span class="flow-colorful">{{ captcha }}</span>
        </div>
      </div>
    </el-form-item>
    <el-button type="primary" :loading="showLoading" class="mt-44px min-h-50px w-full text-18px" @click="submitForm(formRef)" size="large">
      登 录
    </el-button>
  </el-form>
</template>

<style lang="scss" scoped>
.captcha-input {
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
    // border-color: red !important;
    color: red !important;
  }
}

.flow-colorful {
  /*max-width: 600px;*/
  height: 150px;
  background: linear-gradient(45deg, #00ffec, #75f4e4, #7886f4, #1086f4);
  animation: text-animation 1s ease-in-out infinite;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  font-size: 24px;
  text-align: center;
  text-decoration: line-through solid rgba(0, 0, 0, 0.5) 1px !important;
}

@keyframes text-animation {
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
}
</style>
