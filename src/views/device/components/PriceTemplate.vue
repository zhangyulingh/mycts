<script setup lang="ts">
import {onMounted, ref} from "vue"

const props = defineProps(["deviceId"])
const dialogVisible = ref(false)
// 获取props.devideId
onMounted(() => {})
const openStrategy = () => {
  dialogVisible.value = true
}

// 暴露变量
defineExpose({
  openStrategy,
})
const strategyList = ref([
  {
    id: 1,
    name: "模板1",
  },
  {
    id: 2,
    name: "模板2",
  },
  {
    id: 3,
    name: "模板3",
  },
])
const strategyId = ref(null)
const rules = {
  strategyId: [{required: true, message: "请选择电价模板", trigger: "change"}],
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="选择应用模板" width="25%">
    <!-- 选择电价模板 -->
    <el-form label-width="80px" style="width: 100%" :rules="rules">
      <el-form-item label="电价模板" prop="strategyId">
        <el-select v-model="strategyId" placeholder="请选择" class="w-full">
          <el-option v-for="item in strategyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex justify-center my-8">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-input__wrapper {
  width: 100% !important;
}
</style>
