import {ref} from "vue"
import {Local} from "@/utils/storage"
import {getSupabase, isSupabaseConfigured} from "@/utils/supabase"
import {
  exportBarcodeExcel,
  importBarcodeExcel,
  isFileSystemAccessSupported,
  pickLocalExcelFile,
  writeBarcodeExcelToHandle,
} from "@/utils/barcodeExcel"

export interface BarcodeRecord {
  id: string
  productName: string
  productModel: string
  productSpec: string
  productCode: string
  batchNo: string
  productionDate: string
  operator: string
  remark: string
  createTime: string
}

const TABLE_NAME = "products"

interface ProductRow {
  id: string
  barcode: string
  product_name: string
  product_model: string | null
  specification: string | null
  batch_no: string | null
  production_date: string | null
  operator: string | null
  remark: string | null
  created_at: string
}

function parseProductModel(raw: string | null) {
  if (!raw) return {productModel: "", productCode: ""}
  const sep = " / "
  const idx = raw.indexOf(sep)
  if (idx === -1) return {productModel: raw, productCode: ""}
  return {productModel: raw.slice(0, idx), productCode: raw.slice(idx + sep.length)}
}

function formatProductModel(model: string, code: string) {
  if (model && code) return `${model} / ${code}`
  return model || code || ""
}

function formatCreatedAt(createdAt: string | null | undefined) {
  if (!createdAt) return ""
  return createdAt.replace("T", " ").slice(0, 19)
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

function rowToRecord(row: ProductRow): BarcodeRecord {
  const {productModel, productCode} = parseProductModel(row.product_model)
  return {
    id: row.barcode,
    productName: row.product_name || "",
    productModel,
    productSpec: row.specification || "",
    productCode,
    batchNo: row.batch_no || "",
    productionDate: row.production_date || "",
    operator: row.operator || "",
    remark: row.remark || "",
    createTime: formatCreatedAt(row.created_at),
  }
}

function recordToRow(record: BarcodeRecord): Omit<ProductRow, "id" | "created_at"> {
  return {
    barcode: record.id,
    product_name: record.productName,
    product_model: formatProductModel(record.productModel, record.productCode),
    specification: record.productSpec,
    batch_no: record.batchNo,
    production_date: record.productionDate,
    operator: record.operator,
    remark: record.remark,
  }
}

function assertSupabaseReady() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase 未配置，请在 .env.local 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_PUBLISHABLE_KEY")
  }
}

function throwIfError(error: {code?: string; message?: string; status?: number} | null) {
  if (!error) return
  if (error.code === "PGRST205") {
    throw new Error(`数据表 ${TABLE_NAME} 不存在，请检查 Supabase 表名与字段是否已创建`)
  }
  if (
    error.status === 401 ||
    error.code === "PGRST301" ||
    error.message?.includes("Invalid API key") ||
    error.message?.includes("JWT")
  ) {
    throw new Error(
      "Supabase 鉴权失败（401）：请确认 .env.local 中 VITE_SUPABASE_ANON_KEY 正确，重启 npm run dev 后硬刷新页面"
    )
  }
  if (error.code === "42501" || error.message?.includes("row-level security")) {
    throw new Error("无写入权限：请在 Supabase SQL Editor 执行 supabase/fix-rls.sql 开放 products 表读写策略")
  }
  throw new Error(error.message || "Supabase 请求失败")
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
  assertSupabaseReady()
  listLoading.value = true
  try {
    const {PageIndex, PageSize, Keywords} = queryCondition.value
    const from = (PageIndex - 1) * PageSize
    const to = from + PageSize - 1
    let query = getSupabase().from(TABLE_NAME).select("*", {count: "exact"})

    const keyword = Keywords.trim()
    if (keyword) {
      const pattern = `%${keyword}%`
      query = query.or(
        `product_name.ilike.${pattern},barcode.ilike.${pattern},batch_no.ilike.${pattern},product_model.ilike.${pattern},specification.ilike.${pattern},operator.ilike.${pattern},remark.ilike.${pattern}`
      )
    }

    const {data, count, error} = await query.order("created_at", {ascending: false}).range(from, to)
    if (error) throwIfError(error)

    queriedResult.value.total = count || 0
    queriedResult.value.list = (data as ProductRow[] | null)?.map(rowToRecord) || []
  } finally {
    listLoading.value = false
  }
}

