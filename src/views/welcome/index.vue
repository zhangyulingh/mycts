<template>
  <div>
    <div class="flex flex-col flex-1 layout-padding w-full">
      <div class="flex flex-row items-center">
        <el-input type="text" v-model="key" placeholder="关键字查询" class="max-w-280px h-40px" clearable :prefix-icon="Search" />
        <el-button type="primary" @click="getList" class="ml-10px">查询</el-button>
        <div class="flex-1"></div>
        <el-button type="primary" class="" @click="showAddDrawer()">新增启动页计划</el-button>
      </div>
      <el-table
        :data="pageInfo.list"
        class="mt-10px flex-1"
        border
        :header-cell-style="{background: '#EEF2F7', color: '#666666', height: '50px'}"
        :row-style="{height: '50px'}">
        <el-table-column label="主题名称" prop="name" width="" align="center"></el-table-column>
        <el-table-column label="时间范围" align="center">
          <template #default="scope">
            <div>{{ scope.row.viewStartTime.replace("T", " ") }} {{ " ~ " }} {{ scope.row.viewEndTime.replace("T", " ") }}</div>
          </template>
        </el-table-column>
        <el-table-column label="图片数量" width="120" align="center">
          <template #default="scope">
            <div>{{ scope.row.imageNumber }}张</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template #default="scope">
            <div>
              <el-button @click="showAddDrawer(scope.row)" link type="primary">编辑</el-button>
              <el-button @click="delInfo(scope.row, scope.index)" link type="danger" :loading="scope.row.loading1">删除</el-button>
              <el-button @click="closeInfo(scope.row)" link :type="scope.row.marks == 0 ? 'warning' : 'success'" :loading="scope.row.loading2">
                {{ scope.row.marks == 0 ? "关闭" : "启用" }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt-15px justify-end"
        @size-change="onPageSizeChange"
        @current-change="onCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageInfo.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        small
        :total="pageInfo.total" />
    </div>
    <Add ref="addRef" class="my-drawer" />
  </div>
</template>
<script setup lang="ts" name="welcome">
import ApiConfig from "@/api/ApiConfig"
import {PlanInfo} from "@/views/welcome/types/PlanInfo"
import {request} from "@/utils/request"
import {onMounted, reactive, ref} from "vue"
import {ElMessage, ElMessageBox} from "element-plus"
import Add from "@/views/welcome/Add.vue"
import bus from "@/utils/mitt"
import {Search} from "@element-plus/icons-vue"

const addRef = ref<typeof Add>()
const key = ref("")
const showLoading = ref(false)

const pageInfo = reactive<{currentPage: number; pageSize: number; total: number; list: PlanInfo[]}>({
  currentPage: 1, //当前页
  pageSize: 10, //分页的数据
  total: 0, //总页数
  list: [],
})

onMounted(() => {
  getList()
  bus.on("RefreshWelcomePage", (event) => getList())
})

const getList = () => {
  showLoading.value = true
  const param = {page: pageInfo.currentPage, num: pageInfo.pageSize, keyword: key.value}
  request<IResponseData<PlanInfo[]>>({url: ApiConfig.START_LIST, method: "GET", params: param})
    .then((value) => {
      pageInfo.list = value.data
    })
    .finally(() => {
      showLoading.value = false
    })
}

const showAddDrawer = (item?: PlanInfo) => {
  addRef.value.show(item)
}

/**
 * 删除计划
 * @param item
 * @param index
 */
const delInfo = (item: PlanInfo, index: number) => {
  ElMessageBox.alert(`确认要删除主题《${item.name}》吗？`, "提示", {}).then(() => {
    item.loading1 = true
    request({url: ApiConfig.START_DEL, method: "DELETE", params: {id: item.id}})
      .then((value) => {
        ElMessage.success("删除成功")
        getList()
      })
      .finally(() => {
        item.loading1 = false
      })
  })
}

/**
 * 关闭|启用
 * @param item
 */
const closeInfo = (item: PlanInfo) => {
  ElMessageBox.confirm(`确认要改变主题《${item.name}》的状态吗？`, "提示", {}).then(() => {
    item.loading2 = true
    request({url: ApiConfig.START_MARKS, method: "DELETE", params: {id: item.id, marks: 1 - item.marks}})
      .then((value) => {
        item.marks = 1 - item.marks
      })
      .finally(() => {
        item.loading2 = false
      })
  })
}

function onPageSizeChange(val: number) {
  pageInfo.pageSize = val
  getList()
}

function onCurrentChange(val: number) {
  pageInfo.currentPage = val
  getList()
}
</script>

<style scoped lang="scss">
.my-drawer {
  :deep .el-overlay {
    position: absolute;
  }
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
}
</style>
