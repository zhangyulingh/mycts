<script setup lang="ts">
import {ref} from "vue"
import {ElDrawer} from "element-plus"
import {defineExpose, defineProps} from "vue"
import {SwitchFilled} from "@element-plus/icons-vue"
defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
})
const visible = ref(false)
const openDrawer = () => {
  visible.value = true
}

defineExpose({openDrawer})
</script>
<template>
  <el-drawer size="80%" v-model="visible" :show-close="true">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">模板详情</h4>
    </template>
    <div class="p-4">
      <div>
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item>
            <template #label>
              <div class="my2">模板名称</div>
            </template>
            {{ detailData.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">生效时间</div>
            </template>
            {{ detailData.strEffectTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">模板描述</div>
            </template>
            {{ detailData.des }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">模板状态</div>
            </template>
            <el-tag size="small" :type="detailData.isDisable === true ? 'danger' : 'primary'">
              {{ detailData.isDisable === true ? "禁用" : "开启" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">是否应用</div>
            </template>
            <el-tag size="small" :type="detailData.isApply === true ? 'primary' : 'danger'">
              {{ detailData.isApply === true ? "已应用" : "未应用" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 策略月份 -->
      <div>
        <el-descriptions class="mt4" :column="1" border>
          <template #title>
            <div class="description-title flex items-center">
              <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2"><SwitchFilled /></el-icon>
              <span>策略月份</span>
            </div>
          </template>
          <el-descriptions-item>
            <template #label>
              <div>策略月份</div>
            </template>
            <div class="my4">{{ detailData.year }}</div>
            <div>
              <el-tag class="mr2" size="small" v-for="item in detailData.month.split(',')" :key="item">{{ item }}月</el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 电价信息 -->
      <div>
        <el-descriptions class="mt4" :column="2" border>
          <template #title>
            <div class="description-title flex items-center">
              <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2"><SwitchFilled /></el-icon>
              <span>电价信息</span>
            </div>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">尖时段电价</div>
            </template>
            {{ detailData.peakPeriodPrice }}<span class="text-sm">元/kWh</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">峰时段电价</div>
            </template>
            {{ detailData.highPeriodPrice }}<span class="text-sm">元/kWh</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">平时段电价</div>
            </template>
            {{ detailData.normalPeriodPrice }}<span class="text-sm">元/kWh</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">谷时段电价</div>
            </template>
            {{ detailData.lowPeriodPrice }}<span class="text-sm">元/kWh</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 时段信息 -->
      <div>
        <el-descriptions class="mt4" :column="1" border>
          <template #title>
            <div class="description-title flex items-center">
              <el-icon class="text-#16BAAA text-xl -rotate-90 mt1 mr2"><SwitchFilled /></el-icon>
              <span>时段信息</span>
            </div>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="my2">尖时段</div>
            </template>
            <el-tag size="small" class="mr2" v-for="item in detailData.peakPeriod.split(',')" :key="item">{{ item === "" ? "/" : item }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">峰时段</div>
            </template>
            <el-tag size="small" class="mr2" v-for="item in detailData.highPeriod.split(',')" :key="item">{{ item === "" ? "/" : item }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">平时段</div>
            </template>
            <el-tag size="small" class="mr2" v-for="item in detailData.normalPeriod.split(',')" :key="item">{{ item === "" ? "/" : item }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="my2">谷时段</div>
            </template>
            <el-tag size="small" class="mr2" v-for="item in detailData.lowPeriod.split(',')" :key="item">{{ item === "" ? "/" : item }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </el-drawer>
</template>
<style lang="scss" scoped>
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  font-weight: 400 !important;
}
</style>
