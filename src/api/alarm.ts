import {request} from "@/utils/request"

export interface RootObject {
  devCode: string
  devID: string
  alarmTime: string
  alarmRemoveTime?: any
  alarmState: number
  typeDes: string
  grade: number
  des: string
}

export const GetDevAlarmPageList = (data: any) => {
  return request<{data: RootObject[]; total: number}>({
    url: "EnergyStorageDevAlarm/GetDevAlarmPageList",
    method: "post",
    data,
  })
}

export interface AlramObject {
  type: number
  des: string
}
// 告警类型
// GET EnergyStorageDevAlarm/GetAlarmTypeList
export function getAlarmTypeList() {
  return request<AlramObject>({
    url: "EnergyStorageDevAlarm/GetAlarmTypeList",
    method: "get",
  })
}
export interface RemoveDevAlarm {
  success: boolean
  code: number
  message: string
  data: any
}
// PUT EnergyStorageDevAlarm/RemoveDevAlarm?AlarmID={AlarmID}
// 手动解除告警， Code值说明：0解除成功；1解除失败；2无此操作权限
export function getRemoveDevAlarm(AlarmID: any) {
  return request<RemoveDevAlarm>({
    url: `EnergyStorageDevAlarm/RemoveDevAlarm?AlarmID=${AlarmID}`,
    method: "put",
  })
}
