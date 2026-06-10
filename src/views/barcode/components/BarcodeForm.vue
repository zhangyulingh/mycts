<script setup lang="ts">
import {reactive, ref} from "vue"
import type {FormInstance, FormRules} from "element-plus"
import {ElMessage} from "element-plus"
import type {BarcodeRecord} from "@/composables/useBarcode"
import {DEFAULT_PRODUCT_NAME, generateBarcodeId, saveBarcode} from "@/composables/useBarcode"

const visible = ref(false)
const formRef = ref<FormInstance>()
const dialogType = ref<"add" | "edit">("add")
const submitting = ref(false)
const originalBarcode = ref("")

const createEmptyForm = (): BarcodeRecord => ({
  id: "",
  productName: DEFAULT_PRODUCT_NAME,
  model: "",
  power: "",
  specification: "",
  speedControl: "",
  speedType: "",
  color: "",
  weight: "",
  packaging: "",
})

const form = reactive<BarcodeRecord>(createEmptyForm())

const rules = reactive<FormRules>({
  id: [{required: true, message: "请输入条码编号", trigger: "blur"}],
  productName: [{required: true, message: "请输入产品名称", trigger: "blur"}],
  model: [{required: true, message: "请输入型号", trigger: "blur"}],
  power: [{required: true, message: "请输入功率", trigger: "blur"}],
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
        <div class="barcode-form-section__title">{{ form.productName || DEFAULT_PRODUCT_NAME }}</div>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="条码编号" prop="id">
              <el-input v-model="form.id" placeholder="可手动输入或修改条码编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="F系列齿轮搅拌机" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="model">
              <el-input v-model="form.model" placeholder="如 F37~F157（需详询）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功率" prop="power">
              <el-input v-model="form.power" placeholder="如 0.18kw~75kw" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规格">
              <el-input
                v-model="form.specification"
                type="textarea"
                :rows="2"
                placeholder="如 380v（三相）、防爆电机、防静电等" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调速方式">
              <el-input v-model="form.speedControl" placeholder="调速 / 不可调速电机" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转速方式">
              <el-input v-model="form.speedType" placeholder="固定式 / 转速根据客户搅拌目的选择" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色">
              <el-input v-model="form.color" placeholder="根据客户需求任选" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重量">
              <el-input v-model="form.weight" placeholder="根据选定或定制机型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="包装">
              <el-input v-model="form.packaging" placeholder="如 木箱" />
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
:deep(.el-textarea) {
  width: 100%;
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
