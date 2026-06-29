import {service} from "@/utils/request";

export interface AccountItem {
  id: number
  username: string
  nickname: string
  role: string
  phone: string
  created_at: string
  updated_at: string
}

export interface AccountQuery {
  pageIndex: number
  pageSize: number
  keyword?: string
  excludeAdmin?: boolean
}

// 登录（支持用户名或手机号）
export function accountLogin(data: {account: string; password: string}) {
  return service({
    url: "/api/accounts/login",
    method: "post",
    baseURL: "",
    data,
  })
}

// 获取账号分页列表
export function getAccountPageList(data: AccountQuery): Promise<{total: number; data: AccountItem[]}> {
  return service<{total: number; data: AccountItem[]}>({
    url: "/api/accounts",
    method: "get",
    baseURL: "",
    params: data,
  })
}

// 获取单个账号
export function getAccountInfo(id: number) {
  return service<AccountItem>({
    url: `/api/accounts/${id}`,
    method: "get",
    baseURL: "",
  }).then((res) => res)
}

// 新增账号
export function addAccount(data: any) {
  return service({
    url: "/api/accounts",
    method: "post",
    baseURL: "",
    data,
  })
}

// 修改账号
export function updateAccount(id: number, data: any) {
  return service<AccountItem>({
    url: `/api/accounts/${id}`,
    method: "put",
    baseURL: "",
    data,
  })
}

// 删除账号
export function deleteAccount(id: number) {
  return service({
    url: `/api/accounts/${id}`,
    method: "delete",
    baseURL: "",
  })
}

