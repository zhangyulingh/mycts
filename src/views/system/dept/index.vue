<script setup lang="ts" name="systemDept">
import {queryDepartResult, queryDepartList, queryUserList, queryUserResult, queryUserCondition} from "@/composables/useSystem"
import {ElMessage, ElMessageBox, FormInstance} from "element-plus"
import {Session} from "@/utils/storage"

const addOrEditDlgUserRef = ref()
const AddOrEditDeptRef = ref()
const departInfoID = ref(0)
const queryFmRef = ref<FormInstance>()
const resetPwdRef = ref()
const updatePwdRef = ref()

const handleNodeClick = async (data: any) => {
  try {
    setCurrentNodeName(data.name)
    departInfoID.value = data.id
  } catch (error) {
    console.error("操作失败", error)
  }
  queryUserCondition.value.DepartID = departInfoID.value
  queryUserList()
}
// 导入组件
const AddOrEditDeptDlg = defineAsyncComponent(() => import("@/views/system/dept/components/AddOrEditDeptDlg.vue"))
const AddOrEditUserDlg = defineAsyncComponent(() => import("@/views/system/dept/components/AddOrEditUserDlg.vue"))
const ResetPwd = defineAsyncComponent(() => import("@/views/system/dept/components/ResetPwd.vue"))
const UpdatePwd = defineAsyncComponent(() => import("@/views/system/dept/components/UpdatePwd.vue"))

// 新增和编辑部门
const handleAddMenu = async (type: string, data?: any) => {
  if (type === "edit") {
    AddOrEditDeptRef.value?.initAndShow(type, data)
  } else if (type === "add") {
    AddOrEditDeptRef.value?.initAndShow(type, data)
  } else if (type === "add01") {
    AddOrEditDeptRef.value?.initAndShow(type, data)
  }
}

// 新增和编辑人员
const handleAddOreditUser = async (type: string, row?: any) => {
  if (type === "edit") {
    addOrEditDlgUserRef.value?.initAndShow(type, row)
  } else if (type === "add") {
    addOrEditDlgUserRef.value?.initAndShow(type)
  }
}
// 删除部门
const handleDeleteMenu = async () => {
  try {
    const res = await ElMessageBox.confirm("确认删除该部门吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    if (res === "confirm") {
      ElMessage.success("删除成功")
      queryDepartList()
    }
  } catch (error) {
    console.error("操作失败", error)
  }
  queryDepartList()
  const defaultMenuData = {id: 0, name: "一级部门"}
  await handleNodeClick(defaultMenuData)
}
const setCurrentNodeName = (name: string) => {
  currentNodeName.value = name
}
const currentNodeName = ref("")

const refreshMenuList = () => {
  queryDepartList()
  queryUserList()
}
const defaultProps = {
  children: "subDepartList",
  label: "name",
}

