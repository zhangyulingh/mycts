import {ref} from "vue"
import mockData from "@/views/device/mockData.json"

// 查询条件
export const queryCondition = ref({
  PageIndex: 1,
  PageSize: 10,
  InstallDate_Start: "",
  InstallDate_End: "",
  DevState: 0,
  ChargeAndDischargeState: 0,
  CustomerAddr_City: "",
  CustomerAddr_County: "",
  DevLocateAddr_Province: "",
  DevLocateAddr_City: "",
  DevLocateAddr_County: "",
  Keywords: "",
})

// 查询结果
export const queriedResult = ref({
  devCount: 0,
  totalCapacity: 0,
  totalCapacity_MWh: 0,
  devList: [] as any[],
})

// 查询设备列表
export const queryDeviceList = async (params: any = {}) => {
  Object.assign(queryCondition.value, params)
  // 使用JSON数据而不是API调用
  queriedResult.value = mockData.data
}

// 获取设备设备统一编码 - 使用JSON数据
export const queryGetDevH5QRCodeContent = async (devCode: string) => {
  // 从JSON数据中查找设备信息
  const device = mockData.data.devList.find((dev) => dev.devCode === devCode)
  return {
    success: true,
    data: device,
  }
}

// 删除设备 - 使用JSON数据
export const deleteDev = async (id: number) => {
  // 从JSON数据中移除设备
  const index = mockData.data.devList.findIndex((dev) => dev.id === id)
  if (index > -1) {
    mockData.data.devList.splice(index, 1)
    mockData.data.devCount = mockData.data.devList.length
  }
}
