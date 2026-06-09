<script setup lang="ts">
import {onMounted, ref, defineAsyncComponent} from "vue"
import {defineExpose} from "vue"
import {ElAmap, ElAmapMarker} from "@vuemap/vue-amap"
import {ElMessage, ElMessageBox, FormInstance} from "element-plus"
import deviceData from "@/views/device/deviceData.json"

const props = defineProps<{
  deviceId: string
}>()

const drawer = ref(false)
const bindInfoList = ref<any>()
const bindLocatDialog = ref(false)
const formRef = ref<FormInstance | null>(null)
const initData = () => ({
  devCode: "",
  locatDevID: "",
})
const form = reactive(initData())
// 导入组件
const PriceTemplate = defineAsyncComponent(() => import("@/views/device/components/PriceTemplate.vue"))
const getLocatDevInfoList = async () => {
  // 使用JSON数据
  bindInfoList.value = deviceData.data.deviceBindInfo
  const gcJ02 = deviceData.data.deviceBindInfo.gcJ02
  bindInfoList.value.gcJ02 = [gcJ02[0], gcJ02[1]]
}
const handleBindLocat = () => {
  bindLocatDialog.value = true
}
// 解绑
const handleUnbindLocatDev = () => {
  ElMessageBox.confirm("确定解绑该定位器吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 模拟解绑操作
    ElMessage.success("解绑成功")
    drawer.value = false
    // 刷新列表
    getLocatDevInfoList()
  })
}

const rules = {
  devCode: [{required: true, message: "请输入设备编号", trigger: "blur"}],
  locatDevID: [{required: true, message: "请输入定位器编号", trigger: "blur"}],
}
onMounted(() => {})
const openBindDrawer = () => {
  drawer.value = true
  getLocatDevInfoList()
}
// 暴露变量
defineExpose({
  openBindDrawer,
})
const onsubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      form.devCode = props.deviceId
      const res = await bindLocatDev(form)
      if (res) {
        ElMessage.success("绑定成功")
        bindLocatDialog.value = false
        // 刷新列表
        getLocatDevInfoList()
      }
    }
  })
}
</script>

<template>
  <el-drawer v-model="drawer" direction="rtl" size="80%" title="绑定定位器信息">
    <div class="p-4">
      <div v-if="bindInfoList?.isBindLocatDev === true">
        <div class="flex justify-between items-center">
          <div class="font-bold">绑定定位器信息</div>
          <div>
            <el-button type="danger" plain @click="handleUnbindLocatDev">解绑</el-button>
          </div>
        </div>
        <div class="my-4">
          <el-descriptions class="margin-top" :column="2" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">定位器编号</div>
              </template>
              {{ bindInfoList?.locatDevID }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">定位器状态</div>
              </template>
              <el-tag v-if="bindInfoList?.locatDevState === 1" type="success">正常</el-tag>
              <el-tag v-else type="danger">告警</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">当前定位地址</div>
              </template>
              {{ bindInfoList?.address }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">最新上传时间</div>
              </template>
              {{ bindInfoList?.locatTime }}
            </el-descriptions-item>
          </el-descriptions>
          <div class="mt-4 w-full h-50">
            <el-amap :zoom="16" :center="bindInfoList?.gcJ02" :markers="[{position: bindInfoList?.gcJ02}]">
              <el-amap-marker :position="bindInfoList?.gcJ02" />
            </el-amap>
          </div>
        </div>
      </div>
      <div class="my-4 flex flex-col items-center justify-center" v-else>
        <el-empty description="未绑定定位器" />
        <el-button type="primary" plain @click="handleBindLocat">绑定定位器 →</el-button>
      </div>
      <el-dialog v-model="bindLocatDialog" title="绑定定位器" width="500">
        <el-form :rules="rules" ref="formRef" :model="form" label-width="100px">
          <el-form-item label="定位器编号" prop="locatDevID">
            <el-input v-model="form.locatDevID" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="bindLocatDialog = false">取消</el-button>
            <el-button type="primary" @click="onsubmit"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-drawer>
  <PriceTemplate ref="priceTemplateRef" />
</template>
