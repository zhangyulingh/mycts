import {request} from "@/utils/request"

// GET Department/GetDepartList?DepartID={DepartID}
// 获取所有部门列表， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetDepartList = (DepartID: number) => {
  return {
    success: true,
    code: 0,
    message: "获取成功",
    total: 2,
    data: [
      {
        id: 2,
        parentID: 0,
        name: "销售1部",
        subDepartList: [
          {
            id: 3,
            parentID: 2,
            name: "软件部",
            subDepartList: [
              {
                id: 32,
                parentID: 3,
                name: "后端开发",
                subDepartList: null,
              },
              {
                id: 35,
                parentID: 3,
                name: "APP开发",
                subDepartList: [
                  {
                    id: 36,
                    parentID: 35,
                    name: "安卓开发",
                    subDepartList: null,
                  },
                  {
                    id: 37,
                    parentID: 35,
                    name: "ios开发",
                    subDepartList: null,
                  },
                ],
              },
              {
                id: 78,
                parentID: 3,
                name: "测试组",
                subDepartList: [
                  {
                    id: 79,
                    parentID: 78,
                    name: "测试1组",
                    subDepartList: null,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 6,
        parentID: 0,
        name: "IT部",
        subDepartList: [
          {
            id: 38,
            parentID: 6,
            name: "硬件开发",
            subDepartList: null,
          },
          {
            id: 39,
            parentID: 6,
            name: "技术支持",
            subDepartList: null,
          },
        ],
      },
    ],
  }
}
// GET Department/GetDepartInfo?DepartID={DepartID}
// 获取某一个部门信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetDepartInfo = (DepartID: number) => {
  return request({
    url: `/Department/GetDepartInfo?DepartID=${DepartID}`,
    method: "GET",
  })
}
// POST Department/AddDepart
// 新增部门， Code值说明：0新增成功；1部门名称已存在；2父级部门不存在；4新增失败；5无此操作权限
export const AddDepart = (data: any) => {
  return request({
    url: "/Department/AddDepart",
    method: "POST",
    data,
  })
}
// PUT Department/UpdateDepart
// 更新部门信息， Code值说明：0更新成功；1部门名称已存在；2父级部门不存在；3不能归属到子级部门；4更新失败；5无此操作权限
export const UpdateDepart = (data: any) => {
  return request({
    url: "/Department/UpdateDepart",
    method: "PUT",
    data,
  })
}
// DELETE Department/DeleteDepart?DepartID={DepartID}
// 删除部门， Code值说明：0删除成功；1删除失败；2部门下有子级部门；3此部门下尚有员工；4无此操作权限
export const DeleteDepart = (DepartID: number) => {
  return request({
    url: `/Department/DeleteDepart?DepartID=${DepartID}`,
    method: "DELETE",
  })
}
// GET User/GetUserPageList?PageIndex={PageIndex}&PageSize={PageSize}&DepartID={DepartID}&Keywords={Keywords}
// 获取用户分页列表， Code值说明：0获取成功；1获取失败；2无此操作权限
export interface GetUserPageListType {
  PageIndex: number
  PageSize: number
  DepartID: number
  Keywords: string
}
export const GetUserPageList = () => {
  return {
    success: true,
    code: 0,
    message: "获取成功",
    total: 5,
    data: [
      {
        id: 1,
        trueName: "管理员",
        phoneNumber: "15112345678",
        departID: null,
        departName: null,
        roleIDList: "",
        roleNameList: "",
        isAdmin: true,
        isEnabled: false,
      },
      {
        id: 2,
        trueName: "杨颖书",
        phoneNumber: "15232652365",
        departID: 36,
        departName: "安卓开发",
        roleIDList: "15",
        roleNameList: " 角色名称3",
        isAdmin: false,
        isEnabled: true,
      },
      {
        id: 5,
        trueName: "杨飞",
        phoneNumber: "15232323232",
        departID: 32,
        departName: "后端开发",
        roleIDList: "15",
        roleNameList: " 角色名称3",
        isAdmin: false,
        isEnabled: true,
      },
      {
        id: 31,
        trueName: "陈美丽",
        phoneNumber: "15106118888",
        departID: 79,
        departName: "测试1组",
        roleIDList: "15,26,28",
        roleNameList: " 角色名称3；管理权限；测试",
        isAdmin: false,
        isEnabled: true,
      },
      {
        id: 40,
        trueName: "张玉林",
        phoneNumber: "17312211001",
        departID: 39,
        departName: "技术支持",
        roleIDList: "26",
        roleNameList: "管理权限",
        isAdmin: false,
        isEnabled: false,
      },
    ],
  }
}
// GET User/GetUserInfo?UserID={UserID}
// 获取某一个用户信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetUserInfo = (UserID: number) => {
  return request({
    url: `/User/GetUserInfo?UserID=${UserID}`,
    method: "GET",
  })
}
// POST User/AddUser
// 新增用户， Code值说明：0新增成功；1手机号码格式不正确；2用户已添加；4新增失败；5无此操作权限
export const AddUser = (data: any) => {
  return request({
    url: "/User/AddUser",
    method: "POST",
    data,
  })
}
// PUT User/UpdateUser
// 更新用户信息， Code值说明：0更新成功；1手机号码格式不正确；2用户已存在；4更新失败；5无此操作权限
export const UpdateUser = (data: any) => {
  return request({
    url: "/User/UpdateUser",
    method: "PUT",
    data,
  })
}
// PUT User/UpdateUserState
// 启用或停用用户帐号， Code值说明：0操作成功；1操作失败；2无此操作权限
export const UpdateUserState = (id: number, isEnabled: boolean) => {
  return request({
    url: `/User/UpdateUserState`,
    method: "PUT",
    data: {
      ID: id,
      IsEnabled: isEnabled,
    },
  })
}

// PUT User/PwdReset
// 密码重置， Code值说明：0操作成功；1操作失败；2无此操作权限
export const PwdReset = (data: any) => {
  return request({
    url: "/User/PwdReset",
    method: "PUT",
    data,
  })
}
// PUT User/UpdatePwd
// 修改密码， Code值说明：0操作成功；1操作失败；2无此操作权限；3旧密码不正确
export const UpdatePwd = (data: any) => {
  return request({
    url: "/User/UpdatePwd",
    method: "PUT",
    data,
  })
}
// DELETE User/DeleteUser?UserID={UserID}
// 删除用户， Code值说明：0删除成功；1删除失败；2无此操作权限
export const DeleteUser = (UserID: number) => {
  return request({
    url: `/User/DeleteUser?UserID=${UserID}`,
    method: "DELETE",
  })
}
