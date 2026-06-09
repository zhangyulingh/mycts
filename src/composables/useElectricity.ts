import {
  GetElectricPriceTemplatePageList,
  DeleteElectricPriceTemplate,
  UpdateElectricPriceTemplateState,
  GetElectricPriceTemplateDetail,
} from "@/api/electricity"
import type {RootObject} from "@/api/electricity"
import {ref} from "vue"
// 查询模板条件
export const queryCondition = ref({
  PageIndex: 1,
  PageSize: 10,
  Name: "",
})
// 查询模板结果
export const queryResult = ref<{data: RootObject[]; total: number}>({
  data: [],
  total: 0,
})
// 查询模板方法
export const queryElectricList = async () => {
  // const res = await GetElectricPriceTemplatePageList(queryCondition.value)
  // console.log(JSON.stringify(res))
  queryResult.value = {
    total: 12,
    data: [
      {
        id: 47,
        name: "2023年继续用一楼循环用",
        des: "跑循环",
        strEffectTime: "2023-01-01",
        year: 2023,
        month: "1,2,3,4,5,6,7,8,9,10,11,12",
        peakPeriodPrice: "0.0000",
        highPeriodPrice: "0.0000",
        normalPeriodPrice: "0.0000",
        lowPeriodPrice: "0.0000",
        peakPeriod: "03:00-10:00",
        highPeriod: "10:00-17:00",
        normalPeriod: "17:00-23:59",
        lowPeriod: "00:00-03:00",
        isDisable: false,
        isApply: true,
      },
      {
        id: 46,
        name: "2023年继续用江苏省2023年1月份电价",
        des: "国网江苏省电力有限公司代理购电工商业用户2023年1月份电价",
        strEffectTime: "2023-01-01",
        year: 2023,
        month: "1,2,3,4,5,6,7,8,9,10,11,12",
        peakPeriodPrice: "0.0000",
        highPeriodPrice: "1.1275",
        normalPeriodPrice: "0.6557",
        lowPeriodPrice: "0.2744",
        peakPeriod: "",
        highPeriod: "8:00-11:00,17:00-22:00",
        normalPeriod: "11:00-17:00,22:00-24:00",
        lowPeriod: "0:00-8:00",
        isDisable: true,
        isApply: true,
      },
      {
        id: 45,
        name: "1月份的电价",
        des: "1月份的电价信息",
        strEffectTime: "2023-01-31",
        year: 2023,
        month: "9,10,11",
        peakPeriodPrice: "1.0000",
        highPeriodPrice: "2.0000",
        normalPeriodPrice: "3.0000",
        lowPeriodPrice: "4.0000",
        peakPeriod: "00:00-05:59",
        highPeriod: "06:00-11:59",
        normalPeriod: "12:00-17:59",
        lowPeriod: "18:00-23:59",
        isDisable: false,
        isApply: false,
      }, 
   
    ],
  }
}

// 删除模板方法
export const deleteElectric = async (id: number) => {
  await DeleteElectricPriceTemplate({ID: id})
  queryElectricList()
}
// 修改模板状态方法
export const updateElectricState = async (id: number, isDisable: boolean) => {
  await UpdateElectricPriceTemplateState({ID: id, IsDisable: isDisable})
}
// 根据id 获取模板详情
export const getElectricDetail = async (id: number) => {
  return await GetElectricPriceTemplateDetail({ID: id})
}
