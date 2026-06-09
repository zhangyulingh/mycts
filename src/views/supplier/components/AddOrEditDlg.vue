<script setup lang="ts">
import {ref, reactive} from "vue"
// import {AddSupplier, UpdateSupplier, GetAllCOMMModeName} from "@/api/supplier"
import {uploadSingerFile, delSingerFile, uploadFiles} from "@/utils/ali-oss"
import {ElDivider, ElMessage, type FormInstance} from "element-plus"

defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
})

const allCOMMModes = ref([
  {
    id: 1,
    name: "MQTT",
  },
  {
    id: 2,
    name: "TCP",
  },
])
// async function getAllCOMMModeNameList() {
//   const res: any = await GetAllCOMMModeName()
//   allCOMMModes.value = res.data
// }
// getAllCOMMModeNameList()

const handleUploadSuccess = async (file: any, item: any) => {
  const fileUrl = await uploadSingerFile(file)
  item.devImageAddress = fileUrl
}
const visible = ref(false)

const iniData = () => ({
  name: "",
  contacts: "",
  telephone: "",
  address: "",
  devModelList: [initialDeviceModel()],
})
// 设备模型的初始值函数
const initialDeviceModel = () => ({
  name: "",
  modeID: 1,
  ratedCapacity: null,
  ratedPower: null,
  devImageAddress: "",
  devImageFiles: [],
})
const form = reactive(iniData())

const rules = {
  name: [{required: true, message: "请输入供应商名称", trigger: "blur"}],
  contacts: [{required: true, message: "请输入供应商联系人", trigger: "blur"}],
  telephone: [{required: true, message: "请输入供应商联系方式", trigger: "blur"}],
  address: [{required: true, message: "请输入供应商地址", trigger: "blur"}],
  devModelList: {
    type: "array",
    required: true,
    min: 1,
    message: "至少需要一个设备模型",
    validator: (rule: any, value: any, callback: (arg0: Error | undefined) => void) => {
      for (let item of value) {
        let isValid = true

        // 验证设备模型各属性
        if (!item.name) {
          callback(new Error("请输入设备名称"))
          isValid = false
        }
        if (!item.commMode) {
          callback(new Error("请输入设备型号"))
          isValid = false
        }
        if (!item.ratedCapacity) {
          callback(new Error("请输入额定容量"))
          isValid = false
        }
        if (!item.ratedPower) {
          callback(new Error("请输入额定功率"))
          isValid = false
        }
        if (!item.devImageAddress) {
          callback(new Error("请上传设备图片"))
          isValid = false
        }
        if (isValid) {
          callback(undefined)
        }
      }
    },
  },
}

const msgText = ref("")
const formRef = ref<FormInstance | null>(null)

function removeDeviceModel(index: number) {
  form.devModelList.splice(index, 1)
}

function addDeviceModel() {
  form.devModelList.push({...iniData().devModelList[0]})
}

async function initAndShow(detailData: any) {
  visible.value = true
  formRef.value?.resetFields()
  if (detailData && detailData.supplierID) {
    msgText.value = "编辑供应商"
    Object.assign(form, detailData)
    // 通讯方式
    form.devModelList.forEach((item: any) => {
      item.modeID = allCOMMModes.value.find((c: any) => c.name === item.commMode)?.id
    })
    form.devModelList = detailData.devModelList.map((item: any) => {
      return {
        ...item,
        devImageFiles: item.devImageAddress.split(",").map((item: any) => {
          return {
            name: item,
            url: item,
            ossKey: item,
          }
        }),
      }
    })
  } else {
    msgText.value = "新增供应商"
    Object.assign(form, iniData())
  }
}

