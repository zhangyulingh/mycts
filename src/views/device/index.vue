<script setup lang="ts" name="pagesListAdapt">
import {defineAsyncComponent, ref, onBeforeUnmount} from "vue"
import dayjs from "dayjs"
import {formatNumber} from "@/utils/formatNumber"
import {useRouter} from "vue-router"
import {ElButton, ElMessage, ElMessageBox, FormInstance} from "element-plus"
import {pcaTextArr} from "element-china-area-data"
import {queryCondition, queriedResult, queryDeviceList, deleteDev} from "@/composables/useDevice"
import {Session} from "@/utils/storage"

queryDeviceList()

const selectedOptions = ref()
const selectedOptions1 = ref()
const daterangeRef = ref()
const AddOreditDlgRef = ref()
const qrcodeDialogRef = ref()
const deviceId = ref()
const deviceData = ref()
const queryFm = ref<FormInstance>()
const $router = useRouter()
// 引入组件
const props = {checkStrictly: true}
const AddOrEditDlg = defineAsyncComponent(() => import("@/views/device/components/AddOrEditDlg.vue"))
const QrcodeDialog = defineAsyncComponent(() => import("@/views/device/components/qrcodeDialog.vue"))
const ProgressBar = defineAsyncComponent(() => import("@/views/device/components/ProgressBar.vue"))
// 合成客户区域
const changeCustomer = () => {
  // 使用JSON数据，不需要实际筛选
  queryDeviceList()
}
// 合成设备定位区域
const changeDewLocateAddr = () => {
  // 使用JSON数据，不需要实际筛选
  queryDeviceList()
}
// 将选择的时间转换为指定格式
const formatDate = (date: string): string => {
  return dayjs(date).format("YYYY-MM-DD")
}

// 合成时间
const mergeTime = (v: any) => {
  if (v) {
    queryCondition.value.InstallDate_Start = formatDate(v[0])
    queryCondition.value.InstallDate_End = formatDate(v[1])
  } else {
    queryCondition.value.InstallDate_Start = ""
    queryCondition.value.InstallDate_End = ""
  }
  queryDeviceList()
}

// 打开新增设备弹窗
const onOpenAddOrEdit = async (type: string, v?: any) => {
  if (type === "edit") {
    // 从JSON数据中查找设备信息
    const deviceData = queriedResult.value.devList.find((dev) => dev.devCode === v.devCode)
    AddOreditDlgRef.value.initAndShow(deviceData, type)
  } else {
    AddOreditDlgRef.value.initAndShow(type)
  }
}
// 打开二维码弹窗 - 已移除，使用JSON数据
// const onOpenQrcode = (v: any) => {
//   qrcodeDialogRef.value.openDialog(v)
//   deviceId.value = v.devCode
// }
// 删除设备
const deleteDevice = (v: any) => {
  ElMessageBox.confirm("此操作将永久删除该设备, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteDev(v.id)
      ElMessage.success("删除成功")
      queryDeviceList()
    })
    .catch(() => {
      ElMessage.info("已取消删除")
    })
}

const openDetails = (devCode: number) => {
  $router.push({path: `/device/deviceDetails/${devCode}`})
}

// 设备状态文字
const statusText = (statusText: string) => {
  const tag: any = {
    正常: "正常",
    告警: "告警",
    故障: "故障",
    离线: "离线",
  }
  return tag[statusText]
}
// 重置
const resetFields = () => {
  queryCondition.value.InstallDate_Start = "" // 重置时间的值
  queryCondition.value.InstallDate_End = ""
  queryCondition.value.CustomerAddr_City = ""
  queryCondition.value.CustomerAddr_County = ""
  queryCondition.value.DevLocateAddr_Province = ""
  queryCondition.value.DevLocateAddr_City = ""
  queryCondition.value.DevLocateAddr_County = ""
  daterangeRef.value = ""
  selectedOptions.value = ""
  selectedOptions1.value = ""
  queryFm.value?.resetFields()
  queryDeviceList()
}
// 充放电状态文字
const electricityTag = (chargeAndDischargeState: string) => {
  const tag: any = {
    发电: "发电中",
    充电中: "充电中",
    放电中: "放电中",
    待机: "待机",
    "": "待机",
  }
  return tag[chargeAndDischargeState]
}
// 充放电状态背景色
const electricityTagbg = (chargeAndDischargeState: string) => {
  const tag: any = {
    发电: "bg-#00CC85",
    充电中: "bg-#00CC85",
    放电中: "bg-#007BFF",
    待机: "bg-#909090",
    "": "bg-#909090",
  }
  return tag[chargeAndDischargeState]
}
// 充放电状态文字颜色
const electricityTagColor = (chargeAndDischargeState: string) => {
  const tag: any = {
    发电: "text-#00CC85",
    充电中: "text-#00CC85",
    放电中: "text-#007BFF",
    待机: "text-#909090",
    "": "text-#909090",
  }
  return tag[chargeAndDischargeState]
}
// 设备状态文字颜色
const statusColor = (statusColor: string) => {
  const tag: any = {
    正常: "text-#16BAAA",
    在线: "text-#16BAAA",
    告警: "text-#FFC107",
    故障: "text-#F44336",
    离线: "text-#9E9E9E",
  }
  return tag[statusColor]
}
const handleFilterChange = () => {
  queryDeviceList()
}
const handleInput = () => {
  queryDeviceList()
}
// 定义间隔计时器
const intervalTimer = setInterval(() => {
  queryDeviceList()
}, 60000)

