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
	let strArray = input.match(/<include(.+?)\/>/g) || []
	type objecRecord = Record<string, unknown>
	let confArray: objecRecord[] = []
	strArray.forEach(function(item){
		var data: objecRecord = {}
		// 过滤多余的字符
		item = item.replace(/^<include\s+|"|'|\s*\/>$/g,'')
		// 分离参数
		var dataArray = item.split(/\s+/) || []

		dataArray.forEach(function(it){
			var itemSplit = it.split(/=/)
			var key = itemSplit[0]
			var value = itemSplit[1]
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
	let needResolveComponents = getComponentsConfig(temp)
	let temp_result: Record<string, string> = {}

	// 没有用到components
	if(needResolveComponents.length === 0){
		return Promise.resolve(temp)
	}
	const promiseList: Promise<unknown>[] = []
	needResolveComponents.forEach((needResolveComponent) => {
		var componentName = needResolveComponent.name as string
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
		var html = temp.replace(/<include\s+name\s*=\s*(?:"|')(.+?)(?:"|')([^/])*\/>/g, function(includeStr,name){
			return temp_result[name] || includeStr
		})
		return html
	})

}