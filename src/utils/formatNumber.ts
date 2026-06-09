/**
 * 保留两位小数，千分位分逗号分隔，正负数不做处理
 * @param x "11111.1111"   111
 * @returns 11111.11       111.00
 */
export const formatNumber = (x: any) => {
  // 确保 x 是字符串或数字类型，否则返回 "无"
  if (typeof x !== "string" && typeof x !== "number") {
    return "无"
  }

  // 清除非数字和小数点以外的字符
  let numStr = x.toString().replace(/[^\d.-]/g, "")

  // 检查是否可以转换为数字
  const num = Number(numStr)
  if (isNaN(num)) {
    return "无"
  }

  // 保留小数点后两位
  const formatted = num.toFixed(2)

  // 添加千位分隔符
  return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// 再创建一个保留4位小数点的函数,小数点后面不需要千分位隔开
export function formatNumber4(x: number | string): string {
  let numStr = x.toString().replace(/[^\d.-]/g, "")

  // 检查是否可以转换为数字
  const num = Number(numStr)
  if (isNaN(num)) {
    return "无"
  }

  // 保留小数点后四位
  const formatted = num.toFixed(4)
  return formatted
}
