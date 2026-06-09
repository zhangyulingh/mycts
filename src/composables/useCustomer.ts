import {
  GetCustomerPageList,
  DeleteCustomer,
  GetCustomerInfo,
  UpdateCustomerState,
  UpdateAccountState,
  UpdateShareRatio,
  GetAccountInfo,
  GetBindDevList,
  ResetAccountPwd,
  UnbindDev,
} from "@/api/customer"
import type { RootObject } from "@/api/customer"
import { ref } from "vue"
// 查询客户条件
export const queryCondition = ref({
  PageIndex: 1,
  PageSize: 10,
  State: 0,
  Province: "",
  City: "",
  County: "",
  Keywords: "",
})
// 查询客户结果
export const queryResult = ref<{ data: RootObject[]; total: number }>({
  data: [],
  total: 0,
})
// 查询客户列表
export const queryCustomerList = async () => {
  // const res = await GetCustomerPageList(queryCondition.value)
  // console.log(JSON.stringify(res))
  queryResult.value = {
    "total": 6, "data": [
      { "id": 1, "name": "客户1", "contacts": "刘华", "telephone": "19012345678", "province": "江苏省", "city": "常州市", "county": "武进区", "address": "地址1", "incomeShareRatio": "10.00", "totalIncome": "12476.3983", "totalCustomerIncome": "1489.4242", "totalDeduct": null, "totalRecharge": null, "state": 1, "accountBalance": "-694.5971", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-01 20:29:53" }, { "id": 2, "name": "客户2", "contacts": "赵力", "telephone": "18012345678", "province": "江苏省", "city": "常州市", "county": "武进区", "address": "地址2", "incomeShareRatio": "30.00", "totalIncome": "1350.0261", "totalCustomerIncome": "818.3767", "totalDeduct": null, "totalRecharge": null, "state": 1, "accountBalance": "8175.2919", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-06 14:58:55" }, { "id": 3, "name": "客户3", "contacts": "曾书亭", "telephone": "16012345678", "province": "江苏省", "city": "无锡市", "county": "新吴区", "address": "地址3", "incomeShareRatio": "20.00", "totalIncome": "-251.6204", "totalCustomerIncome": "0.0000", "totalDeduct": null, "totalRecharge": null, "state": 1, "accountBalance": "130002.0000", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-06 15:05:14" }, { "id": 27, "name": "客户4", "contacts": "陈灵", "telephone": "15106118840", "province": "江苏省", "city": "常州市", "county": "武进区", "address": "地址4", "incomeShareRatio": "20.00", "totalIncome": "0", "totalCustomerIncome": "0", "totalDeduct": null, "totalRecharge": null, "state": 1, "accountBalance": "121306.0000", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-25 10:20:28" }, { "id": 36, "name": "客户5", "contacts": "陈美丽", "telephone": "15106118888", "province": "江苏省", "city": "常州市", "county": "武进区", "address": "地址5", "incomeShareRatio": "30.00", "totalIncome": "0", "totalCustomerIncome": "0", "totalDeduct": null, "totalRecharge": null, "state": 1, "accountBalance": "0.0000", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-27 15:48:47" }, { "id": 37, "name": "客户6", "contacts": "李果", "telephone": "18360716757", "province": "江苏省", "city": "徐州市", "county": "泉山区", "address": "地址6", "incomeShareRatio": "3.00", "totalIncome": "0", "totalCustomerIncome": "0", "totalDeduct": null, "totalRecharge": null, "state": 2, "accountBalance": "264.0000", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-29 15:51:32" }]
  }
}
// 删除客户
export const deleteCustomer = async (id: number) => {
  await DeleteCustomer({ ID: id })
  queryCustomerList()
}

// 修改客户状态
export const updateCustomerState = async (id: number, state: boolean) => {
  await UpdateCustomerState({ ID: id, State: state })
}
// 修改客户账号状态
export const updateAccountState = async (CustomerID: number, accountID: number, state: boolean) => {
  await UpdateAccountState({
    CustomerID: CustomerID,
    AccountID: accountID,
    State: state,
  })
}

// 根据id调整客户分成比例
export const updateShareRatio = async (id: number, shareRatio: number) => {
  await UpdateShareRatio({ ID: id, ShareRatio: shareRatio })
}
// 获取客户详情
export const getCustomerInfo = async (id: number) => {
  return await { "id": 1, "name": "客户1", "contacts": "刘总", "telephone": "19012345678", "province": "江苏省", "city": "常州市", "county": "武进区", "address": "地址1", "incomeShareRatio": "10.00", "totalIncome": "12476.3983", "totalCustomerIncome": "1489.4242", "totalDeduct": null, "totalRecharge": null, "state": 1, "accountBalance": "-694.5971", "invoiceName": null, "invoiceDutyNum": null, "invoiceAddress": null, "invoiceTelephone": null, "invoiceBank": null, "invoiceAccount": null, "addTime": "2023-03-01 20:29:53" }
}
// 根据id获取客户账号信息
export const getAccountInfo = async (id: number) => {
  return await { "accountID": 1, "userName": "sample string 60443", "trueName": "sampl12 55", "state": true }
}
// 获取客户的绑定设备列表
export const getBindDevList = async (id: number) => {
  return await { "total": 1, "data": [{ "devCode": "1701240102", "devID": "P100M0215K2401180002", "installDate": "2023-03-20", "installer": "王五", "devLocation": null }] }
}
// 重置客户账号密码
export const resetAccountPwd = async (customerID: number, accountID: number, newPwd: string) => {
  await ResetAccountPwd({ CustomerID: customerID, AccountID: accountID, NewPwd: newPwd })
}
// 解绑设备
export const unbindDev = async (id: number, devCode: number) => {
  await UnbindDev({ ID: id, DevCode: devCode })
}
