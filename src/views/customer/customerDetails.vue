<script setup lang="ts">
import {SwitchFilled} from "@element-plus/icons-vue"
import {ref, defineAsyncComponent} from "vue"
import {getAccountInfo, getBindDevList, unbindDev, getCustomerInfo, updateCustomerState, updateAccountState} from "@/composables/useCustomer"
import {ElDivider, ElMessage, ElMessageBox} from "element-plus"
import {useRoute} from "vue-router"
import {Session} from "@/utils/storage"
import router from "@/router"
import {formatNumber} from "@/utils/formatNumber"

const $route = useRoute()

// 使用 computed 属性来获取并监听 id 参数的变化
const customerId: any = computed(() => {
  return $route.params.id // 获取路由参数中的 id
})

const detailData = ref<any>({})
const bindDevData = ref<any>({data: []})
const accountData = ref<any>({accountData: {}})

// 定义刷新数据的函数
const GetCustomerInfo = async () => {
  const res = await getCustomerInfo(customerId.value)
  // console.log(JSON.stringify(res))
  detailData.value = res
}

const GetBindDevList = async () => {
  const res = await getBindDevList(customerId.value)
  // console.log(JSON.stringify(res))
  bindDevData.value = res
}

const GetAccountInfo = async () => {
  const res = await getAccountInfo(customerId.value)
  // console.log(JSON.stringify(res))
  accountData.value = res
}

// 页面加载时立即调用这些函数刷新数据
GetCustomerInfo()
GetBindDevList()
GetAccountInfo()

// 其他逻辑
const divideDlgRef = ref()
const accountDlgRef = ref()
const resetDlgRef = ref()
const bindDevDlgRef = ref()

const DivideDlg = defineAsyncComponent(() => import("@/views/customer/components/DivideDlg.vue"))
const AccountAddOrEditDlg = defineAsyncComponent(() => import("@/views/customer/components/AccountAddOrEditDlg.vue"))
const ResetDlg = defineAsyncComponent(() => import("@/views/customer/components/ResetDlg.vue"))
const BindDevDlg = defineAsyncComponent(() => import("@/views/customer/components/BindDevDlg.vue"))

const openAccountAddOrEdit = (type: string, accountData?: any, customerID?: any) => {
  accountDlgRef.value.openAccountAddOrEdit(type, accountData, customerID)
}

const openDivide = () => {
  const divideData = {
    id: customerId.value,
    ShareRatio: detailData.incomeShareRatio,
  }
  divideDlgRef.value?.openDivide(divideData)
}

const openBindDevice = () => {
  const bindDeviceData = {
    customerID: customerId.value,
  }
  bindDevDlgRef.value.openBindDevice(bindDeviceData)
}

const openReset = (accountData: any, accountID: any) => {
  const resetData = {
    customerID: customerId.value,
    accountID: accountData.accountID,
  }
  resetDlgRef.value.openResetPwd(resetData)
}

