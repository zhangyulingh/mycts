import {request} from "@/utils/request"

export interface Supplier {
  supplierID: number
  name: string
  contacts: string
  telephone: string
  address: string
  devModelList: DevModelList[]
}
export interface DevModelList {
  devModelID: number
  name: string
  commMode: string
  ratedCapacity: number
  ratePower: number
  devImageAddress: string
}
// GET SupplierManage/GetSupplierPageList?PageIndex={PageIndex}&PageSize={PageSize}&Keywords={Keywords}
// 获取供应商分页列表
export function GetAllSupplier(data: any) {
  return request<{data: Supplier[]; total: number}>({
    url: `SupplierManage/GetSupplierPageList?PageIndex=${data.PageIndex}&PageSize=${data.PageSize}&Keywords=${data.Keywords}`,
    method: "get",
    data,
  })
}
// GET SupplierManage/GetSupplierInfo?ID={ID}
// 获取供应商详细信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export function GetSupplierInfo(data: any) {
  return request<Supplier>({
    url: `SupplierManage/GetSupplierInfo?ID=${data.ID}`,
    method: "get",
    data,
  })
}
// DELETE SupplierManage/DeleteSupplier?ID={ID}
// 删除供应商， Code值说明：0删除成功；1删除失败；2无此操作权限；3不能删除已供应设备的供应商
export function DeleteSupplier(data: any) {
  return request({
    url: `SupplierManage/DeleteSupplier?ID=${data.ID}`,
    method: "delete",
    data,
  })
}
// POST SupplierManage/AddSupplier
// 新增供应商，0新增成功；1供应商名称已存在；2设备型号已存在；3不能存在相同的设备型号；4新增失败；5无此操作权限
export function AddSupplier(data: any) {
  return request({
    url: `SupplierManage/AddSupplier`,
    method: "post",
    data,
  })
}
// PUT SupplierManage/UpdateSupplier
// 更新供应商， Code值说明：0更新成功；1供应商名称已存在；2设备型号已存在；3不能存在相同的设备型号；4不能删除已被使用的设备型号；5待更新的设备型号不存在；6更新失败；7无此操作权限
export function UpdateSupplier(data: any) {
  return request({
    url: `SupplierManage/UpdateSupplier`,
    method: "put",
    data,
  })
}
// GET SystemSet/GetOSSPara
// 获取OSS调用参数
export function GetOSSPara() {
  return request({
    url: `SystemSet/GetOSSPara`,
    method: "get",
  })
}
// GET SupplierManage/GetAllCOMMModeName
// 获取所有设备通信方式名称
export function GetAllCOMMModeName() {
  return request({
    url: `SupplierManage/GetAllCOMMModeName`,
    method: "get",
  })
}

// GET SupplierManage/GetAllSupplierName
// 获取所有供应商名称
export function GetAllSupplierName() {
  return request({
    url: `SupplierManage/GetAllSupplierName`,
    method: "get",
  })
}
// GET SupplierManage/GetAllDevModel?SupplierID={SupplierID}
// 获取某一供应商的所有设备型号名称
export function GetAllDevModel(data: any) {
  return request({
    url: `SupplierManage/GetAllDevModel?SupplierID=${data}`,
    method: "get",
  })
}
