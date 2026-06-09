<script setup lang="ts">
// 导入组合式 API
import {ref} from "vue"
// 导入图标
import {ElMessage, UploadProps, UploadFile} from "element-plus"
import {inject} from "vue"
import {BatchImportRecharge} from "@/api/finacial";

// 注入 uploaderList
// 文件列表
const fileList = ref<UploadFile[]>([])

const props = defineProps<{
  modelValue: { id: number; url: string }[]
  name: string
}>()
const emit = defineEmits(["update:modelValue"])
const uploader = inject<Map<string, () => Promise<any>>>("uploader")

// 从url中提取名字
const getFileName = (url: string) => {
  const index = url.lastIndexOf("/")
  return url.substring(index + 1)
}

if (props.modelValue) {
  fileList.value = props.modelValue.map((item) => {
    return {
      uid: item.id,
      name: getFileName(item.url),
      url: item.url,
      status: "success",
    }
  })
}
const upload = async () => {
  return Promise.resolve(fileList.value)
}

uploader?.set(props.name, upload)

// 上传前校验
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const types = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] // Excel 文件的 MIME 类型
  if (!types.includes(rawFile.type)) {
    ElMessage.error("请选择Excel格式的文件")
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    // 假设文件大小不能超过10MB
    ElMessage.error("文件大小不能超过10MB!")
    return false
  }
  return true
}
</script>

<template>
  <el-upload class="w-full" accept=".xls,.xlsx" :limit="1" v-model:file-list="fileList" :auto-upload="false"
             :before-upload="beforeUpload">
    <el-button type="primary" size="default">选择文件</el-button>
    <template #tip>
      <div class="grey--text body-2">仅支持上传 Excel 文件。</div>
    </template>
  </el-upload>
</template>
