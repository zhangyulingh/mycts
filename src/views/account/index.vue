<script setup lang="ts">
import {defineAsyncComponent, reactive, ref, onMounted, computed} from "vue"
import {ElMessage, ElMessageBox} from "element-plus"
import {Session} from "@/utils/storage"
import {getAccountPageList, deleteAccount, getAccountInfo, type AccountItem} from "@/api/account"
import {formatCreatedAt} from "@/utils/formatTime"

const PRIMARY_ADMIN_USERNAME = "admin"

const currentUser = Session.get("userInfo")
const permissions = reactive({
  isSuperAdmin: currentUser?.isAdmin === true,
  isAdmin: currentUser?.roles?.includes("admin") === true,
})
const isAdminRole = computed(() => permissions.isSuperAdmin || permissions.isAdmin)
const isPrimaryAdmin = computed(
  () =>
    currentUser?.isPrimaryAdmin === true ||
    currentUser?.userName === PRIMARY_ADMIN_USERNAME ||
    currentUser?.loginName === PRIMARY_ADMIN_USERNAME
)
const currentUserId = computed(() => currentUser?.id as number | undefined)

const isSelfRow = (row: AccountItem) => currentUserId.value != null && row.id === currentUserId.value
const isAdminAccountRow = (row: AccountItem) => row.role === "admin"
const isPrimaryAdminRow = (row: AccountItem) => row.username === PRIMARY_ADMIN_USERNAME

const canEdit = (row: AccountItem) => {
  if (isPrimaryAdminRow(row)) return isPrimaryAdmin.value
  if (isAdminAccountRow(row)) return isPrimaryAdmin.value
  if (isSelfRow(row)) return isPrimaryAdmin.value
  if (isPrimaryAdmin.value) return true
  if (permissions.isAdmin) return row.role === "user"
  return false
}

const canDelete = (row: AccountItem) => {
  if (isSelfRow(row)) return false
  if (isPrimaryAdminRow(row)) return false
  if (isPrimaryAdmin.value) return true
  if (permissions.isAdmin) return row.role === "user"
  return false
}

const AddOrEditDlg = defineAsyncComponent(() => import("@/views/account/components/AddOrEditDlg.vue"))
const addOrEditDlgRef = ref()

const queryCondition = reactive({
  pageIndex: 1,
  pageSize: 10,
  keyword: "",
})

const state = reactive({
  loading: false,
  tableData: [] as AccountItem[],
  total: 0,
})

const fetchList = async () => {
  state.loading = true
  try {
    const page = await getAccountPageList({
      pageIndex: queryCondition.pageIndex,
      pageSize: queryCondition.pageSize,
      keyword: queryCondition.keyword || undefined,
      excludeAdmin: !isPrimaryAdmin.value,
    })
    state.tableData = page.data
    state.total = page.total
  } finally {
    state.loading = false
  }
}

onMounted(() => { fetchList() })

const handleSizeChange = (val: number) => {
  queryCondition.pageSize = val
  queryCondition.pageIndex = 1
  fetchList()
}

const handleCurrentChange = (val: number) => {
  queryCondition.pageIndex = val
  fetchList()
}

const handleSearch = () => {
  queryCondition.pageIndex = 1
  fetchList()
}

const resetFields = () => {
  queryCondition.keyword = ""
  queryCondition.pageIndex = 1
  fetchList()
}

const addAccount = () => { addOrEditDlgRef.value?.initAndShow({}) }

const isSelfPrimaryEdit = (row: AccountItem) =>
  isPrimaryAdmin.value && (isSelfRow(row) || isPrimaryAdminRow(row))

const onOpenEdit = async (row: AccountItem, forceSelfEdit = false) => {
  try {
    const detail = await getAccountInfo(row.id)
    addOrEditDlgRef.value?.initAndShow(detail, {
      selfEdit: forceSelfEdit || isSelfPrimaryEdit(detail),
    })
  } catch (error) {
    console.error(error)
  }
}

const editMyAccount = async () => {
  if (!isPrimaryAdmin.value) return
  if (currentUserId.value) {
    await onOpenEdit({id: currentUserId.value} as AccountItem, true)
    return
  }
  try {
    const page = await getAccountPageList({pageIndex: 1, pageSize: 100, excludeAdmin: false})
    const me = page.data.find((row) => row.username === PRIMARY_ADMIN_USERNAME)
    if (me) {
      await onOpenEdit(me, true)
    } else {
      ElMessage.warning("未找到超级管理员账号")
    }
  } catch (error) {
    console.error(error)
  }
}

const editMyPassword = async () => {
  if (isPrimaryAdmin.value || !currentUserId.value) return
  try {
    const detail = await getAccountInfo(currentUserId.value)
    addOrEditDlgRef.value?.initAndShow(detail, {selfPasswordOnly: true})
  } catch (error) {
    console.error(error)
  }
}

const onRowDel = (row: AccountItem) => {
  ElMessageBox.confirm("此操作将永久删除此账号，是否继续?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteAccount(row.id)
      ElMessage.success("删除成功")
      fetchList()
    } catch (error) { console.error(error) }
  }).catch(() => {
    ElMessage.info("已取消")
  })
}
</script>

<template>
  <div class="system-account-container layout-padding">
    <div class="system-account-padding layout-padding-auto layout-padding-view">
      <div class="system-account-search mb-15px flex justify-between flex-wrap gap-12px">
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryCondition.keyword"
              placeholder="用户名/昵称/手机号"
              clearable
              class="w-60"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFields">清除条件</el-button>
          </el-form-item>
        </el-form>
        <div class="flex gap-12px">
          <el-button v-if="isPrimaryAdmin" type="primary" @click="editMyAccount">修改我的账号</el-button>
          <el-button v-if="isAdminRole && !isPrimaryAdmin" type="primary" @click="editMyPassword">修改我的密码</el-button>
          <el-button v-if="isAdminRole" type="primary" plain @click="addAccount">新增账号</el-button>
        </div>
      </div>

      <el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryCondition.pageIndex - 1) * queryCondition.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip />
        <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{row}">
            <el-tag v-if="row.role === 'admin'" type="danger" size="small">管理员</el-tag>
            <el-tag v-else type="info" size="small">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="created_at" label="创建时间" width="170" show-overflow-tooltip>
          <template #default="{row}">
            {{ formatCreatedAt(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{row}">
            <el-button size="small" text type="primary" @click="onOpenEdit(row)" v-if="canEdit(row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(row)" v-if="canDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!state.loading && state.tableData.length === 0" />

      <div class="table-pagination" v-if="state.total > 0">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          v-model:current-page="queryCondition.pageIndex"
          background
          :pager-count="5"
          v-model:page-size="queryCondition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <AddOrEditDlg ref="addOrEditDlgRef" @refresh="fetchList" />
  </div>
</template>

<style scoped lang="scss">
.system-account-container {
  .system-account-padding {
    padding: 15px;
    .el-table { flex: 1; }
  }
}
</style>
