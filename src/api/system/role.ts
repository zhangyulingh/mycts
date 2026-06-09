import {request} from "@/utils/request"

// GET Role/GetRolePageList?PageIndex={PageIndex}&PageSize={PageSize}&Keywords={Keywords}
// 获取角色分页列表， Code值说明：0获取成功；1获取失败；2无此操作权限

export interface RoleRootObject {
  id: number
  name: string
  des: string
  roleMembers: string
  actionCodeList: string
}
export const GetRolePageList = () => {
  return {
    success: true,
    code: 0,
    message: "角色分页列表获取成功",
    total: 3,
    data: [
      {
        id: 15,
        name: " 角色名称3",
        des: "角色名称3",
        roleMembers: "杨飞",
        actionCodeList: null,
      },
      {
        id: 26,
        name: "管理权限",
        des: "测试账号",
        roleMembers: "张玉林",
        actionCodeList: null,
      },
      {
        id: 28,
        name: "测试",
        des: "测试",
        roleMembers: "",
        actionCodeList: null,
      },
    ],
  }
}
// DELETE Role/DeleteRole?RoleID={RoleID}
// 删除角色， Code值说明：0删除成功；1删除失败；2无此操作权限
export const DeleteRole = (RoleID: number) => {
  return request({
    url: `/Role/DeleteRole?RoleID=${RoleID}`,
    method: "DELETE",
  })
}
// GET Role/GetRoleInfo?RoleID={RoleID}
// 获取某一个角色详细信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetRoleInfo = () => {
  return {
    "success": true,
    "code": 0,
    "message": "获取成功",
    "data": {
        "id": 15,
        "name": " 角色名称3",
        "des": "角色名称3",
        "roleMembers": null,
        "actionCodeList": "_1_xs,_16_xzkh,_2_sbxs,_2_xzsb,_2_bjsb,_2_scsb,_2_ckbq,_2_djmb,_2_cfcl,_2_bdxx,_17_xs,_9_xs,_9_xzgys,_9_bjgys,_9_scgys,_18_xs,_34_xs,_34_ckzdxq,_34_dczdlb,_35_xs,_35_dczdlb,_36_xs,_36_pldr,_36_czcz,_37_xs,_37_ktfcz,_19_xs,_19_xzmb,_19_bjmb,_19_scmb,_19_xgmbzt"
    }
}
}
// GET Role/GetAllRoleName
// 获取所有角色名称， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetAllRoleName = () => {
  return {
    success: true,
    code: 0,
    message: "获取成功",
    total: 3,
    data: [
      {
        id: 15,
        name: " 角色名称3",
      },
      {
        id: 26,
        name: "管理权限",
      },
      {
        id: 28,
        name: "测试",
      },
    ],
  }
}
// POST Role/AddRole
// 新增角色， Code值说明：0新增成功；1角色名称已存在；2新增失败；3无此操作权限
export const AddRole = (data: any) => {
  return request({
    url: `/Role/AddRole`,
    method: "POST",
    data,
  })
}
// PUT Role/UpdateRole
// 更新角色信息， Code值说明：0更新成功；1角色名称已存在；2更新失败；3无此操作权限
export const UpdateRole = (data: any) => {
  return request({
    url: `/Role/UpdateRole`,
    method: "PUT",
    data,
  })
}
