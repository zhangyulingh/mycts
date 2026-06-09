class ApiConfig {
  static USER_LOGIN = "Login/LoginByPwd"
  static USER_REGISTER = "users/register" //POST
  static APP_LIST = "version/all/1/1000" //
  static APP_DETAIL = "version"
  static APP_DOWNLOAD_INFO = "version/file" //下载页信息 bundle=com.tengen.AssetsCheckInHouse&type=1
  static APP_DELETE = "version/software/del" //DELETE
  static APP_INFO_UPDATE = "version/update/software" //
  static INSTALL_PACKAGE = "version/installpackage"
  static APP_VERSION_LIST = "version/detail" //?bundle=com.tengen.AssetsCheckInHouse  //
  static IOS_XML = "version/ios/xml"
  static APP_VERSION_DELETE = "version/detail/del" // //删除版本 DELETE /id
  static VERSION_Patch = "version/patch" // POST 添加补丁 /id DELETE id(patchId)
  static VERSION_Update_Remark = "version/update/remark" // PUT 更新安装包更新说明 /{id}/{remark}
  static APP_UNMERGE = "version/unmerge" // //解除合并 PUT /id  //
  static APP_LIST_UNMERGE = "version/merge/1/1000" // //查询未合并 GET /id
  static APP_MERGE = "version/merge" // //合并 PUT /id1/id2

  static START_LIST = "version/image/start/list" // 启动页管理列表
  static START_MARKS = "version/image/start/marks" // 启动页关闭启用?id=25&marks=1 DELETE
  static START_DEL = "version/image/start/del" // 删除计划?id=26 DELETE
  static GET_ALL_APP_LIST = "version/all/1/1000" //
  static START_PLAN = "version/image/start/list" // Get /id  | Post新增
  // 设备管理
  static DEVICE_LIST = "EnergyStorageDev/GetDevList" // 设备列表
}
export const testApi = import.meta.env.MODE === "development" // 是否是测试服
export const MODE_SERVER = import.meta.env.DEV // 是否是本地模式
export default ApiConfig
