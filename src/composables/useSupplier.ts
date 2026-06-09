// import {GetAllSupplier, GetSupplierInfo, DeleteSupplier, AddSupplier, GetOSSPara} from "@/api/supplier"
import type {Supplier} from "@/api/supplier"
import {ref} from "vue"

// 查询模板条件
export const queryCondition = ref({
  PageIndex: 1,
  PageSize: 10,
  Keywords: "",
})
// https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg
const data: any = [
  {
    supplierID: 1,
    name: "供应商甲",
    contacts: "李四",
    telephone: "010-10001111",
    address: "XX省XX市虚构区工业园1号楼",
    devModelList: [
      {
        devModelID: 1,
        name: "Alpha-100K",
        commMode: "TCP",
        ratedCapacity: 200,
        ratedPower: 100,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 2,
    name: "供应商乙",
    contacts: "王五",
    telephone: "020-20002222",
    address: "XX省XX市东区虚构路88号",
    devModelList: [
      {
        devModelID: 2,
        name: "Beta-50X",
        commMode: "MQTT",
        ratedCapacity: 120,
        ratedPower: 60,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 3,
    name: "供应商丙",
    contacts: "赵六",
    telephone: "021-30003333",
    address: "XX省XX市西区开发大道66号",
    devModelList: [
      {
        devModelID: 3,
        name: "Gamma-P200",
        commMode: "TCP",
        ratedCapacity: 300,
        ratedPower: 200,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 4,
    name: "供应商丁",
    contacts: "陈七",
    telephone: "0755-40004444",
    address: "XX省XX市南区未来路99号创新园B2楼",
    devModelList: [
      {
        devModelID: 4,
        name: "Delta-X80",
        commMode: "MQTT",
        ratedCapacity: 80,
        ratedPower: 40,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 5,
    name: "供应商戊",
    contacts: "周八",
    telephone: "023-50005555",
    address: "XX省XX市高新区科技一路28号",
    devModelList: [
      {
        devModelID: 5,
        name: "Omega-Z150",
        commMode: "TCP",
        ratedCapacity: 150,
        ratedPower: 90,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 6,
    name: "供应商A",
    contacts: "吴九",
    telephone: "028-60006666",
    address: "XX省XX市北区机电大道55号机电园区",
    devModelList: [
      {
        devModelID: 6,
        name: "Sigma-M75",
        commMode: "MQTT",
        ratedCapacity: 75,
        ratedPower: 55,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 7,
    name: "供应商B",
    contacts: "孙十",
    telephone: "029-70007777",
    address: "XX省XX市新区绿色能源大道18号",
    devModelList: [
      {
        devModelID: 7,
        name: "Lambda-C300",
        commMode: "TCP",
        ratedCapacity: 300,
        ratedPower: 150,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 8,
    name: "供应商C",
    contacts: "钱十一",
    telephone: "0571-80008888",
    address: "XX省XX市东南工业区88号C栋",
    devModelList: [
      {
        devModelID: 8,
        name: "Epsilon-T60",
        commMode: "MQTT",
        ratedCapacity: 60,
        ratedPower: 45,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 9,
    name: "供应商D",
    contacts: "郑十二",
    telephone: "0512-90009999",
    address: "XX省XX市智慧谷5号楼2层",
    devModelList: [
      {
        devModelID: 9,
        name: "Theta-R120",
        commMode: "TCP",
        ratedCapacity: 120,
        ratedPower: 70,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
  {
    supplierID: 10,
    name: "供应商E",
    contacts: "冯十三",
    telephone: "0592-10001000",
    address: "XX省XX市工业新区星河街道88号D栋",
    devModelList: [
      {
        devModelID: 10,
        name: "Zeta-F500",
        commMode: "MQTT",
        ratedCapacity: 500,
        ratedPower: 300,
        devImageAddress: "https://xinhui2017.oss-cn-hangzhou.aliyuncs.com/ess/1212_1715059880959.jpg",
      },
    ],
  },
]

// 查询模板结果
export const queryResult = ref<{data: Supplier[]; total: number}>({
  data: [],
  total: 0,
})
// 查询模板方法
export const getAllSupplierList = async () => {
  // const res = await GetAllSupplier(queryCondition.value)
  await Promise.resolve()
  queryResult.value = {data: data, total: data.length}
}
// 供应商详情
export const getSupplierDetail = async (ID: number) => {
  // const res = await GetSupplierInfo({ID})
  console.log("ID", ID)
  await Promise.resolve()
  console.log(data.find((item: any) => item.supplierID === ID))
  return data.find((item: any) => item.supplierID === ID)
}
// 删除供应商
export const deleteSupplier = async (ID: number) => {
  // const res = await DeleteSupplier({ID})
  return Promise.resolve()
}
// 新增供应商
export const addSupplier = async (data: any) => {
  // const res = await AddSupplier(data)
  return Promise.resolve()
}
// 获取OSS参数
export const getOSSPara = async () => {
  // const res = await GetOSSPara()
  return Promise.resolve()
}
