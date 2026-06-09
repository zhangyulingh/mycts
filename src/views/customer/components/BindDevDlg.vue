<script setup lang="ts">
import {Ref, reactive, ref} from "vue"
import {getAllUnbindDevCode} from "@/api/customer"
import {BindDev} from "@/api/customer"
import {ElMessage} from "element-plus"

defineProps({
  bindDevData: {
    type: Object,
    default: () => ({}),
  },
})

const dialogVisible = ref(false)
const ruleFormRef = ref()
const ruleForm = reactive({
  customerID: 0,
  devCode: "",
  installer: "",
  installDate: "",
})

const allUnbindDevCodeList: Ref<string[]> = ref([])
const isDevCodeLoaded = ref(false) // 用于检查设备编号是否已加载

const openBindDevice = (bindDevData: any) => {
  ruleForm.customerID = bindDevData.customerID

  if (!isDevCodeLoaded.value) {
    getAllUnbindDevCodeList()
  }

  dialogVisible.value = true
}

async function getAllUnbindDevCodeList() {
  // const response = await getAllUnbindDevCode()
  // console.log(response.data)
  allUnbindDevCodeList.value = ['1701240105', '1701240111']
  isDevCodeLoaded.value = true // 标记设备编号已加载
}

const rules = {
  devCode: [{required: true, message: "请选择设备编号", trigger: "change"}],
  installer: [{required: true, message: "请输入安装人员", trigger: "blur"}],
  installDate: [{required: true, message: "请选择安装日期", trigger: "change"}],
}

const onsubmit = () => {
  ruleFormRef.value.validate(async (valid: any) => {
    if (valid) {
      // await BindDev({
      //   customerID: ruleForm.customerID,
      //   devCode: ruleForm.devCode,
      //   installer: ruleForm.installer,
      //   installDate: ruleForm.installDate,
      // })
      dialogVisible.value = false
      ElMessage.success("绑定成功")
      emits("updateDev")
    } else {
      ElMessage.error("请检查输入")
    }
  })
}

// 暴露变量
defineExpose({
  openBindDevice,
})
const emits = defineEmits(["updateDev"])
</script>

<template>
  <el-dialog v-model="dialogVisible" title="绑定设备" width="25%">
    <el-form label-width="80px" style="width: 100%" :rules="rules" :model="ruleForm" ref="ruleFormRef">
      <el-form-item label="设备编号" prop="devCode">
        <el-select v-model="ruleForm.devCode" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in allUnbindDevCodeList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="安装人员" prop="installer">
        <el-input v-model="ruleForm.installer" placeholder="请输入安装人员" />
      </el-form-item>
      <el-form-item label="安装日期" prop="installDate">
        <el-date-picker v-model="ruleForm.installDate" type="date" placeholder="选择日期" format="YYYY-MM-DD" style="width: 100%" />
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