// 解除绑定
const UnbindDev = async (item: any) => {
  const confirm = await ElMessageBox.confirm(`确定解绑设备（ID: ${item.devCode}）吗？一旦解绑后，使用该设备的收益将不再与该客户有关联！`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  if (confirm === "confirm") {
    // await unbindDev(customerId.value, item.devCode)
    ElMessage.success("解绑成功")
    await updateDev()
  } else {
    ElMessage.info("取消解绑")
  }
}

const handleSwitchChange = (detailData: any) => {
  if (!Session.get("userInfo").actionCodeList.includes("_16_xgkhzt") && !Session.get("userInfo").isAdmin === true) {
    ElMessage.warning("很抱歉，您暂时无操作权限！，请联系管理员！")
    GetCustomerInfo()
    return
  } else {
    const newState = detailData.state
    ElMessageBox.confirm(
      `${newState === 1 ? "开启后，将正常对客户账户进行收益自动扣费操作，请确认！" : "停用后，将不再对客户账户进行收益自动扣费操作，请确认！"}`,
      "提示",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(async () => {
        try {
          // await updateCustomerState(detailData.id, newState === 1)
          detailData.state = newState
          ElMessage.success(`${newState === 1 ? "启用" : "停用"}成功`)
        } catch (error) {
          ElMessage.error("更新客户状态失败")
        }
      })
      .catch(() => {
        detailData.state = newState === 1 ? 2 : 1
        ElMessage.info("已取消")
      })
  }
}

// 修改客户端状态
const handleAccountSwitchChange = async (accountData: any) => {
  const {actionCodeList, isAdmin} = Session.get("userInfo")

  if (!actionCodeList.includes("_16_xgkhzt") && !isAdmin) {
    ElMessage.warning("很抱歉，您暂时无操作权限！，请联系管理员！")
    GetAccountInfo()
    return
  }

  // 记录原始状态
  const originalState = !accountData.state

  try {
    await ElMessageBox.confirm(`${originalState ? "启用状态，请确认！" : "停用状态，请确认！"}`, "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        // await updateAccountState(customerId.value, accountData.accountID, !originalState)
        accountData.state = !riginalState // 更新为新状态
        ElMessage.success(`${!originalState ? "启用" : "停用"}成功`)
        // 刷新accountData
        GetAccountInfo()
      })
      .catch(() => {
        // 恢复到原始状态，不进行任何更新
        accountData.state = originalState
        ElMessage.info("已取消")
      })
  } catch (error) {
    // 在发生错误时恢复原始状态
    accountData.state = originalState
    ElMessage.error("更新客户状态失败")
  }
}

const handleUpdateShareRatio = (newShareRatio: number) => {
  detailData.incomeShareRatio = newShareRatio
  GetCustomerInfo() // 刷新页面
}

const handelUpdateAccount = async () => {
  let acc = await getAccountInfo(customerId.value)
  accountData.accountData = acc
  GetAccountInfo() // 刷新页面
}

const updateDev = async () => {
  let arr = await getBindDevList(customerId.value)
  console.log(JSON.stringify(arr))
  bindDevData.bindDevData = arr
  GetBindDevList() // 刷新页面
}

const emits = defineEmits(["update"])
const goBack = () => {
  router.go(-1)
  setTimeout(() => {
    location.reload()
  }, 100)
}
</script>

<template>
  <div>
    <el-button type="primary" @click="goBack" class="m2">◀ 返回上一页</el-button>
    <el-card class="m-2">
      <el-descriptions class="margin-top" :column="2" border>
        <template #title>
          <div class="description-title flex items-center">
            <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2">
              <SwitchFilled />
            </el-icon>
            <span>客户基本信息</span>
          </div>
        </template>
        <el-descriptions-item>
          <template #label>
            <div>客户名称</div>
          </template>
          {{ detailData.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>企业地址</div>
          </template>
          {{ detailData.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>客户联系人</div>
          </template>
          {{ detailData.contacts }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>联系方式</div>
          </template>
          {{ detailData.telephone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>客户状态</div>
          </template>
          <el-tag v-if="detailData.state === 1" type="success">正常服务</el-tag>
          <el-tag v-else type="danger">停止服务</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>创建时间</div>
          </template>
          {{ detailData.addTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div>修改客户状态</div>
          </template>
          <el-switch v-model="detailData.state" :active-value="1" :inactive-value="2" @click="handleSwitchChange(detailData)" />
        </el-descriptions-item>
      </el-descriptions>
      <div>
        <div class="mt-4">
          <el-descriptions class="margin-top" :column="2" border>
            <template #title>
              <div class="description-title flex items-center">
                <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2">
                  <SwitchFilled />
                </el-icon>
                <span>账户信息</span>
                <span class="font-thin text-sm mt1 ml2"> 注：电费收益是根据计量电表的充放电量结算 </span>
              </div>
            </template>
            <template #extra>
              <el-button
                type="primary"
                plain
                @click="openDivide()"
                v-if="Session.get('userInfo').actionCodeList.includes('_16_fcblgl') || Session.get('userInfo').isAdmin === true"
                >分成比例管理</el-button
              >
            </template>
            <el-descriptions-item>
              <template #label>
                <div>当前账户余额（元）</div>
              </template>
              {{ formatNumber(detailData.accountBalance) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>累计收益（元）</div>
              </template>
              {{ formatNumber(detailData.totalIncome) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>收益分成比例</div>
              </template>
              {{ detailData.incomeShareRatio }}%
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>客户分成收益（元）</div>
              </template>
              {{ formatNumber(detailData.totalCustomerIncome) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>累计扣退费（元）</div>
              </template>
              {{ formatNumber(detailData.totalDeduct) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>累计充值（元）</div>
              </template>
              {{ formatNumber(detailData.totalRecharge) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="mt-4" v-if="bindDevData.data && bindDevData.data.length">
        <div class="flex justify-between mt4">
          <el-descriptions class="margin-top" :column="2" border>
            <template #title>
              <div class="description-title flex items-center">
                <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2">
                  <SwitchFilled />
                </el-icon>
                <span>设备安装信息</span>
              </div>
            </template>
          </el-descriptions>
          <el-button
            type="primary"
            plain
            @click="openBindDevice"
            v-if="Session.get('userInfo').actionCodeList.includes('_16_bdsb') || Session.get('userInfo').isAdmin === true"
            >绑定设备</el-button
          >
        </div>
        <ElDivider />
        <div v-for="item in bindDevData.data" :key="item.devCode" class="my4">
          <el-descriptions class="margin-top" :column="2" border>
            <template #extra>
              <!-- 查看设备，跳转路由页面 -->
              <el-button
                type="primary"
                plain
                @click="$router.push({path: `/device/deviceDetails/${item.devCode}`})"
                v-if="Session.get('userInfo').actionCodeList.includes('_16_cksb') || Session.get('userInfo').isAdmin === true">
                查看设备
              </el-button>
              <el-button
                type="primary"
                plain
                @click="UnbindDev(item)"
                v-if="Session.get('userInfo').actionCodeList.includes('_16_jbsb') || Session.get('userInfo').isAdmin === true"
                >解绑设备</el-button
              >
            </template>
            <div v-if="bindDevData.data && bindDevData.data.length">
              <el-descriptions-item>
                <template #label>
                  <div>设备编号</div>
                </template>
                {{ item.devCode }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>设备名称</div>
                </template>
                {{ item.devID }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>安装日期</div>
                </template>
                {{ item.installDate }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>安装人员</div>
                </template>
                {{ item.installer }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>当前定位地址</div>
                </template>
                {{ item.devLocation }}
              </el-descriptions-item>
            </div>
          </el-descriptions>
        </div>
      </div>
      <div v-else>
        <div class="flex justify-between mt4">
          <el-descriptions class="margin-top" :column="2" border>
            <template #title>
              <div class="description-title flex items-center">
                <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2">
                  <SwitchFilled />
                </el-icon>
                <span>设备安装信息</span>
              </div>
            </template>
          </el-descriptions>
          <el-button
            type="primary"
            plain
            @click="openBindDevice"
            v-if="Session.get('userInfo').actionCodeList.includes('_16_bdsb') || Session.get('userInfo').isAdmin === true"
            >绑定设备</el-button
          >
        </div>
        <el-empty description="暂无设备安装信息" />
      </div>
      <ElDivider />
      <div class="mt-4">
        <el-descriptions class="margin-top" :column="2" border>
          <template #title>
            <div class="description-title flex items-center">
              <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2">
                <SwitchFilled />
              </el-icon>
              <span>账号信息</span>
            </div>
          </template>
          <template #extra>
            <el-button
              type="primary"
              @click="openAccountAddOrEdit('add', null, detailData.id)"
              plain
              v-if="
                (!accountData.accountID && Session.get('userInfo').actionCodeList.includes('_16_cjkhdzh')) || Session.get('userInfo').isAdmin === true
              "
              >创建账号
            </el-button>
            <el-button
              type="primary"
              @click="openAccountAddOrEdit('edit', accountData, detailData.id)"
              plain
              v-if="
                (accountData.accountID && Session.get('userInfo').actionCodeList.includes('_16_bjkhdzh')) || Session.get('userInfo').isAdmin === true
              "
              >编辑账号
            </el-button>
            <el-button
              type="primary"
              @click="openReset(accountData, accountData.accountID)"
              plain
              v-if="
                (accountData.accountID && Session.get('userInfo').actionCodeList.includes('_16_zzmm')) || Session.get('userInfo').isAdmin === true
              "
              >重置密码
            </el-button>
          </template>
          <div v-if="accountData.accountID && accountData">
            <el-descriptions-item>
              <template #label>
                <div>管理员姓名</div>
              </template>
              {{ accountData.trueName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>手机号/用户名</div>
              </template>
              {{ accountData.userName }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div>客户端状态</div>
              </template>
              <el-tag v-if="accountData.state" type="success">启用</el-tag>
              <el-tag v-else type="danger">停用</el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div>修改客户端状态</div>
              </template>
              <el-switch v-model="accountData.state" :active-value="true" :inactive-value="false" @click="handleAccountSwitchChange(accountData)" />
            </el-descriptions-item>
          </div>
        </el-descriptions>
        <div v-if="!accountData.accountID || !accountData">
          <el-empty description="暂无账号信息" />
        </div>
      </div>
      <div class="my-4">
        <el-descriptions class="margin-top" :column="2" border>
          <template #title>
            <div class="description-title flex items-center">
              <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2">
                <SwitchFilled />
              </el-icon>
              <span>客户开票管理</span>
            </div>
          </template>
          <el-descriptions-item>
            <template #label>
              <div>企业名称</div>
            </template>
            {{ detailData.invoiceName || "未填写" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>税号</div>
            </template>
            {{ detailData.invoiceDutyNum || "未填写" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>地址</div>
            </template>
            {{ detailData.invoiceAddress || "未填写" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>电话号码</div>
            </template>
            {{ detailData.invoiceTelephone || "未填写" }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div>开户银行</div>
            </template>
            {{ detailData.invoiceBank || "未填写" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>银行账户</div>
            </template>
            {{ detailData.invoiceAccount || "未填写" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <DivideDlg ref="divideDlgRef" @update-share-ratio="handleUpdateShareRatio" />
    <AccountAddOrEditDlg ref="accountDlgRef" @updateAccount="handelUpdateAccount" />
    <ResetDlg ref="resetDlgRef" />
    <BindDevDlg ref="bindDevDlgRef" @updateDev="updateDev" />
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  font-weight: 400 !important;
}
:deep(.el-card__body) {
  padding: 8px 8px !important;
}
</style>
