<script setup lang="ts" name="barcodeScan">
import {computed, onMounted, watch, ref} from "vue"
import {useRoute} from "vue-router"
import logoImg from "@/assets/img/logo.png"
import {fetchBarcodeById, decodeBarcodeData} from "@/composables/useBarcode"
import type {BarcodeRecord} from "@/composables/useBarcode"

const route = useRoute()
const record = ref<BarcodeRecord | null>(null)
const loading = ref(false)
const loadError = ref("")

async function loadRecord() {
  loading.value = true
  loadError.value = ""
  record.value = null

  try {
    const dataParam = route.query.data
    if (dataParam) {
      record.value = decodeBarcodeData(String(dataParam))
      if (!record.value) loadError.value = "二维码信息无效"
      return
    }

    const id = route.query.id
    if (id) {
      record.value = await fetchBarcodeById(String(id))
      if (!record.value) loadError.value = "未找到产品信息"
      return
    }

    loadError.value = "缺少条码参数"
  } catch (error: any) {
    loadError.value = error?.message || "加载失败"
  } finally {
    loading.value = false
  }
}

const infoGroups = computed(() => {
  if (!record.value) return []
  const r = record.value
  return [
    {
      title: r.productName || "F系列齿轮搅拌机",
      items: [
        {label: "型号", value: r.model},
        {label: "功率", value: r.power},
        {label: "规格", value: r.specification},
        {label: "调速方式", value: r.speedControl},
        {label: "转速方式", value: r.speedType},
        {label: "颜色", value: r.color},
        {label: "重量", value: r.weight},
        {label: "包装", value: r.packaging},
      ],
    },
  ]
})

onMounted(loadRecord)
watch(() => route.query, loadRecord)
</script>

<template>
  <div class="scan-page">
    <div class="scan-header">
      <img :src="logoImg" class="scan-logo" alt="logo" />
      <div class="scan-title">产品追溯信息</div>
    </div>

    <div v-if="loading" class="scan-card empty">
      <div class="empty-title">加载中...</div>
    </div>

    <div v-else-if="record" class="scan-card">
      <div v-for="group in infoGroups" :key="group.title" class="info-group">
        <div class="group-title">{{ group.title }}</div>
        <div v-for="item in group.items" :key="item.label" class="info-row">
          <span class="info-label">{{ item.label }}</span>
          <span class="info-value">{{ item.value || "-" }}</span>
        </div>
      </div>
    </div>

    <div v-else class="scan-card empty">
      <div class="empty-title">{{ loadError || "未找到产品信息" }}</div>
      <div class="empty-desc">请确认二维码是否有效，或联系生产方重新生成。</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scan-page {
  min-height: 100vh;
  min-height: 100dvh;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #e8f8f6 0%, #f5f7fa 40%);
  padding: clamp(20px, 5vw, 32px) clamp(12px, 4vw, 20px) clamp(32px, 6vw, 48px);
  box-sizing: border-box;
}

.scan-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto clamp(16px, 4vw, 24px);
  padding: 0 4px;
  flex-shrink: 0;
}

.scan-logo {
  width: clamp(36px, 10vw, 40px);
  height: clamp(36px, 10vw, 40px);
  object-fit: contain;
  flex-shrink: 0;
}

.scan-title {
  font-size: clamp(18px, 5vw, 22px);
  font-weight: 700;
  color: #16baaa;
  line-height: 1.3;
}

.scan-card {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(22, 186, 170, 0.12);
  padding: clamp(18px, 4vw, 24px);
  box-sizing: border-box;
  flex: 0 1 auto;
}

.info-group + .info-group {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eef2f5;
}

.group-title {
  font-size: clamp(15px, 4vw, 16px);
  font-weight: 700;
  color: #16baaa;
  margin-bottom: 16px;
  padding-left: 4px;
  line-height: 1.4;
  word-break: break-word;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 12px 4px;
  border-bottom: 1px dashed #eef2f5;
  gap: 6px 16px;
}

.info-label {
  flex: 0 0 88px;
  color: #909399;
  font-size: 14px;
  line-height: 1.5;
}

.info-value {
  flex: 1 1 160px;
  min-width: 0;
  color: #303133;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(40px, 10vw, 56px) clamp(20px, 5vw, 32px);
}

.empty-title {
  font-size: clamp(16px, 4vw, 18px);
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.empty-desc {
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
  max-width: 280px;
}

@media (max-width: 480px) {
  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    flex: none;
    width: 100%;
    font-weight: 500;
  }

  .info-value {
    flex: none;
    width: 100%;
    padding-left: 0;
  }
}
</style>
