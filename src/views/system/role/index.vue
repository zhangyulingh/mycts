<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import {ElMessage, ElMessageBox, ElPagination, FormInstance} from "element-plus"
import {queryRoleCondition, queryRoleResult, queryRoleList} from "@/composables/useSystem"
import {Session} from "@/utils/storage"

queryRoleList()
// 引入组件
const AddOrEditDlg = defineAsyncComponent(() => import("@/views/system/role/components/AddOrEditDlg.vue"))
const queryFm = ref<FormInstance>()

// 定义变量内容
const resetFields = () => {
  queryRoleCondition.value.Keywords = "" // 重置关键字的值
  queryFm.value?.resetFields()
  queryRoleList()
}
const handleFilterChange = () => {
  queryRoleList()
}
const handleInput = () => {
  queryRoleList()
}
const deleteRole = async () => {
  const confirmResult = await ElMessageBox.confirm("确认删除该角色吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).catch(() => {
    return false
  })
  if (confirmResult) {
    ElMessage.success('删除成功')
    queryRoleList()
  }
}
const addOrEditDlgRef = ref()

// 打开新增角色弹窗
const handleAddOrEditDlg = (type: string, row?: any) => {
  if (type === "edit") {
    if (row) {
      addOrEditDlgRef.value?.initAndShow(row, type)
    }
  } else {
    addOrEditDlgRef.value?.initAndShow(null, type)
  }
}
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb-15px flex justify-between">
        <div class="w-full flex justify-between">
          <el-form :inline="true" :model="queryRoleCondition" class="demo-form-inline" ref="queryFm">
            <el-form-item label="其他" prop="Keywords" clearble>
              <el-input
                v-model="queryRoleCondition.Keywords"
                placeholder="请输入角色名称、联系方式"
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
            size="default"
            class="ml-10px"
            @click="handleAddOrEditDlg('add')"
            v-if="Session.get('userInfo').actionCodeList.includes('_32_xzjs') || Session.get('userInfo').isAdmin === true">
            新增角色
          </el-button>
        </div>
      </div>
      <div class="w-full bg-#dafaf3 border p-4 my-2 border-#16BAAA border-solid rd-1">
        当前列表角色数量<span class="text-20px font-bold text-#16BAAA">{{ queryRoleResult.total }}</span
        >家。
      </div>
      <el-table
        :data="queryRoleResult.data"
        v-if="
          (queryRoleResult.data?.length > 0 && Session.get('userInfo').actionCodeList.includes('_32_xs')) || Session.get('userInfo').isAdmin === true
        "
        height="100%">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryRoleCondition.PageIndex - 1) * queryRoleCondition.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="des" label="角色说明" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleMembers" label="角色成员" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-link
              :underline="false"
              type="primary"
              class="mr2"
              @click="handleAddOrEditDlg('edit', row)"
              v-if="Session.get('userInfo').actionCodeList.includes('_32_bjjs') || Session.get('userInfo').isAdmin === true">
              编辑</el-link
            >
            <el-link
              :underline="false"
              type="danger"
              @click="deleteRole(row.id)"
              v-if="Session.get('userInfo').actionCodeList.includes('_32_scjs') || Session.get('userInfo').isAdmin === true"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else />
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryRoleCondition.PageIndex"
          background
          :pager-count="5"
          v-model:page-size="queryRoleCondition.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryRoleResult.total"
          @size-change="queryRoleList"
          @current-change="queryRoleList" />
      </div>
    </div>
    <AddOrEditDlg ref="addOrEditDlgRef" @updateList="queryRoleList" destroy-on-close />
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
