<script setup lang="ts">
import {ref, reactive} from "vue"
import {AddElectricPriceTemplate, UpdateElectricPriceTemplate} from "@/api/electricity"
import {ElMessage, type FormInstance} from "element-plus"
import {handleInput} from "@/utils/inputNumber"
import dayjs, {Dayjs} from "dayjs"

defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
})
const visible = ref(false)
const iniData = () => ({
  name: "",
  des: "",
  effectTime: "",
  year: "",
  month: [] as any,
  monthC: [] as any,
  peakPeriodPrice: "",
  highPeriodPrice: "",
  normalPeriodPrice: "",
  lowPeriodPrice: "",
  peakPeriod: "",
  highPeriod: "",
  normalPeriod: "",
  lowPeriod: "",
})
const form = reactive(iniData())

const decimalNumberRule = [
  {
    required: true,
    message: "请输入价格",
    trigger: "blur",
  },
  {
    pattern: /^(\d+)(\.\d{1,4})?$/,
    message: "只能保留4位小数",
    trigger: "blur",
  },
]
const rules = {
  name: [{required: true, message: "请输入电价模板名称", trigger: "blur"}],
  effectTime: [{required: true, message: "请选择生效时间", trigger: "blur"}],
  des: [{required: true, message: "请输入模板描述", trigger: "blur"}],
  year: [{required: true, message: "请选择策略年份", trigger: "blur"}],
  monthC: [{required: true, message: "请输入策略月份", trigger: "blur"}],
  peakPeriodPrice: decimalNumberRule,
  highPeriodPrice: decimalNumberRule,
  normalPeriodPrice: decimalNumberRule,
  lowPeriodPrice: decimalNumberRule,
}

const msgText = ref("")
const formRef = ref<FormInstance | null>(null)
const numpeak = ref<Dayjs[][]>([[]])
const numHighPeriod = ref<Dayjs[][]>([[]])
const numNormal = ref<Dayjs[][]>([[]])
const numLow = ref<Dayjs[][]>([[]])
// 定义通用函数
const pushTimeRangeToArr = (arr: any) => {
  arr.push([dayjs("00:00", "HH:mm"), dayjs("23:59", "HH:mm")])
}

const processTimeRanges = (data: any, field: keyof DetailData, targetArray: any[]) => {
  const timeRangeStr = data[field]
  if (timeRangeStr) {
    const arr = timeRangeStr.split(",")
    arr.forEach((item: string, index: number) => {
      const [start, end] = item.split("-")
      if (index >= targetArray.length) {
        targetArray.push([])
      }
      targetArray[index] = [dayjs(start, "HH:mm"), dayjs(end, "HH:mm")]
    })
  } else {
    targetArray.push([dayjs("00:00", "HH:mm"), dayjs("23:59", "HH:mm")])
  }
}
type DetailData = {
  peakPeriod?: string
  highPeriod?: string
  normalPeriod?: string
  lowPeriod?: string
}
const initAndShow = (detailData: any) => {
  visible.value = true
  formRef.value?.resetFields()
  if (detailData && detailData.id) {
    msgText.value = "编辑电价"
    Object.assign(form, detailData)
    if (detailData.year) {
      form.year = detailData.year + ""
    }
    form.effectTime = dayjs(detailData.strEffectTime).format("YYYY-MM-DD")
    // 转换月份
    if (detailData.month) {
      form.monthC = detailData.month.split(",")
    }
    processTimeRanges(detailData, "peakPeriod", numpeak.value)
    processTimeRanges(detailData, "highPeriod", numHighPeriod.value)
    processTimeRanges(detailData, "normalPeriod", numNormal.value)
    processTimeRanges(detailData, "lowPeriod", numLow.value)
  } else {
    numpeak.value = [[dayjs("00:00", "HH:mm"), dayjs("23:59", "HH:mm")]]
    numHighPeriod.value = [[dayjs("00:00", "HH:mm"), dayjs("23:59", "HH:mm")]]
    numNormal.value = [[dayjs("00:00", "HH:mm"), dayjs("23:59", "HH:mm")]]
    numLow.value = [[dayjs("00:00", "HH:mm"), dayjs("23:59", "HH:mm")]]
    msgText.value = "新增电价"
    Object.assign(form, iniData())
  }
}

const formatTimeRangesToString = (array: any[]) => {
  let formattedString = ""
  array.forEach((item, index) => {
    const [start, end] = item.map((time: any) => dayjs(time).format("HH:mm"))
    formattedString += `${start}-${end}`
    if (array.length > 1 && index < array.length - 1) {
      formattedString += ","
    }
  })
  return formattedString
}

const onSubmit = async () => {
  await formRef.value?.validate()
  form.effectTime = dayjs(form.effectTime).format("YYYY-MM-DD")
  form.year = dayjs(form.year).format("YYYY")
  if (Array.isArray(form.monthC) && form.monthC.every((item) => typeof item === "string")) {
    form.month = form.monthC.join(",")
  }

  form.peakPeriod = formatTimeRangesToString(numpeak.value)
  form.highPeriod = formatTimeRangesToString(numHighPeriod.value)
  form.normalPeriod = formatTimeRangesToString(numNormal.value)
  form.lowPeriod = formatTimeRangesToString(numLow.value)

  const submitFunction = msgText.value === "新增电价" ? AddElectricPriceTemplate : UpdateElectricPriceTemplate
  const res = await submitFunction(form)
  if (res === true) {
    emits("updateList")
    ElMessage.success(msgText.value === "新增电价" ? "新增成功" : "编辑成功")
    visible.value = false
  }
}
const emits = defineEmits<{
  (e: "updateList"): void
}>()
const initials = Array.from({length: 12}, (v, k) => k + 1).map((item) => item.toString())
const options = ref(
  initials.map((item) => ({
    label: item,
    value: item,
  }))
)
defineExpose({
  initAndShow,
})
</script>

