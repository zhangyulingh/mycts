import {GetIncomeReportPageList, GetBillPageList, GetRechargePageList, GetChargeAndRefundPageList, GetBillDetail} from "@/api/finacial"
import {stringify} from "crypto-js/enc-utf8"
import {ref} from "vue"
// 查询收益条件---------------------------------------------------------------
export const queryIncomeCondition = ref({
  pageIndex: 1,
  pageSize: 10,
  timeType: 1,
  year: "",
  month: "",
  date: "",
  customerAddr_Province: "",
  customerAddr_City: "",
  customerAddr_County: "",
  devLocateAddr_Province: "",
  devLocateAddr_City: "",
  devLocateAddr_County: "",
  keywords: "",
})
// 查询收益结果
export const queryIncomeResult = ref({
  rowCount: 0,
  totalIncome: "",
  incomeReportList: [],
})
// 查询收益报表分页列表
export const queryIncomePageList = async () => {
  // const res = await GetIncomeReportPageList(queryIncomeCondition.value)
  // console.log(JSON.stringify(res))
  queryIncomeResult.value = {
    rowCount: 5,
    totalIncome: "14211.8172",
    incomeReportList: [
      {
        devCode: "1701240101",
        devID: "P100M0215K2401180001",
        modelName: "EnerArk-NBN-P100M0-215K",
        customerName: "客户名称1",
        statTime: "2023-02-25",
        chargeEnergy: "1.00",
        dischargeEnergy: "20.00",
        normalChargeEnergy: "0.00",
        lowChargeEnergy: "1.00",
        peakDischargeEnergy: "0.00",
        highDischargeEnergy: "5.00",
        income: "0.0000",
        charge: "0.0000",
        remark: "本期设备使用未满足完整充放循环，费用将计入下一周期抵扣后结算",
      },
      {
        devCode: "1701240102",
        devID: "P100M0215K2401180002",
        modelName: "EnerArk-NBN-P100M0-215K",
        customerName: "客户名称2",
        statTime: "2023-02-25",
        chargeEnergy: "0.00",
        dischargeEnergy: "0.00",
        normalChargeEnergy: "0.00",
        lowChargeEnergy: "0.00",
        peakDischargeEnergy: "0.00",
        highDischargeEnergy: "0.00",
        income: "0.0000",
        charge: "0.0000",
        remark: "本期设备使用未满足完整充放循环，费用将计入下一周期抵扣后结算",
      },
      {
        devCode: "1701240101",
        devID: "P100M0215K2401180001",
        modelName: "EnerArk-NBN-P100M0-215K",
        customerName: "客户名称3",
        statTime: "2023-02-25",
        chargeEnergy: "31.00",
        dischargeEnergy: "0.00",
        normalChargeEnergy: "1.00",
        lowChargeEnergy: "29.00",
        peakDischargeEnergy: "0.00",
        highDischargeEnergy: "0.00",
        income: "0.0000",
        charge: "0.0000",
        remark: "本期设备使用未满足完整充放循环，费用将计入下一周期抵扣后结算",
      },
      {
        devCode: "1701240102",
        devID: "P100M0215K2401180002",
        modelName: "EnerArk-NBN-P100M0-215K",
        customerName: "客户名称4",
        statTime: "2023-02-25",
        chargeEnergy: "0.00",
        dischargeEnergy: "0.00",
        normalChargeEnergy: "0.00",
        lowChargeEnergy: "0.00",
        peakDischargeEnergy: "0.00",
        highDischargeEnergy: "0.00",
        income: "0.0000",
        charge: "0.0000",
        remark: "本期设备使用未满足完整充放循环，费用将计入下一周期抵扣后结算",
      },
      {
        devCode: "1701240101",
        devID: "P100M0215K2401180001",
        modelName: "EnerArk-NBN-P100M0-215K",
        customerName: "客户名称5",
        statTime: "2023-02-25",
        chargeEnergy: "1.00",
        dischargeEnergy: "29.00",
        normalChargeEnergy: "0.00",
        lowChargeEnergy: "1.00",
        peakDischargeEnergy: "0.00",
        highDischargeEnergy: "7.00",
        income: "0.0000",
        charge: "0.0000",
        remark: "本期设备使用未满足完整充放循环，费用将计入下一周期抵扣后结算",
      },
    ],
  }
}
// 查询账单条件---------------------------------------------------------------
export const queryBillCondition = ref({
  pageIndex: 1,
  pageSize: 10,
  timeType: 1,
  year: "",
  month: "",
  customerAddr_Province: "",
  customerAddr_City: "",
  customerAddr_County: "",
  keywords: "",
})
// 查询账单结果
export const queryBillResult = ref({
  rowCount: 0,
  billInfoList: [] as BillInfo[], // 显式指定类型并初始化为空数组
  totalAmount: "",
  totalCustomerIncome: "",
  totalIncome: "",
})
// 查询账单分页列表
export const queryBillPageList = async () => {
  // const res = await GetBillPageList(queryBillCondition.value)
  // console.log(JSON.stringify(res))
  queryBillResult.value = {
    rowCount: 5,
    totalIncome: "13574.8040",
    totalCustomerIncome: "2307.8009",
    totalAmount: "14438.2920",
    billInfoList: [
      {
        id: 4,
        code: "ZD2024020001",
        time: "2023-03",
        customerName: "客户名称1",
        income: "-1923.2692",
        incomeShareRatio: "30.00",
        customerIncome: "0.0000",
        amount: "0.0000",
      },
      {
        id: 5,
        code: "ZD2024020002",
        time: "2023-03",
        customerName: "客户名称2",
        income: "1612.8277",
        incomeShareRatio: "30.00",
        customerIncome: "483.8483",
        amount: "1128.9793",
      },
      {
        id: 6,
        code: "ZD2024020003",
        time: "2023-03",
        customerName: "客户名称3",
        income: "-8.8091",
        incomeShareRatio: "30.00",
        customerIncome: "0.0000",
        amount: "0.0000",
      },
      {
        id: 10,
        code: "ZD2024030001",
        time: "2023-03",
        customerName: "客户名称4",
        income: "416.7218",
        incomeShareRatio: "30.00",
        customerIncome: "0.0000",
        amount: "0.0000",
      },
      {
        id: 11,
        code: "ZD2024030002",
        time: "2023-02",
        customerName: "客户名称5",
        income: "-787.2062",
        incomeShareRatio: "30.00",
        customerIncome: "207.4134",
        amount: "483.9648",
      },
    ],
  }
}
// 查询充值条件---------------------------------------------------------------
export const queryRechargeCondition = ref({
  pageIndex: 1,
  pageSize: 10,
  timeType: 1,
  rechargeWay: undefined,
  date_Start: "",
  date_End: "",
  keyWords: "",
})
// 查询充值结果
export const queryRechargeResult = ref({
  rowCount: 0,
  totalRechargeAmount: 0,
  rechargeList: [],
})
// 查询充值分页列表
export const queryRechargePageList = async () => {
  // const res = await GetRechargePageList(queryRechargeCondition.value)
  // console.log(JSON.stringify(res))
  queryRechargeResult.value = {
    rowCount: 5,
    totalRechargeAmount: 243695,
    rechargeList: [
      {
        id: 31,
        code: "CZ202501230001",
        date: "2023-01-25",
        rechargeAmount: 2000,
        customerName: "客户名称1",
        endAccountBalance: 2332.914748,
        rechargeWay: 2,
        addUserName: "管理员",
        addTime: "2023-01-25 10:00:19",
        remark: "模拟客户充值",
      },
      {
        id: 30,
        code: "CZ202408220002",
        date: "2023-01-25",
        rechargeAmount: 1,
        customerName: "客户名称2",
        endAccountBalance: 121309,
        rechargeWay: 2,
        addUserName: "管理员",
        addTime: "2023-01-25 14:55:20",
        remark: "打款测试",
      },
      {
        id: 29,
        code: "CZ202408220001",
        date: "2023-01-24",
        rechargeAmount: 2,
        customerName: "客户名称3",
        endAccountBalance: 121308,
        rechargeWay: 2,
        addUserName: "管理员",
        addTime: "2023-01-24 14:29:31",
        remark: "打款测试",
      },
      {
        id: 28,
        code: "CZ202408080001",
        date: "2023-01-22",
        rechargeAmount: 300,
        customerName: "客户名称4",
        endAccountBalance: 300,
        rechargeWay: 2,
        addUserName: "管理员",
        addTime: "2023-01-22 11:40:46",
        remark: "就充了呗",
      },
      {
        id: 27,
        code: "CZ202405100012",
        date: "2023-01-21",
        rechargeAmount: 10000,
        customerName: "客户名称5",
        endAccountBalance: 130002,
        rechargeWay: 2,
        addUserName: "管理员",
        addTime: "2023-01-21 14:43:35",
        remark: "找零",
      },
    ],
  }
}
// 查询扣退费条件---------------------------------------------------------------
export const queryChargeAndRefundCondition = ref({
  pageIndex: 1,
  pageSize: 10,
  way: undefined,
  date_Start: "",
  date_End: "",
  keyWords: "",
})
// 查询扣退费结果
export const queryChargeAndRefundResult = ref({
  rowCount: 0,
  totalAmount: 0,
  dataList: [],
})
// 查询扣退费分页列表
export const queryChargeAndRefundPageList = async () => {
  // const res = await GetChargeAndRefundPageList(queryChargeAndRefundCondition.value)
  // console.log(JSON.stringify(res))
  queryChargeAndRefundResult.value = {
    rowCount: 5,
    totalAmount: 14642.292022,
    dataList: [
      {
        code: "KC202506070001",
        amount: 18.10422,
        customerName: "客户名称1",
        endAccountBalance: -694.597142,
        way: 1,
        type: null,
        addUserName: null,
        addTime: "2023-02-07 01:00:49",
        remark: "本期收益是由抵扣上期未结算的数据之后而结算得出",
      },
      {
        code: "KC202506060001",
        amount: 25.26129,
        customerName: "客户名称2",
        endAccountBalance: -676.492922,
        way: 1,
        type: null,
        addUserName: "管理员",
        addTime: "2023-02-08 01:00:30",
        remark: "本期收益是由抵扣上期未结算的数据之后而结算得出",
      },
      {
        code: "KC202506050001",
        amount: 32.35023,
        customerName: "客户名称3",
        endAccountBalance: -651.231632,
        way: 1,
        type: null,
        addUserName: null,
        addTime: "2023-02-08 01:00:09",
        remark: "本期收益是由抵扣上期未结算的数据之后而结算得出",
      },
      {
        code: "KC202506040001",
        amount: 14.56677,
        customerName: "客户名称4",
        endAccountBalance: -618.881402,
        way: 1,
        type: null,
        addUserName: null,
        addTime: "2023-02-11 01:00:51",
        remark: "本期收益是由抵扣上期未结算的数据之后而结算得出",
      },
      {
        code: "KC202505310001",
        amount: 14.472,
        customerName: "客户名称5",
        endAccountBalance: -604.314632,
        way: 1,
        type: null,
        addUserName: null,
        addTime: "2023-02-11 01:00:30",
        remark: "本期收益是由抵扣上期未结算的数据之后而结算得出",
      },
    
    ],
  }
}
// 获取账单详情
export const getBillDetail = async (billId: number) => {
  return await {
    id: 4,
    code: "ZD2024020001",
    customerName: "客户1",
    timeType: 1,
    year: 2023,
    month: "3",
    period: "2023.03.01-2023.03.29",
    dayCount: 7,
    incomeShareRatio: "30.00",
    income: "-1923.2692",
    customerIncome: "0.0000",
    beginAccountBalance: "10000.0000",
    recharge: "0.0000",
    amount: "0.0000",
    actualDeduct: "0.0000",
    endAccountBalance: "10000.0000",
    peakPeriodPrice: "",
    highPeriodPrice: "",
    normalPeriodPrice: "",
    lowPeriodPrice: "",
    peakChargeEnergy: "",
    peakChargePay: "",
    peakDischargeEnergy: "",
    peakDischargeIncome: "",
    highChargeEnergy: "",
    highChargePay: "",
    highDischargeEnergy: "",
    highDischargeIncome: "",
    normalChargeEnergy: "",
    normalChargePay: "",
    normalDischargeEnergy: "",
    normalDischargeIncome: "",
    lowChargeEnergy: "",
    lowChargePay: "",
    lowDischargeEnergy: "",
    lowDischargeIncome: "",
    chargeEnergy: "",
    chargePay: "",
    dischargeEnergy: "",
    dischargeIncome: "",
  }
}
