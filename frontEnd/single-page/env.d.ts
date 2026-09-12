/// <reference types="vite/client" />

// 由 vite.config.ts 中的 define 注入
declare const CDN_PATH: string

// 无内置类型声明的第三方依赖
declare module 'md5' {
  const md5: (input: string) => string
  export default md5
}

declare module 'qrcode' {
  const QRCode: any
  export default QRCode
}

declare module 'weixin-js-sdk' {
  const wx: any
  export default wx
}
