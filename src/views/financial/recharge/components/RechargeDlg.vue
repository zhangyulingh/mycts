<script setup lang="ts">
import {reactive, ref} from "vue"
import {RechargeOper} from "@/api/finacial"
import {GetAllCustomerName} from "@/api/customer"

import {Upload} from "@/components/ImageUpload"
const uploader = new Map<string, () => Promise<any>>()
provide("uploader", uploader)

import {ElMessage, FormInstance} from "element-plus"

const dialogVisible = ref(false)
const iniData = () => ({
  customerID: undefined,
  rechargeAmount: undefined,
  date: "",
  remark: "",
  voucherAddress: [],
})
const getAllCustomerNameList = ref([
  {id: 1, name: "客户1"},
  {id: 2, name: "客户2"},
  {id: 3, name: "客户3"}, 

])
// async function getAllCustomerName() {
//   // const res: any = await GetAllCustomerName()
//   // console.log(JSON.stringify(res))
//   getAllCustomerNameList.value = []
// }
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)

const initAndShow = () => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  // getAllCustomerName()
}
const emits = defineEmits(["updateList"])

const rules = {
  customerID: [{required: true, message: "请输入客户名称", trigger: "blur"}],
  rechargeAmount: [{required: true, message: "请输入充值金额", trigger: "blur"}],
  date: [{required: true, message: "请输入充值日期", trigger: "blur"}],
  remark: [{required: true, message: "请输入备注", trigger: "blur"}],
}

// 充值操作
const onSubmit = async () => {
  // 等待表单验证完成
  const isFormValid = await formRef.value?.validate()
  // 等待所有上传操作完成
  await Promise.all(Array.from(uploader.values()).map((fn) => fn()))
  // 再次检查表单是否有效
  if (!isFormValid) {
    return
  }
  // 执行充值操作
  const res: any = await RechargeOper({
    customerID: form.customerID,
    rechargeAmount: form.rechargeAmount,
    date: form.date,
    remark: form.remark,
    voucherAddress: form.voucherAddress.map((item) => item.url),
  })
  if (res) {
    ElMessage.success("充值成功")
    dialogVisible.value = false
    emits("updateList")
  } else {
    ElMessage.error("充值失败")
  }
  // 重置表单字段、
  formRef.value?.resetFields()
  // 清空凭证地址数组并重新获取客户名称列表
  form.voucherAddress = []
  getAllCustomerName()
}

// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="50%" title="充值操作" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="客户名称" prop="customerID">
            <el-select v-model="form.customerID" placeholder="请选择客户名称" clearable>
              <el-option v-for="item in getAllCustomerNameList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="充值金额" prop="rechargeAmount">
            <el-input v-model="form.rechargeAmount" placeholder="请输入充值金额" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="充值日期" prop="date">
            <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="凭证图片">
            <Upload v-model="form.voucherAddress" name="voucherAddress" multiple limit="{5}" accept="image/*" placeholder="上传凭证" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-8">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
