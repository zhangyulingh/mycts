import {GetMenuList} from "@/api/system/menuAndAction"
import {GetRolePageList} from "@/api/system/role"
import {GetDepartList, GetUserPageList} from "@/api/system/dept"

import type {RoleRootObject} from "@/api/system/role"
// 查询条件----------------------------------
export const queryCondition = ref<any>({
  isLoadActionList: true,
})
// 查询结果
export const queryResult = ref([])
// 查询菜单列表
export const queryMenuList = async () => {
  const res: any = await GetMenuList(queryCondition.value.isLoadActionList)
  queryResult.value = res.data
}

// 查询角色条件----------------------------------
export const queryRoleCondition = ref<any>({
  PageIndex: 1,
  PageSize: 10,
  Keywords: "",
})
// 查询角色结果
export const queryRoleResult = ref<{data: RoleRootObject[]; total: number}>({
  data: [],
  total: 0,
})
// 查询角色列表
export const queryRoleList = async () => {
  const res: any = await GetRolePageList()
  queryRoleResult.value = res
}
// 查询部门条件----------------------------------
export const queryDepartCondition = ref<any>({
  DepartID: 0,
})
// 查询部门结果
export const queryDepartResult = ref({
  data: [],
  total: 0,
})
// 查询部门列表
export const queryDepartList = async () => {
  const res: any = await GetDepartList(queryDepartCondition.value)
  queryDepartResult.value = res
}
// 查询用户条件----------------------------------
export const queryUserCondition = ref<any>({
  PageIndex: 1,
  PageSize: 20,
  DepartID: 0,
  Keywords: "",
})
// 查询用户结果
export const queryUserResult = ref({
  data: [],
  total: 0,
} as {data: any[]; total: number})
// 查询用户列表
export const queryUserList = async () => {
  const res: any = await GetUserPageList()
  queryUserResult.value = res
}
