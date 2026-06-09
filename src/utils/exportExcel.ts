import * as XLSX from "xlsx"

export default (data: any[], sheetName: string = "sheet1", fileName: string = "信息.xlsx") => {
  const contentSheet = XLSX.utils.json_to_sheet(data)

  const workBook = {
    SheetNames: [sheetName], // 指定有序 sheet 的 name
    Sheets: {
      [sheetName]: contentSheet, // 表格数据内容
    },
  }

  return XLSX.writeFile(workBook, fileName) // 向文件系统写出文件
}
