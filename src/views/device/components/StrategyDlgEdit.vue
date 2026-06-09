<script setup lang="ts">
import {ref} from "vue"
import dayjs from "dayjs"
import {ElMessageBox, ElNotification} from "element-plus"
import deviceData from "@/views/device/deviceData.json"
import electricityData from "@/views/device/electricityData.json"

const props = defineProps<{
  deviceId: string
}>()

const dialogVisible = ref(false)

const openStrategyEdit = () => {
  dialogVisible.value = true
}

const lastPolicyList = ref<any>({
  cdPolicy: [],
  fdPolicy: [],
  isExecSoon: false,
  setExecTime: "",
  templateID: 0,
})
const fdPolicyList = ref()
const cdPolicyList = ref()

// 获取最新一次设置的策略
const getDevLastSetCFD = async () => {
  // 使用JSON数据
  const res = deviceData.data.deviceStrategy
  if (res) {
    lastPolicyList.value.cdPolicy = res.cdPolicy
    fdPolicyList.value = res.fdPolicy.map((item: any) => ({
      period: item.period,
      power: item.power,
    }))
    cdPolicyList.value = res.cdPolicy.map((item: any) => ({
      period: item.period,
      power: item.power,
    }))
    lastPolicyList.value.setExecTime = res.devTime
    lastPolicyList.value.templateID = 47 // 使用默认模板ID
  }
}

getDevLastSetCFD()

// 获取电价模板列表
const electricityPriceList = ref()
const GetElectricPriceTemplatePageListData = async () => {
  // 使用JSON数据
  electricityPriceList.value = electricityData.data.priceTemplates.templates
}
GetElectricPriceTemplatePageListData()
const emits = defineEmits(["updataTime"])
// 确定按钮
const onsubmit = async () => {
  try {
    // 模拟策略设置操作
    console.log("设置充放策略:", {
      devCode: props.deviceId,
      cdPolicy: cdPolicyList.value,
      fdPolicy: fdPolicyList.value,
      isExecSoon: lastPolicyList.value.isExecSoon,
      setExecTime: lastPolicyList.value.isExecSoon ? dayjs().format("YYYY-MM-DD") : dayjs(lastPolicyList.value.setExecTime).format("YYYY-MM-DD"),
      templateID: lastPolicyList.value.templateID,
    })

    // 弹出确认框
    await ElMessageBox.confirm("当前操作将会覆盖上次操作结果，是否继续？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    // 关闭对话框
    dialogVisible.value = false
    // 如果用户确认，显示成功消息
    await ElNotification({
      title: "成功",
      message: "指令已保存",
      type: "success",
    })
    emits("updataTime")
  } catch (error) {
    // 处理错误情况
    console.error("调用接口发生错误:", error)
  }
}

// 添加一条充电策略，并设置默认值
const addCdPolicy = () => {
  if (!cdPolicyList.value) {
    cdPolicyList.value = [
      {
        period: "00:00-23:59", // 示例默认值
        power: "100", // 示例默认值
      },
    ]
  } else {
    cdPolicyList.value.push({
      period: "00:00-23:59", // 示例默认值
      power: "100", // 示例默认值
    })
  }
}

// 添加一条放电策略，并设置默认值
const addFdPolicy = () => {
  if (!fdPolicyList.value) {
    fdPolicyList.value = [
      {
        period: "00:00-23:59", // 示例默认值
        power: "100", // 示例默认值
      },
    ]
  } else {
    fdPolicyList.value.push({
      period: "00:00-23:59", // 示例默认值
      power: "100", // 示例默认值
    })
  }
}

defineExpose({
  openStrategyEdit,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="充放电策略" width="60%" :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="my-2">
      <table style="border-collapse: collapse; width: 100%; border: 1px solid #d4d9e0">
        <tbody>
          <tr style="background-color: #f2f2f2">
            <th style="border: 1px solid #d4d9e0; width: 20%; height: 50px; background-color: #edf0f3">充放周期</th>
            <th style="border: 1px solid #d4d9e0; background-color: #edf0f3; background-color: #edf0f3">每天</th>
          </tr>
          <tr>
            <td style="border: 1px solid #d4d9e0; background-color: #fff; text-align: center; background-color: #edf0f3">充电</td>
            <td style="border: 1px solid #d4d9e0; background-color: #fff">
              <div class="m4">
                <el-form class="flex justify-between" :model="lastPolicyList">
                  <div>
                    <div class="font-bold my2">输入时段：<span class="text-12px font-thin">格式00:01-00:20</span></div>
                    <el-form-item v-for="(item, index) in cdPolicyList" :key="index">
                      <el-input v-model="cdPolicyList[index].period" placeholder="请输入时段" class="w-45" />
                    </el-form-item>
                  </div>
                  <div>
                    <div class="font-bold my2">设置功率（kw）</div>
                    <el-form-item v-for="(item, index) in cdPolicyList" :key="index">
                      <div>
                        <el-input v-model="cdPolicyList[index].power" placeholder="请输入功率" w-20>
                          <template #append>kw</template>
                        </el-input>
                      </div>
                      <div @click="cdPolicyList.splice(index, 1)" class="cursor-pointer ml-2">
                        <el-icon>
                          <ele-RemoveFilled class="text-red cursor-pointer" />
                        </el-icon>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
                <el-button type="primary" plain class="w-20 my2" @click="addCdPolicy">添加</el-button>
              </div>
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #d4d9e0; background-color: #fff; text-align: center; background-color: #edf0f3">放电</td>
            <td style="border: 1px solid #d4d9e0; background-color: #fff">
              <div class="m4">
                <el-form class="flex justify-between" :model="fdPolicyList">
                  <div>
                    <div class="font-bold my2">输入时段：<span class="text-12px font-thin">格式00:01-00:20</span></div>
                    <el-form-item v-for="(item, index) in fdPolicyList" :key="index" prop="period">
                      <el-input v-model="fdPolicyList[index].period" placeholder="请输入时段" class="w-45" />
                    </el-form-item>
                  </div>
                  <div>
                    <div class="font-bold my2">设置功率:</div>
                    <el-form-item v-for="(item, index) in fdPolicyList" :key="index">
                      <div>
                        <el-input v-model="fdPolicyList[index].power" placeholder="请输入功率" w-20>
                          <template #append>kw</template>
                        </el-input>
                      </div>
                      <div @click="fdPolicyList.splice(index, 1)" class="cursor-pointer ml-2">
                        <el-icon>
                          <ele-RemoveFilled class="text-red cursor-pointer" />
                        </el-icon>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
                <el-button type="primary" plain class="w-20 my2" @click="addFdPolicy">添加</el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div class="mb-2 text-sm">
        <div class="flex justify-start my-4">
          <div class="cell-item my2">执行时间：</div>
          <el-radio-group v-model="lastPolicyList.isExecSoon" class="ml-4 mr-4">
            <el-radio :label="true">立即执行</el-radio>
            <el-radio :label="false">延时执行</el-radio>
          </el-radio-group>
          <el-date-picker
            v-model="lastPolicyList.setExecTime"
            type="date"
            placeholder="选择日期时间"
            style="width: 200px"
            v-if="lastPolicyList.isExecSoon === false" />
        </div>
        <div>
          <el-form-item label="电价模板：" class="flex justify-start my-4">
            <el-select placeholder="请选择" v-model="lastPolicyList.templateID" clearable>
              <el-option v-for="item in electricityPriceList" :key="item.period" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-center my-8">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
