import {ref} from "vue"
import {
  deleteProduct,
  getProduct,
  isApiBaseUrlConfigured,
  listProducts,
  saveProduct,
  updateProduct,
} from "@/utils/api"
import {
  exportBarcodeExcel,
  importBarcodeExcel,
  isFileSystemAccessSupported,
  pickLocalExcelFile,
  writeBarcodeExcelToHandle,
} from "@/utils/barcodeExcel"

export const DEFAULT_PRODUCT_NAME = "F系列齿轮搅拌机"

export interface BarcodeRecord {
  id: string
  productName: string
  model: string
  power: string
  specification: string
  speedControl: string
  speedType: string
  color: string
  weight: string
  packaging: string
}

interface ProductRow {
  id: number
  barcode: string
  product_name: string | null
  model: string | null
  power: string | null
  specification: string | null
  speed_control: string | null
  speed_type: string | null
  color: string | null
  weight: string | null
  packaging: string | null
  created_at: string
}

function rowToRecord(row: ProductRow): BarcodeRecord {
  return {
    id: row.barcode,
    productName: row.product_name || DEFAULT_PRODUCT_NAME,
    model: row.model || "",
    power: row.power || "",
    specification: row.specification || "",
    speedControl: row.speed_control || "",
    speedType: row.speed_type || "",
    color: row.color || "",
    weight: row.weight || "",
    packaging: row.packaging || "",
  }
}

function recordToProduct(record: BarcodeRecord) {
  return {
    barcode: record.id.trim(),
    product_name: record.productName || DEFAULT_PRODUCT_NAME,
    model: record.model,
    power: record.power,
    specification: record.specification,
    speed_control: record.speedControl,
    speed_type: record.speedType,
    color: record.color,
    weight: record.weight,
    packaging: record.packaging,
  }
}

function normalizeApiError(error: any) {
  const message = error?.message || "后端 API 请求失败"
  if (message.includes("404")) return "未找到产品信息"
  if (message.includes("409") || message.includes("already exists")) return "条码编号已存在，请更换"
  return message
}

export const queryCondition = ref({
  PageIndex: 1,
  PageSize: 10,
  Keywords: "",
})

export const queriedResult = ref({
  total: 0,
  list: [] as BarcodeRecord[],
})

export const listLoading = ref(false)

let localExcelHandle: FileSystemFileHandle | null = null
export const boundExcelFileName = ref("")

function filterRecords(records: BarcodeRecord[], keyword: string) {
  const value = keyword.trim().toLowerCase()
  if (!value) return records

  return records.filter((record) =>
    [
      record.id,
      record.productName,
      record.model,
      record.power,
      record.specification,
      record.speedControl,
      record.speedType,
      record.color,
      record.weight,
      record.packaging,
    ]
      .filter(Boolean)
      .some((item) => String(item).toLowerCase().includes(value))
  )
}

async function syncToLocalExcel() {
  if (!localExcelHandle) return
  try {
    const records = await fetchAllBarcodes()
    await writeBarcodeExcelToHandle(localExcelHandle, records)
  } catch (error) {
    console.error("同步本地 Excel 失败:", error)
    localExcelHandle = null
    boundExcelFileName.value = ""
  }
}

export const queryBarcodeList = async () => {
  listLoading.value = true
  try {
    const {PageIndex, PageSize, Keywords} = queryCondition.value
    const allRecords = await fetchAllBarcodes()
    const filteredRecords = filterRecords(allRecords, Keywords)
    const start = (PageIndex - 1) * PageSize

    queriedResult.value.total = filteredRecords.length
    queriedResult.value.list = filteredRecords.slice(start, start + PageSize)
  } finally {
    listLoading.value = false
  }
}

export const fetchAllBarcodes = async () => {
  try {
    const data = await listProducts(10000)
    return (data as ProductRow[]).map(rowToRecord)
  } catch (error: any) {
    throw new Error(normalizeApiError(error))
  }
}

export const fetchBarcodeById = async (id: string) => {
  if (!id) return null
  try {
    const data = await getProduct(id)
    return data ? rowToRecord(data as ProductRow) : null
  } catch (error: any) {
    if (error?.message?.includes("404") || error?.message?.includes("not found")) return null
    throw new Error(normalizeApiError(error))
  }
}

export const saveBarcode = async (record: BarcodeRecord, originalBarcode?: string) => {
  const barcode = record.id.trim()
  if (!barcode) throw new Error("请输入条码编号")

  try {
    if (originalBarcode) {
      await updateProduct(originalBarcode, recordToProduct({...record, id: barcode}))
    } else {
      await saveProduct(recordToProduct({...record, id: barcode}))
    }

    await queryBarcodeList()
    await syncToLocalExcel()
  } catch (error: any) {
    throw new Error(normalizeApiError(error))
  }
}

export const deleteBarcode = async (id: string) => {
  try {
    await deleteProduct(id)
    await queryBarcodeList()
    await syncToLocalExcel()
  } catch (error: any) {
    throw new Error(normalizeApiError(error))
  }
}

export const generateBarcodeId = async () => {
  const date = new Date()
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
  const prefix = `BC${dateStr}`
  const records = await fetchAllBarcodes()
  const count = records.filter((record) => record.id.startsWith(prefix)).length
  return `${prefix}${String(count + 1).padStart(4, "0")}`
}

const SCAN_BASE_URL = import.meta.env.VITE_APP_SCAN_BASE_URL || window.location.origin

export const scanBaseUrl = ref(SCAN_BASE_URL)

export function getScanBaseUrl() {
  return SCAN_BASE_URL
}

export function decodeBarcodeData(encoded: string): BarcodeRecord | null {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4) base64 += "="
    const json = decodeURIComponent(escape(atob(base64)))
    const record = JSON.parse(json) as Partial<BarcodeRecord>
    return record?.id ? (record as BarcodeRecord) : null
  } catch {
    return null
  }
}

export function getBarcodeQrUrl(record: BarcodeRecord) {
  return `${getScanBaseUrl()}#/barcode/scan?id=${encodeURIComponent(record.id)}`
}

export const exportAllToExcel = async () => {
  const records = await fetchAllBarcodes()
  exportBarcodeExcel(records)
}

export const bindLocalExcelFile = async () => {
  if (!isFileSystemAccessSupported()) {
    await exportAllToExcel()
    return {success: false, message: "当前浏览器不支持直接写入本地文件，已改为下载 Excel"}
  }

  const handle = await pickLocalExcelFile(localExcelHandle)
  if (!handle) return {success: false, message: "已取消绑定"}

  localExcelHandle = handle
  boundExcelFileName.value = handle.name
  const records = await fetchAllBarcodes()
  await writeBarcodeExcelToHandle(handle, records)
  return {success: true, message: `已绑定本地文件：${handle.name}，后续保存将自动同步`}
}

export const unbindLocalExcelFile = () => {
  localExcelHandle = null
  boundExcelFileName.value = ""
}

export const importRecordsFromExcel = async (file: File) => {
  const records = await importBarcodeExcel(file)
  if (records.length === 0) {
    return {success: false, message: "Excel 中没有有效数据"}
  }

  for (const record of records) {
    const existing = await fetchBarcodeById(record.id)
    if (existing) {
      await updateProduct(record.id, recordToProduct(record))
    } else {
      await saveProduct(recordToProduct(record))
    }
  }

  await queryBarcodeList()
  await syncToLocalExcel()
  return {success: true, message: `已导入 ${records.length} 条记录到后端数据库`}
}

export const canBindLocalFile = isFileSystemAccessSupported()
export const isApiConfigured = isApiBaseUrlConfigured()
