<script setup lang="ts" name="pagesFilteringDetails">
// import {defineAsyncComponent} from "vue"
import {defineAsyncComponent, ref} from "vue"
import {formatNumber} from "@/utils/formatNumber"
import {Session} from "@/utils/storage"
import mockData from "@/views/device/mockData.json"
import deviceData from "@/views/device/deviceData.json"

const props = defineProps({
  devCode: {
    type: String,
    required: true,
  },
})
const StrategyDlg = defineAsyncComponent(() => import("@/views/device/components/StrategyDlg.vue"))
const PriceDrawer = defineAsyncComponent(() => import("@/views/device/components/PriceDrawer.vue"))
const BindDrawer = defineAsyncComponent(() => import("@/views/device/components/BindDrawer.vue"))

// const RoleDialog = defineAsyncComponent(() => import("@/views/device/components/dialog.vue"))
// 存储数据
const detailMenus = ref<any>()
const latestState = ref<any>()
const meterData = ref<any>()
const alarmList = ref<any[]>()
const OneDevAlarmListModel = ref({total: 0})
const strategyDlgRef = ref()
const deviceId = ref()
const priceDrawerRef = ref()
const bindDrawerRef = ref<any>()

// 获取数据 - 使用JSON数据
const getDetailMenus = async () => {
  // 从设备列表中查找对应设备
  const device = mockData.data.devList.find((dev: any) => dev.devCode === props.devCode)
  if (device) {
    // 合并设备信息和详情信息
    detailMenus.value = {
      ...deviceData.data.deviceDetailInfo,
      id: device.id,
    }
  }
}
getDetailMenus()

const getLatestState = async () => {
  // 使用JSON数据
  latestState.value = deviceData.data.deviceStatus
}
getLatestState()

const getMeterData = async () => {
  // 使用JSON数据
  meterData.value = deviceData.data.deviceMeter
}
getMeterData()

const getAlarmList = async () => {
  // 使用JSON数据
  alarmList.value = deviceData.data.deviceAlarms.data
  OneDevAlarmListModel.value = {
    total: deviceData.data.deviceAlarms.total,
  }
}
getAlarmList()
const openStrategy = (v: any) => {
  strategyDlgRef.value.openStrategy(v)
  deviceId.value = v.devCode
}
// 获取电价模板记录
const openPriceDrawer = () => {
  priceDrawerRef.value.openPriceDrawer(props.devCode)
}
// 获取绑定信息
const openBindDrawer = () => {
  bindDrawerRef.value.openBindDrawer(props.devCode)
}
// 设备状态颜色变化
const devStateColor = (state: string | undefined) => {
  switch (state) {
    case "正常":
      return "text-#16BAAA"
    case "在线":
      return "text-#16BAAA"
    case "故障":
      return "text-#F44336"
    case "离线":
      return "text-#9E9E9E"
    case "告警":
      return "text-#FFC107"
    default:
  }
}
// 充放电状态颜色变化

const chargeAndDischargeStateColor = (state: string | undefined) => {
  switch (state) {
    case "充电中":
      return "bg-#00CC85"
    case "放电中":
      return "bg-#007BFF"
    case "待机":
      return "bg-#909090"
    default:
      return "bg-#909090"
  }
}

// // 打开修改设备弹窗
// const onOpenEdit = (type: string, v: any) => {
//   roleDialogRef.value.openDialog(type, v)
// }
// const roleDialogRef = ref()
</script>