export const fetchAllBarcodes = async () => {
  assertSupabaseReady()
  const {data, error} = await getSupabase()
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", {ascending: false})
    .limit(10000)
  if (error) throwIfError(error)
  return ((data as ProductRow[] | null) || []).map(rowToRecord)
}

export const fetchBarcodeById = async (id: string) => {
  if (!id) return null
  assertSupabaseReady()
  const {data, error} = await getSupabase().from(TABLE_NAME).select("*").eq("barcode", id).maybeSingle()
  if (error) throwIfError(error)
  return data ? rowToRecord(data as ProductRow) : null
}

export const saveBarcode = async (record: BarcodeRecord, originalBarcode?: string) => {
  assertSupabaseReady()
  const barcode = record.id.trim()
  if (!barcode) throw new Error("请输入条码编号")

  const row = recordToRow({...record, id: barcode})
  const supabase = getSupabase()

  if (originalBarcode && originalBarcode !== barcode) {
    const conflict = await fetchBarcodeById(barcode)
    if (conflict) throw new Error("条码编号已存在，请更换")

    const {error} = await supabase.from(TABLE_NAME).update(row).eq("barcode", originalBarcode)
    if (error) throwIfError(error)
  } else {
    const {error} = await supabase.from(TABLE_NAME).upsert(row, {onConflict: "barcode"})
    if (error) throwIfError(error)
  }

  await queryBarcodeList()
  await syncToLocalExcel()
}

export const deleteBarcode = async (id: string) => {
  assertSupabaseReady()
  const {error} = await getSupabase().from(TABLE_NAME).delete().eq("barcode", id)
  if (error) throwIfError(error)
  await queryBarcodeList()
  await syncToLocalExcel()
}

export const generateBarcodeId = async () => {
  assertSupabaseReady()
  const date = new Date()
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
  const prefix = `BC${dateStr}`
  const {count, error} = await getSupabase()
    .from(TABLE_NAME)
    .select("*", {count: "exact", head: true})
    .like("barcode", `${prefix}%`)
  if (error) throwIfError(error)
  const seq = String((count || 0) + 1).padStart(4, "0")
  return `${prefix}${seq}`
}

const SCAN_BASE_KEY = "barcodeScanBaseUrl"

export const scanBaseUrl = ref(getScanBaseUrl())

export function getScanBaseUrl() {
  try {
    const raw = window.localStorage.getItem(Local.setKey(SCAN_BASE_KEY))
    if (raw) {
      const url = JSON.parse(raw)
      if (typeof url === "string" && url.trim()) return url.trim().replace(/\/$/, "")
    }
  } catch {
    // ignore
  }
  const envUrl = import.meta.env.VITE_APP_SCAN_BASE_URL as string | undefined
  if (envUrl?.trim()) return envUrl.trim().replace(/\/$/, "")
  const path = window.location.pathname.replace(/\/$/, "")
  return `${window.location.origin}${path}`
}

export function setScanBaseUrl(url: string) {
  const value = url.trim().replace(/\/$/, "")
  Local.set(SCAN_BASE_KEY, value)
  scanBaseUrl.value = value
}

/** 兼容旧版二维码（链接内编码 data） */
export function decodeBarcodeData(encoded: string): BarcodeRecord | null {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4) base64 += "="
    const json = decodeURIComponent(escape(atob(base64)))
    const record = JSON.parse(json) as BarcodeRecord
    return record?.id ? record : null
  } catch {
    return null
  }
}

/** 二维码短链接：扫码后从 Supabase 按 id 查询 */
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

  assertSupabaseReady()
  const {error} = await getSupabase().from(TABLE_NAME).upsert(records.map(recordToRow), {onConflict: "barcode"})
  if (error) throwIfError(error)

  await queryBarcodeList()
  await syncToLocalExcel()
  return {success: true, message: `已导入 ${records.length} 条记录到 Supabase`}
}

export const canBindLocalFile = isFileSystemAccessSupported()
export {isSupabaseConfigured}
