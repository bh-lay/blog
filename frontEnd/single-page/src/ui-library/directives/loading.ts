import { nextTick } from 'vue'
import type { Directive } from 'vue'

const nodeKey = '$loadingNode'
const maskNodeClass = 'ui-loading-layer'
const maskNodeHiddenClass = 'ui-loading-layer-hidden'

function getStyle (elem: Element, prop: string): string {
	const style = window.getComputedStyle(elem, null)
	return prop in style ? (style as any)[prop] : style.getPropertyValue(prop)
}

function toggleVisible (parentNode: any, visible: boolean) {
	const useMethod = visible ? 'remove' : 'add'
	const maskNode = parentNode[nodeKey]
	if (maskNode) {
		maskNode.classList[useMethod](maskNodeHiddenClass)
	} else {
		nextTick(() => {
			toggleVisible(parentNode, visible)
		})
	}
}

export default {
	beforeMount (el: HTMLElement, binding: any) {
		nextTick(() => {
			if (getStyle(el, 'position') === 'static') {
				el.style.position = 'relative'
			}
			const node = document.createElement('div')
			node.innerHTML = '<div><span>正在加载</span></div>'
			node.classList.add(maskNodeClass)
			el.appendChild(node)

			el[nodeKey] = node

			toggleVisible(el, binding.value)
		})
	},

	updated (el: HTMLElement, binding: any) {
		if (binding.value !== binding.oldValue) {
			toggleVisible(el, binding.value)
		}
	}
} as Directive
