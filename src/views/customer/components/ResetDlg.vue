<script setup lang="ts">
import {ElMessage, FormInstance} from "element-plus"
import {reactive, ref} from "vue"
import {resetAccountPwd} from "@/composables/useCustomer"
import {encryptByAes} from "@/utils/cipher"

defineProps({
  resetData: {
    type: Object,
    default: () => ({}),
  },
})
const dialogVisible = ref(false)
const ruleForm = reactive({
  customerID: 0,
  accountID: 0,
  newPwd: "",
})
const openResetPwd = (resetData: any) => {
  dialogVisible.value = true
  Object.assign(ruleForm, resetData)
}

const ruleFormRef = ref<FormInstance | null>(null)
const rules = {
  newPwd: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 20, message: "密码长度在6到20个字符", trigger: "blur"},
  ],
}
const onSubmit = async () => {
  const isValid = await ruleFormRef.value?.validate()
  if (isValid) {
    // await resetAccountPwd(ruleForm.customerID, ruleForm.accountID, encryptByAes(ruleForm.newPwd))
    dialogVisible.value = false
    ElMessage.success("重置密码成功！")
  }
}
// 暴露变量
defineExpose({
  openResetPwd,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="重置密码" width="30%">
    <el-form :rules="rules" ref="ruleFormRef" :model="ruleForm" label-width="80px">
      <el-form-item label="重置密码" prop="newPwd">
        <el-input v-model="ruleForm.newPwd" type="password" placeholder="请输入密码" />
      </el-form-item>
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
