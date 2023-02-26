/**
 * @author bh-lay
 *
 * get template that we have defined !
 *
 * exports.get(mod_name,{init:true});
 *    {init :true} replace public template
 *    {init :false} return original text
 *
 */

import { componentContext, componentRegisted, Connect } from './types'
import resolveComponent from './component'
/**
 * 获取components 配置
 *
 * @param String input ……<include name="navigation-bootstrap"  active="index"/>……
 * @returns {name:'navigation-bootstrap',active:'index'}
 */
function getComponentsConfig(input: string){
	const strArray = input.match(/<include(.+?)\/>/g) || []
	type objecRecord = Record<string, unknown>
	const confArray: objecRecord[] = []
	strArray.forEach(function(item){
		const data: objecRecord = {}
		// 过滤多余的字符
		item = item.replace(/^<include\s+|"|'|\s*\/>$/g,'')
		// 分离参数
		const dataArray = item.split(/\s+/) || []

		dataArray.forEach(function(it){
			const itemSplit = it.split(/=/)
			const key = itemSplit[0]
			const value = itemSplit[1]
			data[key] = value
		})
		confArray.push(data)
	})
	return confArray
}
export function replaceComponent(
	temp: string,
	componentRegistedRecord: componentRegisted,
	context: componentContext
): Promise<string>{
	const needResolveComponents = getComponentsConfig(temp)
	const temp_result: Record<string, string> = {}

	// 没有用到components
	if(needResolveComponents.length === 0){
		return Promise.resolve(temp)
	}
	const promiseList: Promise<unknown>[] = []
	needResolveComponents.forEach((needResolveComponent) => {
		const componentName = needResolveComponent.name as string
		promiseList.push(resolveComponent(
			componentName,
			needResolveComponent,
			componentRegistedRecord[componentName],
			context
		)
			.then(function(componentStr){
				temp_result[componentName] = componentStr || ''
			})
		)
	})
	return Promise.all(promiseList).then(() => {
		const html = temp.replace(/<include\s+name\s*=\s*(?:"|')(.+?)(?:"|')([^/])*\/>/g, function(includeStr,name){
			return temp_result[name] || includeStr
		})
		return html
	})

}