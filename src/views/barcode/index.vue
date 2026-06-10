<script setup lang="ts" name="barcodeIndex">
import {defineAsyncComponent, ref, nextTick, onMounted} from "vue"
import {ElMessage, ElMessageBox, FormInstance} from "element-plus"
import type {BarcodeRecord} from "@/composables/useBarcode"
import {
  queryCondition,
  queriedResult,
  queryBarcodeList,
  deleteBarcode,
  exportAllToExcel,
  bindLocalExcelFile,
  unbindLocalExcelFile,
  importRecordsFromExcel,
  boundExcelFileName,
  canBindLocalFile,
  listLoading,
  isApiConfigured,
} from "@/composables/useBarcode"

const BarcodeForm = defineAsyncComponent(() => import("@/views/barcode/components/BarcodeForm.vue"))
const QrcodeDialog = defineAsyncComponent(() => import("@/views/barcode/components/QrcodeDialog.vue"))

const formRef = ref<InstanceType<typeof BarcodeForm>>()
const qrcodeDialogRef = ref<InstanceType<typeof QrcodeDialog>>()
const queryFmRef = ref<FormInstance>()
const currentRecord = ref<BarcodeRecord | null>(null)
const importInputRef = ref<HTMLInputElement>()

const onOpenAdd = () => {
  formRef.value?.initAndShow("add")
}

const onOpenEdit = (row: BarcodeRecord) => {
  formRef.value?.initAndShow("edit", row)
}

const onOpenQrcode = async (row: BarcodeRecord) => {
  currentRecord.value = row
  await nextTick()
  qrcodeDialogRef.value?.openDialog()
}

