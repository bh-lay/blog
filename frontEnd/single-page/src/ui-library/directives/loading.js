
import Vue from 'vue'

const nodeKey = '$loadingNode'
const maskNodeClass = 'ui-loading-layer'
const maskNodeHiddenClass = 'ui-loading-layer-hidden'

function getStyle (elem, prop) {
	var style = window.getComputedStyle(elem, null)
	return prop in style ? style[prop] : style.getPropertyValue(prop)
}

function toggleVisible (parentNode, visible) {
	let useMethod = visible ? 'remove' : 'add'
	let maskNode = parentNode[nodeKey]
	if (maskNode) {
		maskNode.classList[useMethod](maskNodeHiddenClass)
	} else {
		Vue.nextTick(() => {
			toggleVisible(parentNode, visible)
		})
	}
}
export default {
	bind (el, binding, vnode) {
		Vue.nextTick(() => {
			if (getStyle(el, 'position') === 'static') {
				el.style.position = 'relative'
			}
			let node = document.createElement('div')
			node.innerHTML = '<div><span>正在加载</span></div>'
			node.classList.add(maskNodeClass)
			el.appendChild(node)

			el[nodeKey] = node

			toggleVisible(el, binding.value)
		})
	},

	update (el, binding, vnode) {
		if (binding.value !== binding.oldValue) {
			toggleVisible(el, binding.value)
		}
	}
}
