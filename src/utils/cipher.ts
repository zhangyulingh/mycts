import AES, {encrypt} from "crypto-js/aes"
import UTF8, {parse} from "crypto-js/enc-utf8"
import pkcs7 from "crypto-js/pad-pkcs7"
import ECB from "crypto-js/mode-ecb"
import Base64 from "crypto-js/enc-base64"
import md5 from "crypto-js/md5"
import CryptoJS from "crypto-js" // 导入 CryptoJS

export interface EncryptionParams {
  key: string
  iv?: string
}

export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64)
}

export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8)
}

export function encryptByMd5(password: string) {
  return md5(password).toString()
}

export function encryptPwd(password: string) {
  return encryptByMd5(`${password}QyMarketing`).toUpperCase()
}

export function encryptByAes(password: string) {
  return encrypt(parse(password), parse(encryptByMd5("_hS2@17_").toUpperCase()), {
    mode: ECB,
    padding: pkcs7,
  }).toString()
}
// 加密解密
export function toEncrypt(value: any) {
  const key = CryptoJS.enc.Utf8.parse(encryptByMd5("_hS2@17_").toUpperCase())
  const password = CryptoJS.enc.Utf8.parse(value)
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export function toDecrypt(value: any) {
  const key = CryptoJS.enc.Utf8.parse(encryptByMd5("_hS2@17_").toUpperCase())
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypted)
}
