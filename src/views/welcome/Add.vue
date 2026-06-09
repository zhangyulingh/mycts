<template>
  <el-drawer v-model="showDialog" destroy-on-close title="上传启动页" size="700px" direction="rtl">
    <div class="flex flex-col px-32px pb-50px pt-40px">
      <div class="">
        <el-form ref="formRef" :model="formData" :rules="rules" class="space-y-16px" label-width="120px">
          <el-form-item prop="duringDate" label="选择日期" required>
            <el-date-picker
              v-model="formData.duringDate"
              type="datetimerange"
              range-separator="到"
              format="YYYY/MM/DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间" />
          </el-form-item>
          <el-form-item prop="preloadDays" label="预下载天数" required>
            <el-input-number v-model="formData.preloadDays" :min="1" :max="20" />
          </el-form-item>
          <el-form-item prop="name" label="主题名称" required>
            <el-input v-model="formData.name" clearable />
          </el-form-item>
          <el-form-item prop="fileList" label="选择上传图片" required>
            <el-upload
              accept=".png,.jpg,.jpeg"
              v-model:file-list="formData.fileList"
              multiple
              :on-preview="handlePictureCardPreview"
              :auto-upload="false"
              list-type="picture-card"
              :before-remove="getDelItem">
              <el-icon>
                <ele-Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="relative pl-20px mt-10px">
          应用到的APP
          <el-checkbox class="absolute right-30px w-12px" @change="handleCheckAllChange" v-model="allCheck">{{
            allCheck ? "全不选" : "全选"
          }}</el-checkbox>
        </div>
        <div class="p-16px" v-loading="showLoading">
          <div
            v-for="item in appList"
            :class="item.checked ? 'bg-[var(--el-color-primary-light-3)] text-white' : 'bg-white'"
            @click="item.checked = !item.checked"
            class="float-left m-3px box-border flex cursor-pointer items-center rounded-md border px-10px py-3px leading-8">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-shadow-layout">
        <el-button link type="primary" class="w-full" @click="checkSubmit(formRef)">立即上传</el-button>
      </div>
    </div>
  </el-drawer>
  <el-image-viewer
    v-if="dialogVisible"
    :initial-index="picIndex"
    hide-on-click-modal
    :url-list="formData.fileList.map((value) => value.url)"
    @close="dialogVisible = false" />
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from "vue"
import {request} from "@/utils/request"
import ApiConfig from "@/api/ApiConfig"
import {PictureInfo} from "@/views/welcome/types/PictureInfo"
import {ElMessage, FormInstance, FormRules, UploadFile, UploadFiles, UploadProps, UploadRawFile, UploadUserFile} from "element-plus"
import {PlanInfo} from "@/views/welcome/types/PlanInfo"
import {Session} from "@/utils/storage"
import bus from "@/utils/mitt"
import {OssUploadFile, uploadFiles} from "@/utils/ali-oss"
import {AppInfo} from "@/views/welcome/types/AppInfo"

const showDialog = ref(false)
const showLoading = ref(false)
const formRef = ref<FormInstance>()
const appList = ref<AppInfo[]>([])
const allCheck = ref(false)

const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const picIndex = ref(0)
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
  picIndex.value = formData.value.fileList.findIndex((file) => file.url === uploadFile.url)
}

interface MyUploadFile extends OssUploadFile {
  id?: number
  width: number
  height: number
  name: string
  url: string
}

const formData = ref<{
  name: string
  preloadDays: number
  duringDate: string[]
  fileList: MyUploadFile[]
  delList: number[]
  planInfo: PlanInfo
  arr: string[]
}>({
  name: "",
  duringDate: [],
  preloadDays: 1,
  fileList: [],
  delList: [],
  planInfo: {},
  arr: [], // 已选中的appId列表
})

/**
 * 获取删除的原图片id列表
 * @param uploadFile
 * @param uploadFiles
 */
const getDelItem = (uploadFile: MyUploadFile, uploadFiles: UploadFiles) => {
  uploadFile.id && formData.value.delList.push(uploadFile.id)
  return true
}

