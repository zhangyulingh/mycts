<script setup lang="ts">
import {ref} from "vue"

defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
})

const dialogVisible = ref(false)
const openDetailDlg = () => {
  dialogVisible.value = true
}
// 暴露变量
defineExpose({
  openDetailDlg,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="供应商详情" width="50%">
    <el-descriptions class="margin-top" :column="2" border size="small">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">供应商名称</div>
        </template>
        {{ detailData.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">供应商联系人</div>
        </template>
        {{ detailData.contacts }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">联系方式</div>
        </template>
        {{ detailData.telephone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">供应商地址</div>
        </template>
        {{ detailData.address }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- 设备型号循环 -->
    <el-descriptions class="mt4" :column="2" border size="small" v-for="item in detailData.devModelList" :key="item.devModelID">
      <template #title>
        <div class="description-title flex items-center">
          <span>设备型号:{{ item.devModelID }}</span>
        </div>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">名称</div>
        </template>
        {{ item.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">通信方式</div>
        </template>
        {{ item.commMode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">额定容量(kWh)</div>
        </template>
        {{ item.ratedCapacity }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">额定功率(kW)</div>
        </template>
        {{ item.ratedPower }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">设备图片</div>
        </template>
        <img :src="item.devImageAddress" alt="设备图片" style="width: 200px; height: 200px" />
      </el-descriptions-item>
    </el-descriptions>
    <div class="flex justify-center my4">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
