<script setup lang="ts">
// 导入组合式 API
import {ref} from "vue"
// 导入图标
import {Plus} from "@element-plus/icons-vue"
import {ElMessage, UploadProps, UploadFile} from "element-plus"
import {uploadSingerFile} from "@/utils/ali-oss"
import {inject} from "vue"

// 注入 uploaderList
// 文件列表
const fileList = ref<UploadFile[]>([])
// 放大图片
const dialogImageUrl = ref("")
// imageUrl 用于显示上传的图片
const dialogVisible = ref(false)

const props = defineProps<{
  modelValue: {id: number; url: string}[]
  name: string
}>()
const emit = defineEmits(["update:modelValue"])
const uploader = inject<Map<string, () => Promise<any>>>("uploader")

if (props.modelValue) {
  fileList.value = props.modelValue.map((item) => {
    return {
      uid: item.id,
      name: item.url,
      url: item.url,
      status: "success",
    }
  })
}

const upload = async () => {
  const promises = fileList.value.map(async (file) => {
    if (file.status === "success") {
      return Promise.resolve({url: file.url})
    } else {
      try {
        const ret = await uploadSingerFile(file.raw)
        file.status = "success"
        file.url = ret
        return {url: ret}
      } catch (err) {
        file.status = "fail"
        return await Promise.reject(err)
      }
    }
  })
  const res = await Promise.all(promises)
  emit("update:modelValue", res)
  return res // Return the array of URLs
}

uploader?.set(props.name, upload)

// 预览文件
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 上传前校验
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const types = ["image/jpeg", "image/png", "image/gif"]
  if (!types.includes(rawFile.type)) {
    ElMessage.error("只能上传jpg/png/gif格式的图片!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片大小不能超过5MB!")
    return false
  }
  return true
}
// computed
</script>

<template>
  <el-upload
    accept="image/*"
    list-type="picture-card"
    :limit="20"
    v-model:file-list="fileList"
    :on-preview="handlePictureCardPreview"
    :auto-upload="false"
    :before-upload="beforeUpload">
    <el-icon><Plus /></el-icon>
    <template #tip>
      <div class="grey--text body-2">只支持.jpg .png .gif格式的图片；</div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<style scoped lang="scss">
.el-upload--picture-card {
  --el-upload-picture-card-size: 80px !important;
  background-color: var(--el-fill-color-lighter);
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 6px;
  box-sizing: border-box;
  width: 50px !important;
  height: var(--el-upload-picture-card-size);
  cursor: pointer;
  vertical-align: top;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
