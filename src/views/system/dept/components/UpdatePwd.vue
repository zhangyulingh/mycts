<script setup lang="ts">
import {reactive, ref} from "vue"
import {ElMessage, FormInstance} from "element-plus"
const dialogVisible = ref(false)
const iniData = () => ({
  oldPwd: "",
  newPwd: "",
})
const form = reactive(iniData())
const formRef = ref<FormInstance | null>(null)

const initAndShow = (data: any) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  Object.assign(form, {
    id: data.id,
    newPwd: "",
  })
}
const emits = defineEmits(["updateList"])

const rules = {
  oldPwd: [{required: true, message: "请输入旧密码", trigger: "blur"}],
  newPwd: [{required: true, message: "请输入员新密码", trigger: "blur"}],
}

// 新增或编辑员工

const onSubmit = async () => {
  const isFormValid = await formRef.value?.validate()
  if (!isFormValid) return
  try {
    dialogVisible.value = false
    ElMessage.success("重置成功！")
    emits("updateList")
  } catch (error) {
    console.error("操作失败", error)
  }
}

// 暴露变量
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="50%" title="修改密码" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" size="default" :rules="rules" label-width="100px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="form.oldPwd" placeholder="请输入旧密码" clearable show-password />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="form.newPwd" placeholder="请输入新密码" clearable show-password />
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
