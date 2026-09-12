import type { Directive } from 'vue'

// 所有绑定了clickoutside指令的元素的dom对象数组
const nodeList: any[] = []
// 用来做存放于dom对象中clickoutside相关参数对象的key
const ctx = '@@clickoutsideContext'

let startClick: MouseEvent | undefined
let seed = 0

if (typeof document !== 'undefined') {
	// 鼠标按下时，记录此时事件信息
	document.addEventListener('mousedown', (e) => (startClick = e))
	// 鼠标松开时候，遍历绑定clickoutside的节点，进行判断是否在节点外部以触发回调
	document.addEventListener('mouseup', (e) => {
		nodeList.forEach((node) => node[ctx].documentHandler(e, startClick))
	})
}

// 是否在特殊限定范围内
function ifInExact (exactElms: Element[], target1: Element, target2: Element): boolean {
	for (let i = 0; i < exactElms.length; i++) {
		const elm = exactElms[i]
		if (elm.contains(target1) || elm.contains(target2) || elm === target1) return true
	}
	return false
}

// 是否有特殊限定范围
function ifHasExact (el: HTMLElement, exactArea?: string): HTMLCollectionOf<Element> | false {
	if (!exactArea) return false
	return el.getElementsByClassName(exactArea)
}

function createDocumentHandler (el: HTMLElement, binding: any) {
	return function (mouseup: MouseEvent = {} as MouseEvent, mousedown: MouseEvent = {} as MouseEvent) {
		const instance = binding.instance as any
		if (!instance ||
			!mouseup.target ||
			!mousedown.target ||
			(instance.popperElm &&
				(instance.popperElm.contains(mouseup.target) ||
					instance.popperElm.contains(mousedown.target)))) return
		const exactElms = ifHasExact(el, el[ctx].exactArea)
		// 如果是有特殊限定范围的，则进行判断当前点击是否在 限定范围内
		if (exactElms) {
			if (ifInExact(exactElms as unknown as Element[], mouseup.target as Element, mousedown.target as Element)) {
				return
			}
			// 无特殊限定范围，则判断点击是否在默认的指令所在范围内
		} else if (el.contains(mouseup.target as Node) || el.contains(mousedown.target as Node) || el === mouseup.target) {
			return
		}
		if (binding.expression &&
			el[ctx].methodName &&
			instance[el[ctx].methodName]) {
			instance[el[ctx].methodName]()
		} else {
			el[ctx].bindingFn && el[ctx].bindingFn()
		}
	}
}

export default {
	beforeMount (el: HTMLElement, binding: any) {
		nodeList.push(el)
		const id = seed++
		el[ctx] = {
			id,
			documentHandler: createDocumentHandler(el, binding),
			methodName: binding.expression,
			bindingFn: binding.value,
			// 特殊限定范围的class，限定范围为该class的所有元素的并集
			exactArea: binding.arg
		}
	},

	updated (el: HTMLElement, binding: any) {
		el[ctx].documentHandler = createDocumentHandler(el, binding)
		el[ctx].methodName = binding.expression
		el[ctx].bindingFn = binding.value
		// 附加 真正起作用部分
		el[ctx].exactArea = binding.arg
	},

	unmounted (el: HTMLElement) {
		const len = nodeList.length

		for (let i = 0; i < len; i++) {
			if (nodeList[i][ctx].id === el[ctx].id) {
				nodeList.splice(i, 1)
				break
			}
		}
		delete el[ctx]
	}
} as Directive
