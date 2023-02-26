/*
 * @author bh-lay
 *
 *  视图片段生成方式
 * 
 */
import { promises as fs } from 'fs'
import { componentContext, componentFn } from './types'

const baseFileRoot = './src/components/'
// define template Object
export default async function(
	URI: string,
	data: Record<string, unknown>,
	resolveFn: componentFn,
	context: componentContext
): Promise<string>{
	const realPath = baseFileRoot + URI
	// 模版内容
	let componentTemplate = ''
	try {
		componentTemplate = await fs.readFile(realPath + '.html', 'utf8')
	} catch (e) {
		componentTemplate = ''
	}
	// 查找脚本文件
	try {
		if (typeof resolveFn === 'function') {
			return await resolveFn(componentTemplate, data, context)
		} else {
			return componentTemplate
		}
	} catch (e) {
		return componentTemplate
	}
}