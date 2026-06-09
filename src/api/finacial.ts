import {request} from "@/utils/request"

export interface RootObject {
  rowCount: number
  totalIncome: string
  incomeReportList: IncomeReportList[]
}

export interface IncomeReportList {
  devCode: string
  devID: string
  modelName: string
  customerName: string
  statTime: string
  chargeEnergy: string
  dischargeEnergy: string
  normalChargeEnergy: string
  lowChargeEnergy: string
  peakDischargeEnergy: string
  highDischargeEnergy: string
  income: string
  charge: string
  remark: string
}
// 获取收益报表分页列表
// POST FinanceManage/GetIncomeReportPageList
export function GetIncomeReportPageList(data: any) {
  return request<{rowCount: 0; totalIncome: ""; incomeReportList: []}>({
    url: "FinanceManage/GetIncomeReportPageList",
    method: "post",
    data: data,
  })
}
export interface BillRootObject {
  code: string
  time: string
  customerName: string
  income: string
  incomeShareRatio: string
  customerIncome: string
  amount: string
}
// 获取账单信息分页列表
// POST FinanceManage/GetBillPageList
export function GetBillPageList(data: any) {
  return request<{rowCount: 0; billInfoList: []; totalAmount: ""; totalCustomerIncome: ""; totalIncome: ""}>({
    url: "FinanceManage/GetBillPageList",
    method: "post",
    data: data,
  })
}
// POST FinanceManage/GetRechargePageList
// 获取充值记录分页列表
export function GetRechargePageList(data: any) {
  return request<{rowCount: 0; totalRechargeAmount: 0; rechargeList: []}>({
    url: "FinanceManage/GetRechargePageList",
    method: "post",
    data: data,
  })
}
// POST FinanceManage/GetChargeAndRefundPageList
// 获取扣退费记录分页列表
export function GetChargeAndRefundPageList(data: any) {
  return request<{rowCount: 0; totalAmount: 0; totalRefundAmount: 0; dataList: []}>({
    url: "FinanceManage/GetChargeAndRefundPageList",
    method: "post",
    data: data,
  })
}
// POST FinanceManage/RechargeOper
// 充值操作，0充值成功；1充值失败；2无此操作权限
export function RechargeOper(data: any) {
  return request<any>({
    url: "FinanceManage/RechargeOper",
    method: "post",
    data: data,
  })
}
// POST FinanceManage/ChargeAndRefundOper
// 扣退费操作，0操作成功；1扣退费金额不能高于客户余额；2操作失败；3无此操作权限
export function ChargeAndRefundOper(data: any) {
  return request({
    url: "FinanceManage/ChargeAndRefundOper",
    method: "post",
    data: data,
  })
}
// GET FinanceManage/GetRechargeTemplateAddr
// 获取批量导入充值记录的模板文件下载地址
export function GetRechargeTemplateAddr() {
  return request({
    url: "FinanceManage/GetRechargeTemplateAddr",
    method: "get",
  })
}
// POST FinanceManage/BatchImportRecharge
// 批量导入充值记录，0导入成功；1文件数据格式不正确；2导入失败；3无此操作权限
export function BatchImportRecharge(data: any) {
  return request({
    url: "FinanceManage/BatchImportRecharge",
    method: "post",
    data: data,
  })
}
// GET FinanceManage/GetBillDetail?ID={ID}
// 获取账单详细信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export function GetBillDetail(data: any) {
  return request({
    url: `FinanceManage/GetBillDetail?ID=${data.ID}`,
    method: "get",
    data,
  })
}
// POST FinanceManage/ExportBill
// 导出账单数据，返回导出文件下载路径，Code值说明：0导出成功；1无数据；2超出最大导出行数；3导出失败；4无此操作权限
export function ExportBill(data: any) {
  return request({
    url: "FinanceManage/ExportBill",
    method: "post",
    data: data,
  })
}
// POST FinanceManage/ExportIncomeReport
// 导出收益报表，返回导出文件下载路径，Code值说明：0导出成功；1无数据；2超出最大导出行数；3导出失败；4无此操作权限
export function ExportIncomeReport(data: any) {
  return request({
    url: "FinanceManage/ExportIncomeReport",
    method: "post",
    data: data,
  })
}
// PUT FinanceManage/UploadRechargeVoucher
// 上传充值凭证，Code值说明：0上传成功；1不能重复上传凭证；2上传失败；3无此操作权限
export function UploadRechargeVoucher(data: any) {
  return request({
    url: "FinanceManage/UploadRechargeVoucher",
    method: "put",
    data: data,
  })
}
