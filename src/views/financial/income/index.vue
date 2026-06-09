<script setup lang="ts">
import {onMounted, ref} from "vue"
import {formatNumber} from "@/utils/formatNumber"
import {pcaTextArr} from "element-china-area-data"
import {queryIncomePageList, queryIncomeResult, queryIncomeCondition} from "@/composables/useFinacial"
import {FormInstance} from "element-plus"
import {formatDate} from "@/utils/formatTime"
import {ExportIncomeReport} from "@/api/finacial"
import {Session} from "@/utils/storage"

const onIncomeExport = async () => {
  try {
    // const tableData = (await ExportIncomeReport(queryIncomeCondition.value)) as string
    //导出空数据
    const tableData = {}
    // 假设后台返回的 tableData 是 Excel 文件的下载地址
    if (tableData) {
      const a = document.createElement("a")
      a.href = tableData
      a.download = "收益账单数据.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      console.error("后台未返回有效的 Excel 文件地址")
    }
  } catch (error) {
    console.error("导出账单失败", error)
  }
}
const props = {checkStrictly: true}
const selectedOptions = ref()
const selectedOptions1 = ref()
// 给默认当前时间
const daterangeRef = ref(null)
const queryFm = ref<FormInstance>()
// 合成客户区域
const changeCustomer = (v: any) => {
  queryIncomeCondition.value.customerAddr_Province = v[0]
  queryIncomeCondition.value.customerAddr_City = v[1]
  queryIncomeCondition.value.customerAddr_County = v[2]
  queryIncomePageList()
}
// 合成设备定位区域
const changeDewLocateAddr = (v: any) => {
  queryIncomeCondition.value.devLocateAddr_Province = v[0]
  queryIncomeCondition.value.devLocateAddr_City = v[1]
  queryIncomeCondition.value.devLocateAddr_County = v[2]
  queryIncomePageList()
}

// 重置查询条件
const resetFields = () => {
  selectedOptions.value = []
  selectedOptions1.value = []
  daterangeRef.value = null
  queryIncomeCondition.value = {
    pageIndex: 1,
    pageSize: 10,
    date: "",
    month: "",
    year: "",
    timeType: 1,
    customerAddr_Province: "",
    customerAddr_City: "",
    customerAddr_County: "",
    devLocateAddr_Province: "",
    devLocateAddr_City: "",
    devLocateAddr_County: "",
    keywords: "",
  }
  queryIncomePageList()
}
const handleFilterChange = () => {
  queryIncomePageList()
}
const handleInput = () => {
  queryIncomePageList()
}
// 引入组件
// const RoleDialog =
// defineAsyncComponent(() => import("@/views/supplier/components/dialog.vue"))
// // 打开新增角色弹窗
// const onOpenAddRole = (type: string) => {
//   roleDialogRef.value.openDialog(type)
// }
// // 打开修改角色弹窗
// const onOpenEditRole = (type: string, row: Object) => {
//   roleDialogRef.value.openDialog(type, row)
// }
// // 删除角色
// const onRowDel = (row: RowRoleType) => {
//   ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, "提示", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//     type: "warning",
//   })
//     .then(() => {
//       getTableData()
//       ElMessage.success("删除成功")
//     })
//     .catch(() => {})
// }

// 页面加载时
onMounted(() => {
  // queryIncomeCondition.value.date = formatDate(Date(), "YYYY-mm-dd")
  queryIncomePageList()
})

const dateLabel = () => {
  return queryIncomeCondition.value.timeType === 1
    ? "请选择日报时间"
    : queryIncomeCondition.value.timeType === 2
    ? "请选择月报时间"
    : "请选择年报时间"
}
const dataType = () => {
  return queryIncomeCondition.value.timeType === 1 ? "date" : queryIncomeCondition.value.timeType === 2 ? "month" : "year"
}
// 合成时间
const mergeTime = (v: any) => {
  queryIncomeCondition.value.year = ""
  queryIncomeCondition.value.month = ""
  queryIncomeCondition.value.date = ""
  // 将选择的时间转换为指定格式
  if (v !== null) {
    if (queryIncomeCondition.value.timeType === 1) {
      queryIncomeCondition.value.date = formatDate(v, "YYYY-mm-dd")
    } else if (queryIncomeCondition.value.timeType === 2) {
      queryIncomeCondition.value.month = formatDate(v, "YYYY-mm")
    } else {
      queryIncomeCondition.value.year = formatDate(v, "YYYY")
    }
  }
  queryIncomePageList()
}

