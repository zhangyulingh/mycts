<script setup lang="ts">
import QRCode from "qrcodejs2-fixes"
import html2canvas from "html2canvas"
import {ref, watch, nextTick} from "vue"
import type {BarcodeRecord} from "@/composables/useBarcode"
import {getBarcodeQrUrl} from "@/composables/useBarcode"

const props = defineProps<{
  record?: BarcodeRecord | null
}>()

const dialogVisible = ref(false)
const qrUrl = ref("")

const generateQRCode = () => {
  const element = document.getElementById("barcode-qrcode")
  if (!element || !qrUrl.value) return
  element.innerHTML = ""
  new QRCode(element, {
    text: qrUrl.value,
    width: 180,
    height: 180,
    colorDark: "#0853af",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  })
}

watch(
  () => props.record,
  (val) => {
    if (val) {
      qrUrl.value = getBarcodeQrUrl(val)
      nextTick(() => generateQRCode())
    }
  }
)

const openDialog = () => {
  if (!props.record) return
  qrUrl.value = getBarcodeQrUrl(props.record)
  dialogVisible.value = true
  nextTick(() => generateQRCode())
}

const generateAndDownload = () => {
  const dialog = document.getElementById("barcode-dialog-container")
  if (!dialog) return
  setTimeout(() => {
    html2canvas(dialog).then((canvas) => {
      const a = document.createElement("a")
      a.href = canvas.toDataURL("image/png")
      a.download = `条码-${props.record?.id || "二维码"}.png`
      a.click()
    })
  }, 500)
}

defineExpose({openDialog})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="92%"
    :show-close="false"
    class="barcode-qrcode-dialog bg-[url(/images/qrcode_bg.jpg)] bg-cover no-header-dialog"
    id="barcode-dialog-container">
    <div class="qrcode-dialog-body">
      <div class="qrcode-tag">· 产品追溯 ·</div>
      <div class="qrcode-title">{{ record?.productName || "F系列齿轮搅拌机" }}</div>
      <div class="qrcode-info">型号：{{ record?.model || "-" }}</div>
      <div class="qrcode-info">功率：{{ record?.power || "-" }}</div>
      <div class="qrcode-code-wrap">
        <div id="barcode-qrcode"></div>
      </div>
      <div class="qrcode-tip">微信扫一扫打开产品信息页面</div>
      <div class="qrcode-tip qrcode-tip--sub">短链接扫码，数据从后端 API 读取</div>
    </div>
    <div class="qrcode-download">
      <el-button @click="generateAndDownload">下载</el-button>
    </div>
  </el-dialog>
</template>

<style>
.no-header-dialog .el-dialog__header {
  display: none;
}

.el-overlay-dialog .el-dialog.barcode-qrcode-dialog {
  max-width: 420px;
  margin: 0 auto;
}

.barcode-qrcode-dialog .el-dialog__body {
  padding: clamp(24px, 6vw, 32px) clamp(20px, 5vw, 28px) clamp(28px, 6vw, 36px);
}

.qrcode-dialog-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-align: center;
  line-height: 1.9;
  gap: 6px;
  width: 100%;
}

.qrcode-tag {
  width: min(56%, 220px);
  min-height: 44px;
  margin-top: 4px;
  margin-bottom: 8px;
  border-radius: 999px;
  background: #edf1fd;
  color: #0853af;
  font-size: clamp(15px, 4vw, 18px);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
}

.qrcode-title {
  margin-top: 12px;
  margin-bottom: 8px;
  font-size: clamp(20px, 5.5vw, 26px);
  font-weight: 700;
  line-height: 1.4;
  padding: 0 8px;
  word-break: break-word;
}

.qrcode-info {
  margin-top: 6px;
  font-size: clamp(14px, 3.5vw, 15px);
  line-height: 1.8;
  padding: 0 8px;
  word-break: break-word;
}

.qrcode-code-wrap {
  width: min(220px, 70vw);
  height: min(220px, 70vw);
  margin: 20px 0 16px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: clamp(12px, 3vw, 16px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.qrcode-code-wrap canvas,
.qrcode-code-wrap img {
  max-width: 100%;
  max-height: 100%;
}

.qrcode-tip {
  margin-top: 8px;
  font-size: clamp(13px, 3.2vw, 14px);
  padding: 0 12px;
  line-height: 1.6;
}

.qrcode-tip--sub {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.88;
}

.qrcode-download {
  display: flex;
  justify-content: center;
  margin-top: clamp(20px, 5vw, 28px);
  padding-top: 8px;
  width: 100%;
}

.qrcode-download .el-button {
  min-width: 120px;
  height: 40px;
  padding: 0 28px;
}
</style>
