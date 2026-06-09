<script setup lang="ts">
import {reactive, ref} from "vue"
import {SwitchFilled} from "@element-plus/icons-vue"
import {ElMessage, FormInstance} from "element-plus"
import supplierAndModelData from "@/views/device/supplierAndModelData.json"

defineProps({
  deviceData: {
    type: Object,
    default: () => ({}),
  },
})

const iniData = () => ({
  supplierID: "",
  modelID: "",
  devCode: "",
  factoryNo: "",
  devID: "",
})
const form = reactive(iniData())
const dialogVisible = ref(false)
const allSupplierList = ref([])
const allAllDevModel = ref([])
const formRef = ref<FormInstance | null>(null)

function getAllSupplierList() {
  // 使用合并的JSON数据
  allSupplierList.value = supplierAndModelData.data.suppliers
}

getAllSupplierList()

function getAllDevModel(supplierID: string, deviceData?: any) {
  // 根据供应商ID查找对应的设备型号
  const supplier = supplierAndModelData.data.suppliers.find((s: any) => s.id == supplierID)
  allAllDevModel.value = supplier ? supplier.deviceModels : []
  if (deviceData) form.modelID = allAllDevModel.value.find((c: any) => c.name === deviceData.modelName)?.id
}

const changeSupplier = (supplierID: string) => {
  form.supplierID = supplierID
  form.modelID = ""
  getAllDevModel(supplierID)
}
const msgText = ref("")
const initAndShow = (deviceData: any, type: string) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  if (type === "edit") {
    msgText.value = "编辑设备"
    form.supplierID = allSupplierList.value.find((c: any) => c.name === deviceData.supplierName)?.id
    getAllDevModel(form.supplierID, deviceData)
    Object.assign(form, deviceData)
  } else {
    msgText.value = "新增设备"
    Object.assign(form, iniData())
  }
}
const emits = defineEmits(["updateList"])

const rules = {
  devCode: [{required: true, message: "请输入设备编号", trigger: "blur"}],
  factoryNo: [{required: true, message: "请输入出厂编号", trigger: "blur"}],
  devID: [
    {required: true, message: "请输入设备序列号;前缀 P100M0215K240118", trigger: "blur"},
    // 前缀 P100M0215K240118
    {pattern: /^P100M0215K240118/, message: "请输入正确的设备序列号;前缀 P100M0215K240118", trigger: "blur"},
  ],
  supplierID: [{required: true, message: "请选择供应商", trigger: "change"}],
  modelID: [{required: true, message: "请选择设备型号", trigger: "change"}],
}

// 新增或编辑设备
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    const successMessage = msgText.value === "新增设备" ? "新增成功" : "编辑成功"
    // 使用JSON数据，不需要API调用
    // 这里可以添加数据到JSON文件或本地存储的逻辑
    emits("updateList")
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
  <el-dialog v-model="dialogVisible" width="30%">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <div class="w-full ml-4 font-bold flex items-center mb6">
          <el-icon class="text-#16BAAA text-xl -rotate-90 mr2">
            <SwitchFilled />
          </el-icon>
          <span>设备信息</span>
        </div>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="设备编号" prop="devCode">
            <el-input v-model="form.devCode" placeholder="请输入设备编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="出厂编号" prop="factoryNo">
            <el-input v-model="form.factoryNo" placeholder="请输入出厂编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="设备序列号" prop="devID">
            <el-input v-model="form.devID" placeholder="请输入设备序列号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="供应商" prop="supplierID">
            <el-select v-model="form.supplierID" placeholder="请选择供应商" clearable @change="changeSupplier" class="w-full">
              <el-option v-for="item in allSupplierList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="设备型号" prop="modelID">
            <el-select v-model="form.modelID" placeholder="请选择设备型号" clearable class="w-full">
              <el-option v-for="item in allAllDevModel" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