const selectDataType = () => {
  // queryIncomePageList()
  daterangeRef.value = null
  mergeTime(daterangeRef.value)
}
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <!-- 筛选 -->
      <div class="system-user-search mb-15px">
        <div class="flex justify-between">
          <div class="w-full">
            <el-form :model="queryIncomeCondition" ref="queryFm" inline class="flex flex-col">
              <div class="flex justify-start items-center">
                <div>
                  <el-tabs class="demo-tabs" v-model="queryIncomeCondition.timeType" @click="selectDataType()">
                    <el-tab-pane :label="'日报表'" :name="1"></el-tab-pane>
                    <el-tab-pane :label="'月报表'" :name="2"></el-tab-pane>
                    <el-tab-pane :label="'年报表'" :name="3"></el-tab-pane>
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
                  <el-form-item label="设备定位区域">
                    <el-cascader :options="pcaTextArr" v-model="selectedOptions1" :props="props" @change="changeDewLocateAddr" />
                  </el-form-item>
                  <el-form-item label="其他" prop="Keywords">
                    <el-input
                      v-model="queryIncomeCondition.keywords"
                      placeholder="请输入设备序列号、设备编号、所属客户"
                      class="w-80"
                      clearable
                      @change="handleFilterChange"
                      @input="handleInput" />
                  </el-form-item>
                  <el-button type="primary" @click="resetFields()">清除条件</el-button>
                </div>
                <el-button
                  type="primary"
                  plain
                  @click="onIncomeExport"
                  v-if="Session.get('userInfo').actionCodeList.includes('_35_dczdlb') || Session.get('userInfo').isAdmin === true"
                  >导出账单</el-button
                >
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 统计 -->
      <div class="pl-2 bg-emerald bg-op-20 rd-1 border py-4 border-#16BAAA border-solid">
        当前列表展示数据累计收益<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queryIncomeResult.totalIncome) }}</span
        >元。
      </div>
      <!-- 表格数据 -->

      <el-table
        v-if="
          (queryIncomeResult.incomeReportList !== null &&
            queryIncomeResult.rowCount !== 0 &&
            Session.get('userInfo').actionCodeList.includes('_35_xs')) ||
          Session.get('userInfo').isAdmin === true
        "
        :data="queryIncomeResult.incomeReportList">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryIncomeCondition.pageIndex - 1) * queryIncomeCondition.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="devCode" label="设备编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="devID" label="设备序列号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="modelName" label="设备型号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerName" label="所属企业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="statTime" label="统计时间" show-overflow-tooltip>
          <template #default="{row}">
            {{ row.statTime }}
          </template>
        </el-table-column>
        <el-table-column prop="chargeEnergy" label="累计充电量(kWh)">
          <template #default="{row}">
            {{ formatNumber(row.chargeEnergy) }}
          </template>
        </el-table-column>
        <el-table-column prop="dischargeEnergy" label="累计放电量(kWh)">
          <template #default="{row}">
            {{ formatNumber(row.dischargeEnergy) }}
          </template>
        </el-table-column>
        <el-table-column prop="peakDischargeEnergy" label="尖时段放电量(kWh)">
          <template #default="{row}">
            {{ formatNumber(row.peakDischargeEnergy) }}
          </template>
        </el-table-column>
        <el-table-column prop="highDischargeEnergy" label="峰时段放电量(kWh)">
          <template #default="{row}">
            {{ formatNumber(row.highDischargeEnergy) }}
          </template>
        </el-table-column>
        <el-table-column prop="normalChargeEnergy" label="平时段充电量(kWh)">
          <template #default="{row}">
            {{ formatNumber(row.normalChargeEnergy) }}
          </template>
        </el-table-column>
        <el-table-column prop="lowChargeEnergy" label="谷时段充电量(kWh)">
          <template #default="{row}">
            {{ formatNumber(row.lowChargeEnergy) }}
          </template>
        </el-table-column>
        <el-table-column prop="income" label="累计收益（元）">
          <template #default="{row}">
            {{ formatNumber(row.income) }}
          </template>
        </el-table-column>
        <el-table-column prop="charge" label="累计扣退费（元）" fixed="right" width="140">
          <template #default="{row}">
            <div class="flex justify-between items-center">
              <div v-if="row.charge === '无数据'">-/-</div>
              <div v-else>{{ formatNumber(row.charge) }}</div>
              <div class="mx-2" v-if="row.remark">
                <el-popover
                  :width="300"
                  placement="left"
                  popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 15px;">
                  <template #reference>
                    <el-icon class="iconfont icon-tishi cursor-pointer text-#16BAAA" />
                  </template>
                  <p class="indent-8 text-sm font-bold">{{ row.remark }}</p>
                </el-popover>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-empty description="暂无数据" />
      </div>
      <!-- 页码 -->
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryIncomeCondition.pageIndex"
          v-model:page-size="queryIncomeCondition.pageSize"
          background
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryIncomeResult.rowCount"
          @size-change="queryIncomePageList"
          @current-change="queryIncomePageList" />
      </div>
    </div>
    <!-- <RoleDialog ref="roleDialogRef" @refresh="getTableData()" /> -->
  </div>
</template>

<style lang="scss" scoped>
.system-role-container {
  .system-role-padding {
    padding: 15px;
    .el-table {
      flex: 1;
    }
  }
}
</style>