const onSubmit = async () => {
  // await formRef.value?.validate()
  let ps: any[] = []
  form.devModelList.forEach((item: any, index: number) => {
    ps[index] = uploadFiles(item.devImageFiles, true)
  })
  Promise.all(ps)
    .then(() => {
      onSubmit1()
    })
    .catch(() => {})
}
const onSubmit1 = async () => {
  form.devModelList.forEach((item: any) => {
    item.devImageAddress = item.devImageFiles.map((item: any) => item.ossKey).join(",")
  })
  // const submitFunction = msgText.value === "新增供应商" ? AddSupplier : UpdateSupplier
  const submitFunction = (data: any) => Promise.resolve(true)
  const res = await submitFunction(form)
  if (res === true) {
    ElMessage.success(msgText.value === "新增供应商" ? "新增成功" : "编辑成功")
    emits("updateList")
    visible.value = false
  }
}

const emits = defineEmits<{
  (e: "updateList"): void
}>()

defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="visible" :show-close="true" width="40%" :close-on-press-escape="false" :close-on-click-modal="false">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" label-width="80px" :rules="rules">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入供应商名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts" placeholder="请输入供应商联系人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="联系方式" prop="telephone">
            <el-input v-model="form.telephone" placeholder="请输入联系方式" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb-20px">
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入供应商地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <ElDivider />
        <div class="w-full">
          <el-button type="primary" plain @click="addDeviceModel">新增设备</el-button>
          <div v-for="(item, index) in form.devModelList" :key="index">
            <div class="flex justify-between my2 w-full">
              <div class="font-bold">设备型号：{{ index + 1 }}</div>
              <el-button type="danger" plain @click="removeDeviceModel(index)">删除</el-button>
            </div>
            <div class="w-full flex flex-wrap">
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb-20px">
                <el-form-item label="名称" :prop="'devModelList.' + index + '.name'">
                  <el-input v-model="item.name" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb-20px">
                <el-form-item label="通讯方式" :prop="'devModelList.' + index + '.modeID'">
                  <el-select v-model="item.modeID" placeholder="请选择通讯方式" clearable class="w-full">
                    <el-option v-for="item in allCOMMModes" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb-20px">
                <el-form-item label="额定容量" :prop="'devModelList.' + index + '.ratedCapacity'">
                  <el-input v-model="item.ratedCapacity" placeholder="请输入额定容量" clearable>
                    <template #append>kWh</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb-20px">
                <el-form-item label="额定功率" :prop="'devModelList.' + index + '.ratedPower'">
                  <el-input v-model="item.ratedPower" placeholder="请输入额定功率" clearable>
                    <template #append>kW</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb-20px">
                <el-form-item label="设备图片" :prop="'devModelList.' + index + '.devImageAddress'">
                  <el-upload
                    :on-success="(file:any) => handleUploadSuccess(file, item)"
                    :on-remove="delSingerFile"
                    v-model:file-list="item.devImageFiles"
                    list-type="picture-card"
                    :auto-upload="false">
                    <el-icon>
                      <ele-DocumentAdd />
                    </el-icon>
                  </el-upload>
                </el-form-item>
              </el-col>
              <ElDivider />
            </div>
          </div>
        </div>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="default" @click="onSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  font-weight: 400 !important;
}

:deep(.el-tag.el-tag--info) {
  background-color: #ffffff;
  border-color: darkgray;
  color: darkgray;
  // background-color: #16baaa;
  // color: white;
}

:deep(.el-tag .el-tag__close) {
  color: white;
  background-color: red;
}

:deep(.el-select-v2__placeholder.is-transparent) {
  margin-left: 230px;
  margin-top: -20px;
}

:deep(.custom-datepicker .el-input__wrapper) {
  border: 1px solid white;
  box-shadow: none !important; /* 移除阴影 */
  margin-left: 1px;
}

:deep(.el-select-v2__caret.el-icon) {
  margin-top: -15px;
}

:deep(.el-select-v2__wrapper) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  padding: 40px 30px 1px 0;
}

:deep(.el-scrollbar__wrap--hidden-default) {
  scrollbar-width: thin !important;
}
</style>