<template>
  <el-dialog v-model="visible" :show-close="true" width="40%" :close-on-press-escape="false" :close-on-click-modal="false">
    <template #header="{titleId, titleClass}">
      <h4 :id="titleId" :class="titleClass">{{ msgText }}</h4>
    </template>
    <el-form ref="formRef" :model="form" size="default" label-width="100px" :rules="rules">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入电价模板名称" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="生效时间" prop="effectTime">
            <el-date-picker v-model="form.effectTime" type="date" placeholder="请选择生效时间" clearable style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-form-item label="模板描述" prop="des">
            <el-input
              v-model="form.des"
              placeholder="请输入电价模板描述"
              type="textarea"
              maxlength="500"
              show-word-limit
              :rows="4"
              clearable></el-input>
          </el-form-item>
        </el-col>
        <div class="w-full relative">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
            <el-form-item prop="year" class="absolute top-2px z-1 custom-datepicker">
              <el-date-picker v-model="form.year" type="year" placeholder="请选择策略年份" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="策略时间" prop="monthC">
              <el-select-v2 v-model="form.monthC" class="w-full" :options="options" placeholder="请选择策略月份" multiple />
            </el-form-item>
          </el-col>
        </div>

        <!-- 时段 -->
        <div>
          <el-col class="mb-20px">
            <el-form-item label="尖时段">
              <div v-for="(item, i) in numpeak" :key="i" class="mb2">
                <el-time-picker
                  v-model="numpeak[i]"
                  isRange
                  placeholder="请选择尖时段"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH:mm" />
                <el-icon v-if="numpeak.length > 1 || i !== 0">
                  <ele-RemoveFilled
                    class="text-red cursor-pointer"
                    @click="
                      () => {
                        numpeak.splice(i, 1)
                      }
                    " />
                </el-icon>
                <el-icon>
                  <ele-CirclePlusFilled class="text-#16baaa cursor-pointer" @click="pushTimeRangeToArr(numpeak)" />
                </el-icon>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="mb-20px">
            <el-form-item label="峰时段">
              <div v-for="(item, i) in numHighPeriod" :key="i" class="mb2">
                <el-time-picker
                  v-model="numHighPeriod[i]"
                  isRange
                  placeholder="请选择峰时段"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH:mm" />
                <el-icon v-if="numHighPeriod.length > 1 || i !== 0">
                  <ele-RemoveFilled
                    class="text-red cursor-pointer"
                    @click="
                      () => {
                        numHighPeriod.splice(i, 1)
                      }
                    " />
                </el-icon>
                <el-icon>
                  <ele-CirclePlusFilled class="text-#16baaa cursor-pointer" @click="pushTimeRangeToArr(numHighPeriod)" />
                </el-icon>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="mb-20px">
            <el-form-item label="平时段">
              <div v-for="(item, i) in numNormal" :key="i" class="mb2">
                <el-time-picker
                  v-model="numNormal[i]"
                  isRange
                  placeholder="请选择平时段"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH:mm" />
                <el-icon v-if="numNormal.length > 1 || i !== 0">
                  <ele-RemoveFilled
                    class="text-red cursor-pointer"
                    @click="
                      () => {
                        numNormal.splice(i, 1)
                      }
                    " />
                </el-icon>
                <el-icon>
                  <ele-CirclePlusFilled class="text-#16baaa cursor-pointer" @click="pushTimeRangeToArr(numNormal)" />
                </el-icon>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="mb-20px">
            <el-form-item label="谷时段">
              <div v-for="(item, i) in numLow" :key="i" class="mb2">
                <el-time-picker
                  v-model="numLow[i]"
                  isRange
                  placeholder="请输入谷时段"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH:mm" />
                <el-icon v-if="numLow.length > 1 || i !== 0">
                  <ele-RemoveFilled
                    class="text-red cursor-pointer"
                    @click="
                      () => {
                        numLow.splice(i, 1)
                      }
                    " />
                </el-icon>
                <el-icon>
                  <ele-CirclePlusFilled class="text-#16baaa cursor-pointer" @click="pushTimeRangeToArr(numLow)" />
                </el-icon>
              </div>
            </el-form-item>
          </el-col>
        </div>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-20px">
          <el-divider content-position="left">注：请输入大于等于0的有效数字，小数点保留后四位</el-divider>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="尖时段电价" prop="peakPeriodPrice">
            <el-input v-model="form.peakPeriodPrice" placeholder="请输入尖时段电价" @input="form.peakPeriodPrice = handleInput($event)" clearable>
              <template #append>元/kWh</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="124" :xl="12" class="mb-20px">
          <el-form-item label="峰时段电价" prop="highPeriodPrice">
            <el-input v-model="form.highPeriodPrice" placeholder="请输入峰时段电价" @input="form.highPeriodPrice = handleInput($event)" clearable>
              <template #append>元/kWh</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="平时段电价" prop="normalPeriodPrice">
            <el-input v-model="form.normalPeriodPrice" placeholder="请输入平时段电价" @input="form.normalPeriodPrice = handleInput($event)" clearable>
              <template #append>元/kWh</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" class="mb-20px">
          <el-form-item label="谷时段电价" prop="lowPeriodPrice">
            <el-input v-model="form.lowPeriodPrice" placeholder="请输入谷时段电价" @input="form.lowPeriodPrice = handleInput($event)" clearable>
              <template #append>元/kWh</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="flex items-center justify-center">
        <el-button size="default" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="default" >提交</el-button>
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
:deep(.el-select__wrapper) {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;
  padding: 50px 10px 10px 15px !important;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-blank);
  transition: var(--el-transition-duration);
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
