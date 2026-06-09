<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import {Session} from "@/utils/storage"
import {ElMessage, ElMessageBox, ElPagination, FormInstance} from "element-plus"
import {queryCondition, queryResult, getAllSupplierList, deleteSupplier, getSupplierDetail} from "@/composables/useSupplier"
getAllSupplierList()

// 引入组件
const AddOrEditDlg = defineAsyncComponent(() => import("@/views/supplier/components/AddOrEditDlg.vue"))
const SupDetailDlg = defineAsyncComponent(() => import("@/views/supplier/components/SupDetailDlg.vue"))

const supDetailDlgRef = ref<any>(null)
const addOrEditRef = ref<any>(null)
const queryFmRef = ref<FormInstance>()

const detailData = ref({})
const onOpenDetail = (row: any) => {
  supDetailDlgRef.value?.openDetailDlg(row)
  detailData.value = row
}

const onOpenAddSupplier = () => {
  addOrEditRef.value?.initAndShow()
}
const onRowEdit = async (row: any) => {
  const detailData = await getSupplierDetail(row.supplierID)
  addOrEditRef.value?.initAndShow(detailData)
}
// 定义变量内容
const resetFields = () => {
  queryCondition.value.Keywords = ""
  queryFmRef.value?.resetFields()
  getAllSupplierList()
}
const handleFilterChange = () => {
  getAllSupplierList()
}
const handleInput = () => {
  getAllSupplierList()
}

// 删除供应商
const onRowDel = (row: any) => {
  ElMessageBox.confirm("确定删除该供应商吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteSupplier(row.supplierID).then(() => {
      ElMessage.success("删除成功")
      getAllSupplierList()
    })
  })
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
                v-model="queryCondition.Keywords"
                placeholder="请输入供应商名称"
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
            type="primary"
            plain
            class="right"
            @click="onOpenAddSupplier"
            v-if="Session.get('userInfo').actionCodeList.includes('_9_xzgys') || Session.get('userInfo').isAdmin === true">
            新增供应商
          </el-button>
        </div>
      </div>
      <div class="w-full bg-#dafaf3 border p-4 my-2 border-#16BAAA border-solid rd-1">
        当前供应商数量<span class="text-20px font-bold text-#16BAAA">{{ queryResult.total }}</span
        >个。
      </div>
      <el-table
        border
        :data="queryResult.data"
        v-if="(queryResult.data.length > 0 && Session.get('userInfo').actionCodeList.includes('_9_xs')) || Session.get('userInfo').isAdmin === true">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryCondition.PageIndex - 1) * queryCondition.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contacts" label="联系人" show-overflow-tooltip>
          <template #default="{row}">
            {{ row.contacts || "未填写" }}
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="联系电话" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备型号" show-overflow-tooltip>
          <template #default="{row}">
            <div v-for="(devModel, index) in row.devModelList" :key="index">
              {{ devModel.name }}<br />
              <el-divider v-show="row.devModelList.length > 1 && index !== row.devModelList.length - 1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="通讯方式" show-overflow-tooltip>
          <template #default="{row}">
            <div v-for="(commMode, index) in row.devModelList" :key="index">
              {{ commMode.commMode }}<br />
              <el-divider v-show="row.devModelList.length > 1 && index !== row.devModelList.length - 1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设备额定容量(kWh)" show-overflow-tooltip>
          <template #default="{row}">
            <div v-for="(ratedCapacity, index) in row.devModelList" :key="index">
              {{ ratedCapacity.ratedCapacity }}<br /><el-divider v-show="row.devModelList.length > 1 && index !== row.devModelList.length - 1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设备额定功率(kW)" show-overflow-tooltip>
          <template #default="{row}">
            <div v-for="(ratedPower, index) in row.devModelList" :key="index">
              {{ ratedPower.ratedPower }}<br /><el-divider v-show="row.devModelList.length > 1 && index !== row.devModelList.length - 1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设备图片" show-overflow-tooltip>
          <template #default="{row}">
            <div v-for="(devImage, index) in row.devModelList" :key="index">
              <img :src="devImage.devImageAddress" alt="" class="w-10 h-10" /><el-divider
                v-show="row.devModelList.length > 1 && index !== row.devModelList.length - 1" />
            </div>
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
              v-if="Session.get('userInfo').actionCodeList.includes('_9_bjgys') || Session.get('userInfo').isAdmin === true"
              >编辑</el-button
            >
            <el-button
              size="small"
              text
              type="danger"
              @click="onRowDel(row)"
              v-if="Session.get('userInfo').actionCodeList.includes('_9_scgys') || Session.get('userInfo').isAdmin === true"
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
          @size-change="getAllSupplierList"
          @current-change="getAllSupplierList" />
      </div>
    </div>
    <SupDetailDlg ref="supDetailDlgRef" :detail-data="detailData" />
    <AddOrEditDlg ref="addOrEditRef" @updateList="getAllSupplierList" />
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
:deep {
  .el-table--default .cell {
    padding: 0 0 !important;
    text-align: center;
  }
}
</style>
