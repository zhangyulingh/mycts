import {request} from "@/utils/request"

export interface RootObject {
  devCount: number
  totalCapacity: number
  totalCapacity_MWh: number
  devList: DevList[]
}

export interface DevList {
  devCode: string
  devID: string
  customerName: string
  installDate: string
  devState: string
  chargeAndDischargeState: string
  totalChargeEnergy: number
  totalChargeEnergy_MWh: number
  totalDischargeEnergy: number
  totalDischargeEnergy_MWh: number
  totalCycle: number
}

export type QueryCondition = Partial<{
  PageIndex: number
  PageSize: number
  InstallDate_Start: String
  InstallDate_End: String
  DevState: number
  ChargeAndDischargeState: number
  CustomerAddr_Province: String
  CustomerAddr_City: String
  CustomerAddr_County: String
  DevLocateAddr_Province: String
  DevLocateAddr_City: String
  DevLocateAddr_County: String
  Keywords: String
}>
export const getDeviceList = (data: QueryCondition) => {
  return request<RootObject>({
    url: "/EnergyStorageDev/GetDevPageList",
    method: "post",
    data: data,
  })
}
export interface GetDevH5QRCodeResponse {
  success: boolean
  code: number
  message: string
  data: any
}

// 获取设备设备统一编码
export const getDevH5QRCodeContent = (devCode: string) => {
  return request<GetDevH5QRCodeResponse>({
    url: `EnergyStorageDev/GetDevH5QRCodeContent?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
export interface devInfoMenuItems {
  id: number
  devCode: string
  factoryNo: string
  devID: string
  modelName: string
  ratedCapacity: number
  ratedPower: number
  devState: string
  supplierName: string
  firstUseDate: string
  customerName: string
}
// GET EnergyStorageDev/GetDevInfo?DevCode={DevCode}
// 获取储能设备详细信息
export const getDevInfo = (devCode: string) => {
  return request<devInfoMenuItems>({
    url: `EnergyStorageDev/GetDevInfo?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
// 获取设备最新状态信息
// GET EnergyStorageDev/GetDevLatestState?DevCode={DevCode}
export interface devLatestState {
  devCode: string
  devTime: string
  todayChargeEnergy: string
  todayDischargeEnergy: string
  totalCycle: string
  totalChargeEnergy: string
  totalChargeEnergy_MWh: string
  totalDischargeEnergy: string
  totalDischargeEnergy_MWh: string
  soh: string
  chargeAndDischargeState: string
  currentPower: string
  soc: string
}
export const getDevLatestState = (devCode: string) => {
  return request<devLatestState>({
    url: `EnergyStorageDev/GetDevLatestState?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
// 获取储能设备计量电表数据
// GET EnergyStorageDev/GetDevMeterData?DevCode={DevCode}

export interface devMeterData {
  devCode: string
  devTime: string
  todayChargeEnergy: string
  todayDischargeEnergy: string
  todayIncome: string
  totalChargeEnergy: string
  totalChargeEnergy_MWh: string
  totalDischargeEnergy: string
  totalDischargeEnergy_MWh: string
  totalIncome: string
  currentVoltage: string
  currentCurrent: string
  currentPower: string
}
export const getDevMeterData = (devCode: string) => {
  return request<devMeterData>({
    url: `EnergyStorageDev/GetDevMeterData?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}

// 获取某一台储能设备所有未解除告警
// GET EnergyStorageDevAlarm/GetOneDevAlarmList?DevCode={DevCode}
export type devAlarmList = {
  DevCode: string
  DevlD: string
  AlarmTime: string
  AlarmRemoveTime: string
  AlarmState: number
  TypeDes: string
  Grade: number
  Des: string
}

export const getOneDevAlarmList = (devCode: string) => {
  return request<{data: devAlarmList[]; total: 0}>({
    url: `EnergyStorageDevAlarm/GetOneDevAlarmList?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
export interface CFDPolicy {
  devTime: string
  cdPolicy: CdPolicy[]
  fdPolicy: CdPolicy[]
}
export interface CdPolicy {
  periodType: number
  period: string
  power: string
}
// 获取储能设备充放电策略
// GET EnergyStorageDev/GetDevCFDPolicy?DevCode={DevCode}
export const getDevCFDPolicy = (devCode: string) => {
  return request<CFDPolicy>({
    url: `EnergyStorageDev/GetDevCFDPolicy?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
// GET EnergyStorageDev/GetNextSetCFDPolicyExecTime?DevCode={DevCode}
export const getNextSetCFDPolicyExecTime = (devCode: string) => {
  return request<{data: string}>({
    url: `EnergyStorageDev/GetNextSetCFDPolicyExecTime?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
export interface lastRootObject {
  cdPolicy: CdPolicy[]
  fdPolicy: CdPolicy[]
  isExecSoon: boolean
  setExecTime: string
  templateID: number
}

// GET EnergyStorageDev/GetDevLastSetCFDPolicy?DevCode={DevCode}
// 获取最新一次设置的储能设备充放电策略， Code值说明：0获取成功；1获取失败；2无此操作权限
export const getDevLastSetCFDPolicy = (devCode: string) => {
  return request<lastRootObject>({
    url: `EnergyStorageDev/GetDevLastSetCFDPolicy?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
export interface devCfdPolicy {
  devCode: string
  templateID: number
  cdPolicy: CdPolicy[]
  fdPolicy: CdPolicy[]
  isExecSoon: boolean
  setExecTime: string
}
// POST EnergyStorageDev/SetDevCFDPolicy
export const setDevCFDPolicy = (data = {} as devCfdPolicy) => {
  return request({
    url: `EnergyStorageDev/SetDevCFDPolicy`,
    method: "post",
    data,
  })
}
// POST EnergyStorageDev/AddDev
// 新增储能设备， Code值说明：0新增成功；1设备编号已存在；2出厂编号已存在；3产品序列号已存在；4产品序列号格式不正确；5供应商编码错误；6新增失败；7无此操作权限
export const addDev = (data: any) => {
  return request({
    url: `EnergyStorageDev/AddDev`,
    method: "post",
    data,
  })
}
// DELETE EnergyStorageDev/DeleteDev?ID={ID}
// 移除储能设备， Code值说明：0移除成功；1移除失败；2无此操作权限；3不能移除已绑定客户的设备
export const DeleteDev = (data: any) => {
  return request({
    url: `EnergyStorageDev/DeleteDev?ID=${data.ID}`,
    method: "delete",
    data,
  })
}

// PUT EnergyStorageDev/UpdateDev
// 更新储能设备， Code值说明：0更新成功；1设备编号已存在；2出厂编号已存在；3产品序列号已存在；4产品序列号格式不正确；5供应商编码错误；6更新失败；7无此操作权限
export const updateDev = (data: any) => {
  return request({
    url: `EnergyStorageDev/UpdateDev`,
    method: "put",
    data,
  })
}
// GET EnergyStorageDev/GetElectricPriceApplyList?DevCode={DevCode}
// 获取储能设备电价模板应用记录
export const getElectricPriceApplyList = (devCode: string) => {
  return request({
    url: `EnergyStorageDev/GetElectricPriceApplyList?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
// GET EnergyStorageDev/GetLocatDevInfo?DevCode={DevCode}
// 获取储能设备绑定的定位设备详细信息
export const getLocatDevInfo = (devCode: string) => {
  return request({
    url: `EnergyStorageDev/GetLocatDevInfo?DevCode=${devCode}`,
    method: "get",
    params: {
      devCode,
    },
  })
}
// PUT EnergyStorageDev/UnbindLocatDev?DevCode={DevCode}
// 储能设备解除绑定定位设备， Code值说明：0解绑成功；1解绑失败；2无此操作权限；3未绑定过定位设备
export const unbindLocatDev = (devCode: string) => {
  return request({
    url: `EnergyStorageDev/UnbindLocatDev?DevCode=${devCode}`,
    method: "put",
    params: {
      devCode,
    },
  })
}
// PUT EnergyStorageDev/BindLocatDev
// 储能设备绑定定位设备， Code值说明：0绑定成功；1绑定失败；2无此操作权限；3已绑定过定位设备；
// 4不能绑定已被绑定的定位设备；5不能绑定未安装的定位设备；6定位设备服务器异常
export const bindLocatDev = (data: any) => {
  return request({
    url: `EnergyStorageDev/BindLocatDev`,
    method: "put",
    data,
  })
}
