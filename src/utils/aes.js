/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */

// AES加密引入crypto
import CryptoJS from "crypto-js"

/**
 * 加密函数
 * @param {string} value
 */
let encryptKey = "Kqx_,T$@"

export function toEncrypt(value) {
  const key = CryptoJS.enc.Utf8.parse(
    //将秘钥转换成Utf8字节数组
    CryptoJS.MD5(encryptKey).toString().toUpperCase()
  )
  const password = CryptoJS.enc.Utf8.parse(value)
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

// 解密函数
export function toDecrypt(value) {
  const key = CryptoJS.enc.Utf8.parse(
    //将秘钥转换成Utf8字节数组
    CryptoJS.MD5(encryptKey).toString().toUpperCase()
  )
  const encrypted = CryptoJS.AES.decrypt(value, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  const bv = CryptoJS.enc.Utf8.stringify(encrypted)
  return bv
}

// 解密文件
export function toDecryptFile(value) {
  const key = CryptoJS.enc.Utf8.parse(
    //将秘钥转换成Utf8字节数组
    CryptoJS.MD5(encryptKey).toString().toUpperCase()
  )
  const contentWA = CryptoJS.enc.u8array.parse(value)
  const dcBase64String = contentWA.toString(CryptoJS.enc.Base64)
  const encrypted = CryptoJS.AES.decrypt(dcBase64String, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  const bv = CryptoJS.enc.u8array.stringify(encrypted)
  return bv
}
