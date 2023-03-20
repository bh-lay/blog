
import { Connect } from '@/core/index'
import { base64Decode } from '@/lib/utils'

const assetPath = '../static/'

export function base64PathToAbsolute (pathBase64: string) {
  // 转换成正常路径
  const realPath = base64Decode(pathBase64)
  // 转换成可操作路径
  return relativePathToAbsolute(realPath)
}
// 校验路径是否合法，并返回合法路径
export function relativePathToAbsolute (realPath: string) {
  // 屏蔽非法请求
  realPath = realPath.replace(/\.\.\//g,'')
  return assetPath + realPath.replace(/^\/|\/$/g,'')
}

// 校验是否有权限操作
export async function hasPermission (connect: Connect) {
  const sessionInstance = await connect.session()
  const userGroup = sessionInstance.get('user_group')
  return userGroup === 'admin'
}
