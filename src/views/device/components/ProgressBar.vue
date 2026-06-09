<script lang="ts" setup>
import {defineProps, computed} from "vue"

const props = defineProps({
  percent: {
    type: Number,
    default: 0,
  },
  wrapColor: {
    type: String,
    default: "",
  },
  borderColor: {
    type: String,
    default: "",
  },
})

// 根据百分比计算进度条颜色
const getDotColor = (percent: number): string => {
  if (percent >= 0 && percent < 20) {
    return "#7cb3ff" // Blue color for 0-20
  } else if (percent >= 20 && percent < 40) {
    return "#7cb3ff" // Orange color for 20-40
  } else if (percent >= 40 && percent < 60) {
    return "#60a3ff" // Yellow color for 40-60
  } else if (percent >= 60 && percent < 80) {
    return "#3589ff" // Green color for 60-80
  } else {
    return "#0A70FF" // Red color for 80-100
  }
}

// 计算进度条的格子数
const dotCount = computed(() => {
  if (props.percent < 0) {
    return 0
  } else if (props.percent > 100) {
    return 100 // 5 cells for 100%
  } else {
    return Math.ceil(props.percent / 20) // Each cell represents 20%
  }
})
</script>

<template>
  <div>
    <div class="progress-wrap" :style="{backgroundColor: wrapColor, borderColor: borderColor}">
      <!-- 使用dotCount来访问计算出的值 -->
      <div class="progress-dot" v-for="i in 5" :key="i" :style="{opacity: i <= dotCount ? 1 : 0, backgroundColor: getDotColor((i - 1) * 20)}"></div>
    </div>
    <div class="absolute -mt-5.2 ml-5 text-white text-12px">{{ percent }}%</div>
  </div>
</template>

<style lang="scss" scoped>
.progress-wrap {
  display: inline-flex;
  align-items: center;
  min-width: 60px;
  border-radius: 2px;
  box-sizing: border-box;

  .progress-dot {
    width: 11px;
    height: 13px;
    border-radius: 1px;
    background-color: #007bff;
    margin-right: 1px;
    &:last-child {
      margin-right: 0;
      border-radius: 0 2px 2px 0;
    }
    &:first-child {
      margin-left: 1px;
      border-radius: 2px 0 0 2px;
    }
  }
}
</style>
