export function formatSize(filesize: any): string {
  if (null == filesize || filesize === "") {
    return "0 Bytes"
  }
  const unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  let index = 0
  const srcsize = parseFloat(filesize)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size: any = srcsize / Math.pow(1024, index)
  if (size % 1 === 0) {
    size = size.toFixed(0) //如果是整数不保留小数
  } else {
    size = size.toFixed(2) //保留的小数位数
  }
  return size + unitArr[index]
}
