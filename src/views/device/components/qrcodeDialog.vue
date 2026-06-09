<script setup lang="ts">
import QRCode from "qrcodejs2-fixes"
import html2canvas from "html2canvas"
import {onMounted, ref, defineProps, defineExpose, nextTick, onBeforeUpdate, watch} from "vue"
import {queryGetDevH5QRCodeContent} from "@/composables/useDevice"
const props = defineProps(["deviceId"])
const response = ref<any>()
onMounted(() => {
  watch(
    () => props.deviceId,
    async () => {
      response.value = await queryGetDevH5QRCodeContent(props.deviceId)
      generateQRCode()
    }
  )
})
const dialogVisible = ref(false)

// 在组件加载时直接生成二维码
onMounted(() => {})
onBeforeUpdate(() => {
  nextTick(() => {
    generateQRCode()
  })
})

// 生成二维码
const generateQRCode = () => {
  const element = document.getElementById("code")
  if (element) {
    element.innerHTML = ""
    new QRCode(element, {
      text: response.value,
      width: 168,
      height: 168,
      colorDark: "#0853af",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    })
  }
}
// 在组件加载时直接生成二维码
onMounted(() => {
  generateQRCode()
})
const openDialog = () => {
  dialogVisible.value = true
}
// 生成图片并下载
const generateAndDownload = () => {
  const dialog = document.getElementById("dialog-container")

  if (dialog !== null) {
    setTimeout(() => {
      html2canvas(dialog).then((canvas) => {
        const a = document.createElement("a")
        a.href = canvas.toDataURL("image/png")
        a.download = "二维码.png"
        a.click()
      })
    }, 500) // 增加一个 500 毫秒的延迟
  }
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="350px"
    :show-close="false"
    class="bg-[url(/images/qrcode_bg.jpg)] bg-cover no-header-dialog"
    id="dialog-container">
    <div class="flex flex-col justify-center items-center text-white leading-12">
      <div class="rd-50 bg-#EDF1FD w-50% h-10 font-bold text-lg flex justify-center items-center text-blue mt-4">· 光伏 ·</div>
      <div class="text-26px font-bold mt-4">储能站运行数据查询</div>
      <div>设备编号：{{ props.deviceId }}</div>
      <div class="h-50 w-50 bg-white flex justify-center items-center">
        <div id="code"></div>
      </div>
      <div>打开微信扫一扫即可查询</div>
    </div>
    <div class="flex justify-center items-center absolute -bottom-15 left-43%">
      <el-button @click="generateAndDownload">下载</el-button>
    </div>
  </el-dialog>
</template>
<style>
.no-header-dialog .el-dialog__header {
  display: none;
}
</style>