<template>
  <div>
    <el-button type="primary" @click="$router.go(-1)" class="m2">◀ 返回上一页</el-button>
    <div class="p4 bg-white m2 flex justify-between items-center">
      <div class="font-bold">设备总览</div>
      <div class="text-#16BAAA">
        <el-button
          type="primary"
          plain
          @click="openPriceDrawer"
          v-if="Session.get('userInfo').actionCodeList.includes('_2_djmb') || Session.get('userInfo').isAdmin === true">
          电价模板</el-button
        >
        <el-button
          type="primary"
          plain
          @click="openStrategy"
          v-if="Session.get('userInfo').actionCodeList.includes('_2_cfcl') || Session.get('userInfo').isAdmin === true"
          >充放策略</el-button
        >
        <el-button
          type="primary"
          plain
          @click="openBindDrawer"
          v-if="Session.get('userInfo').actionCodeList.includes('_2_bdxx') || Session.get('userInfo').isAdmin === true"
          >绑定信息</el-button
        >
        <!--  <el-button type="primary" plain @click="onOpenEdit('edit', v)">编辑设备</el-button>
      -->
        <!-- <el-button type="danger" plain>移除设备</el-button> -->
      </div>
    </div>
    <div class="m2 pr4 overflow-hidden whitespace-nowrap overflow-clip grid grid-cols-2 gap-2">
      <div>
        <!-- 设备概览 -->
        <div class="box-shadow bg-white p4">
          <div class="font-bold">设备概览</div>
          <div class="bg-#F7F8FA my-2 p-2 leading-6 flex flex-wrap justify-between">
            <div class="flex flex-row justify-between">
              <div class="my2">
                <div class="text-12px text-#898989">设备编号</div>
                <div class="font-bold text-14px">{{ detailMenus?.devCode }}</div>
              </div>
            </div>
            <div class="flex flex-row justify-start items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx4"></div>
              <div class="my2">
                <div class="text-12px text-#898989 truncate">出厂编号</div>
                <div class="font-bold text-14px truncate">{{ detailMenus?.factoryNo }}</div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">产品序列号</div>
                <div class="font-bold text-14px truncate">{{ detailMenus?.devID }}</div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">设备型号</div>
                <div class="font-bold text-14px truncate">{{ detailMenus?.modelName }}</div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">额定功率</div>
                <div class="font-bold text-14px">{{ formatNumber(detailMenus?.ratedPower) }}kW</div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">额定容量</div>
                <div class="font-bold text-14px">{{ formatNumber(detailMenus?.ratedCapacity) }}kWh</div>
              </div>
            </div>
          </div>
          <div class="bg-#F7F8FA p-2 leading-6 flex flex-wrap justify-between">
            <div class="my2">
              <div class="text-12px text-#898989">首次使用日期</div>
              <span class="font-bold text-14px" v-if="detailMenus?.firstUseDate">{{ detailMenus?.firstUseDate }}</span>
              <span class="font-bold text-14px" v-else>暂无</span>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx-4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">设备状态</div>
                <div class="font-bold text-14px">
                  <span :class="devStateColor(detailMenus?.devState)" v-if="detailMenus?.devState">● {{ detailMenus?.devState }}</span>
                  <span v-else>暂无</span>
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx-4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">供应商</div>
                <div class="font-bold text-14px" v-if="detailMenus?.id === 11">供应商1</div>
                <div class="font-bold text-14px" v-else-if="detailMenus?.id === 22">供应商2</div>
                <div class="font-bold text-14px" v-else-if="detailMenus?.id">供应商3</div>
                <div class="font-bold text-14px" v-else>暂无</div>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="h-10 w-1px bg-#CDCDCD mx-4"></div>
              <div class="my2">
                <div class="text-12px text-#898989">所属客户</div>
                <div class="font-bold text-14px" v-if="detailMenus?.id === 11">客户1</div>
                <div class="font-bold text-14px" v-else-if="detailMenus?.id === 22">客户2</div>
                <div class="font-bold text-14px" v-else-if="detailMenus?.id">客户3</div>
                <div class="font-bold text-14px" v-else>暂无</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 实时状态 -->
        <div class="box-shadow bg-white p4 my2">
          <div class="flex flex-row items-baseline">
            <div class="font-bold mb-4 mr-4">实时状态</div>
            <div class="text-10px text-#898989">最新收益计算时间：{{ latestState?.devTime }}</div>
          </div>
          <div
            class="flex flex-row md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-row"
            v-if="detailMenus?.id !== 11 && detailMenus?.id !== 22">
            <div
              class="lg:mb4 xl:mr4 xl:mb0 font-bold bg-gradient-to-b from-#dce9ff to-#f2f5fb text-lg px-2 flex justify-center items-center flex-col">
              <img src="@/assets/img/icon_device_detail04.png" class="w-15 h-15" /> <span class="text-14px">储能站</span>
            </div>
            <div class="md:grid md:grid-cols-2 xl:grid xl:grid-cols-3 gap-4 w-full text-12px">
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail02.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>今日充电量</span
                  ><span class="font-bold text-16px" v-if="latestState?.todayChargeEnergy">
                    {{ formatNumber(latestState?.todayChargeEnergy) }}kWh
                  </span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail08.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>今日放电量</span>
                  <span class="font-bold text-16px" v-if="latestState?.todayDischargeEnergy"
                    >{{ formatNumber(latestState?.todayDischargeEnergy) }}kWh</span
                  >
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail05.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计充放循环</span> <span class="font-bold text-16px" v-if="latestState?.totalCycle">{{ latestState?.totalCycle }}次</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail19.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计充电量</span>
                  <span class="font-bold text-16px" v-if="latestState?.totalChargeEnergy">{{ formatNumber(latestState?.totalChargeEnergy) }}kWh</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail10.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计放电量</span>
                  <span class="font-bold text-16px" v-if="latestState?.totalDischargeEnergy"
                    >{{ formatNumber(latestState?.totalDischargeEnergy) }}kWh</span
                  >
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_soh.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>SOH</span> <span class="font-bold text-16px" v-if="latestState?.soh">{{ latestState?.soh }}</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_fd.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>当前状态</span>
                  <span
                    class="font-bold text-14px text-white text-center rd-1"
                    :class="chargeAndDischargeStateColor(latestState?.chargeAndDischargeState)"
                    v-if="latestState?.chargeAndDischargeState"
                    >{{ latestState?.chargeAndDischargeState }}</span
                  >
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_kw.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>当前功率</span>
                  <span class="font-bold text-16px" v-if="latestState?.currentPower">{{ formatNumber(latestState?.currentPower) }}kW</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_soc.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>SOC</span> <span class="font-bold text-16px" v-if="latestState?.soc">{{ latestState?.soc }}</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex flex-row md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-row mt-4"
            v-if="detailMenus?.id !== 11 && detailMenus?.id !== 22">
            <div
              class="lg:mb4 xl:mr4 xl:mb0 font-bold bg-gradient-to-b from-#ffefdd to-#fffaf5 text-lg px-2 flex flex-col justify-center items-center">
              <img src="@/assets/img/icon_device_detail12.png" class="w-15 h-15" />
              <span class="text-14px">计量电表</span>
            </div>
            <div class="md:grid md:grid-cols-2 xl:grid xl:grid-cols-3 gap-4 w-full text-12px">
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail02.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>今日充电量</span>
                  <span class="font-bold text-16px" v-if="meterData?.todayChargeEnergy">{{ formatNumber(meterData?.todayChargeEnergy) }}kWh</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail08.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>今日放电量</span>
                  <span class="font-bold text-16px" v-if="meterData?.todayDischargeEnergy"
                    >{{ formatNumber(meterData?.todayDischargeEnergy) }}kWh</span
                  >
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_sy.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>今日收益</span>
                  <span class="font-bold text-16px" v-if="meterData?.todayIncome">{{ formatNumber(meterData?.todayIncome) }}元</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail19.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计充电量</span>
                  <span class="font-bold text-16px" v-if="meterData?.totalChargeEnergy">{{ formatNumber(meterData?.totalChargeEnergy) }}kWh</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail10.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计放电量</span>
                  <span class="font-bold text-16px" v-if="meterData?.totalDischargeEnergy"
                    >{{ formatNumber(meterData?.totalDischargeEnergy) }}kWh</span
                  >
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_sytotal.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计收益</span>
                  <span class="font-bold text-16px" v-if="meterData?.totalIncome">{{ formatNumber(meterData?.totalIncome) }}元</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_v.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <!-- 如果为null ，则显示- -->
                  <span>当前电压</span>
                  <span class="font-bold text-16px" v-if="meterData?.currentVoltage">{{ meterData?.currentVoltage }}V</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_a.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>当前电流</span>
                  <span class="font-bold text-16px" v-if="meterData?.currentCurrent">{{ meterData?.currentCurrent }}A</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_k.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>当前功率</span>
                  <span class="font-bold text-16px" v-if="meterData?.currentPower">{{ formatNumber(meterData?.currentPower) }}kW</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 光伏设备专用模块 -->
          <div
            class="flex flex-row md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-row mt-4"
            v-if="detailMenus?.id === 11 || detailMenus?.id === 22">
            <div
              class="lg:mb4 xl:mr4 xl:mb0 font-bold bg-gradient-to-b from-[#FFF7E6] to-[#FFE4B5] text-lg px-2 flex flex-col justify-center items-center">
              <img src="@/assets/img/icon_device_detail12.png" class="w-15 h-15" />
              <span class="text-14px">光伏板</span>
            </div>
            <div class="md:grid md:grid-cols-2 xl:grid xl:grid-cols-4 gap-4 w-full text-12px">
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_fd.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>当前状态</span>
                  <span
                    class="font-bold text-14px text-white text-center rd-1"
                    :class="chargeAndDischargeStateColor(latestState?.chargeAndDischargeState)"
                    v-if="latestState?.chargeAndDischargeState"
                    >{{ latestState?.chargeAndDischargeState }}</span
                  >
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail02.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>今日发电量</span>
                  <span class="font-bold text-16px" v-if="meterData?.todayChargeEnergy">{{ formatNumber(meterData?.todayChargeEnergy) }}kWh</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_detail19.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>累计发电量</span>
                  <span class="font-bold text-16px" v-if="meterData?.totalChargeEnergy">{{ formatNumber(meterData?.totalChargeEnergy) }}kWh</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
              <div class="bg-#F7F8FA p-4 flex justify-start items-center">
                <img src="@/assets/img/icon_device_k.png" class="w-8 h-8 mr-4" />
                <div class="flex flex-col">
                  <span>当前功率</span>
                  <span class="font-bold text-16px" v-if="detailMenus?.id === 11">2.5kW</span>
                  <span class="font-bold text-16px" v-else-if="detailMenus?.id === 22">3.2kW</span>
                  <span class="font-bold text-16px" v-else-if="meterData?.currentPower">{{ formatNumber(meterData?.currentPower) }}kW</span>
                  <span v-else> 暂无数据 </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 告警 -->
      <div class="box-shadow bg-white p4 mb-2">
        当前告警<span class="text-24px font-bold mx-2 text-#16BAAA">{{ OneDevAlarmListModel.total }}</span
        >条
        <el-table :data="alarmList">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="typeDes" label="告警/故障类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="des" label="告警/故障内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="alarmTime" label="告警/故障时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="grade" label="告警/故障等级" show-overflow-tooltip>
            <!-- 1，2，3 -->
            <template #default="{row}">
              <el-tag type="danger" size="small" v-if="row.grade === 1">一级</el-tag>
              <el-tag type="warning" size="small" v-else-if="row.grade === 2">二级</el-tag>
              <el-tag type="info" size="small" v-else>三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="alarmState" label="告警/故障状态" fixed="right" show-overflow-tooltip>
            <template #default="{row}">
              <el-tag type="danger" size="small" v-if="row.alarmState === 1">告警中</el-tag>
              <el-tag type="success" size="small" v-else>已恢复</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <PriceDrawer ref="priceDrawerRef" :deviceId="devCode" />
      <StrategyDlg ref="strategyDlgRef" :deviceId="devCode" />
      <BindDrawer ref="bindDrawerRef" :deviceId="devCode" />

      <!-- <RoleDialog ref="roleDialogRef" />-->
    </div>
  </div>
</template>
