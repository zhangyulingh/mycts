<script setup lang="ts">
import {reactive, ref} from "vue"
import {SwitchFilled} from "@element-plus/icons-vue"
import {pcaTextArr} from "element-china-area-data"
import {AddCustomer, UpdateCustomer} from "@/api/customer"
import {ElDivider, ElMessage, FormInstance} from "element-plus"

defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
})
const dialogVisible = ref(false)
const iniData = () => ({
  id: 0,
  name: "",
  contacts: "",
  telephone: "",
  province: "",
  city: "",
  county: "",
  cachesounty: "",
  address: "",
  invoiceName: "",
  invoiceDutyNum: "",
  invoiceAddress: "",
  invoiceTelephone: "",
  invoiceBank: "",
  invoiceAccount: "",
})
const form = reactive(iniData())
const selectedOptions = ref()
const formRef = ref<FormInstance | null>(null)
const msgText = ref("")

const initAndShow = (detailData: any) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  if (detailData && detailData.id) {
    msgText.value = "编辑客户"
    Object.assign(form, detailData)
    selectedOptions.value = [detailData.province, detailData.city, detailData.county]
  } else {
    msgText.value = "新增客户"
    Object.assign(form, iniData())
    selectedOptions.value = []
  }
}
const emits = defineEmits(["updateList"])
const changeCustomer = (v: any) => {
  form.province = v[0]
  form.city = v[1]
  form.county = v[2]
}

const phoneReg = /^1[3456789]\d{9}$/
const rules = {
  name: [{required: true, message: "请输入客户名称", trigger: "blur"}],
  contacts: [{required: true, message: "请输入客户联系人", trigger: "blur"}],
  telephone: [
    {required: true, message: "请输入联系方式", trigger: "blur"},
    {
      pattern: phoneReg,
      message: "请输入正确的手机号, 11位数字",
      trigger: "blur",
    },
  ],
  address: [{required: true, message: "请输入企业地址", trigger: "blur"}],
}

// 新增或编辑客户
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    const successMessage = msgText.value === "新增客户" ? "新增成功" : "编辑成功"
    // const submitTask = msgText.value === "新增客户" ? AddCustomer(form) : UpdateCustomer(form)
    // await submitTask
    // emits("updateList")
    ElMessage.success(successMessage)
    dialogVisible.value = false
  }
}
// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="40%">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <div class="w-full ml-4 mb-4 font-bold flex items-center">
          <el-icon class="text-#16BAAA text-xl -rotate-90 mr2"><SwitchFilled /></el-icon>
          <span>客户信息</span>
        </div>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入客户名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts" placeholder="请输入联系人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="联系方式" prop="telephone">
            <el-input v-model="form.telephone" placeholder="请输入联系方式" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="企业地址" prop="address">
            <el-cascader :options="pcaTextArr" v-model="selectedOptions" :emitPath="false" @change="changeCustomer" class="mb4 w-full" />
            <el-input v-model="form.address" placeholder="请输入详细地址" clearable class="w-full"></el-input>
          </el-form-item>
        </el-col>
        <ElDivider />
        <div class="w-full ml-4 mb-4 font-bold flex items-center">
          <el-icon class="text-#16BAAA text-xl -rotate-90 mr2"><SwitchFilled /></el-icon>
          <span>开票信息</span>
        </div>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="企业名称">
            <el-input v-model="form.invoiceName" placeholder="请输入企业名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="开票税号">
            <el-input v-model="form.invoiceDutyNum" placeholder="请输入开票税号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="开票地址">
            <el-input v-model="form.invoiceAddress" placeholder="请输入开票地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="开票电话">
            <el-input v-model="form.invoiceTelephone" placeholder="请输入开票电话" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="开票银行">
            <el-input v-model="form.invoiceBank" placeholder="请输入开票银行" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="银行账号">
            <el-input v-model="form.invoiceAccount" placeholder="请输入银行账号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-2">
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
