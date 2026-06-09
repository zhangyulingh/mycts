<script setup lang="ts">
import {reactive, ref} from "vue"
import {AddAction, UpdateAction} from "@/api/system/menuAndAction"
import {ElMessage, FormInstance} from "element-plus"

const dialogVisible = ref(false)
const iniData = () => ({
  menuID: 0,
  name: "",
  apiPath: "",
  remark: "",
  sort: 0,
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)
const msgText = ref("")
const menuName = ref("")

const initAndShow = (menu: any, type: string, row?: any) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  if (type === "edit") {
    msgText.value = "编辑功能菜单"
    Object.assign(form, row)
    menuName.value = menu.name
  } else {
    msgText.value = "新增功能"
    Object.assign(form, iniData())
    form.menuID = menu.id
    menuName.value = menu.name
  }
}
const emits = defineEmits(["updateList"])

const rules = {
  name: [{required: true, message: "请输入菜单名称", trigger: "blur"}],
}

// 新增或编辑菜单
const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (isFormValid) {
    const successMessage = msgText.value === "新增功能" ? "新增成功" : "编辑成功"
    const submitTask = msgText.value === "新增功能" ? AddAction(form) : UpdateAction(form)
    await submitTask
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
  <el-dialog v-model="dialogVisible" width="25%">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="所属菜单">
            <span>{{ menuName }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="功能名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入功能名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="API路径">
            <el-input v-model="form.apiPath" placeholder="请输入API路径" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              placeholder="请输入排序"
              clearable
              class="w-full"
              controls-position="right"
              :min="0"
              :max="1000"
              :step="1"></el-input-number>
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
