<script setup lang="ts">
import {reactive, ref} from "vue"
import {UploadRechargeVoucher} from "@/api/finacial"
const props = defineProps({
  rechargeId: {
    type: Number,
    default: 0,
  },
})
import {Upload} from "@/components/ImageUpload"
const uploader = new Map<string, () => Promise<any>>()
provide("uploader", uploader)

import {ElMessage, FormInstance} from "element-plus"

const dialogVisible = ref(false)
const iniData = () => ({
  id: 0,
  voucherAddress: [],
})

const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)

const initAndShow = () => {
  dialogVisible.value = true
  formRef.value?.resetFields()
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
  const res: any = await UploadRechargeVoucher({
    id: props.rechargeId,
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
}

// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="20%" title="上传凭证" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" size="default">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="凭证图片">
            <Upload v-model="form.voucherAddress" name="voucherAddress" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-4">
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
