export type AppInfo = {
  id?: number
  userID?: number
  name: string
  bundle?: string
  icon?: string
  introduce?: string
  storeURL?: string
  mergeID?: number
  mergeName?: string
  mergeIcon?: string
  mergeType?: string
  type?: number
  maxVersion?: string
  maxBuild?: number
  addTime?: string
  addUser?: number
  updateTime?: string
  updateUser?: number
  canMerge?: number
  lastUploadTime?: Date
  expiredDate?: string
  hasExpired?: boolean //是否临近过期（1个月）
  checked?: boolean
  privacyUrl?: string //隐私协议
}
