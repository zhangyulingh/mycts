import * as XLSX from "xlsx"
import type {BarcodeRecord} from "@/composables/useBarcode"

const DEFAULT_PRODUCT_NAME = "F系列齿轮搅拌机"

const EXCEL_FILE_NAME = "条码产品记录.xlsx"
const SHEET_NAME = "产品记录"

const HEADER_MAP: Record<keyof BarcodeRecord, string> = {
  id: "条码编号",
  productName: "产品名称",
  model: "型号",
  power: "功率",
  specification: "规格",
  speedControl: "调速方式",
  speedType: "转速方式",
  color: "颜色",
  weight: "重量",
  packaging: "包装",
}

const REVERSE_HEADER_MAP = Object.fromEntries(Object.entries(HEADER_MAP).map(([k, v]) => [v, k])) as Record<string, keyof BarcodeRecord>

function recordToExcelRow(record: BarcodeRecord) {
  return Object.fromEntries(Object.entries(HEADER_MAP).map(([key, label]) => [label, record[key as keyof BarcodeRecord] ?? ""]))
}

function excelRowToRecord(row: Record<string, unknown>): BarcodeRecord | null {
  const record = {} as BarcodeRecord
  for (const [label, key] of Object.entries(REVERSE_HEADER_MAP)) {
    if (row[label] !== undefined && row[label] !== "") {
      record[key] = String(row[label])
    } else if (row[key] !== undefined && row[key] !== "") {
      record[key] = String(row[key])
    }
  }
  if (!record.id) return null
  return {
    id: record.id,
    productName: record.productName || DEFAULT_PRODUCT_NAME,
    model: record.model || "",
    power: record.power || "",
    specification: record.specification || "",
    speedControl: record.speedControl || "",
    speedType: record.speedType || "",
    color: record.color || "",
    weight: record.weight || "",
    packaging: record.packaging || "",
  }
}

function buildWorkbook(records: BarcodeRecord[]) {
  const rows = records.map(recordToExcelRow)
  const sheet = XLSX.utils.json_to_sheet(rows)
  sheet["!cols"] = [
    {wch: 18},
    {wch: 18},
    {wch: 14},
    {wch: 14},
    {wch: 24},
    {wch: 14},
    {wch: 14},
    {wch: 12},
    {wch: 12},
    {wch: 12},
  ]
  return {
    SheetNames: [SHEET_NAME],
    Sheets: {
      [SHEET_NAME]: sheet,
    },
  }
}

function workbookToArrayBuffer(workbook: XLSX.WorkBook) {
  return XLSX.write(workbook, {bookType: "xlsx", type: "array"}) as ArrayBuffer
}

export function exportBarcodeExcel(records: BarcodeRecord[], fileName: string = EXCEL_FILE_NAME) {
  const workbook = buildWorkbook(records)
  XLSX.writeFile(workbook, fileName)
}

export async function writeBarcodeExcelToHandle(handle: FileSystemFileHandle, records: BarcodeRecord[]) {
  const workbook = buildWorkbook(records)
  const buffer = workbookToArrayBuffer(workbook)
  const writable = await handle.createWritable()
  await writable.write(new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
  await writable.close()
}

export function isFileSystemAccessSupported() {
  return typeof window !== "undefined" && "showSaveFilePicker" in window
}

export async function pickLocalExcelFile(existingHandle?: FileSystemFileHandle | null) {
  if (!isFileSystemAccessSupported()) return null

  if (existingHandle) {
    return existingHandle
  }

  return window.showSaveFilePicker({
    suggestedName: EXCEL_FILE_NAME,
    types: [
      {
        description: "Excel 文件",
        accept: {"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]},
      },
    ],
  })
}

export async function importBarcodeExcel(file: File): Promise<BarcodeRecord[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, {type: "array"})
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return []

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {defval: ""})
  return rows.map(excelRowToRecord).filter((item): item is BarcodeRecord => !!item)
}

export {EXCEL_FILE_NAME}
