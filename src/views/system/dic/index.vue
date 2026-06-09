<script setup lang="ts" name="systemDept">
import {ref, onMounted, defineAsyncComponent} from "vue"
import {queryResult, queryMenuList} from "@/composables/useSystem"
import {GetMenuInfo, GetActionList, DeleteMenu, DeleteAction} from "@/api/system/menuAndAction"
import {ElMessage, ElMessageBox} from "element-plus"

const menuList = ref([] as any[])
const actionList = ref([])
const addOrEditDlgRef = ref()
const addOrEditActionDlgRef = ref()
// 导入组件
const AddOrEditDlg = defineAsyncComponent(() => import("@/views/system/dic/components/AddOrEditDlg.vue"))
const AddOrEditActionDlg = defineAsyncComponent(() => import("@/views/system/dic/components/AddOrEditActionDlg.vue"))

// 新增和编辑菜单
const handleAddMenu = async (type: string) => {
  if (type === "edit") {
    addOrEditDlgRef.value?.initAndShow(menuList.value[0], type)
  } else if (type === "add") {
    addOrEditDlgRef.value?.initAndShow(menuList.value[0], type)
  }
}

// 新增和编辑功能列表
const handleAddOrEditAction = async (type: string, row?: any) => {
  if (type === "edit") {
    addOrEditActionDlgRef.value?.initAndShow(menuList.value[0], type, row)
  } else {
    addOrEditActionDlgRef.value?.initAndShow(menuList.value[0], type)
  }
}

const deleteMenu = async () => {
  try {
    const confirmMessage = `是否删除菜单：${menuList.value[0].name}`
    await ElMessageBox.confirm(confirmMessage, "提示", {type: "warning"})
    await DeleteMenu(menuList.value[0].id)
    ElMessage.success("删除成功")
    await refreshMenuList()
    const defaultMenuData = {id: 1, name: "数据看板"}
    await handleNodeClick(defaultMenuData)
  } catch (error) {
    console.error("删除失败", error)
  }
}

const deleteAction = async (id: number) => {
  try {
    const confirmMessage = `是否删除功能: ${actionList.value.find((item) => item.id === id)?.name}`
    await ElMessageBox.confirm(confirmMessage, "提示", {type: "warning"})
    await DeleteAction(id)
    ElMessage.success("删除成功")
    await refreshMenuList()
  } catch (error) {
    console.error("删除失败", error)
  }
}

const setCurrentNodeName = (name: string) => {
  currentNodeName.value = name
}
const currentNodeName = ref("")

let userPermissions: string[] = [] // 假设这是从后端获取的用户权限列表

// // 添加一个函数来检查权限
// const hasPermission = (apiPath: string | null): boolean => {
//   if (!apiPath) return true // 如果apiPath为空，认为无需权限检查
//   return userPermissions.includes(apiPath)
// }

const handleNodeClick = async (data: any) => {
  try {
    setCurrentNodeName(data.name)
    localStorage.setItem("selectedNode", JSON.stringify(data)) // 保存节点信息到本地存储
    const menuInfo = await GetMenuInfo(data.id)
    menuList.value = [menuInfo]
    const actionInfo: any = await GetActionList(data.id)
    actionList.value = actionInfo.data
  } catch (error) {
    console.error("操作失败", error)
  }
}

const refreshMenuList = async () => {
  await queryMenuList()
  if (queryResult.value.length === 0) {
    const defaultMenuData = {id: 1, name: "数据看板"}
    await handleNodeClick(defaultMenuData)
  } else {
    const savedNodeData = localStorage.getItem("selectedNode")
    if (savedNodeData) {
      const currentMenuData = JSON.parse(savedNodeData)
      await handleNodeClick(currentMenuData)
    }
  }
}

const defaultProps = {
  children: "subMenuList",
  label: "name",
}

onMounted(async () => {
  const savedNodeData = localStorage.getItem("selectedNode") // 从本地存储获取保存的节点信息
  if (savedNodeData) {
    const defaultMenuData = JSON.parse(savedNodeData)
    await handleNodeClick(defaultMenuData)
  } else {
    const defaultMenuData = {id: 1, name: "数据看板"}
    await handleNodeClick(defaultMenuData)
  }
  await queryMenuList()
})
</script>

<template>
  <div class="p-2 flex justify-start">
    <div class="w-20% mr-2">
      <el-card>
        <div class="my-2">
          <el-tree
            :data="queryResult"
            :props="defaultProps"
            :default-expand-all="true"
            node-key="id"
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleNodeClick"></el-tree>
        </div>
      </el-card>
    </div>
    <div class="w-80%">
      <div>
        <el-card shadow="hover" class="layout-padding-auto">
          <div class="system-dept-search mb-15px flex justify-between">
            <div class="w-full">
              <div class="w-full text-#16BAAA font-bold">当前节点：{{ currentNodeName }}</div>
            </div>
            <el-button size="default" type="primary" plain class="ml-10px" @click="handleAddMenu('edit')"> 编辑 </el-button>
            <el-button size="default" type="danger" plain class="ml-10px" @click="deleteMenu"> 删除</el-button>
            <el-button size="default" type="primary" plain class="ml-10px" @click="handleAddMenu('add')"> 添加子节点 </el-button>
          </div>
          <el-table :data="menuList" style="width: 100%">
            <el-table-column label="序号" show-overflow-tooltip width="80">
              <template #default="{$index}">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="菜单名称"></el-table-column>
            <el-table-column prop="code" label="编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-card>
      </div>
      <div class="mt-4">
        <el-card shadow="hover" class="layout-padding-auto">
          <div class="system-dept-search mb-15px flex justify-between">
            <div class="w-full text-#16BAAA font-bold">功能列表</div>
            <el-button size="default" type="primary" plain class="ml-10px" @click="handleAddOrEditAction('add')"> 新增功能 </el-button>
          </div>
          <el-table :data="actionList" style="width: 100%">
            <el-table-column label="序号" show-overflow-tooltip width="80">
              <template #default="{$index}">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="功能权限"></el-table-column>
            <el-table-column prop="code" label="编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="apiPath" label="API路径" show-overflow-tooltip width="400">
              <template #default="scope">
                <span v-if="scope.row.apiPath">{{ scope.row.apiPath }}</span>
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template #default="{row}">
                <el-link :underline="false" type="primary" class="mr2" @click="handleAddOrEditAction('edit', row)">编辑</el-link>
                <el-link :underline="false" type="danger" @click="deleteAction(row.id)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <AddOrEditDlg ref="addOrEditDlgRef" @updateList="refreshMenuList" />
    <AddOrEditActionDlg ref="addOrEditActionDlgRef" @updateList="refreshMenuList" />
  </div>
</template>
<style lang="scss">
.el-tree-node__content {
  display: flex;
  align-items: center;
  height: 40px !important;
  cursor: pointer;
}
</style>
