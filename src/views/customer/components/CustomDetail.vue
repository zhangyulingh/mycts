<script setup lang="ts">
import {SwitchFilled} from "@element-plus/icons-vue"
import {ref, defineAsyncComponent, defineExpose} from "vue"
import {getAccountInfo, getBindDevList, unbindDev} from "@/composables/useCustomer"
import {ElDivider, ElMessage, ElMessageBox} from "element-plus"
import {updateCustomerState} from "@/composables/useCustomer"

const props = defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
  bindDevData: {
    type: Object,
    default: () => ({}),
  },
  accountData: {
    type: Object,
    default: () => ({}),
  },
  resetData: {
    type: Object,
    default: () => ({}),
  },
  divideData: {
    type: Object,
    default: () => ({}),
  },
})
const drawer = ref(false)
const divideDlgRef = ref()
const accountDlgRef = ref()
const resetDlgRef = ref()
const bindDevDlgRef = ref()
// const unbindDialogRef = ref()

const DivideDlg = defineAsyncComponent(() => import("@/views/customer/components/DivideDlg.vue"))
const AccountAddOrEditDlg = defineAsyncComponent(() => import("@/views/customer/components/AccountAddOrEditDlg.vue"))
const ResetDlg = defineAsyncComponent(() => import("@/views/customer/components/ResetDlg.vue"))
const BindDevDlg = defineAsyncComponent(() => import("@/views/customer/components/BindDevDlg.vue"))

const openDrawer = () => {
  drawer.value = true
}

const openAccountAddOrEdit = (type: string, accountData?: any, customerID?: any) => {
  accountDlgRef.value.openAccountAddOrEdit(type, accountData, customerID)
}
const openDivide = () => {
  const divideData = {
    id: props.detailData.id,
    ShareRatio: props.detailData.incomeShareRatio,
  }
  divideDlgRef.value?.openDivide(divideData)
}
const openBindDevice = () => {
  const bindDeviceData = {
    customerID: props.detailData.id,
  }
  bindDevDlgRef.value.openBindDevice(bindDeviceData)
}
const openReset = () => {
  const resetData = {
    customerID: props.detailData.id,
    accountID: props.accountData.accountData.accountID,
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
    // await unbindDev(props.detailData.id, item.devCode)
    ElMessage.success("解绑成功")
    await updateDev()
  } else {
    ElMessage.info("取消解绑")
  }
}
const handleSwitchChange = (detailData: any) => {
  const newState = detailData.state
  ElMessageBox.confirm(`是否${newState === 1 ? "启用" : "停用"}此客户?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
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
const handleUpdateShareRatio = (newShareRatio: number) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.detailData.incomeShareRatio = newShareRatio
}
const handelUpdateAccount = async () => {
  let acc = await getAccountInfo(props.detailData.id)
  // eslint-disable-next-line vue/no-mutating-props
  props.accountData.accountData = acc
}
const updateDev = async () => {
  let arr = await getBindDevList(props.detailData.id)
  // eslint-disable-next-line vue/no-mutating-props
  props.bindDevData.bindDevData = arr
}

// const openBind = () => {
//   bindDialogRef.value.openBind()
// }
// const openUnbind = () => {
//   unbindDialogRef.value.openUnbind()
// }
// const openEdit = () => {
//   editDialogRef.value.openEdit()
// }

const emits = defineEmits(["update"])
const closeDraw = () => {
  drawer.value = false
  emits("update")
}
// 暴露变量
defineExpose({
  openDrawer,
})
</script>

<template>
  <el-drawer v-model="drawer" direction="rtl" size="80%" :show-close="false" :close-on-click-modal="false">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">客户详情</h4>
      <el-button type="danger" @click="closeDraw"> X</el-button>
    </template>
    <div class="p-4">
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
              <el-button type="primary" plain @click="openDivide()">分成比例管理</el-button>
            </template>
            <el-descriptions-item>
              <template #label>
                <div>当前账户余额（元）</div>
              </template>
              {{ detailData.accountBalance }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>累计收益（元）</div>
              </template>
              {{ detailData.totalIncome }}
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
              {{ detailData.totalCustomerIncome }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>累计扣退费（元）</div>
              </template>
              {{ detailData.totalDeduct }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>累计充值（元）</div>
              </template>
              {{ detailData.totalRecharge }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="mt-4" v-if="bindDevData.bindDevData.data && bindDevData.bindDevData.data.length">
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
          <el-button type="primary" plain @click="openBindDevice">绑定设备</el-button>
        </div>
        <ElDivider />
        <div v-for="item in bindDevData.bindDevData.data" :key="item.devCode" class="my4">
          <el-descriptions class="margin-top" :column="2" border>
            <template #extra>
              <!-- 查看设备，跳转路由页面 -->
              <el-button type="primary" plain @click="$router.push({path: `/device/deviceDetails/${item.devCode}`})"> 查看设备 </el-button>
              <el-button type="primary" plain @click="UnbindDev(item)">解绑设备</el-button>
            </template>
            <div v-if="bindDevData.bindDevData.data && bindDevData.bindDevData.data.length">
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
          <el-button type="primary" plain @click="openBindDevice">绑定设备</el-button>
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
            <el-button type="primary" @click="openAccountAddOrEdit('add', null, detailData.id)" plain v-if="!accountData.accountData.accountID"
              >创建账号
            </el-button>
            <el-button type="primary" @click="openAccountAddOrEdit('edit', accountData, detailData.id)" plain v-if="accountData.accountData.accountID"
              >编辑账号
            </el-button>
            <el-button type="primary" @click="openReset" plain v-if="accountData.accountData.accountID">重置密码 </el-button>
          </template>
          <div v-if="accountData.accountData.accountID && accountData.accountData">
            <el-descriptions-item>
              <template #label>
                <div>管理员姓名</div>
              </template>
              {{ accountData.accountData.trueName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>手机号/用户名</div>
              </template>
              {{ accountData.accountData.userName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div>账号状态</div>
              </template>
              {{ accountData.accountData.state === true ? "正常" : "停用" }}
            </el-descriptions-item>
          </div>
        </el-descriptions>
        <div v-if="!accountData.accountData.accountID || !accountData.accountData">
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
    </div>
  </el-drawer>
  <DivideDlg ref="divideDlgRef" @update-share-ratio="handleUpdateShareRatio" />
  <AccountAddOrEditDlg ref="accountDlgRef" @updateAccount="handelUpdateAccount" />
  <ResetDlg ref="resetDlgRef" />
  <BindDevDlg ref="bindDevDlgRef" @updateDev="updateDev" />
</template>
<style lang="scss" scoped>
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  font-weight: 400 !important;
}
</style>
