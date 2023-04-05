// 定义文件类型 Mime-Type
export type mimes = Record<string, string>
export const defaultMimes: mimes = {
  html: 'text/html',
  js: 'application/x-javascript',
  json: 'application/json',
  css: 'text/css',
  ico: 'image/x-icon',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  rar: 'application/zip',
  zip: 'application/zip',
  pdf: 'application/pdf',
  txt: 'text/plain'
}