// 清理函数以清除间隔计时器
onBeforeUnmount(() => {
  clearInterval(intervalTimer)
})
</script>

<template>
  <div class="list-adapt-container layout-pd">
    <el-card shadow="hover">
      <div class="flex justify-start">
        <!-- 筛选 -->
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline" ref="queryFm">
          <el-form-item label="设备状态" prop="DevState">
            <el-select v-model="queryCondition.DevState" placeholder="设备状态" @change="handleFilterChange">
              <el-option label="全部" :value="0" />
              <el-option label="正常" :value="1" />
              <el-option label="离线" :value="2" />
              <el-option label="告警" :value="3" />
              <el-option label="故障" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="充放电状态" prop="ChargeAndDischargeState">
            <el-select v-model="queryCondition.ChargeAndDischargeState" placeholder="设备状态" @change="handleFilterChange">
              <el-option label="全部" :value="0" />
              <el-option label="充电中" :value="1" />
              <el-option label="放电中" :value="2" />
              <el-option label="待机" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="企业所在区域">
            <el-cascader :options="pcaTextArr" v-model="selectedOptions" :props="props" @change="changeCustomer" />
          </el-form-item>
          <el-form-item label="设备定位区域">
            <el-cascader :options="pcaTextArr" v-model="selectedOptions1" :props="props" @change="changeDewLocateAddr" />
          </el-form-item>
          <el-form-item label="安装日期">
            <el-date-picker v-model="daterangeRef" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" @change="mergeTime" />
          </el-form-item>
          <el-form-item label="其他" prop="Keywords">
            <el-input
              v-model="queryCondition.Keywords"
              placeholder="请输入设备编号、设备型号、所属客户"
              clearable
              @change="handleFilterChange"
              @input="handleInput" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetFields()">清除条件</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            type="primary"
            plain
            size="default"
            class="ml-10px"
            @click="onOpenAddOrEdit('add')"
            v-if="Session.get('userInfo').actionCodeList.includes('_2_xzsb') || Session.get('userInfo').isAdmin === true">
            新增设备
          </el-button>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div class="w-full my-2 bg-#16BAAA bg-op-20 border py-2 border-#16BAAA border-solid rd-1 flex justify-between items-center">
          <div class="h-10 rd-2 p-2 font-bold">
            当前储能设备数量<span class="text-20px font-bold text-#16BAAA">{{ queriedResult.devCount }}</span
            >台,累计装机容量<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queriedResult.totalCapacity_MWh) }}</span
            >MWh。
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3"
        v-if="
          (queriedResult.devList?.length > 0 && Session.get('userInfo').actionCodeList.includes('_2_sbxs')) ||
          Session.get('userInfo').isAdmin === true
        ">
        <div
          class="mb4 border-solid border-gray-200 p-2 bg-gradient-to-b from-[#F1F5FF] to-[#FFFFFF] bg-gradient hover:b-#16BAAA b-1 rd-4"
          :class="{
            'bg-gradient-to-b from-[#FFEDED] to-[#FFFFFF]': v.devState === '故障',
            'bg-gradient-to-b from-[#FFF7E6] to-[#FFE4B5] border-2 border-[#FFA500] shadow-lg': v.id === 11 || v.id === 22,
          }"
          v-for="(v, k) in queriedResult.devList"
          :key="k">
          <div class="flex justify-start">
            <div class="flex flex-col items-center mt-4 relative">
              <div class="absolute left-0 -top-4 text-#F44336 text-8" v-if="v.devState === '故障'">
                <el-icon><ele-WarnTriangleFilled /></el-icon>
              </div>
              <!-- 光伏设备特殊标识 -->
              <div
                class="absolute -top-2 -right-2 bg-[#FFA500] text-white text-xs px-2 py-1 rounded-full font-bold"
                v-if="v.id === 11 || v.id === 22">
                光伏
              </div>
              <img :src="v.devImageAddress" class="w-60px h-55px rd-1" />
              <div class="text-sm my-1 font-bold flex" :class="statusColor(v.devState)">● {{ statusText(v.devState) }}</div>
            </div>
            <div class="text-sm text-blueGray leading-6 ml-4 w-full">
              <div class="flex justify-between items-end my-4 relative">
                <div class="text-black font-bold">设备编号:{{ v.devCode }}</div>
                <div
                  class="w-22 h-12 bg-op-20 text-sm rd-0 rd-rt-3 rd-lb-3 b-0 absolute -top-6 -right-2 font-bold flex flex-col py-2 justify-between items-center"
                  :class="electricityTagbg(v.chargeAndDischargeState)">
                  <div :class="electricityTagColor(v.chargeAndDischargeState)">{{ electricityTag(v.chargeAndDischargeState) }}</div>
                  <div class="w-80% bg-[url(./images/soc_bg.png)] bg-contain bg-no-repeat">
                    <ProgressBar :percent="v.soc ? parseFloat(v.soc.replace('%', '')) : 0" />
                  </div>
                </div>
              </div>
              <div>产品序列号：{{ v.devID }}</div>
              <div class="text-ellipsis">所属客户：{{ v.customerName }}</div>
              <div>安装日期：{{ v.installDate }}</div>
            </div>
          </div>
          <div class="h-1px bg-#f7f7f7 my-1"></div>
          <!-- 光伏设备 (id为11和22) 只显示累计发电 -->
          <div class="flex justify-center text-blueGray text-sm bg-#EDF1FD p-4 rd-2 leading-4" v-if="v.id === 11 || v.id === 22">
            <div class="flex flex-col justify-between items-center text-sm">
              <div>累计发电</div>
              <div class="text-14px text-black font-bold" v-if="v.totalChargeEnergy_MWh">{{ formatNumber(v.totalChargeEnergy_MWh) }}MWh</div>
              <div class="text-14px text-black font-bold" v-else>暂无</div>
            </div>
          </div>
          <!-- 其他设备显示完整的累计充电、放电、循环信息 -->
          <div class="flex justify-between text-blueGray text-sm bg-#EDF1FD p-4 rd-2 leading-4" v-else>
            <div class="flex flex-col justify-between items-center text-sm">
              <div>累计充电</div>
              <div class="text-14px text-black font-bold" v-if="v.totalChargeEnergy_MWh">{{ formatNumber(v.totalChargeEnergy_MWh) }}MWh</div>
              <div class="text-14px text-black font-bold" v-else>暂无</div>
            </div>
            <div class="flex flex-col justify-between items-center">
              <div>累计放电</div>
              <div class="text-14px text-black font-bold" v-if="v.totalDischargeEnergy_MWh">{{ formatNumber(v.totalDischargeEnergy_MWh) }}MWh</div>
              <div class="text-14px text-black font-bold" v-else>暂无</div>
            </div>
            <div class="flex flex-col justify-between items-center">
              <div>累计循环</div>
              <div class="text-14px text-black font-bold" v-if="v.totalCycle">{{ v.totalCycle }}次</div>
              <div class="text-14px text-black font-bold" v-else>暂无</div>
            </div>
          </div>
          <div class="h-1px bg-#f7f7f7 my-4 px-4"></div>
          <div class="flex justify-between items-center text-black px-8">
            <div
              class="cursorPointer"
              @click="onOpenAddOrEdit('edit', v)"
              v-if="Session.get('userInfo').actionCodeList.includes('_2_bjsb') || Session.get('userInfo').isAdmin === true">
              <!-- <i class="iconfont icon-bianji1"></i> -->
              编辑
            </div>
            <div class="cursorPointer text-#16BAAA" @click="openDetails(v.devCode)">
              <!-- <i class="iconfont icon-xiangqing1"></i> -->
              详情
            </div>
            <div
              class="cursorPointer text-#F44336"
              @click="deleteDevice(v)"
              v-if="Session.get('userInfo').actionCodeList.includes('_2_scsb') || Session.get('userInfo').isAdmin === true">
              <i class="iconfont icon-shanchu"></i>
              删除
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else />
      <template v-if="queryCondition">
        <el-pagination
          @size-change="
            (PageSize: any) => {
              queryDeviceList({PageSize})
            }
          "
          @current-change="
            (PageIndex: any) => {
              queryDeviceList({PageIndex})
            }
          "
          class="mt-15px"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          :current-page="queryCondition.PageIndex"
          background
          :page-size="queryCondition.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queriedResult.devCount">
        </el-pagination>
      </template>
    </el-card>
    <AddOrEditDlg ref="AddOreditDlgRef" :deviceData="deviceData" @updateList="queryDeviceList" />
    <QrcodeDialog ref="qrcodeDialogRef" :deviceId="deviceId" />
  </div>
</template>
<style lang="scss" scoped>
.cursorPointer {
  font-weight: 700;
  cursor: pointer;
  &:hover {
    color: #16baaa;
  }
}
:deep(.el-progress-bar__outer) {
  border-radius: inherit;
  background-color: none !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: inherit;
}
</style>
