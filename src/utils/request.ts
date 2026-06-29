import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios"
import {ElMessage, ElMessageBox} from "element-plus"
import {get} from "lodash-es"
import * as qs from "qs"
import {Session} from "@/utils/storage"

/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      // 在发送请求之前做些什么 token
      const header = Session.get("token")

      if (header) {
        config.headers!["Custom"] = header
      }
      const userInfo = Session.get("userInfo")
      const operatorName = userInfo?.userName || userInfo?.loginName
      if (operatorName) {
        config.headers!["X-Operator-Username"] = operatorName
      }
      return config
    },
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 API 返回的数据
      const apiData = response.data as IResponseData<any>
      const success = apiData.success
      if (!success) {
        ElMessage.error(apiData.message || "Error")
        return Promise.reject(new Error(apiData.message || "Error"))
      } else {
        return apiData.total !== undefined ? {total: apiData.total, data: apiData.data} : apiData.data
      }
    },
    (error) => {
      const responseData = get(error, "response.data") as Partial<IResponseData<unknown>> | undefined
      const apiMessage = typeof responseData?.message === "string" ? responseData.message.trim() : ""
      const status = get(error, "response.status")

      if (apiMessage) {
        error.message = apiMessage
        ElMessage.error(apiMessage)
        return Promise.reject(error)
      }

      switch (status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
        case 4001:
          // `token` 过期或者账号已在别处登录
          Session.clear()
          window.location.href = "/"
          ElMessageBox.alert("你已被登出，请重新登录", "提示", {})
            .then(() => {})
            .catch(() => {})
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = "请求地址出错"
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP 版本不受支持"
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequestFunction(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const configDefault = {
      headers: {"Content-Type": "application/json"},
      timeout: 15000,
      baseURL: "/apiKey",
      paramsSerializer: {
        serialize(params: any) {
          return qs.stringify(params, {allowDots: true})
        },
      },
      data: {},
    }
    return service(Object.assign(configDefault, config))
  }
}

/** 用于网络请求的实例 */
export const service = createService()
/** 用于网络请求的方法 */
export const request = createRequestFunction(service)
