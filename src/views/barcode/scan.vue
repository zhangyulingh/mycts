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
      title: "产品信息",
      items: [
        {label: "条码编号", value: r.id},
        {label: "产品名称", value: r.productName},
        {label: "产品型号 / 编号", value: [r.productModel, r.productCode].filter(Boolean).join(" / ") || "-"},
        {label: "产品规格", value: r.productSpec},
      ],
    },
    {
      title: "生产信息",
      items: [
        {label: "生产批次", value: r.batchNo},
        {label: "生产日期", value: r.productionDate},
        {label: "操作员", value: r.operator},
        {label: "备注", value: r.remark},
        {label: "录入时间", value: r.createTime},
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
  background: linear-gradient(180deg, #e8f8f6 0%, #f5f7fa 40%);
  padding: 32px 20px 48px;
}

.scan-header {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 640px;
  margin: 0 auto 24px;
  padding: 0 4px;
}

.scan-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.scan-title {
  font-size: 22px;
  font-weight: 700;
  color: #16baaa;
}

.scan-card {
  max-width: 640px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(22, 186, 170, 0.12);
  padding: 24px 24px 28px;
}

.info-group + .info-group {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eef2f5;
}

.group-title {
  font-size: 16px;
  font-weight: 700;
  color: #16baaa;
  margin-bottom: 16px;
  padding-left: 4px;
}

.info-row {
  display: flex;
  padding: 12px 4px;
  border-bottom: 1px dashed #eef2f5;
  gap: 16px;
}

.info-label {
  width: 88px;
  flex-shrink: 0;
  color: #909399;
}

.info-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.empty {
  text-align: center;
  padding: 56px 32px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.empty-desc {
  color: #909399;
}
</style>
