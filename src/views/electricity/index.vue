<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import {ElMessage, ElMessageBox, ElPagination, FormInstance} from "element-plus"
import {queryCondition, queryResult, queryElectricList, deleteElectric, updateElectricState, getElectricDetail} from "@/composables/useElectricity"
import {Session} from "@/utils/storage"
queryElectricList()

// 引入组件
const AddOrEditDlg = defineAsyncComponent(() => import("@/views/electricity/components/AddOrEditDlg.vue"))
const DetailDraw = defineAsyncComponent(() => import("@/views/electricity/components/DetailDraw.vue"))
// const CustomDraw = defineAsyncComponent(() => import("@/views/customer/components/CustomDraw.vue"))

const detailDrawRef = ref<any>(null)
const addOrEditRef = ref<any>(null)
const queryFmRef = ref<FormInstance>()

const selectedRow = ref<any>({})
const onOpenDetail = async (row: any) => {
  try {
    const detailData = await  {"id": 47,
        "name": "2023年继续用一楼循环用",
        "des": "跑循环",
        "strEffectTime": "2023-01-01",
        "year": 2023,
        "month": "1,2,3,4,5,6,7,8,9,10,11,12",
        "peakPeriodPrice": "0.0000",
        "highPeriodPrice": "0.0000",
        "normalPeriodPrice": "0.0000",
        "lowPeriodPrice": "0.0000",
        "peakPeriod": "03:00-10:00",
        "highPeriod": "10:00-17:00",
        "normalPeriod": "17:00-23:59",
        "lowPeriod": "00:00-03:00",
        "isDisable": false,
        "isApply": true}
    selectedRow.value = detailData
    detailDrawRef.value?.openDrawer()
  } catch (error) {
    console.error("获取电价模板详情失败", error)
  }
}
const onRowEdit = async (row: any) => {
  const detailData = await {
        "id": 47,
        "name": "2023年继续用一楼循环用",
        "des": "跑循环",
        "strEffectTime": "2023-01-01",
        "year": 2023,
        "month": "1,2,3,4,5,6,7,8,9,10,11,12",
        "peakPeriodPrice": "0.0000",
        "highPeriodPrice": "0.0000",
        "normalPeriodPrice": "0.0000",
        "lowPeriodPrice": "0.0000",
        "peakPeriod": "03:00-10:00",
        "highPeriod": "10:00-17:00",
        "normalPeriod": "17:00-23:59",
        "lowPeriod": "00:00-03:00",
        "isDisable": false,
        "isApply": true
    }
  addOrEditRef.value?.initAndShow(detailData)
}
const addData = () => {
  addOrEditRef.value?.initAndShow({})
}
// 定义变量内容
const resetFields = () => {
  queryCondition.value.Name = ""
  queryFmRef.value?.resetFields()
  queryElectricList()
}
const handleFilterChange = () => {
  queryElectricList()
}
const handleInput = () => {
  queryElectricList()
}

// 删除模板
const onRowDel = (row: any) => {
  ElMessageBox.confirm("确定删除该模板吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // deleteElectric(row.id).then(() => {
      //   ElMessage.success("删除成功")
      //   queryElectricList()
      // })
    })
    .catch(() => {
      ElMessage.info("取消删除")
    })
}
const handleSwitchChange = (row: any) => {
  if (!Session.get("userInfo").actionCodeList.includes("_19_xzmb") && !Session.get("userInfo").isAdmin === true) {
    ElMessage.warning("很抱歉，您暂时无操作权限！，请联系管理员！")
    queryElectricList()
    return
  } else {
    ElMessageBox.confirm("确定切换模板状态吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
         ElMessage.success("操作成功")
        // updateElectricState(row.id, row.isDisable).then(() => {
        //   ElMessage.success("操作成功")
        // })
      })
      .catch(() => {
        row.isDisable = !row.isDisable
        ElMessage.info("已取消")
      })
  }
}
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb-15px flex justify-between">
        <div class="w-full flex justify-between">
          <el-form :inline="true" :model="queryCondition" class="demo-form-inline" ref="queryFmRef">
            <el-form-item label="其他" prop="Name" clearble>
              <el-input
                v-model="queryCondition.Name"
                placeholder="请输入模板名称"
                clearable
                class="w-60"
                @change="handleFilterChange"
                @input="handleInput" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="resetFields()">清除条件</el-button>
            </el-form-item>
          </el-form>
          <el-button
            class="right"
            type="primary"
            plain
            @click="addData"
            v-if="Session.get('userInfo').actionCodeList.includes('_19_xzmb') || Session.get('userInfo').isAdmin === true">
            新增模板
          </el-button>
        </div>
      </div>
      <div class="w-full bg-#dafaf3 border p-4 my-2 border-#16BAAA border-solid rd-1">
        当前列表模板数量<span class="text-20px font-bold text-#16BAAA">{{ queryResult.total }}</span
        >个。
      </div>
      <el-table
        :data="queryResult.data"
        v-if="(queryResult.data.length > 0 && Session.get('userInfo').actionCodeList.includes('_19_xs')) || Session.get('userInfo').isAdmin === true">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryCondition.PageIndex - 1) * queryCondition.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="电价模板名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="des" label="模板描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="strEffectTime" label="生效时间"></el-table-column>
        <el-table-column prop="isApply" label="应用状态" show-overflow-tooltip>
          <template #default="{row}">
            <el-tag v-if="row.isApply === true">已应用</el-tag>
            <el-tag type="danger" v-else-if="row.isApply === false">未应用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isDisable" label="模板状态">
          <template #default="{row}">
            <el-switch v-model="row.isDisable" active-color="#FF4949" inactive-color="#16BAAA" @click="handleSwitchChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button size="small" text type="primary" @click="onOpenDetail(row)">详情</el-button>
            <el-button
              size="small"
              text
              type="primary"
              @click="onRowEdit(row)"
              v-if="Session.get('userInfo').actionCodeList.includes('_19_bjmb') || Session.get('userInfo').isAdmin === true"
              >编辑</el-button
            >
            <el-button
              size="small"
              text
              type="danger"
              @click="onRowDel(row)"
              v-if="Session.get('userInfo').actionCodeList.includes('_19_scmb') || Session.get('userInfo').isAdmin === true"
              >删除</el-button
            >
            <!-- <el-button size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)">批量应用</el-button>
             -->
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else />
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryCondition.PageIndex"
          background
          :pager-count="5"
          v-model:page-size="queryCondition.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryResult.total"
          @size-change="queryElectricList"
          @current-change="queryElectricList" />
      </div>
    </div>
    <DetailDraw ref="detailDrawRef" :detailData="selectedRow" />
    <AddOrEditDlg ref="addOrEditRef" @updateList="queryElectricList" />
    <!-- <CustomDraw ref="customDrawRef" /> -->
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
