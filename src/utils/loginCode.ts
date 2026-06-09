// 生成指定长度的随机字母字符串，
function generateRandomString(length: number): string {
  let result = ""
  const characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
export default generateRandomString
