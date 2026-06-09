<script setup lang="ts">
import {onMounted, ref} from "vue"
import {formatNumber} from "@/utils/formatNumber"
import {pcaTextArr} from "element-china-area-data"
import {ElMessage, FormInstance} from "element-plus"
import {formatDate} from "@/utils/formatTime"
import {queryBillPageList, queryBillResult, queryBillCondition, getBillDetail} from "@/composables/useFinacial"
import {ExportBill} from "@/api/finacial"
import {Session} from "@/utils/storage"

const onBillExport = async () => {
  loading.value = true // 开始加载状态
  try {
    // const tableData = (await ExportBill(queryBillCondition.value)) as string
    const tableData =  {}
    // 假设后台返回的 tableData 是 Excel 文件的下载地址
    if (tableData) {
      const a = document.createElement("a")
      a.href = tableData
      a.download = "账单数据.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      loading.value = false // 取消加载状态
    } else {
      console.error("后台未返回有效的 Excel 文件地址")
    }
  } catch (error) {
    console.error("导出账单失败", error)
  }
}

const loading = ref(false)
const props = {checkStrictly: true}
const billDetailRef = ref()
const selectedOptions = ref()
const selectedOptions1 = ref()
// 给默认当前时间
const daterangeRef = ref(null)
const queryFm = ref<FormInstance>()
// 合成客户区域
const changeCustomer = (v: any) => {
  queryBillCondition.value.customerAddr_Province = v[0]
  queryBillCondition.value.customerAddr_City = v[1]
  queryBillCondition.value.customerAddr_County = v[2]
  queryBillPageList()
}

// 重置查询条件
const resetFields = () => {
  selectedOptions.value = []
  selectedOptions1.value = []
  daterangeRef.value = null
  queryBillCondition.value = {
    pageIndex: 1,
    pageSize: 10,
    month: "",
    year: "",
    timeType: 1,
    customerAddr_Province: "",
    customerAddr_City: "",
    customerAddr_County: "",
    keywords: "",
  }
  queryBillPageList()
}
const handleFilterChange = () => {
  queryBillPageList()
}
const handleInput = () => {
  queryBillPageList()
}

// 引入组件
const BillDetailDlg = defineAsyncComponent(() => import("@/views/financial/bill/components/BillDetailDlg.vue"))
const billDetailRow = ref<any>()

// 打开详情
const onOpenDetail = async (row: any) => {
  if (!Session.get("userInfo").actionCodeList.includes("_34_ckzdxq") && !Session.get("userInfo").isAdmin === true) {
    ElMessage.warning("很抱歉，您暂时无操作权限！，请联系管理员！")
    queryBillPageList()
    return
  } else {
    try {
      const billDetailData = await getBillDetail(row.id)
      billDetailRow.value = billDetailData
      billDetailRef.value?.openDialog()
    } catch (error) {
      console.error("获取账单详情失败", error)
    }
  }
}
// 页面加载时
onMounted(() => {
  // queryBillCondition.value.date = formatDate(Date(), "YYYY-mm-dd")
  queryBillPageList()
})

const dateLabel = () => {
  if (queryBillCondition.value.timeType === 1) {
    return "请选择月报时间"
  } else if (queryBillCondition.value.timeType === 2) {
    return "请选择年报时间"
  }
}
const dataType = () => {
  if (queryBillCondition.value.timeType === 1) {
    return "month"
  } else if (queryBillCondition.value.timeType === 2) {
    return "year"
  }
}
// 合成时间
const mergeTime = (v: any) => {
  queryBillCondition.value.year = ""
  queryBillCondition.value.month = ""
  // 将选择的时间转换为指定格式
  if (v !== null) {
    if (queryBillCondition.value.timeType === 1) {
      queryBillCondition.value.month = formatDate(v, "YYYY-mm")
    } else if (queryBillCondition.value.timeType === 2) {
      queryBillCondition.value.year = formatDate(v, "YYYY")
    }
  }
  queryBillPageList()
}

const selectDataType = () => {
  // queryBillPageList()
  daterangeRef.value = null
  mergeTime(daterangeRef.value)
}
// 导出账单
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb-15px">
        <el-form :model="queryBillCondition" ref="queryFm" inline>
          <div class="flex justify-start items-center">
            <div>
              <el-tabs class="demo-tabs" v-model="queryBillCondition.timeType" @click="selectDataType()">
                <el-tab-pane :label="'月报表'" :name="1"></el-tab-pane>
                <el-tab-pane :label="'年报表'" :name="2"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="flex justify-end items-center mx10 mt2">
              <el-form-item>
                <el-date-picker v-model="daterangeRef" :type="dataType()" size="small" :placeholder="dateLabel()" @change="mergeTime">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="mt-4 flex justify-start">
              <el-form-item label="企业所在区域">
                <el-cascader :options="pcaTextArr" v-model="selectedOptions" :props="props" @change="changeCustomer" />
              </el-form-item>
              <el-form-item label="其他" prop="Keywords">
                <el-input
                  v-model="queryBillCondition.keywords"
                  placeholder="请输入账单编号、所属企业"
                  class="w-80"
                  clearable
                  @change="handleFilterChange"
                  @input="handleInput" />
              </el-form-item>
              <el-button type="primary" @click="resetFields()">清除条件</el-button>
            </div>
            <el-button
              type="primary"
              :loading="loading"
              plain
              @click="onBillExport"
              v-if="Session.get('userInfo').actionCodeList.includes('_34_dczdlb') || Session.get('userInfo').isAdmin === true"
              >导出账单</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="pl-2 bg-emerald bg-op-20 rd-1 border py-4 border-#16BAAA border-solid">
        当前列表展示数据累计收益<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queryBillResult.totalIncome) }}</span
        >元, 客户分成收益<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queryBillResult.totalCustomerIncome) }}</span
        >元, 系统自动扣退费<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queryBillResult.totalAmount) }}</span
        >元。
      </div>

      <el-table
        v-if="
          (queryBillResult.billInfoList !== null && queryBillResult.rowCount !== 0 && Session.get('userInfo').actionCodeList.includes('_34_xs')) ||
          Session.get('userInfo').isAdmin === true
        "
        :data="queryBillResult.billInfoList">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryBillCondition.pageIndex - 1) * queryBillCondition.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="账单编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="time" label="账单月份" show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerName" label="所属企业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="income" label="本期累计收益(元)">
          <template #default="{row}">
            {{ formatNumber(row.income) }}
          </template>
        </el-table-column>
        <el-table-column prop="incomeShareRatio" label="客户分成比例(%)">
          <template #default="{row}">
            {{ formatNumber(row.incomeShareRatio) }}
          </template>
        </el-table-column>
        <el-table-column prop="customerIncome" label="客户分成收益(元)">
          <template #default="{row}">
            {{ formatNumber(row.customerIncome) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="系统扣退费(元)">
          <template #default="{row}">
            {{ formatNumber(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{row}">
            <el-button text size="small" type="primary" @click="onOpenDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-empty description="暂无数据" />
      </div>
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryBillCondition.pageIndex"
          v-model:page-size="queryBillCondition.pageSize"
          background
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryBillResult.rowCount"
          @size-change="queryBillPageList"
          @current-change="queryBillPageList" />
      </div>
    </div>
    <BillDetailDlg ref="billDetailRef" :billDetailData="billDetailRow" />
  </div>
</template>

<style scoped lang="scss">
.system-role-container {
  .system-role-padding {
    padding: 15px;

    .el-table {
      flex: 1;
    }
  }
}
</style>
