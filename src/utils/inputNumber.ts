export const handleInput = (value: string): string => {
  // 匹配大于等于0的有效数字，小数点后最多四位
  const regex = /^(?:0(?:\.\d{1,4})?|[1-9]\d*(?:\.\d{1,4})?)$/
  if (!regex.test(value)) {
    // 如果输入不符合要求，则清除输入框中的非法字符
    value = value.replace(/[^\d.]/g, "")
    // 只保留小数点后四位
    const indexOfDot = value.indexOf(".")
    if (indexOfDot !== -1) {
      value = value.slice(0, indexOfDot + 5)
    }
  }
  return value
}
