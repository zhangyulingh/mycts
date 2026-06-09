<script setup lang="ts">
import dayjs from "dayjs"
import {ElButton, ElMessage, ElMessageBox, ElPagination, ElTag, FormInstance} from "element-plus"
import {pcaTextArr} from "element-china-area-data"
import {getRemoveDevAlarm} from "@/api/alarm"
import {queryCondition, queryResult, queryGetAlarmList, allAlarmTypeList, getAllAlarmTypeList} from "@/composables/useAlarm"
import {Session} from "@/utils/storage"
// 初始化数据
queryGetAlarmList()
getAllAlarmTypeList()

const props = {checkStrictly: true}
const daterangeRef = ref()
const selectedOptions = ref()
const queryFm = ref<FormInstance>()

// 合成时间
const mergeTime = (v: any) => {
  if (v) {
    queryCondition.value.AlarmDate_Start = formatDate(v[0])
    queryCondition.value.AlarmDate_End = formatDate(v[1])
  } else {
    queryCondition.value.AlarmDate_Start = ""
    queryCondition.value.AlarmDate_End = ""
  }
  queryGetAlarmList()
}

// 合成设备定位区域
const changeDewLocateAddr = (v: any) => {
  queryCondition.value.DevLocateAddr_Province = v[0]
  queryCondition.value.DevLocateAddr_City = v[1]
  queryCondition.value.DevLocateAddr_County = v[2]
  queryGetAlarmList()
}

// 将选择的时间转换为指定格式
const formatDate = (date: string): string => {
  return dayjs(date).format("YYYY-MM-DD")
}

// 重置查询条件
const resetFields = () => {
  queryCondition.value = {
    PageIndex: 1,
    PageSize: 10,
    AlarmType: undefined,
    AlarmGrade: undefined,
    AlarmState: 1,
    Keywords: "",
    DevLocateAddr_Province: "",
    DevLocateAddr_City: "",
    DevLocateAddr_County: "",
    AlarmDate_Start: "",
    AlarmDate_End: "",
  }
  daterangeRef.value = null // 清空时间
  selectedOptions.value = null // 清空设备定位区域
  queryFm.value?.resetFields()
  queryGetAlarmList()
}

// 筛选变化时触发查询
const handleFilterChange = () => {
  queryGetAlarmList()
}

// 输入时触发查询
const handleInput = () => {
  queryGetAlarmList()
}
// 解除告警方法
const removeAlarm = (id: any) => {
  if (!Session.get("userInfo").actionCodeList.includes("_17_jcgj") && !Session.get("userInfo").isAdmin === true) {
    ElMessage.warning("很抱歉，您暂时无操作权限！，请联系管理员！")
    return
  } else {
    ElMessageBox.confirm("确定要解除该告警吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
                    ElMessage({
              type: "success",
              message: "告警已成功解除",
            })
            queryGetAlarmList()

        // getRemoveDevAlarm(id)
        //   .then(() => {
        //     ElMessage({
        //       type: "success",
        //       message: "告警已成功解除",
        //     })
        //     queryGetAlarmList()
        //   })
        //   .catch(() => {
        //     ElMessage({
        //       type: "error",
        //       message: "告警解除失败，请稍后重试",
        //     })
        //   })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "告警解除已取消",
        })
      })
  }
}
</script>

<template>
  <div class="system-role-container layout-padding">
    <!-- 筛选条件 -->
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="flex justify-start">
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline" ref="queryFm">
          <!-- 告警状态 -->
          <el-form-item label="告警状态" prop="AlarmState">
            <el-select v-model="queryCondition.AlarmState" placeholder="设备状态" @change="handleFilterChange">
              <el-option label="告警中" :value="1" />
              <el-option label="已恢复" :value="2" />
            </el-select>
          </el-form-item>
          <!-- 告警类型 -->
          <el-form-item label="告警类型" prop="AlarmType">
            <el-select v-model="queryCondition.AlarmType" placeholder="告警类型" @change="handleFilterChange">
              <el-option label="全部" :value="0" />
              <el-option v-for="item in allAlarmTypeList" :key="item.type" :label="item.des" :value="item.type" @change="handleFilterChange" />
            </el-select>
          </el-form-item>
          <!-- 告警等级 -->
          <el-form-item label="告警等级" prop="AlarmGrade">
            <el-select v-model="queryCondition.AlarmGrade" placeholder="告警等级" @change="handleFilterChange">
              <el-option label="全部" :value="0" />
              <el-option label="一级" :value="1" />
              <el-option label="二级" :value="2" />
              <el-option label="三级" :value="3" />
            </el-select>
          </el-form-item>
          <!-- 告警日期 -->
          <el-form-item label="告警日期">
            <el-date-picker v-model="daterangeRef" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" @change="mergeTime" />
          </el-form-item>
          <!-- 设备定位区域 -->
          <el-form-item label="设备定位区域">
            <el-cascader :options="pcaTextArr" v-model="selectedOptions" :props="props" @change="changeDewLocateAddr" />
          </el-form-item>
          <!-- 其他条件 -->
          <el-form-item label="其他" prop="Keywords">
            <el-input
              v-model="queryCondition.Keywords"
              placeholder="请输入告警内容、设备编号、产品序列号"
              clearable
              @change="handleFilterChange"
              @input="handleInput" />
          </el-form-item>
          <!-- 清除条件按钮 -->
          <el-form-item>
            <el-button type="primary" @click="resetFields()">清除条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 当前列表告警数量 -->
      <div class="my-4 px-2 bg-emerald bg-op-20 border py-4 border-#16BAAA border-solid rd-1">
        当前列表告警数量 <span class="text-20px font-bold text-#16BAAA">{{ queryResult.total }} 条</span>
      </div>
      <!-- 告警级别说明 -->
      <div class="text-sm my-4 pl2">注：告警级别中，按紧急严重程度 3、2、1 依次递增（3 级为最低，1 级为最高等级）</div>
      <!-- 告警列表 -->
      <div v-if="queryResult.data.length === 0">
        <el-empty />
      </div>
      <el-table v-else :data="queryResult.data">
        <el-table-column type="index" label="序号" width="60">
          <template #default="{$index}">
            {{ $index + 1 + (queryCondition.PageIndex - 1) * queryCondition.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="devCode" label="设备编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="devID" label="设备ID/序列号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeDes" label="告警/故障类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="des" label="告警/故障内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="alarmTime" label="告警/故障时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="grade" label="告警/故障等级" show-overflow-tooltip>
          <template #default="{row}">
            <el-tag type="danger" size="small" v-if="row.grade === 1">一级</el-tag>
            <el-tag type="warning" size="small" v-else-if="row.grade === 2">二级</el-tag>
            <el-tag type="" size="small" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="alarmState" label="告警/故障状态" show-overflow-tooltip>
          <template #default="{row}">
            <el-tag type="danger" size="small" v-if="row.alarmState === 1">告警中</el-tag>
            <el-tag type="success" size="small" v-else>已恢复</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="queryResult.data.some((row) => row.alarmState === 1)" prop="canAutoRemove" label="手动解除" show-overflow-tooltip>
          <template #default="{row}">
            <el-button v-if="row.canAutoRemove === false" type="primary" plain @click="removeAlarm(row.alarmID)"> 解除告警 </el-button>
            <div v-else>/</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4">
        <el-pagination
          :page-sizes="[5, 10, 15, 20]"
          v-model:current-page="queryCondition.PageIndex"
          v-model:page-size="queryCondition.PageSize"
          background
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryResult.total"
          @size-change="queryGetAlarmList"
          @current-change="queryGetAlarmList" />
      </div>
    </div>
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
