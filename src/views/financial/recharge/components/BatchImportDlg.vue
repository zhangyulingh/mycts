<script setup lang="ts">
import {reactive, ref} from "vue"
import {GetRechargeTemplateAddr, BatchImportRecharge} from "@/api/finacial"
import {Upload} from "@/components/ExcelUpload"

const uploader = new Map<string, () => Promise<any>>()
provide("uploader", uploader)

import {ElMessage, FormInstance} from "element-plus"

const dialogVisible = ref(false)
const iniData = () => ({
  data: [],
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)

const getGetRechargeTemplate = ref("")
// const getGetRechargeTemplateAddr = async () => {
//   const res: any = await GetRechargeTemplateAddr()
//   getGetRechargeTemplate.value = res
// }

const initAndShow = () => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  // getGetRechargeTemplateAddr()
}
const emits = defineEmits(["updateList"])

// 充值操作
const onSubmit = async () => {
  // 等待所有上传操作完成
  const fn = uploader.get("excel")
  fn().then((res) => {
    const ps = res.map((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target.result) {
          BatchImportRecharge({data: e.target.result.split(",")[1]}).then((res) => {
            ElMessage.success("导入成功")
            dialogVisible.value = false
            emits("updateList")
          })
        }
      }
      reader.readAsDataURL(file.raw)
    })
  })
}

// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="50%" title="批量导入" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" size="default" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="线下充值记录模版:" label-width="130px">
            <el-link class="text-#16BAAA" :href="getGetRechargeTemplate">下载</el-link>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="导入文件:" label-width="130px">
            <Upload v-model="form.data" name="excel" />
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
