<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import {formatNumber} from "@/utils/formatNumber"
import {ElPagination, FormInstance, dayjs} from "element-plus"
import {queryRechargeCondition, queryRechargeResult, queryRechargePageList} from "@/composables/useFinacial"
import {Session} from "@/utils/storage"
queryRechargePageList()

// 引入组件
const RechargeDlg = defineAsyncComponent(() => import("@/views/financial/recharge/components/RechargeDlg.vue"))
const RechargeImgDlg = defineAsyncComponent(() => import("@/views/financial/recharge/components/RechargeImgDlg.vue"))
const BatchImportDlg = defineAsyncComponent(() => import("@/views/financial/recharge/components/BatchImportDlg.vue"))

const rechargeDlgRef = ref()
const rechargeImgDlgRef = ref()
const batchImportDlgRef = ref()
const rechargeId = ref<any>()
const queryFmRef = ref<FormInstance>()
const daterangeRef = ref()

const onOpenRechargeDlg = () => {
  rechargeDlgRef.value?.initAndShow()
}
const onOpenRechargeImgDlg = (row: any) => {
  rechargeId.value = row.id
  rechargeImgDlgRef.value?.initAndShow(row)
}
const onOpenBatchImport = () => {
  batchImportDlgRef.value?.initAndShow()
}
// 定义变量内容
const resetFields = () => {
  queryRechargeCondition.value.date_End = ""
  queryRechargeCondition.value.date_Start = ""
  daterangeRef.value = ""
  queryFmRef.value?.resetFields()
  queryRechargePageList()
}
// 将选择的时间转换为指定格式
const formatDate = (date: string): string => {
  return dayjs(date).format("YYYY-MM-DD")
}
// 合成时间
const mergeTime = () => {
  if (daterangeRef.value) {
    queryRechargeCondition.value.date_Start = formatDate(daterangeRef.value[0])
    queryRechargeCondition.value.date_End = formatDate(daterangeRef.value[1])
  }
  queryRechargePageList()
}
const handleFilterChange = () => {
  queryRechargePageList()
}
const handleInput = () => {
  queryRechargePageList()
}
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb-15px flex justify-between">
        <div class="w-full flex justify-start">
          <el-form :inline="true" :model="queryRechargeCondition" class="demo-form-inline" ref="queryFmRef">
            <el-form-item label="充值方式" prop="rechargeWay" clearble>
              <el-select v-model="queryRechargeCondition.rechargeWay" placeholder="请选择充值方式" clearable @change="handleFilterChange">
                <el-option label="线上" value="1" />
                <el-option label="线下" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="充值日期" prop="date" clearble>
              <el-date-picker
                v-model="daterangeRef"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                @change="mergeTime" />
            </el-form-item>
            <el-form-item label="其他" prop="keyWords" clearble>
              <el-input
                v-model="queryRechargeCondition.keyWords"
                placeholder="请输入模板名称"
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
              @click="onOpenBatchImport"
              v-if="Session.get('userInfo').actionCodeList.includes('_36_pldr') || Session.get('userInfo').isAdmin === true">
              批量导入
            </el-button>
            <el-button
              type="primary"
              plain
              @click="onOpenRechargeDlg"
              v-if="Session.get('userInfo').actionCodeList.includes('_36_czcz') || Session.get('userInfo').isAdmin === true">
              充值操作
            </el-button>
          </div>
        </div>
      </div>
      <div class="w-full bg-#dafaf3 border p-4 my-2 border-#16BAAA border-solid rd-1">
        当前列表展示数据累计充值金额<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queryRechargeResult.totalRechargeAmount) }}</span
        >元。
      </div>
      <el-table
        v-if="
          (Session.get('userInfo').actionCodeList.includes('_36_xs') && queryRechargeResult.rechargeList.length > 0) ||
          Session.get('userInfo').isAdmin === true
        "
        :data="queryRechargeResult.rechargeList">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryRechargeCondition.pageIndex - 1) * queryRechargeCondition.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="充值单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="date" label="充值日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rechargeAmount" label="充值金额（元）">
          <template #default="{row}">
            <span class="text-#16BAAA">{{ formatNumber(row.rechargeAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="endAccountBalance" label="账户余额（元）">
          <template #default="{row}">
            <span class="text-#16BAAA">{{ formatNumber(row.endAccountBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rechargeWay" label="充值方式" show-overflow-tooltip>
          <template #default="{row}">
            <el-tag type="success" v-if="row.rechargeWay === 1">线上扫码</el-tag>
            <el-tag type="warning" v-else-if="row.rechargeWay === 2">线下转账</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="addUserName" label="操作人员"></el-table-column>
        <el-table-column prop="addTime" label="操作时间"></el-table-column>
        <!-- <el-table-column prop="voucherAddress" label="凭证">
          <template #default="{row}">
            <el-image
              v-if="row.voucherAddress && row.voucherAddress.length > 0"
              :src="row.voucherAddress[0]"
              style="width: 50px; height: 50px"
              fit="cover"
              preview-teleported
              :preview-src-list="row.voucherAddress" />
            <el-link v-else type="primary" @click="onOpenRechargeImgDlg(row)">上传凭证</el-link>
          </template>
        </el-table-column> -->
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <el-empty v-else />
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryRechargeCondition.pageIndex"
          background
          :pager-count="5"
          v-model:page-size="queryRechargeCondition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryRechargeResult.rowCount"
          @size-change="queryRechargePageList"
          @current-change="queryRechargePageList" />
      </div>
    </div>
    <RechargeDlg ref="rechargeDlgRef" @updateList="queryRechargePageList" />
    <RechargeImgDlg ref="rechargeImgDlgRef" :rechargeId="rechargeId" @updateList="queryRechargePageList" />
    <BatchImportDlg ref="batchImportDlgRef" @updateList="queryRechargePageList" />
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
