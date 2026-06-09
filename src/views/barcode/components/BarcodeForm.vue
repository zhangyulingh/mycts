<script setup lang="ts">
import {reactive, ref} from "vue"
import type {FormInstance, FormRules} from "element-plus"
import {ElMessage} from "element-plus"
import dayjs from "dayjs"
import type {BarcodeRecord} from "@/composables/useBarcode"
import {generateBarcodeId, saveBarcode} from "@/composables/useBarcode"

const visible = ref(false)
const formRef = ref<FormInstance>()
const dialogType = ref<"add" | "edit">("add")
const submitting = ref(false)
const originalBarcode = ref("")

const createEmptyForm = (): BarcodeRecord => ({
  id: "",
  productName: "",
  productModel: "",
  productSpec: "",
  productCode: "",
  batchNo: "",
  productionDate: dayjs().format("YYYY-MM-DD"),
  operator: "",
  remark: "",
  createTime: "",
})

const form = reactive<BarcodeRecord>(createEmptyForm())

const rules = reactive<FormRules>({
  id: [{required: true, message: "请输入条码编号", trigger: "blur"}],
  productName: [{required: true, message: "请输入产品名称", trigger: "blur"}],
  productModel: [{required: true, message: "请输入产品型号", trigger: "blur"}],
  productCode: [{required: true, message: "请输入产品编号", trigger: "blur"}],
  batchNo: [{required: true, message: "请输入生产批次", trigger: "blur"}],
  productionDate: [{required: true, message: "请选择生产日期", trigger: "change"}],
})

const initAndShow = async (type: "add" | "edit", record?: BarcodeRecord) => {
  dialogType.value = type
  originalBarcode.value = type === "edit" && record ? record.id : ""
  Object.assign(form, type === "edit" && record ? {...record} : createEmptyForm())
  if (type === "add") {
    try {
      form.id = await generateBarcodeId()
    } catch (error: any) {
      ElMessage.error(error?.message || "生成条码编号失败")
      return
    }
  }
  visible.value = true
}

const submit = async () => {
  if (!formRef.value || submitting.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (dialogType.value === "add") {
        form.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
      }
      await saveBarcode({...form, id: form.id.trim()}, dialogType.value === "edit" ? originalBarcode.value : undefined)
      ElMessage.success(dialogType.value === "add" ? "录入成功" : "保存成功")
      visible.value = false
    } catch (error: any) {
      ElMessage.error(error?.message || "保存失败")
    } finally {
      submitting.value = false
    }
  })
}

defineExpose({initAndShow})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="dialogType === 'add' ? '录入产品信息' : '编辑产品信息'"
    width="820px"
    destroy-on-close
    class="barcode-form-dialog">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="large"
      class="barcode-form">
      <div class="barcode-form-section">
        <div class="barcode-form-section__title">产品信息</div>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="条码编号" prop="id">
              <el-input v-model="form.id" placeholder="可手动输入或修改条码编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品型号" prop="productModel">
              <el-input v-model="form.productModel" placeholder="请输入产品型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编号" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品规格">
              <el-input v-model="form.productSpec" placeholder="请输入产品规格" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="barcode-form-section">
        <div class="barcode-form-section__title">生产信息</div>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="生产批次" prop="batchNo">
              <el-input v-model="form.batchNo" placeholder="请输入生产批次" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产日期" prop="productionDate">
              <el-date-picker
                v-model="form.productionDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择生产日期"
                class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作员">
              <el-input v-model="form.operator" placeholder="请输入操作员" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <div class="barcode-form-footer">
        <el-button size="large" @click="visible = false">取消</el-button>
        <el-button size="large" type="primary" :loading="submitting" @click="submit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.barcode-form {
  padding: 4px 8px 0;
}

.barcode-form-section {
  padding: 8px 12px 12px;

  & + & {
    margin-top: 12px;
    padding-top: 20px;
    border-top: 1px solid #eef2f5;
  }

  &__title {
    margin-bottom: 20px;
    padding-left: 12px;
    border-left: 4px solid #16baaa;
    font-size: 16px;
    font-weight: 600;
    color: #16baaa;
    line-height: 1;
  }
}

.barcode-form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 28px;
}

:deep(.el-form-item__label) {
  margin-bottom: 10px !important;
  padding: 0 !important;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  line-height: 22px;
}

:deep(.el-input),
:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  min-height: 88px !important;
  padding: 12px 14px;
}
</style>

<style lang="scss">
.el-overlay-dialog .el-dialog.barcode-form-dialog {
  .el-dialog__header {
    padding: 24px 40px 16px !important;
    margin-right: 0;
  }

  .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
  }

  .el-dialog__body {
    padding: 12px 40px 20px !important;
  }

  .el-dialog__footer {
    padding: 8px 40px 32px !important;
  }
}
</style>
