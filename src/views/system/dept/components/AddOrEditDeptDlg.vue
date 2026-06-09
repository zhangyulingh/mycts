<script setup lang="ts">
import {reactive, ref} from "vue"
import {ElMessage, FormInstance} from "element-plus"

const dialogVisible = ref(false)
const iniData = () => ({
  parentID: 0,
  name: "",
  name1: "",
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)
const msgText = ref("")

const initAndShow = (type: string, data?: any) => {
  dialogVisible.value = true
  if (type === "edit") {
    msgText.value = "编辑部门"
    Object.assign(form, data, {name1: data.name})
  } else if (type === "add") {
    msgText.value = "新增部门"
    Object.assign(form, {
      parentID: data.id,
      name1: data.name,
      name: "",
    })
  } else if (type === "add01") {
    msgText.value = "新增部门"
    Object.assign(form, {
      parentID: 0,
      name1: "顶级部门",
      name: "",
    })
  }
}
const emits = defineEmits(["updateList"])

const rules = {
  name: [{required: true, message: "请输入部门名称", trigger: "blur"}],
}

// 新增或编辑部门
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    const successMessage = msgText.value === "新增部门" ? "新增成功" : "编辑成功"
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
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="上级部门">
            <el-input v-model="form.name1" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="二级部门" prop="name">
            <el-input v-model="form.name" placeholder="请输入二级部门名称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex justify-center my-4">
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
