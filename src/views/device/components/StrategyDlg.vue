<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import deviceData from "@/views/device/deviceData.json"
import electricityData from "@/views/device/electricityData.json"

const props = defineProps<{
  deviceId: string
}>()

const StrategyDlgEdit = defineAsyncComponent(() => import("@/views/device/components/StrategyDlgEdit.vue"))
const strategyDlgEditRef = ref<any>(null)
const dialogVisible = ref(false)
const openStrategy = () => {
  dialogVisible.value = true
  getDevLastSetCFD()
}
const nextTime: any = ref("")

const getNextTime = async () => {
  // 使用JSON数据
  nextTime.value = deviceData.data.deviceStrategy.devTime
}
getNextTime()
const openStrategyEdit = (v: any) => {
  dialogVisible.value = false
  strategyDlgEditRef.value.openStrategyEdit(v)
}

const policyList = ref<any>({
  cdPolicy: [],
  fdPolicy: [],
  devTime: "",
})
// 当前策略
const getDevLastSetCFD = async () => {
  // 使用JSON数据
  policyList.value.devTime = deviceData.data.deviceStrategy.devTime
  policyList.value.cdPolicy = deviceData.data.deviceStrategy.cdPolicy
  policyList.value.fdPolicy = deviceData.data.deviceStrategy.fdPolicy
}

// 获取电价模板列表
const electricityPriceList = ref()
const GetElectricPriceTemplatePageListData = async () => {
  // 使用JSON数据
  electricityPriceList.value = electricityData.data.priceTemplates.templates
}
GetElectricPriceTemplatePageListData()
defineExpose({
  openStrategy,
})
// (1峰，2平，3谷，4尖峰，5高尖峰)
const periodTypeMap: any = {
  1: "峰",
  2: "平",
  3: "谷",
  4: "尖峰",
  5: "高尖峰",
}
const headerCellStyle = {
  background: "#EDF0F3",
  color: "#606266",
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="当前充放电策略" width="60%" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="mb4">最新数据上报时间：{{ policyList.devTime || "暂无" }}</div>
    <table style="border-collapse: collapse; width: 100%; border: 1px solid #d4d9e0">
      <tbody>
        <tr style="background-color: #f2f2f2">
          <th style="border: 1px solid #d4d9e0; width: 20%; height: 50px; background-color: #edf0f3">充放周期</th>
          <th style="border: 1px solid #d4d9e0; background-color: #edf0f3; background-color: #edf0f3">每天</th>
        </tr>
        <tr>
          <td style="border: 1px solid #d4d9e0; background-color: #fff; text-align: center; background-color: #edf0f3">充电</td>
          <td style="border: 1px solid #d4d9e0; background-color: #fff">
            <div class="m8">
              <el-table :data="policyList.cdPolicy" border :header-cell-style="headerCellStyle">
                <el-table-column prop="periodType" label="峰平谷状态">
                  <template #default="{row}">
                    {{ periodTypeMap[row.periodType] }}
                  </template>
                </el-table-column>
                <el-table-column prop="period" label="时段" />
                <el-table-column prop="power" label="功率(kW)" />
              </el-table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #d4d9e0; background-color: #fff; text-align: center; background-color: #edf0f3">放电</td>
          <td style="border: 1px solid #d4d9e0; background-color: #fff">
            <div class="m8">
              <el-table :data="policyList.fdPolicy" border :header-cell-style="headerCellStyle">
                <el-table-column prop="periodType" label="峰平谷状态">
                  <template #default="{row}">
                    {{ periodTypeMap[row.periodType] }}
                  </template>
                </el-table-column>
                <el-table-column prop="period" label="时段" />
                <el-table-column prop="power" label="功率(kW)" />
              </el-table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="my4 leading-8" id="nextTime" style="display: block">
      <el-descriptions class="margin-top w-50%" :column="1" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item my2">下次执行时间</div>
          </template>
          {{ nextTime || "暂无" }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <div class="flex justify-center my-8">
        <el-button type="primary" class="mr10" @click="openStrategyEdit">远程调整策略</el-button>
        <el-button @click="dialogVisible = false">关闭页面</el-button>
      </div>
    </div>
  </el-dialog>
  <StrategyDlgEdit ref="strategyDlgEditRef" :deviceId="props.deviceId" @updataTime="getNextTime" />
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