const rules = reactive<FormRules>({
  name: [{required: true, message: "请输入主题名称", trigger: "blur"}],
  duringDate: [{required: true, message: "请选择日期范围", trigger: "blur"}],
  fileList: [{required: true, message: "请至少选择一张图片", trigger: "blur"}],
})

const checkSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      showLoading.value = true
      uploadFiles(formData.value.fileList, true, "")
        .then(() => {
          formatFileData()
        })
        .catch(() => {
          showLoading.value = false
        })
    }
  })
}

/**
 * 把本地图片的width，height读出来，装进filelist里
 */
function formatFileData() {
  const promises = formData.value.fileList.map((file) => {
    return new Promise((resolve) => {
      if (!file.width) {
        let img = new Image()
        img.onload = (ev) => {
          resolve()
          file.width = img.width
          file.height = img.height
        }
        img.src = file.ossKey?.toString()
      } else {
        resolve()
      }
    })
  })

  Promise.all(promises)
    .then(() => submit())
    .catch((reason) => {
      showLoading.value = false
    })
}

/**
 * 新增|修改
 */
function submit() {
  const data = {
    id: formData.value.planInfo.id,
    name: formData.value.name,
    viewStartTime: formData.value.duringDate[0].replace("T", " "),
    viewEndTime: formData.value.duringDate[1].replace("T", " "),
    preloadDays: formData.value.preloadDays,
    addList: formData.value.fileList
      .filter((value) => value.ossKey)
      .map((file) => {
        return {url: file.ossKey, width: file.width, height: file.height}
      }),
    delList: formData.value.delList,
    userId: Session.get("userInfo").id,
    appId: appList.value
      .filter((value) => value.checked)
      .map((value) => value.id)
      .toString(),
  }
  request({url: ApiConfig.START_PLAN, method: "POST", data: data})
    .then((value) => {
      ElMessage.success(formData.value.planInfo.id ? "添加成功" : "修改成功")
      bus.emit("RefreshWelcomePage")
      close()
    })
    .finally(() => {
      showLoading.value = false
    })
}

/**
 * 获取下方可选的APP列表
 */
const getAllAppList = () => {
  showLoading.value = true
  request<IResponseData<AppInfo[]>>({url: ApiConfig.GET_ALL_APP_LIST, method: "GET"})
    .then((value) => {
      //app按名称排序
      appList.value = value.data.sort((a, b) => {
        if (a.name > b.name) return -1
        else return 1
      })
      //已选中的app变色
      appList.value.forEach((value1) => {
        value1.checked = formData.value.arr.includes(value1.id.toString())
      })
      //全选，全不选checkbox
      allCheck.value = formData.value.arr.length == appList.value.length
    })
    .finally(() => {
      showLoading.value = false
    })
}

/**
 * 获取图片（单独的接口）
 * @param id
 */
const getPictures = (id: number | undefined) => {
  request<PictureInfo[]>({url: `${ApiConfig.START_PLAN}/${id}`, method: "GET"})
    .then((value) => {
      value.forEach((value1) => {
        formData.value.fileList.push({
          id: value1.id,
          url: value1.url,
          name: value1.id?.toString(),
          width: value1.width,
          height: value1.height,
          ossKey: "",
        })
      })
    })
    .finally(() => {})
}

const show = (info?: PlanInfo) => {
  showDialog.value = true
  formData.value = {
    name: info?.name ?? "",
    duringDate: [info?.viewStartTime ?? "", info?.viewEndTime ?? ""],
    preloadDays: info?.preloadDays ?? 1,
    fileList: [],
    delList: [],
    planInfo: info ?? {},
    arr: info?.appId ? info?.appId.split(",") : [],
  }
  getAllAppList()
  info?.id && getPictures(info?.id)
}

const close = () => {
  showDialog.value = false
}
const handleCheckAllChange = (check: boolean) => {
  appList.value.forEach((info) => {
    info.checked = check
  })
}
//对外公开变量
defineExpose({
  show,
  close,
})
</script>

<style scoped lang="scss">
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
}

:deep(.el-upload-list__item-thumbnail) {
  object-fit: cover;
}
</style>
