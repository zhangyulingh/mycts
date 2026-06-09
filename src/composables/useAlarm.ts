import { GetDevAlarmPageList, getAlarmTypeList } from "@/api/alarm"
import { RootObject } from "@/api/alarm"
import { ref } from "vue"
// 告警查询条件
export const queryCondition = ref({
  PageIndex: 1,
  PageSize: 10,
  AlarmType: undefined,
  AlarmGrade: undefined,
  AlarmState: 1,
  AlarmDate_Start: "",
  AlarmDate_End: "",
  DevLocateAddr_Province: "",
  DevLocateAddr_City: "",
  DevLocateAddr_County: "",
  Keywords: "",
})
// 查询结果
export const queryResult = ref<{ data: RootObject[]; total: number }>({
  data: [],
  total: 0,
})
// 查询告警方法
export const queryGetAlarmList = async () => {
  const res = { "total": 10, "data": [{ "alarmID": 3484, "devCode": "1701240105", "devID": "P100M0215K2401180000", "alarmTime": "2023-03-26 11:08:04", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "设备离线", "grade": 1, "des": "设备离线", "canAutoRemove": true, "removeWay": 0 }, { "alarmID": 3479, "devCode": "1701240105", "devID": "P100M0215K2401180000", "alarmTime": "2023-03-26 10:53:33", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "EMS故障", "grade": 2, "des": "功率电表1通讯中断", "canAutoRemove": true, "removeWay": 0 }, { "alarmID": 3478, "devCode": "1701240105", "devID": "P100M0215K2401180000", "alarmTime": "2023-03-26 10:53:13", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "UC告警", "grade": 3, "des": "空调通讯中断", "canAutoRemove": true, "removeWay": 0 }, { "alarmID": 11001, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-22 01:00:57", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230321的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }, { "alarmID": 11000, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-21 01:00:36", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230320的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }, { "alarmID": 10999, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-20 01:00:14", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230319的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }, { "alarmID": 10997, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-19 01:00:53", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230318的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }, { "alarmID": 10996, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-18 01:00:32", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230317的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }, { "alarmID": 10995, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-17 01:00:10", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230316的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }, { "alarmID": 10994, "devCode": "1701240101", "devID": "P100M0215K2401180001", "alarmTime": "2023-03-16 01:00:50", "alarmRemoveTime": null, "alarmState": 1, "typeDes": "收益异常报警", "grade": 1, "des": "对20230315的收益分成扣费执行失败(日收益数据还未生成)", "canAutoRemove": false, "removeWay": 0 }] }
  // console.log(JSON.stringify(res))
  queryResult.value = res
}

// 告警类型列表
export const allAlarmTypeList = ref()
export const getAllAlarmTypeList = async () => {
  // const res = await getAlarmTypeList()
  // console.log(JSON.stringify(res))
  allAlarmTypeList.value = [{ "type": 5, "des": "设备离线" }, { "type": 10001, "des": "EMS故障" }, { "type": 10002, "des": "UC故障" }, { "type": 10003, "des": "PCS故障" }, { "type": 10004, "des": "BMS故障" }, { "type": 1, "des": "EMS告警" }, { "type": 2, "des": "UC告警" }, { "type": 3, "des": "PCS告警" }, { "type": 4, "des": "BMS告警" }, { "type": 6, "des": "空调告警" }, { "type": 7, "des": "数据上传超时" }, { "type": 8, "des": "定位报警" }, { "type": 9, "des": "收益异常报警" }]
}
