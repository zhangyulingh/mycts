<script setup lang="ts">
import {reactive, ref} from "vue"
import {AddAccount, UpdateAccount} from "@/api/customer"
import {ElMessage, FormInstance} from "element-plus"

defineProps({
  accountData: {
    type: Object,
    default: () => ({}),
  },
})
const dialogVisible = ref(false)
const iniData = () => ({
  customerID: 0,
  accountID: 0,
  trueName: "",
  userName: "",
  pwd: "",
})
let form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)
const msgText = ref("")

const openAccountAddOrEdit = (type: string, accountData: any, customerID?: any) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  if (type === "edit") {
    msgText.value = "编辑客户"
    Object.assign(form, {
      customerID: customerID,
      accountID: accountData.accountID,
      trueName: accountData.trueName,
      userName: accountData.userName,
    })
  } else {
    Object.assign(form, {
      customerID: customerID,
      accountID: 0,
      trueName: "",
      userName: "",
      pwd: "",
    })
    msgText.value = "创建客户"
  }
}
const emits = defineEmits(["updateAccount"])

const rules = {
  trueName: [{required: true, message: "请输入管理员姓名", trigger: "blur"}],
  userName: [{required: true, message: "请输入手机号/用户名", trigger: "blur"}],
  pwd: [{required: true, message: "请输入密码", trigger: "blur"}],
}

// 新增或编辑客户
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    // dialogVisible.value = false // 在此关闭对话框
    const successMessage = msgText.value === "创建客户" ? "创建成功" : "编辑成功"
    // try {
    //   const submitTask = msgText.value === "创建客户" ? AddAccount(form) : UpdateAccount(form)
    //   await submitTask
      emits("updateAccount", form.accountID ? {...form} : {...form, accountID: 0})
      ElMessage.success(successMessage)
    // } catch (error) {
    //   ElMessage.error("操作失败")
    // }
  }
}

// 暴露变量
defineExpose({
  openAccountAddOrEdit,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="50%" :title="msgText">
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="110px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="管理员姓名" prop="trueName">
            <el-input v-model="form.trueName" placeholder="请输入角色名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="手机号/用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入客户联系人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="密码" prop="pwd" v-if="msgText === '创建客户'">
            <el-input v-model="form.pwd" type="password" placeholder="请输入密码" clearable></el-input>
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
