import {request} from "@/utils/request"

export interface RootObject {
  id: number
  name: string
  des: string
  strEffectTime: string
  year: number
  month: string
  peakPeriodPrice: string
  highPeriodPrice: string
  normalPeriodPrice: string
  lowPeriodPrice: string
  peakPeriod: string
  highPeriod: string
  normalPeriod: string
  lowPeriod: string
  isDisable: boolean
  isApply: boolean
}
// 获取客户分页列表
// GET ElectricPriceConfig/GetElectricPriceTemplatePageList?PageIndex={PageIndex}&PageSize={PageSize}&Name={Name}
export function GetElectricPriceTemplatePageList(data: any) {
  return request<{data: RootObject[]; total: number}>({
    url: `ElectricPriceConfig/GetElectricPriceTemplatePageList?PageIndex=${data.PageIndex}&PageSize=${data.PageSize}&Name=${data.Name}`,
    method: "get",
    data,
  })
}
// GET ElectricPriceConfig/GetElectricPriceTemplateDetail?ID={ID}
export const GetElectricPriceTemplateDetail = (data: any) => {
  return request<RootObject>({
    url: `ElectricPriceConfig/GetElectricPriceTemplateDetail?ID=${data.ID}`,
    method: "get",
    data,
  })
}
// POST ElectricPriceConfig/AddElectricPriceTemplate
export const AddElectricPriceTemplate = (data: any) => {
  return request<boolean>({
    url: "ElectricPriceConfig/AddElectricPriceTemplate",
    method: "post",
    data,
  })
}

// DELETE ElectricPriceConfig/DeleteElectricPriceTemplate?ID={ID}
export const DeleteElectricPriceTemplate = (data: any) => {
  return request({
    url: `ElectricPriceConfig/DeleteElectricPriceTemplate?ID=${data.ID}`,
    method: "delete",
    data,
  })
}
// PUT ElectricPriceConfig/UpdateElectricPriceTemplate
export const UpdateElectricPriceTemplate = (data: any) => {
  return request({
    url: "ElectricPriceConfig/UpdateElectricPriceTemplate",
    method: "put",
    data,
  })
}
// PUT ElectricPriceConfig/UpdateElectricPriceTemplateState?ID={ID}&IsDisable={IsDisable}
export const UpdateElectricPriceTemplateState = (data: any) => {
  return request({
    url: `ElectricPriceConfig/UpdateElectricPriceTemplateState?ID=${data.ID}&IsDisable=${data.IsDisable}`,
    method: "put",
    data,
  })
}
