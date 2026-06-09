import {request} from "@/utils/request"

// GET MenuAction/GetMenuList?IsLoadActionList={IsLoadActionList}
// 获取所有菜单列表， Code值说明：0获取成功；1获取失败；2无此操作权限
interface RootObject {
  id: number
  parentID: number
  parentName: string
  name: string
  code: string
  remark: string
  sort: number
  subMenuList: SubMenuList[] | null
  actionList: [] | null
}

interface SubMenuList {
  id: number
  parentID: number
  parentName: null
  name: string
  code: string
  remark: string
  sort: number
  subMenuList: []
  actionList: []
}
export const GetMenuList = () => {
  return {
    success: true,
    code: 0,
    message: "获取成功",
    total: 8,
    data: [
      {
        id: 1,
        parentID: 0,
        parentName: null,
        name: "数据看板",
        code: "sjkb",
        remark: "数据可视化看板",
        sort: 1,
        subMenuList: null,
        actionList: [
          {
            id: 23,
            name: "显示",
            code: "_1_xs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
        ],
      },
      {
        id: 2,
        parentID: 0,
        parentName: null,
        name: "设备管理",
        code: "sbgl",
        remark: "",
        sort: 2,
        subMenuList: null,
        actionList: [
          {
            id: 32,
            name: "设备显示",
            code: "_2_sbxs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
          {
            id: 33,
            name: "新增设备",
            code: "_2_xzsb",
            apiPath: "/EnergyStorageDev/AddDev",
            remark: "",
            sort: 2,
          },
          {
            id: 34,
            name: "编辑设备",
            code: "_2_bjsb",
            apiPath: "/EnergyStorageDev/UpdateDev",
            remark: "",
            sort: 3,
          },
          {
            id: 35,
            name: "删除设备",
            code: "_2_scsb",
            apiPath: "/EnergyStorageDev/DeleteDev",
            remark: "",
            sort: 4,
          },
          {
            id: 36,
            name: "查看标签",
            code: "_2_ckbq",
            apiPath: null,
            remark: "",
            sort: 5,
          },
          {
            id: 37,
            name: "电价模板",
            code: "_2_djmb",
            apiPath: null,
            remark: "",
            sort: 6,
          },
          {
            id: 38,
            name: "充放策略",
            code: "_2_cfcl",
            apiPath: "/EnergyStorageDev/SetDevCFDPolicy",
            remark: "",
            sort: 7,
          },
          {
            id: 39,
            name: "绑定信息",
            code: "_2_bdxx",
            apiPath: "/EnergyStorageDev/BindLocatDev",
            remark: "",
            sort: 8,
          },
        ],
      },
      {
        id: 16,
        parentID: 0,
        parentName: null,
        name: "客户管理",
        code: "khgl",
        remark: "",
        sort: 3,
        subMenuList: null,
        actionList: [
          {
            id: 85,
            name: "显示",
            code: "_16_xs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
          {
            id: 26,
            name: "新增客户",
            code: "_16_xzkh",
            apiPath: "/CustomerManage/AddCustomer",
            remark: "",
            sort: 2,
          },
          {
            id: 40,
            name: "编辑客户",
            code: "_16_bjkh",
            apiPath: "/CustomerManage/UpdateCustomer",
            remark: "",
            sort: 3,
          },
          {
            id: 41,
            name: "删除客户",
            code: "_16_sckh",
            apiPath: "/CustomerManage/DeleteCustomer",
            remark: "",
            sort: 4,
          },
          {
            id: 42,
            name: "修改客户状态",
            code: "_16_xgkhzt",
            apiPath: "/CustomerManage/UpdateCustomerState",
            remark: "",
            sort: 5,
          },
          {
            id: 43,
            name: "分成比例管理",
            code: "_16_fcblgl",
            apiPath: "/CustomerManage/UpdateShareRatio",
            remark: "",
            sort: 6,
          },
          {
            id: 44,
            name: "绑定设备",
            code: "_16_bdsb",
            apiPath: "/CustomerManage/BindDev",
            remark: "",
            sort: 7,
          },
          {
            id: 45,
            name: "查看设备",
            code: "_16_cksb",
            apiPath: null,
            remark: "",
            sort: 8,
          },
          {
            id: 46,
            name: "解绑设备",
            code: "_16_jbsb",
            apiPath: "/CustomerManage/UnbindDev",
            remark: "",
            sort: 9,
          },
          {
            id: 47,
            name: "创建客户端账号",
            code: "_16_cjkhdzh",
            apiPath: "/CustomerManage/AddAccount",
            remark: "",
            sort: 10,
          },
          {
            id: 48,
            name: "编辑客户端账号",
            code: "_16_bjkhdzh",
            apiPath: "/CustomerManage/UpdateAccount",
            remark: "",
            sort: 11,
          },
          {
            id: 49,
            name: "重置密码",
            code: "_16_zzmm",
            apiPath: "/CustomerManage/ResetAccountPwd",
            remark: "",
            sort: 12,
          },
          {
            id: 93,
            name: "修改客户端状态",
            code: "_16_xgkhdzt",
            apiPath: "",
            remark: "",
            sort: 13,
          },
        ],
      },
      {
        id: 17,
        parentID: 0,
        parentName: null,
        name: "告警管理",
        code: "gjgl",
        remark: "",
        sort: 4,
        subMenuList: null,
        actionList: [
          {
            id: 50,
            name: "显示",
            code: "_17_xs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
          {
            id: 51,
            name: "解除告警",
            code: "_17_jcgj",
            apiPath: "EnergyStorageDevAlarm/RemoveDevAlarm",
            remark: "",
            sort: 2,
          },
        ],
      },
      {
        id: 9,
        parentID: 0,
        parentName: null,
        name: "供应商管理",
        code: "gysgl",
        remark: "test2",
        sort: 5,
        subMenuList: null,
        actionList: [
          {
            id: 52,
            name: "显示",
            code: "_9_xs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
          {
            id: 53,
            name: "新增供应商",
            code: "_9_xzgys",
            apiPath: "/SupplierManage/AddSupplier",
            remark: "",
            sort: 2,
          },
          {
            id: 54,
            name: "编辑供应商",
            code: "_9_bjgys",
            apiPath: "/SupplierManage/UpdateSupplier",
            remark: "",
            sort: 3,
          },
          {
            id: 55,
            name: "删除供应商",
            code: "_9_scgys",
            apiPath: "/SupplierManage/DeleteSupplier",
            remark: "",
            sort: 4,
          },
        ],
      },
      {
        id: 18,
        parentID: 0,
        parentName: null,
        name: "财务管理",
        code: "cwgl",
        remark: "",
        sort: 6,
        subMenuList: [
          {
            id: 34,
            parentID: 18,
            parentName: null,
            name: "账单信息",
            code: "zdxx",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: [
              {
                id: 57,
                name: "显示",
                code: "_34_xs",
                apiPath: null,
                remark: "",
                sort: 1,
              },
              {
                id: 58,
                name: "查看账单详情",
                code: "_34_ckzdxq",
                apiPath: "/FinanceManage/GetBillDetail",
                remark: "",
                sort: 2,
              },
              {
                id: 59,
                name: "导出账单列表",
                code: "_34_dczdlb",
                apiPath: "/FinanceManage/ExportBill",
                remark: "",
                sort: 3,
              },
            ],
          },
          {
            id: 35,
            parentID: 18,
            parentName: null,
            name: "收益报表",
            code: "sybb",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: [
              {
                id: 60,
                name: "显示",
                code: "_35_xs",
                apiPath: null,
                remark: "",
                sort: 1,
              },
              {
                id: 61,
                name: "导出账单列表",
                code: "_35_dczdlb",
                apiPath: "/FinanceManage/ExportIncomeReport",
                remark: "",
                sort: 2,
              },
            ],
          },
          {
            id: 36,
            parentID: 18,
            parentName: null,
            name: " 充值管理",
            code: " czgl",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: [
              {
                id: 62,
                name: "显示",
                code: "_36_xs",
                apiPath: null,
                remark: "",
                sort: 1,
              },
              {
                id: 63,
                name: "批量导入",
                code: "_36_pldr",
                apiPath: "/FinanceManage/BatchImportRecharge",
                remark: "",
                sort: 2,
              },
              {
                id: 64,
                name: "充值操作",
                code: "_36_czcz",
                apiPath: "/FinanceManage/RechargeOper",
                remark: "",
                sort: 3,
              },
            ],
          },
          {
            id: 37,
            parentID: 18,
            parentName: null,
            name: "扣费管理",
            code: "kfgl",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: [
              {
                id: 65,
                name: "显示",
                code: "_37_xs",
                apiPath: null,
                remark: "",
                sort: 1,
              },
              {
                id: 66,
                name: "扣退费操作",
                code: "_37_ktfcz",
                apiPath: "/FinanceManage/ChargeAndRefundOper",
                remark: "",
                sort: 2,
              },
            ],
          },
        ],
        actionList: [
          {
            id: 56,
            name: "显示",
            code: "_18_xs",
            apiPath: null,
            remark: "",
            sort: 0,
          },
        ],
      },
      {
        id: 19,
        parentID: 0,
        parentName: null,
        name: "电价配置",
        code: "djpz",
        remark: "",
        sort: 6,
        subMenuList: null,
        actionList: [
          {
            id: 67,
            name: "显示",
            code: "_19_xs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
          {
            id: 68,
            name: "新增模版",
            code: "_19_xzmb",
            apiPath: "/ElectricPriceConfig/AddElectricPriceTemplate",
            remark: "",
            sort: 2,
          },
          {
            id: 69,
            name: "编辑模板",
            code: "_19_bjmb",
            apiPath: "/ElectricPriceConfig/UpdateElectricPriceTemplate",
            remark: "",
            sort: 3,
          },
          {
            id: 70,
            name: "删除模板",
            code: "_19_scmb",
            apiPath: "/ElectricPriceConfig/DeleteElectricPriceTemplate",
            remark: "",
            sort: 4,
          },
          {
            id: 71,
            name: "修改模板状态",
            code: "_19_xgmbzt",
            apiPath: "/ElectricPriceConfig/UpdateElectricPriceTemplateState",
            remark: "",
            sort: 5,
          },
        ],
      },
      {
        id: 20,
        parentID: 0,
        parentName: null,
        name: "系统设置",
        code: "xtsz",
        remark: "",
        sort: 7,
        subMenuList: [
          {
            id: 28,
            parentID: 20,
            parentName: null,
            name: "组织架构",
            code: "zzjg",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: [
              {
                id: 73,
                name: "显示",
                code: "_28_xs",
                apiPath: null,
                remark: "",
                sort: 1,
              },
              {
                id: 28,
                name: "新增部门",
                code: "_28_xzbm",
                apiPath: "/Department/AddDepart",
                remark: "",
                sort: 2,
              },
              {
                id: 74,
                name: "编辑部门",
                code: "_28_bjbm",
                apiPath: "/Department/UpdateDepart",
                remark: "",
                sort: 3,
              },
              {
                id: 75,
                name: "删除部门",
                code: "_28_scbm",
                apiPath: "/Department/DeleteDepart",
                remark: "",
                sort: 4,
              },
              {
                id: 76,
                name: "新增人员",
                code: "_28_xzry",
                apiPath: "/User/AddUser",
                remark: "",
                sort: 5,
              },
              {
                id: 77,
                name: "编辑人员 ",
                code: "_28_bjry ",
                apiPath: "/User/UpdateUser",
                remark: "",
                sort: 6,
              },
              {
                id: 78,
                name: "删除人员",
                code: "_28_scry",
                apiPath: "/User/DeleteUser",
                remark: "",
                sort: 7,
              },
              {
                id: 79,
                name: "停用/启用账号",
                code: "_28_ty/qyzh",
                apiPath: "/User/UpdateUserState",
                remark: "",
                sort: 8,
              },
              {
                id: 80,
                name: "重置密码",
                code: "_28_zzmm",
                apiPath: "/User/PwdReset",
                remark: "",
                sort: 9,
              },
            ],
          },
          {
            id: 32,
            parentID: 20,
            parentName: null,
            name: "角色管理",
            code: "jsgl",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: [
              {
                id: 81,
                name: "显示",
                code: "_32_xs",
                apiPath: null,
                remark: "",
                sort: 1,
              },
              {
                id: 82,
                name: "新增角色",
                code: "_32_xzjs",
                apiPath: "/Role/AddRole",
                remark: "",
                sort: 2,
              },
              {
                id: 83,
                name: "编辑角色",
                code: "_32_bjjs",
                apiPath: "/Role/UpdateRole",
                remark: "",
                sort: 3,
              },
              {
                id: 84,
                name: "删除角色",
                code: "_32_scjs",
                apiPath: "/Role/DeleteRole",
                remark: "",
                sort: 4,
              },
            ],
          },
          {
            id: 33,
            parentID: 20,
            parentName: null,
            name: "功能管理",
            code: "gngl",
            remark: "",
            sort: 0,
            subMenuList: null,
            actionList: null,
          },
        ],
        actionList: [
          {
            id: 72,
            name: "显示",
            code: "_20_xs",
            apiPath: null,
            remark: "",
            sort: 1,
          },
        ],
      },
    ],
  }
}
// GET MenuAction/GetMenuInfo?MenuID={MenuID}
// 获取某一个菜单信息， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetMenuInfo = (MenuID: number) => {
  return request({
    url: `/MenuAction/GetMenuInfo?MenuID=${MenuID}`,
    method: "GET",
  })
}
// GET MenuAction/GetActionList?MenuID={MenuID}
// 获取某一个菜单的功能列表， Code值说明：0获取成功；1获取失败；2无此操作权限
export const GetActionList = (MenuID: number) => {
  return request({
    url: `/MenuAction/GetActionList?MenuID=${MenuID}`,
    method: "GET",
  })
}
// POST MenuAction/AddMenu
// 新增菜单， Code值说明：0新增成功；1此菜单已存在；2父级菜单不存在；4新增失败；5无此操作权限
export const AddMenu = (data: any) => {
  return request({
    url: "/MenuAction/AddMenu",
    method: "POST",
    data,
  })
}
// PUT MenuAction/UpdateMenu
// 更新菜单信息， Code值说明：0更新成功；1此菜单已存在；2更新失败；3无此操作权限
export const UpdateMenu = (data: any) => {
  return request({
    url: "/MenuAction/UpdateMenu",
    method: "PUT",
    data,
  })
}
// POST MenuAction/AddAction---------------------------------------------------------------
// 新增功能， Code值说明：0新增成功；1此功能已存在；2菜单不存在；4新增失败；5无此操作权限
export const AddAction = (data: any) => {
  return request({
    url: "/MenuAction/AddAction",
    method: "POST",
    data,
  })
}
// PUT MenuAction/UpdateAction
// 更新功能信息， Code值说明：0更新成功；1此功能已存在；2更新失败；3无此操作权限
export const UpdateAction = (data: any) => {
  return request({
    url: "/MenuAction/UpdateAction",
    method: "PUT",
    data,
  })
}
// DELETE MenuAction/DeleteMenu?MenuID={MenuID}
// 删除菜单， Code值说明：0删除成功；1删除失败；2无此操作权限；3菜单下有子级菜单；4此菜单下尚有功能
export const DeleteMenu = (MenuID: number) => {
  return request({
    url: `/MenuAction/DeleteMenu?MenuID=${MenuID}`,
    method: "DELETE",
  })
}
// DELETE MenuAction/DeleteAction?ActionID={ActionID}
// 删除功能， Code值说明：0删除成功；1删除失败；2无此操作权限
export const DeleteAction = (ActionID: number) => {
  return request({
    url: `/MenuAction/DeleteAction?ActionID=${ActionID}`,
    method: "DELETE",
  })
}