onMounted(async () => {
  const defaultMenuData = {id: 0, name: "所有部门"}
  await handleNodeClick(defaultMenuData)
  queryDepartList()
  queryUserList()
})
const handleFilterChange = () => {
  queryUserList()
}
const handleInput = () => {
  queryUserList()
}
// 定义变量内容
const resetFields = () => {
  queryUserCondition.value.Keywords = ""
  queryFmRef.value?.resetFields()
  queryUserList()
}
const handleDeleteUser = async (data: any) => {
  try {
    const res = await ElMessageBox.confirm(`确认删除用户${data.trueName}吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    if (res === "confirm") {
      ElMessage.success("删除成功")
      queryUserList()
    }
  } catch (error) {
    console.error("操作失败", error)
  }
}

const resetPwd = async (data: any) => {
  resetPwdRef.value?.initAndShow(data)
}

// 停用\启用
const handleStatus = (row: any) => {
  const status = row.isEnabled ? "启用" : "停用"
  const content = `确认${status}用户${row.trueName}吗？`
  ElMessageBox.confirm(content, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    ElMessage.success("操作成功")
  })
}
</script>

<template>
  <div class="p-2 flex justify-between">
    <div class="w-20% mr-2">
      <el-card>
        <div class="flex justify-between items-center items-baseline mb2">
          <div class="font-bold">部门架构</div>
          <el-button
            type="primary"
            plain
            class="mt-10px"
            size="small"
            @click="handleAddMenu('add01')"
            v-if="Session.get('userInfo').actionCodeList.includes('_28_xzbm') || Session.get('userInfo').isAdmin === true">
            新增部门
          </el-button>
        </div>
        <el-tree
          :data="queryDepartResult.data"
          :props="defaultProps"
          :default-expand-all="true"
          node-key="id"
          :expand-on-click-node="false"
          highlight-current
          @node-click="handleNodeClick"
          v-if="Session.get('userInfo').actionCodeList.includes('_28_xs') || Session.get('userInfo').isAdmin === true">
          <template #default="{node, data}">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <a
                  @click="handleAddMenu('add', data)"
                  v-if="Session.get('userInfo').actionCodeList.includes('_28_xzbm') || Session.get('userInfo').isAdmin === true"
                  ><i class="iconfont icon-xinzeng mx2"></i>
                </a>
                <a
                  @click="handleAddMenu('edit', data)"
                  v-if="Session.get('userInfo').actionCodeList.includes('_28_bjbm') || Session.get('userInfo').isAdmin === true"
                  ><i class="iconfont icon-bianji2 mx2"></i>
                </a>
                <a
                  @click="handleDeleteMenu"
                  v-if="Session.get('userInfo').actionCodeList.includes('_28_scbm') || Session.get('userInfo').isAdmin === true"
                  ><i class="iconfont icon-shanchu"></i>
                </a>
              </span>
            </span>
          </template>
        </el-tree>
        <el-empty v-else></el-empty>
      </el-card>
    </div>
    <div class="w-80%">
      <el-card shadow="hover" class="layout-padding-auto">
        <div class="system-dept-search mb-15px flex justify-between">
          <div class="w-full">
            <div class="w-full text-#16BAAA font-bold mb-4">当前部门：{{ currentNodeName }}</div>
            <el-form :inline="true" :model="queryUserCondition" class="demo-form-inline" ref="queryFmRef">
              <el-form-item label="其他" prop="Name" clearble>
                <el-input
                  v-model="queryUserCondition.Keywords"
                  placeholder="请输入员工姓名或手机号"
                  clearable
                  class="w-60"
                  @change="handleFilterChange"
                  @input="handleInput" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="resetFields()">清除条件</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-button
            size="default"
            type="primary"
            plain
            class="ml-10px"
            @click="handleAddOreditUser('add')"
            v-if="Session.get('userInfo').actionCodeList.includes('_28_xzry') || Session.get('userInfo').isAdmin === true">
            新增人员
          </el-button>
        </div>
        <el-table
          :data="queryUserResult.data"
          style="width: 100%"
          v-if="Session.get('userInfo').actionCodeList.includes('_28_xs') || Session.get('userInfo').isAdmin === true">
          <el-table-column label="序号" show-overflow-tooltip width="80">
            <template #default="{$index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="trueName" label="真实姓名"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="departName" label="部门名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="roleNameList" label="角色" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="260">
            <template #default="{row}">
              <el-link type="primary" :underline="false" class="mx2" @click="resetPwd(row)" v-if="row.id !== 1"> 重置 </el-link>
              <el-link :underline="false" class="mr2" @click="handleStatus(row)" :type="!row.isEnabled ? 'primary' : 'danger'">
                {{ !row.isEnabled ? "停用" : "启用" }}
              </el-link>
              <el-link type="primary" :underline="false" @click="handleAddOreditUser('edit', row)" class="mx-2" v-if="row.id !== 1"> 编辑 </el-link>
              <el-link type="danger" :underline="false" @click="handleDeleteUser(row)" v-if="row.id !== 1"> 删除 </el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else></el-empty>
        <div class="mt-4">
          <el-pagination
            :page-sizes="[5, 10, 15, 20]"
            v-model:current-page="queryUserCondition.PageIndex"
            background
            :pager-count="5"
            v-model:page-size="queryUserCondition.PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryUserResult.total"
            @size-change="queryUserList"
            @current-change="queryUserList" />
        </div>
      </el-card>
    </div>
    <ResetPwd ref="resetPwdRef" @updateList="refreshMenuList" />
    <UpdatePwd ref="updatePwdRef" @updateList="refreshMenuList" />
    <AddOrEditDeptDlg ref="AddOrEditDeptRef" @updateList="refreshMenuList" />
    <AddOrEditUserDlg ref="addOrEditDlgUserRef" @updateList="refreshMenuList" destroy-on-close />
  </div>
</template>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
