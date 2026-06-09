<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue"
import {ElMessage, ElMessageBox, ElPagination, FormInstance} from "element-plus"
import {pcaTextArr} from "element-china-area-data"
import {formatNumber} from "@/utils/formatNumber"
import {useRouter} from "vue-router"
const $router = useRouter()

import {
  queryCondition,
  queryResult,
  queryCustomerList,
  deleteCustomer,
  getCustomerInfo,
  getBindDevList,
  getAccountInfo,
  updateCustomerState,
} from "@/composables/useCustomer"
import {Session} from "@/utils/storage"

queryCustomerList()
// 引入组件
const AddOrEditDlg = defineAsyncComponent(() => import("@/views/customer/components/AddOrEditDlg.vue"))
const CustomDetail = defineAsyncComponent(() => import("@/views/customer/components/CustomDetail.vue"))
const queryFm = ref<FormInstance>()
const selectedOptions = ref()
const props = {checkStrictly: true}
// 合成客户区域
const changeCustomer = (v: any) => {
  queryCondition.value.Province = v[0]
  queryCondition.value.City = v[1]
  queryCondition.value.County = v[2]
  queryCustomerList()
}
// 定义变量内容
const resetFields = () => {
  queryCondition.value.Keywords = "" // 重置关键字的值
  queryCondition.value.State = 0 // 重置状态的值
  queryCondition.value.Province = "" // 重置地理位置的值
  queryCondition.value.City = ""
  queryCondition.value.County = ""
  queryFm.value?.resetFields()
  queryCustomerList()
}
const handleFilterChange = () => {
  queryCustomerList()
}
const handleInput = () => {
  queryCustomerList()
}
const handleSwitchChange = (row: any) => {
  if (!Session.get("userInfo").actionCodeList.includes("_16_xgkhzt") && !Session.get("userInfo").isAdmin === true) {
    ElMessage.warning("很抱歉，您暂时无操作权限！，请联系管理员！")
    queryCustomerList()
    return
  } else {
    const newState = row.state
    //   开：开启后，将正常对客户账户进行收益自动扣费操作，请确认！
    // 关：停用后，将不再对客户账户进行收益自动扣费操作，请确认！
    ElMessageBox.confirm(
      `${newState === 1 ? "开启后，将正常对客户账户进行收益自动扣费操作，请确认" : "停用后，将不再对客户账户进行收益自动扣费操作，请确认！"}`,
      "提示",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(async () => {
        try {
          // await updateCustomerState(row.id, newState === 1)
          row.state = newState
          ElMessage.success(`${newState === 1 ? "启用" : "停用"}成功`)
          queryCustomerList()
        } catch (error) {
          ElMessage.error("更新客户状态失败")
        }
      })
      .catch(() => {
        row.state = newState === 1 ? 2 : 1
        ElMessage.info("已取消")
      })
  }
}

const addOrEditDlgRef = ref()
const detailDrawRef = ref()

// 打开新增角色弹窗
const addCustomer = () => {
  addOrEditDlgRef.value?.initAndShow({})
}

const selectedRow = ref<any>({})
const bindDevRow = ref<any>({})
const accountRow = ref<any>({})
// 客户详情
const onOpenDetails = (id: number) => {
  $router.push({path: `/customer/customerDetails/${id}`})
}

// 详情
// const onOpenDetail = async (row: any) => {
//   try {
//     // 获取客户信息
//     const detailData = await getCustomerInfo(row.id)
//     // 获取绑定设备信息
//     let bindDevData: any = {}
//     try {
//       bindDevData = await getBindDevList(row.id)
//     } catch (error) {
//       console.error("获取绑定设备信息失败", error)
//     }
//     // 获取账户信息
//     let accountData: any = {}
//     try {
//       accountData = await getAccountInfo(row.id)
//     } catch (error) {
//       console.error("获取账户信息失败", error)
//     }
//     // 更新对应的 ref 变量
//     selectedRow.value = detailData
//     bindDevRow.value = {bindDevData}
//     accountRow.value = {accountData, customerID: row.id}

//     // 打开客户详情抽屉
//     detailDrawRef.value?.openDrawer()
//   } catch (error) {
//     console.error("获取客户详情失败", error)
//   }
// }

// 打开修改角色弹窗
const onOpenAddOrEdit = async (row: any) => {
  const detailData = await getCustomerInfo(row.id)
  addOrEditDlgRef.value?.initAndShow(detailData)
}
// 删除角色
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除此客户，是否继续?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // deleteCustomer(row.id)
      ElMessage.success("删除成功")
      queryCustomerList()
    })
    .catch(() => {
      ElMessage.info("已取消")
    })
}
</script>
<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb-15px flex justify-between">
        <div class="w-full flex justify-between">
          <el-form :inline="true" :model="queryCondition" class="demo-form-inline" ref="queryFm">
            <el-form-item label="客户状态" prop="State">
              <el-select v-model="queryCondition.State" placeholder="客户状态" class="w-30" @change="handleFilterChange">
                <el-option label="全部" :value="0" />
                <el-option label="正常服务" :value="1" />
                <el-option label="停止服务" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="企业所在区域">
              <el-cascader :options="pcaTextArr" v-model="selectedOptions" :props="props" @change="changeCustomer" class="w-60" />
            </el-form-item>
            <el-form-item label="其他" prop="Keywords" clearble>
              <el-input
                v-model="queryCondition.Keywords"
                placeholder="请输入客户名称、联系方式"
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
            @click="addCustomer"
            v-if="Session.get('userInfo').actionCodeList.includes('_16_xzkh') || Session.get('userInfo').isAdmin === true">
            新增客户
          </el-button>
        </div>
      </div>
      <div class="w-full bg-#dafaf3 border p-4 my-2 border-#16BAAA border-solid rd-1">
        当前列表客户数量<span class="text-20px font-bold text-#16BAAA">{{ queryResult.total }}</span
        >家。
      </div>
      <el-table :data="queryResult.data" v-if="queryResult.data.length > 0">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryCondition.PageIndex - 1) * queryCondition.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="企业地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contacts" label="客户联系人"></el-table-column>
        <el-table-column prop="telephone" label="联系方式"></el-table-column>
        <el-table-column prop="totalIncome" label="累计收益（元）">
          <template #default="{row}">
            {{ formatNumber(row.totalIncome) }}
          </template>
        </el-table-column>
        <el-table-column prop="incomeShareRatio" label="收益分成比例（%）">
          <template #default="{row}"> {{ row.incomeShareRatio }}</template>
        </el-table-column>
        <el-table-column prop="totalCustomerIncome" label="客户分成收益（元）">
          <template #default="{row}">
            {{ formatNumber(row.totalCustomerIncome) }}
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="当前账户余额（元）">
          <template #default="{row}">
            {{ formatNumber(row.accountBalance) }}
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="客户状态">
          <template #default="{row}">
            <el-switch v-model="row.state" :active-value="1" :inactive-value="2" @click="handleSwitchChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{row}">
            <el-button
              size="small"
              text
              type="primary"
              @click="onOpenAddOrEdit(row)"
              v-if="Session.get('userInfo').actionCodeList.includes('_16_bjkh') || Session.get('userInfo').isAdmin === true"
              >编辑</el-button
            >
            <el-button size="small" text type="primary" @click="onOpenDetails(row.id)">详情</el-button>
            <el-button
              size="small"
              text
              type="danger"
              @click="onRowDel(row)"
              v-if="Session.get('userInfo').actionCodeList.includes('_16_sckh') || Session.get('userInfo').isAdmin === true"
              >删除</el-button
            >
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
          @size-change="queryCustomerList"
          @current-change="queryCustomerList" />
      </div>
    </div>
    <AddOrEditDlg ref="addOrEditDlgRef" @updateList="queryCustomerList" />
    <CustomDetail ref="detailDrawRef" :detailData="selectedRow" :bindDevData="bindDevRow" :accountData="accountRow" @update="queryCustomerList" />
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
