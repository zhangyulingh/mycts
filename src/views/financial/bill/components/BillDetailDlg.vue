<script setup lang="ts">
import html2canvas from "html2canvas"
import {formatNumber, formatNumber4} from "@/utils/formatNumber"

const props = defineProps({
  billDetailData: {
    type: Object,
    default: () => ({}),
  },
})
const dialogVisible = ref(false)
const openDialog = () => {
  dialogVisible.value = true
}

// 暴露变量
defineExpose({
  openDialog,
})
const loading = ref(false)
// 生成图片并下载
const generateAndDownload = () => {
  loading.value = true // 开始加载状态
  const dialog = document.getElementById("dialog-container")
  if (dialog !== null) {
    setTimeout(() => {
      html2canvas(dialog).then((canvas) => {
        const a = document.createElement("a")
        a.href = canvas.toDataURL("image/png")
        // 动态设置下载后的图片名，显示月份
        a.download = `${props.billDetailData.month}月账单.png`
        a.click()
        loading.value = false // 取消加载状态
      })
    }, 500) // 增加一个 500 毫秒的延迟
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" show-close title="账单详情" width="40%">
    <div class="bg-#F1F7FC px-2" id="dialog-container">
      <div class="w-full flex items-center">
        <!-- <div class="w-1/3"><img src="@/assets/img/logo_bill.jpg" alt="账单详情" class="w-40 h-15 mt-4" /></div> -->
        <span class="w-3/3 font-bold text-xl text-black pl-20">{{ billDetailData.month }}月对账单</span>
      </div>
      <div class="flex justify-between items-center">
        <div>
          <div><span class="font-bold text-14px text-#143356 leading-8">尊敬的：</span>{{ billDetailData.customerName }}</div>
          <div><span class="font-bold text-14px text-#143356 leading-8">账单编号：</span>{{ billDetailData.code }}</div>
        </div>
        <div><img src="@/assets/img/bill_der.jpg" alt="账单详情" class="w-20 h-16" /></div>
      </div>
      <table style="border-collapse: collapse; width: 100%" class="text-center">
        <thead>
          <tr class="leading-12" style="background-color: white">
            <th class="border-collapse">账单类型</th>
            <th class="border-collapse">账单月份</th>
            <th class="border-collapse">抄表方式</th>
            <th class="border-collapse">用电期间</th>
            <th class="border-collapse">用电天数</th>
            <th class="border-collapse">分成比例</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center h-10">
            <td class="border-collapse">
              {{ billDetailData.timeType === 1 ? "月账单" : "年账单" }}
            </td>
            <td class="border-collapse">{{ billDetailData.month }}</td>
            <td class="border-collapse">自动结算</td>
            <td class="border-collapse">{{ billDetailData.period }}</td>
            <td class="border-collapse">{{ billDetailData.dayCount }}</td>
            <td class="border-collapse">{{ billDetailData.incomeShareRatio }}%</td>
          </tr>
          <tr>
            <td colspan="6">
              <div class="text-center h-13 text-right pr-4 font-bold text-#143356">
                <div class="pt2">当期收益（元）：{{ formatNumber(billDetailData.income) }}</div>
                <div>分成收益（元）：{{ formatNumber(billDetailData.customerIncome) }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 账户信息 -->
      <table style="border-collapse: collapse; width: 100%; border: 1px solid #143356; margin-top: 10px">
        <thead>
          <tr>
            <td colspan="6">
              <div class="text-center text-lg h-10 leading-10 text-center font-bold bg-#b2bfcd text-#143356">账户信息</div>
            </td>
          </tr>
        </thead>
        <thead>
          <tr class="leading-12 text-center" style="background-color: white">
            <th class="border-collapse">期初账户余额（元）</th>
            <th class="border-collapse">当期充值（元）</th>
            <th class="border-collapse">当期应扣（元）</th>
            <th class="border-collapse">当期实扣（元）</th>
            <th class="border-collapse">期末账户余额（元）</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center h-10 text-center">
            <td class="border-collapse">{{ formatNumber(billDetailData.beginAccountBalance) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.recharge) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.amount) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.actualDeduct) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.endAccountBalance) }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 收益明细 -->
      <table style="border-collapse: collapse; width: 100%; border: 1px solid #143356; margin-top: 10px">
        <thead>
          <tr>
            <td colspan="6">
              <div class="text-center text-lg h-10 leading-10 text-center font-bold bg-#b2bfcd text-#143356">
                <div>{{ billDetailData.month }}月收益明细</div>
              </div>
            </td>
          </tr>
        </thead>
        <thead>
          <tr class="leading-10 leading-10 text-center">
            <th class="border-collapse" rowspan="2">时段</th>
            <th class="border-collapse" rowspan="2">电价（元/kWh）</th>
            <th class="border-collapse" colspan="2">充电信息</th>
            <th class="border-collapse" colspan="2">放电信息</th>
          </tr>
          <tr class="leading-10 leading-10 text-center" style="border: none">
            <th class="border-collapse">充电量（kWh）</th>
            <th class="border-collapse">充电费用（元）</th>
            <th class="border-collapse">放电量（kWh）</th>
            <th class="border-collapse">放电费用（元）</th>
          </tr>
        </thead>
        <tbody>
          <tr class="leading-10 text-center h-10">
            <td class="border-collapse">尖时段</td>
            <td class="border-collapse">{{ formatNumber4(billDetailData.peakPeriodPrice) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.peakChargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.peakChargePay) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.peakDischargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.peakDischargeIncome) }}</td>
          </tr>
          <tr class="leading-10 text-center h-10">
            <td class="border-collapse">高峰时段</td>
            <td class="border-collapse">{{ formatNumber4(billDetailData.highPeriodPrice) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.highChargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.highChargePay) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.highDischargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.highDischargeIncome) }}</td>
          </tr>
          <tr class="leading-10 text-center h-10">
            <td class="border-collapse">平时段</td>
            <td class="border-collapse">{{ formatNumber4(billDetailData.normalPeriodPrice) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.normalChargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.normalChargePay) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.normalDischargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.normalDischargeIncome) }}</td>
          </tr>
          <tr class="leading-10 text-center h-10">
            <td class="border-collapse">低谷时段</td>
            <td class="border-collapse">{{ formatNumber4(billDetailData.lowPeriodPrice) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.lowChargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.lowChargePay) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.lowDischargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.lowDischargeIncome) }}</td>
          </tr>
          <tr class="leading-10 text-center h-10">
            <td class="border-collapse" colspan="2">总计</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.chargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.chargePay) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.dischargeEnergy) }}</td>
            <td class="border-collapse">{{ formatNumber(billDetailData.dischargeIncome) }}</td>
          </tr>
          <tr class="leading-10 text-center h-10">
            <td class="border-collapse" colspan="6">
              <div class="text-center text-right pr-4 font-bold text-#143356">当期收益（元）：{{ formatNumber(billDetailData.income) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-2 leading-6">
        <div class="text-#143356 font-bold">说明：</div>
        <div class="text-#143356">1.电费计价标准：按照当地工商业用户电价标准执行，电价数据由国家电网官网提供，若有调整据实计算。</div>
        <div class="text-#143356">2.充放费用的计算方法是：充电费用：-（∑（时段电价*充电量））、放电费用：∑（时段电价*放电量）。</div>
        <div class="text-#143356">3.当期收益的计算方法：充电费用+放电费用。</div>
        <div class="text-#143356">4.分成收益的计算方法是：累计收益*分成比例。</div>
      </div>
    </div>
    <div class="flex justify-center items-center absolute -bottom-10 left-43%">
      <el-button type="primary" :loading="loading" @click="generateAndDownload">账单下载</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.no-header-dialog .el-dialog__header {
  display: none;
}
// style="border-collapse: collapse; border: 1px solid #143356"
.border-collapse {
  width: 16%;
  border-collapse: collapse;
  border: 1px solid #143356;
}
.border-collapse-bottom {
  width: 35%;
  border-bottom: 1px solid #143356;
}
.el-overlay .el-overlay-dialog .el-dialog .el-dialog__body {
  padding: 1px !important;
}
.el-overlay .el-overlay-dialog .el-dialog {
  max-height: 100vh;
}
</style>
