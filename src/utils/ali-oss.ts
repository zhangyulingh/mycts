import mime from "mime"
import OSS from "ali-oss"
import {has} from "lodash-es"
import {UploadUserFile} from "element-plus"
import {toDecrypt, toEncrypt} from "@/utils/cipher"

const bucket: string = "xinhui2017"
const region: string = "oss-cn-hangzhou"
export const basePath: string = "ess"

const accessKeyId: string = toDecrypt("X3bCTS8gsmQPnTHPYrikFJc5QFYLme/FUrf6MSZLhkY=")
const accessKeySecret: string = toDecrypt("DwceAdwNoUUWyDsHUHFF9fa2m/PdK1090nweQtdj4MU=")
export const client = new OSS({
  region,
  accessKeyId,
  accessKeySecret,
  bucket,
  secure: true,
})
const config: {chunkSize: number; basePath: string} = {
  chunkSize: 1024 * 1024 * 50,
  basePath: basePath,
}
const origin: string = `https://${bucket}.${region}.aliyuncs.com/`

export interface OssUploadFile extends UploadUserFile {
  ossKey?: string
}

export function getUrl(path: string, {compressed}: {compressed?: boolean} = {}): string {
  if (path && path !== "null" && path !== "undefined") {
    if (/http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(path)) {
      return path
    } else {
      if (compressed) {
        return client.signatureUrl(path, {
          process: "image/resize,w_200,h_200",
        })
      } else {
        return client.signatureUrl(path)
      }
    }
  } else {
    return path
  }
}

/**
 * 文件列表上传
 * @param fileList 文件列表
 * @param url
 * @param defaultProp
 */
export async function uploadFiles(
  fileList: OssUploadFile[],
  url: boolean,
  defaultProp?: string
): Promise<{name: string; size: number; ossKey: string; sort: number}[]> {
  const promises: Promise<{name: string; size: number; ossKey: string; sort: number}>[] = fileList.map((file: OssUploadFile, index: number) => {
    if (file.status === "ready" || file.status === "fail") {
      file.status = "uploading"
      const ossKey: string = generateOssKey(file)
      const uploadOptions: {progress?: (p: number) => void; parallel?: number; partSize?: number} = {
        progress: function (p: number) {
          file.percentage = p * 100
        },
      }
      const {chunkSize} = config
      // 如果文件大于chunkSize，则采用分片上传
      if (file.size && file.size > chunkSize) {
        uploadOptions.parallel = Math.ceil(file.size / chunkSize)
        uploadOptions.partSize = chunkSize
      }
      return client
        .multipartUpload(ossKey, file.raw, uploadOptions)
        .then((ret: any) => {
          if (ret.res.status === 200) {
            return client.putACL(ossKey, "public-read").then((_ret: any) => {
              file.status = "success"
              file.ossKey = url ? origin + ossKey : ossKey
              if (_ret.res.status === 200) {
                const json = {
                  name: file.name,
                  size: file.size,
                  ossKey: encodeURI(file.ossKey),
                  sort: index,
                }
                if (defaultProp) return Promise.resolve(formatKey(json, defaultProp))
                return Promise.resolve(json)
              } else {
                file.status = "fail"
                return Promise.reject(_ret)
              }
            })
          } else {
            file.status = "fail"
            return Promise.reject(ret)
          }
        })
        .catch((err: any) => {
          file.status = "fail"
          return Promise.reject(err)
        })
    } else {
      const json = {
        name: file.name,
        size: file.size,
        ossKey: url ? file.url : file.ossKey,
        sort: index,
      }
      if (defaultProp) return Promise.resolve(formatKey(json, defaultProp))
      return Promise.resolve(json)
    }
  })
  return Promise.all(promises)
}

/**
 * 单文件上传
 * @param file
 */
export function uploadSingerFile(file: any): Promise<string> {
  const ossKey: string = generateOssKey(file)
  const uploadOptions: {parallel?: number; partSize?: number} = {}
  const {chunkSize} = config
  if (file.size > chunkSize) {
    uploadOptions.parallel = Math.ceil(file.size / chunkSize)
    uploadOptions.partSize = chunkSize
  }
  return client
    .multipartUpload(ossKey, file, uploadOptions)
    .then((ret: any) => {
      if (ret.res.status === 200) {
        return client.putACL(ossKey, "public-read").then((_ret: any) => {
          if (_ret.res.status === 200) {
            return Promise.resolve(origin + encodeURI(ossKey))
          } else {
            return Promise.reject(_ret)
          }
        })
      } else {
        return Promise.reject(ret)
      }
    })
    .catch((err: any) => {
      return Promise.reject(err)
    })
}

// 删除文件
export function delSingerFile(url: string): void {
  url = url.replace(origin, "")
  client.delete(url)
}

function generateOssKey(file: {name: string; type?: any}): string {
  const {basePath} = config
  const ext: string = mime.getExtension(file.type) || file.name.split(".").at(-1)
  const name: string = file.name.replace(/\.[^/.]+$/, "")
  return `${basePath}/${name}_${Date.now()}.${ext}`
}

function formatKey(json: {[key: string]: any}, defaultProp: string): {[key: string]: any} {
  const keys: string[] = defaultProp.split(",")
  const result: {[key: string]: any} = {}
  keys.forEach((key: string) => {
    if (has(json, key)) {
      result[key] = json[key]
    }
  })
  return result
}

//参数1为 dataurl为base64
//参数2为 name为自定义名称
export const base64ToFile = (dataurl: any, name: string) => {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], name, {type: mime})
}
