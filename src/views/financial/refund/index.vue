<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import {formatNumber} from "@/utils/formatNumber"

import {ElPagination, FormInstance, dayjs} from "element-plus"
import {queryChargeAndRefundCondition, queryChargeAndRefundResult, queryChargeAndRefundPageList} from "@/composables/useFinacial"
import {Session} from "@/utils/storage"
queryChargeAndRefundPageList()

// 引入组件
const RefundDlg = defineAsyncComponent(() => import("@/views/financial/refund/components/RefundDlg.vue"))

const refundDlgRef = ref<any>(null)
const queryFmRef = ref<FormInstance>()
const daterangeRef = ref()

const onOpenRefundDlg = () => {
  refundDlgRef.value?.initAndShow()
}
// 将选择的时间转换为指定格式
const formatDate = (date: string): string => {
  return dayjs(date).format("YYYY-MM-DD")
}
const mergeTime = () => {
  if (daterangeRef.value) {
    queryChargeAndRefundCondition.value.date_Start = formatDate(daterangeRef.value[0])
    queryChargeAndRefundCondition.value.date_End = formatDate(daterangeRef.value[1])
  }
  queryChargeAndRefundPageList()
}
// 定义变量内容
const resetFields = () => {
  queryChargeAndRefundCondition.value.date_End = ""
  queryChargeAndRefundCondition.value.date_Start = ""
  daterangeRef.value = ""

  queryFmRef.value?.resetFields()
  queryChargeAndRefundPageList()
}
const handleFilterChange = () => {
  queryChargeAndRefundPageList()
}
const handleInput = () => {
  queryChargeAndRefundPageList()
}
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb-15px flex justify-between">
        <div class="w-full flex justify-between">
          <el-form :inline="true" :model="queryChargeAndRefundCondition" class="demo-form-inline" ref="queryFmRef">
            <el-form-item label="扣退费方式" prop="way" clearble>
              <el-select
                v-model="queryChargeAndRefundCondition.way"
                placeholder="请选择扣退费方式"
                clearable
                class="w-60"
                @change="handleFilterChange">
                <el-option label="系统扣费" value="1" />
                <el-option label="人工退费" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="扣退费日期" prop="date" clearble>
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
                v-model="queryChargeAndRefundCondition.keyWords"
                placeholder="请输入模板名称"
                clearable
                @change="handleFilterChange"
                @input="handleInput" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="resetFields()">清除条件</el-button>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            plain
            @click="onOpenRefundDlg"
            v-if="Session.get('userInfo').actionCodeList.includes('_37_ktfcz') || Session.get('userInfo').isAdmin === true">
            扣退费操作
          </el-button>
        </div>
      </div>
      <div class="w-full bg-#dafaf3 border p-4 my-2 border-#16BAAA border-solid rd-1">
        当前列表展示数据累计扣退费金额<span class="text-20px font-bold text-#16BAAA">{{ formatNumber(queryChargeAndRefundResult.totalAmount) }}</span
        >元。
      </div>
      <el-table
        v-if="
          (queryChargeAndRefundResult.dataList.length > 0 && Session.get('userInfo').actionCodeList.includes('_37_xs')) ||
          Session.get('userInfo').isAdmin === true
        "
        :data="queryChargeAndRefundResult.dataList">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryChargeAndRefundCondition.pageIndex - 1) * queryChargeAndRefundCondition.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="扣退费单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="amount" label="扣退费金额（元）" show-overflow-tooltip>
          <template #default="{row}">
            <span class="text-#16BAAA">{{ formatNumber(row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="endAccountBalance" label="账户余额（元）">
          <template #default="{row}">
            <span class="text-#16BAAA">{{ formatNumber(row.endAccountBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="扣退费时间"></el-table-column>
        <el-table-column prop="way" label="扣退费方式">
          <template #default="{row}">
            <el-tag type="error" v-if="row.way === 1">系统扣费</el-tag>
            <el-tag type="primary" v-else>人工退费</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="扣退费类型">
          <template #default="{row}">
            <span v-if="row.type === 1">异常调整</span>
            <span v-else-if="row.type === 2">销户退费</span>
            <span v-else>自动结算</span>
          </template>
        </el-table-column>
        <el-table-column prop="addUserName" label="操作人员"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <el-empty v-else />
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryChargeAndRefundCondition.pageIndex"
          background
          :pager-count="5"
          v-model:page-size="queryChargeAndRefundCondition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryChargeAndRefundResult.rowCount"
          @size-change="queryChargeAndRefundPageList"
          @current-change="queryChargeAndRefundPageList" />
      </div>
    </div>
    <RefundDlg ref="refundDlgRef" @update-list="queryChargeAndRefundPageList" />
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
