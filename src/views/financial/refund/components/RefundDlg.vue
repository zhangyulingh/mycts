<script setup lang="ts">
import {reactive, ref} from "vue"
import {ChargeAndRefundOper} from "@/api/finacial"
import {GetAllCustomerName} from "@/api/customer"

const uploader = new Map<string, () => Promise<any>>()
provide("uploader", uploader)

import {ElMessage, FormInstance} from "element-plus"

const dialogVisible = ref(false)
const iniData = () => ({
  type: 0,
  customerID: "",
  amount: undefined,
  remark: "",
})
const getAllCustomerNameList = ref([
    {id: 1, name: "客户1"},
  {id: 2, name: "客户2"},
  {id: 3, name: "客户3"}, 
])
// async function getAllCustomerName() {
//   const res: any = await GetAllCustomerName()
//   getAllCustomerNameList.value = res.data
// }
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)
const rules = {
  type: [{required: true, message: "请选择充值类型", trigger: "blur"}],
  customerID: [{required: true, message: "请选择客户名称", trigger: "blur"}],
  amount: [
    {required: true, message: "请填入大于0的正数，小数点保留两位", trigger: "blur"},
    {pattern: /^\d+(\.\d{1,2})?$/, message: "请填入大于0的正数，小数点保留两位", trigger: "blur"},
  ],
  remark: [{required: true, message: "请输入备注", trigger: "blur"}],
}

const initAndShow = () => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  getAllCustomerName()
}
const emits = defineEmits(["updateList"])

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
  const res: any = await ChargeAndRefundOper(form)
  if (res) {
    ElMessage.success("操作成功")
    dialogVisible.value = false
    emits("updateList")
  } else {
    ElMessage.error("操作失败")
  }
  // 重置表单字段、清空凭证地址数组并重新获取客户名称列表
  formRef.value?.resetFields()
  getAllCustomerName()
}
// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="20%" title="扣退费操作" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="人工退费" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="1">异常调整</el-radio>
              <el-radio label="2">销户退费</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="客户名称" prop="customerID">
            <el-select v-model="form.customerID" placeholder="请选择客户名称" clearable class="w-full">
              <el-option v-for="item in getAllCustomerNameList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="扣费金额" prop="amount">
            <el-input v-model="form.amount" placeholder="请输入扣费金额" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center">
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