const onDelete = (row: BarcodeRecord) => {
  ElMessageBox.confirm(`确定删除条码「${row.id}」吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteBarcode(row.id)
      ElMessage.success("删除成功")
    } catch (error: any) {
      ElMessage.error(error?.message || "删除失败")
    }
  })
}

const onExportExcel = async () => {
  try {
    await exportAllToExcel()
    ElMessage.success("Excel 已导出到下载目录")
  } catch (error: any) {
    ElMessage.error(error?.message || "导出失败")
  }
}

const onBindLocalFile = async () => {
  try {
    const result = await bindLocalExcelFile()
    if (result.message) {
      ElMessage[result.success ? "success" : "warning"](result.message)
    }
  } catch (error: any) {
    ElMessage.error(error?.message || "绑定失败")
  }
}

const onUnbindLocalFile = () => {
  unbindLocalExcelFile()
  ElMessage.info("已取消本地文件绑定")
}

const onImportClick = () => {
  importInputRef.value?.click()
}

const onImportExcel = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return

  try {
    await ElMessageBox.confirm("导入时若条码编号相同将覆盖已有记录，是否继续？", "导入 Excel", {
      confirmButtonText: "合并导入",
      cancelButtonText: "取消",
      distinguishCancelAndClose: true,
      type: "info",
    })
    const result = await importRecordsFromExcel(file)
    ElMessage[result.success ? "success" : "warning"](result.message)
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error?.message || "导入失败")
    }
  }
}

const resetFields = () => {
  queryCondition.value.Keywords = ""
  queryCondition.value.PageIndex = 1
  queryFmRef.value?.resetFields()
  void queryBarcodeList()
}

const handlePageChange = (page: number) => {
  queryCondition.value.PageIndex = page
  void queryBarcodeList()
}

const handleSizeChange = (size: number) => {
  queryCondition.value.PageSize = size
  queryCondition.value.PageIndex = 1
  void queryBarcodeList()
}

onMounted(async () => {
  if (!isApiConfigured) {
    ElMessage.warning("请先在 .env.local 配置后端 API，并确认 PostgreSQL products 表已创建")
    return
  }
  try {
    await queryBarcodeList()
  } catch (error: any) {
    ElMessage.error(error?.message || "加载条码数据失败")
  }
})
</script>

<template>
  <div class="barcode-container layout-padding">
    <div class="barcode-content layout-padding-auto layout-padding-view">
      <div class="barcode-header">
        <div class="barcode-header__title">条码系统</div>
        <div class="barcode-header__desc">录入产品信息保存到自建后端 API；二维码为短链接，客户微信扫码打开 H5 页面查看</div>
      </div>

      <el-alert
        v-if="!isApiConfigured"
        title="后端 API 未配置：请在 .env.local 填写 VITE_API_BASE_URL，并确认 Express 服务和 PostgreSQL 已启动"
        type="error"
        show-icon
        :closable="false"
        class="mb-0" />

      <div class="barcode-toolbar">
        <el-form :inline="true" :model="queryCondition" ref="queryFmRef" class="barcode-toolbar__form">
          <el-form-item label="关键词" prop="Keywords">
            <div class="barcode-search-row">
              <el-input
                v-model="queryCondition.Keywords"
                placeholder="产品名称 / 型号 / 功率 / 条码"
                clearable
                class="barcode-search-row__input"
                @keyup.enter="queryBarcodeList()" />
              <el-button type="primary" @click="queryBarcodeList()">查询</el-button>
              <el-button @click="resetFields()">清除条件</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-button type="primary" plain class="barcode-toolbar__action" @click="onOpenAdd">录入产品信息</el-button>
      </div>

      <div class="barcode-file-bar">
        <div class="barcode-file-bar__left">
          <span class="barcode-file-bar__label">本地 Excel：</span>
          <span v-if="boundExcelFileName" class="barcode-file-bar__name">已绑定 {{ boundExcelFileName }}，保存/删除时自动同步</span>
          <span v-else class="barcode-file-bar__name barcode-file-bar__name--muted">
            {{ canBindLocalFile ? "未绑定本地文件，可绑定后自动写入指定 Excel" : "当前浏览器仅支持手动导出 Excel 到下载目录" }}
          </span>
        </div>
        <div class="barcode-file-bar__actions">
          <el-button @click="onExportExcel">导出 Excel</el-button>
          <el-button @click="onImportClick">导入 Excel</el-button>
          <el-button v-if="canBindLocalFile" type="primary" plain @click="onBindLocalFile">
            {{ boundExcelFileName ? "更换本地文件" : "绑定本地 Excel" }}
          </el-button>
          <el-button v-if="boundExcelFileName" @click="onUnbindLocalFile">取消绑定</el-button>
        </div>
        <input ref="importInputRef" type="file" accept=".xlsx,.xls" class="hidden" @change="onImportExcel" />
      </div>

      <div class="barcode-summary">
        当前已录入产品
        <span class="barcode-summary__count">{{ queriedResult.total }}</span>
        条，数据保存在 PostgreSQL，全国客户扫码均可查询。
      </div>

      <div class="barcode-table-wrap">
        <el-table v-loading="listLoading" :data="queriedResult.list" border stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="60" align="center">
            <template #default="{$index}">
              {{ $index + 1 + (queryCondition.PageIndex - 1) * queryCondition.PageSize }}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="条码编号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="model" label="型号" min-width="110" show-overflow-tooltip />
          <el-table-column prop="power" label="功率" min-width="100" show-overflow-tooltip />
          <el-table-column prop="specification" label="规格" min-width="160" show-overflow-tooltip />
          <el-table-column prop="speedControl" label="调速方式" min-width="110" show-overflow-tooltip />
          <el-table-column prop="speedType" label="转速方式" min-width="110" show-overflow-tooltip />
          <el-table-column prop="color" label="颜色" min-width="90" show-overflow-tooltip />
          <el-table-column prop="weight" label="重量" min-width="90" show-overflow-tooltip />
          <el-table-column prop="packaging" label="包装" min-width="90" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="240" align="center">
            <template #default="{row}">
              <el-button link type="primary" @click="onOpenQrcode(row)">生成二维码</el-button>
              <el-button link type="primary" @click="onOpenEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="onDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="barcode-pagination">
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queriedResult.total"
          :page-size="queryCondition.PageSize"
          :current-page="queryCondition.PageIndex"
          @current-change="handlePageChange"
          @size-change="handleSizeChange" />
      </div>
    </div>

    <BarcodeForm ref="formRef" />
    <QrcodeDialog ref="qrcodeDialogRef" :record="currentRecord" />
  </div>
</template>

<style scoped lang="scss">
.barcode-container {
  .barcode-content {
    padding: 20px 24px 24px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .barcode-header {
    padding-bottom: 4px;

    &__title {
      font-size: 20px;
      font-weight: 700;
      color: #303133;
      line-height: 28px;
    }

    &__desc {
      margin-top: 6px;
      font-size: 14px;
      color: #909399;
      line-height: 22px;
    }
  }

  .barcode-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: #f8fafb;
    border: 1px solid #eef2f5;
    border-radius: 8px;

    &__form {
      flex: 1;
      margin-bottom: 0;

      :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 0;
      }

      :deep(.el-form-item__label) {
        line-height: 32px;
        padding-right: 12px;
      }

      :deep(.el-form-item__content) {
        line-height: 32px;
      }
    }

    &__action {
      flex-shrink: 0;
    }
  }

  .barcode-search-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;

    &__input {
      width: 280px;
    }
  }

  .barcode-file-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    background: #fff;
    border: 1px dashed #dcdfe6;
    border-radius: 8px;

    &__left {
      flex: 1;
      min-width: 0;
      font-size: 14px;
      line-height: 22px;
    }

    &__label {
      color: #606266;
      font-weight: 500;
    }

    &__name {
      color: #303133;

      &--muted {
        color: #909399;
      }
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      flex-shrink: 0;
    }
  }

  .hidden {
    display: none;
  }

  .barcode-summary {
    padding: 14px 20px;
    background: #dafaf3;
    border: 1px solid #16baaa;
    border-radius: 8px;
    color: #303133;
    font-size: 14px;
    line-height: 22px;

    &__count {
      margin: 0 6px;
      font-size: 20px;
      font-weight: 700;
      color: #16baaa;
    }
  }

  .barcode-table-wrap {
    flex: 1;
    min-height: 0;
    padding: 4px 0;
  }

  .barcode-pagination {
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
  }
}

:deep(.el-table) {
  .cell {
    padding: 10px 12px;
  }

  th.el-table__cell {
    background: #f5f7fa;
  }
}
</style>
