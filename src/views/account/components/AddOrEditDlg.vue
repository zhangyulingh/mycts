<template>
  <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="550px">
    <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" :label-width="state.selfEdit ? '100px' : '90px'">
      <el-row :gutter="30">
        <el-col v-if="!state.selfPasswordOnly" :xs="24" :sm="state.selfEdit ? 24 : 12" class="mb-20px">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="state.ruleForm.username"
              placeholder="请输入用户名"
              clearable
              :disabled="state.dialog.type === 'edit' && !state.selfEdit" />
          </el-form-item>
        </el-col>

        <template v-if="state.selfEdit">
          <el-col :xs="24" :sm="24" class="mb-20px">
            <el-form-item label="原密码">
              <el-input
                v-model="state.ruleForm.oldPassword"
                type="password"
                show-password
                placeholder="修改密码时必填"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" class="mb-20px">
            <el-form-item label="新密码">
              <el-input
                v-model="state.ruleForm.newPassword"
                type="password"
                show-password
                placeholder="留空则不修改密码"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" class="mb-20px">
            <el-form-item label="确认密码">
              <el-input
                v-model="state.ruleForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
                clearable />
            </el-form-item>
          </el-col>
        </template>

        <el-col v-else :xs="24" :sm="12" class="mb-20px">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="state.ruleForm.password"
              type="password"
              show-password
              :placeholder="state.dialog.type === 'edit' ? '留空则不修改' : '请输入密码'"
              clearable />
          </el-form-item>
        </el-col>

        <el-col v-if="!state.selfEdit" :xs="24" :sm="12" class="mb-20px">
          <el-form-item label="昵称">
            <el-input v-model="state.ruleForm.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="!state.selfEdit" :xs="24" :sm="12" class="mb-20px">
          <el-form-item label="角色">
            <el-select v-model="state.ruleForm.role" placeholder="请选择角色" clearable class="w-full">
              <el-option v-if="isPrimaryAdmin" label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="!state.selfEdit" :xs="24" :sm="12" class="mb-20px">
          <el-form-item label="手机号">
            <el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="default" :loading="state.loading">{{ state.dialog.submitTxt }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref, computed} from "vue"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus"
import {Session} from "@/utils/storage"
import {addAccount, updateAccount} from "@/api/account"

const emit = defineEmits(["refresh", "selfUpdated"])
const dialogFormRef = ref()
const router = useRouter()
let originalUsername = ""

const isPrimaryAdmin = computed(() => {
  const userInfo = Session.get("userInfo")
  return userInfo?.isPrimaryAdmin === true || userInfo?.userName === "admin" || userInfo?.loginName === "admin"
})

const emptyPasswordFields = () => ({
  password: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})

const state = reactive({
  loading: false,
  selfEdit: false,
  selfPasswordOnly: false,
  ruleForm: {
    id: 0,
    username: "",
    password: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    nickname: "",
    role: "user",
    phone: "",
  },
  dialog: {
    isShowDialog: false,
    type: "add",
    title: "",
    submitTxt: "",
  },
})

const resetPasswordFields = () => {
  Object.assign(state.ruleForm, emptyPasswordFields())
}

const initAndShow = (row: any, options?: {selfEdit?: boolean; selfPasswordOnly?: boolean}) => {
  state.selfPasswordOnly = options?.selfPasswordOnly === true
  state.selfEdit = options?.selfEdit === true || state.selfPasswordOnly
  state.dialog.isShowDialog = true
  resetPasswordFields()
  if (row && row.id) {
    state.dialog.type = "edit"
    state.dialog.title = state.selfPasswordOnly
      ? "修改我的密码"
      : state.selfEdit
        ? "修改我的账号"
        : "编辑账号"
    state.dialog.submitTxt = "修 改"
    state.ruleForm.id = row.id
    state.ruleForm.username = row.username
    originalUsername = row.username
    state.ruleForm.nickname = row.nickname || ""
    state.ruleForm.role = row.role || "user"
    state.ruleForm.phone = row.phone || ""
  } else {
    state.dialog.type = "add"
    state.dialog.title = "新增账号"
    state.dialog.submitTxt = "新 增"
    Object.assign(state.ruleForm, {
      id: 0, username: "", nickname: "", role: "user", phone: "", ...emptyPasswordFields(),
    })
  }
}

const closeDialog = () => { state.dialog.isShowDialog = false }
const onCancel = () => { closeDialog() }

const validateSelfPassword = () => {
  const {oldPassword, newPassword, confirmPassword} = state.ruleForm
  const changingPassword = state.selfPasswordOnly || !!(oldPassword || newPassword || confirmPassword)
  if (!changingPassword) return true

  if (!oldPassword) {
    ElMessage.warning("请输入原密码")
    return false
  }
  if (!newPassword) {
    ElMessage.warning("请输入新密码")
    return false
  }
  if (!confirmPassword) {
    ElMessage.warning("请确认新密码")
    return false
  }
  if (newPassword !== confirmPassword) {
    ElMessage.warning("两次输入的新密码不一致")
    return false
  }
  return true
}

const shouldReLogin = (submitData: {username?: string; password?: string}) => {
  if (state.selfPasswordOnly) return true
  if (!state.selfEdit) return false
  if (submitData.password) return true
  if (submitData.username && submitData.username !== originalUsername) return true
  return false
}

const onSubmit = async () => {
  if (!state.ruleForm.username) { ElMessage.warning("请输入用户名"); return }
  if (state.dialog.type === "add" && !state.ruleForm.password) { ElMessage.warning("请输入密码"); return }
  if (state.selfEdit && !validateSelfPassword()) return

  state.loading = true
  try {
    let submitData: any

    if (state.selfEdit) {
      submitData = {username: state.ruleForm.username}
      if (state.selfPasswordOnly || state.ruleForm.newPassword) {
        submitData.oldPassword = state.ruleForm.oldPassword
        submitData.password = state.ruleForm.newPassword
      }
    } else {
      submitData = {
        username: state.ruleForm.username,
        nickname: state.ruleForm.nickname,
        phone: state.ruleForm.phone,
        role: state.ruleForm.role,
      }
      if (state.ruleForm.password) submitData.password = state.ruleForm.password
    }

    if (state.dialog.type === "edit") {
      await updateAccount(state.ruleForm.id, submitData)
      if (shouldReLogin(submitData)) {
        closeDialog()
        Session.clear()
        ElMessage.success("修改成功，请使用新账号信息重新登录")
        await router.push("/login")
        return
      }
      ElMessage.success("修改成功")
    } else {
      await addAccount(submitData)
      ElMessage.success("新增成功")
    }
    closeDialog()
    emit("refresh")
  } finally {
    state.loading = false
  }
}

defineExpose({initAndShow})
</script>
