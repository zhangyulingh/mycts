<script setup lang="ts">
import {onMounted, ref} from "vue"
import {defineExpose} from "vue"
import electricityData from "@/views/device/electricityData.json"

const props = defineProps<{
  deviceId: string
}>()
const drawer = ref(false)
const selectedRow = ref<any>({})
const detailDrawRef = ref<any>(null)

const DetailDraw = defineAsyncComponent(() => import("@/views/device/components/DetailDraw.vue"))
const onOpenDetail = async (row: any) => {
  try {
    // 从电价模板数据中查找对应的模板详情
    const templateDetail = electricityData.data.priceTemplates.templates.find((template: any) => template.id === row.id)
    selectedRow.value = templateDetail || row
    detailDrawRef.value?.openDrawer()
  } catch (error) {
    console.error("获取电价模板详情失败", error)
  }
}
// const priceTemplateRef = ref<any>(null)
// const PriceTemplate = defineAsyncComponent(() => import("@/views/device/components/PriceTemplate.vue"))
// 电价选择模板
// const openStrategy = () => {
//   priceTemplateRef.value.openStrategy()
// }

// 获取电价模板应用记录
const priceListData = ref<any>(null)
const getElectricPriceApplyListData = async () => {
  // 使用JSON数据
  priceListData.value = electricityData.data.priceApplyRecords.records
}
// 获取props.devideId
onMounted(() => {})
const openPriceDrawer = () => {
  drawer.value = true
  getElectricPriceApplyListData()
}

// 暴露变量
defineExpose({
  openPriceDrawer,
})
</script>

<template>
  <el-drawer v-model="drawer" direction="rtl" size="80%" :with-header="false">
    <div class="flex justify-between my-2 p-4">
      <div class="font-bold">电价模板应用记录</div>
      <!-- <el-button type="primary" @click="openStrategy">选择应用模板</el-button> -->
    </div>
    <div class="p-2">
      <el-table :data="priceListData" stripe border :header-cell-style="{'text-align': 'left', 'background-color': '#f5f7fa'}">
        <el-table-column type="index" label="序号" width="60" center />
        <el-table-column prop="name" label="电价模板" show-overflow-tooltip>
          <template #default="{row}">
            <div class="flex justify-between">
              <span type="success">{{ row.name }}</span>
              <div>
                <el-tag v-if="row.isExecuting === true" type="success">执行中</el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="effectTime" label="生效时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addUserName" label="操作人员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addTime" label="操作时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="查看模板">
          <template #default="{row}">
            <el-button type="text" @click="onOpenDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
  <DetailDraw ref="detailDrawRef" :detailData="selectedRow" />
  <!-- <PriceTemplate ref="priceTemplateRef" /> -->
</template>
