import {request} from "@/utils/request"

export interface RootObject {
  id: number
  name: string
  contacts: string
  telephone: string
  province: string
  city: string
  county: string
  address: string
  incomeShareRatio: string
  totalIncome: string
  totalCustomerIncome: string
  state: number
  accountBalance: string
  invoiceName?: any
  invoiceDutyNum?: any
  invoiceAddress?: any
  invoiceTelephone?: any
  invoiceBank?: any
  invoiceAccount?: any
  addTime: string
}
// 获取客户分页列表
// POST CustomerManage/GetCustomerPageList
export function GetCustomerPageList(data: any) {
  return request<{data: RootObject[]; total: number}>({
    url: "CustomerManage/GetCustomerPageList",
    method: "post",
    data,
  })
}

// POST CustomerManage/AddCustomer
// 新增客户， Code值说明：0新增成功；1名称已存在；2新增失败；3无此操作权限
export const AddCustomer = (data: any) => {
  return request({
    url: "CustomerManage/AddCustomer",
    method: "post",
    data,
  })
}
// 删除客户
// DELETE CustomerManage/DeleteCustomer?ID={ID}
export const DeleteCustomer = (data: any) => {
  return request({
    url: `CustomerManage/DeleteCustomer?ID=${data.ID}`,
    method: "delete",
    data,
  })
}
// PUT CustomerManage/UpdateCustomer
// 更新客户， Code值说明：0更新成功；1名称已存在；2更新失败；3无此操作权限
export const UpdateCustomer = (data: any) => {
  return request({
    url: "CustomerManage/UpdateCustomer",
    method: "put",
    data,
  })
}
// 修改客户状态
// PUT CustomerManage/UpdateCustomerState?ID={ID}&State={State}
export const UpdateCustomerState = (data: any) => {
  return request({
    url: `CustomerManage/UpdateCustomerState?ID=${data.ID}&State=${data.State}`,
    method: "put",
    data,
  })
}

// PUT CustomerManage/UpdateShareRatio?ID={ID}&ShareRatio={ShareRatio}
// 修改客户的收益分成比例， Code值说明：0修改成功；1修改失败；2无此操作权限
export const UpdateShareRatio = (data: any) => {
  return request({
    url: `CustomerManage/UpdateShareRatio?ID=${data.ID}&ShareRatio=${data.ShareRatio}`,
    method: "put",
    data,
  })
}
// GET CustomerManage/GetCustomerInfo?ID={ID}
// 获取客户详细信息， Code值说明：0获取成功；1新增失败；2无此操作权限
export const GetCustomerInfo = (data: any) => {
  return request({
    url: `CustomerManage/GetCustomerInfo?ID=${data.ID}`,
    method: "get",
    data,
  })
}
// GET CustomerManage/GetAccountInfo?ID={ID}
// 获取客户的账号信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetAccountInfo = (data: any) => {
  return request({
    url: `CustomerManage/GetAccountInfo?ID=${data.ID}`,
    method: "get",
    data,
  })
}
// GET CustomerManage/GetBindDevList?ID={ID}
// 获取客户的绑定设备列表， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetBindDevList = (data: any) => {
  return request({
    url: `CustomerManage/GetBindDevList?ID=${data.ID}`,
    method: "get",
    data,
  })
}

// POST CustomerManage/AddAccount
// 创建账号， Code值说明：0创建成功；1已存在账号；2创建失败；3无此操作权限
export const AddAccount = (data: any) => {
  return request({
    url: "CustomerManage/AddAccount",
    method: "post",
    data,
  })
}
// PUT CustomerManage/UpdateAccount
// 更新账号， Code值说明：0更新成功；2更新失败；3无此操作权限
export const UpdateAccount = (data: any) => {
  return request({
    url: "CustomerManage/UpdateAccount",
    method: "put",
    data,
  })
}
// PUT CustomerManage/ResetAccountPwd?CustomerID={CustomerID}&AccountID={AccountID}&NewPwd={NewPwd}
// 重置客户账号密码， Code值说明：0重置成功；1重置失败；2无此操作权限
export const ResetAccountPwd = (data: any) => {
  return request({
    url: `CustomerManage/ResetAccountPwd?CustomerID=${data.CustomerID}&AccountID=${data.AccountID}&NewPwd=${data.NewPwd}`,
    method: "put",
    data,
  })
}
// PUT CustomerManage/UpdateAccountState?CustomerID={CustomerID}&AccountID={AccountID}&State={State}
// 修改客户账号状态， Code值说明：0修改成功；1修改失败；2无此操作权限
export const UpdateAccountState = (data: any) => {
  return request({
    url: `CustomerManage/UpdateAccountState?CustomerID=${data.CustomerID}&AccountID=${data.AccountID}&State=${data.State}`,
    method: "put",
    data,
  })
}
export interface BindDevTs {
  customerID: number
  devCode: string
  installer: string
  installDate: string
}
// PUT CustomerManage/BindDev
// 绑定设备， Code值说明：0绑定成功；1绑定失败；2无此操作权限；3设备已绑定到其它客户
export const BindDev = (data: BindDevTs) => {
  return request({
    url: "CustomerManage/BindDev",
    method: "put",
    data,
  })
}
// PUT CustomerManage/UnbindDev?ID={ID}&DevCode={DevCode}
// 解绑设备， Code值说明：0解绑成功；1解绑失败；2无此操作权限
export const UnbindDev = (data: any) => {
  return request({
    url: `CustomerManage/UnbindDev?ID=${data.ID}&DevCode=${data.DevCode}`,
    method: "put",
    data,
  })
}
// GET EnergyStorageDev/GetAllUnbindDevCode
// 获取所有未与客户进行绑定的设备编号， Code值说明：0获取成功；1获取失败；2无此操作权限
export const getAllUnbindDevCode = () => {
  return request<{data: string[]}>({
    url: `EnergyStorageDev/GetAllUnbindDevCode`,
    method: "get",
  })
}
// GET CustomerManage/GetAllCustomerName
// 获取所有客户名称
export const GetAllCustomerName = () => {
  return request<{data: string[]}>({
    url: `CustomerManage/GetAllCustomerName`,
    method: "get",
  })
}
