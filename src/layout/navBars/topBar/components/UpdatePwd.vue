<script setup lang="ts">
import {UpdatePwd} from "@/api/system/dept"
import {ElMessage, FormInstance} from "element-plus"
import {encryptByAes} from "@/utils/cipher"
import {ref, reactive} from "vue"
import {useRouter} from "vue-router"
import {Session, Local} from "@/utils/storage"

const router = useRouter()

const dialogVisible = ref(false)
const iniData = () => ({
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)

const initAndShow = (data: any) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  Object.assign(form, {
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
  })
}
const validateConfirmPwd = (rule: any, value: string, callback: any) => {
  if (value !== form.newPwd) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}
const rules = {
  oldPwd: [{required: true, message: "请输入旧密码", trigger: "blur"}],
  newPwd: [{required: true, message: "请输入新密码", trigger: "blur"}],
  confirmPwd: [
    {required: true, message: "请确认新密码", trigger: "blur"},
    {validator: validateConfirmPwd, trigger: "blur"},
  ],
}

// 新增或编辑员工
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (!isFormValid) return
  const encryptedForm = {
    oldPwd: encryptByAes(form.oldPwd),
    newPwd: encryptByAes(form.newPwd),
  }

  try {
    await UpdatePwd(encryptedForm)
    dialogVisible.value = false
    ElMessage.success("密码已修改！")
    Session.clear()
    Local.clear()
    window.location.reload()
    router.push({path: "/login"})
  } catch (error) {
    ElMessage.error("操作失败")
    console.error("操作失败", error)
  }
}

// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="25%" title="修改密码" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="80px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="form.oldPwd" placeholder="请输入旧密码" clearable show-password type="password" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="form.newPwd" placeholder="请输入新密码" clearable show-password type="password" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model="form.confirmPwd" placeholder="请确认新密码" clearable show-password type="password" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-8">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
