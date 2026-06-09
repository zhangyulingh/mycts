<script setup lang="ts">
import {ElMessage, FormInstance} from "element-plus"
import {reactive, ref} from "vue"
import {updateShareRatio} from "@/composables/useCustomer"

defineProps({
  divideData: {
    type: Object,
    default: () => ({}),
  },
})
const ruleForm = reactive({
  id: 0,
  ShareRatio: 0,
})
const dialogVisible = ref(false)

const openDivide = (divideData: any) => {
  dialogVisible.value = true
  Object.assign(ruleForm, divideData)
}
const ruleFormRef = ref<FormInstance>()

const rules = {
  ShareRatio: [{required: true, message: "请输入分成比例", trigger: "blur"}],
}
const emits = defineEmits(["update-share-ratio"])
const onsubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      // await updateShareRatio(ruleForm.id, ruleForm.ShareRatio)
      dialogVisible.value = false
      ElMessage.success("修改分成比例成功！")
      // 触发自定义事件，将新的分成比例传递给父组件
      emits("update-share-ratio", ruleForm.ShareRatio)
    } else {
      ElMessage.error("请检查输入项")
    }
  })
}
// 暴露变量
defineExpose({
  openDivide,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="分成比例管理" width="20%">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item label="分成比例" prop="ShareRatio">
        <div class="flex justify-between w-full">
          <el-input v-model="ruleForm.ShareRatio" placeholder="请输入分成比例" class="w-80">
            <template #append>%</template>
          </el-input>
        </div>
        <div class="text-sm my2">注:请填入0~100的有效数字，小数点保留两位</div>
      </el-form-item>
    </el-form>
    <div class="flex justify-center my-4">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onsubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
