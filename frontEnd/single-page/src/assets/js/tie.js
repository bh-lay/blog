/**
 * @author bh-lay
 * @github https://github.com/bh-lay/tie.js
 * @modified 2015-12-07 18:21
 *
 * 处理既要相对于某个模块固定，又要在其可视时悬浮的页面元素
 * util.tie({
		dom: ,			//需要浮动的元素
		scopeDom: ,		//页面显示时的参照元素
		fixed_top: 20	//悬浮时，距顶部的距离
	})
 *
*/


let privateBody = document.body || document.getElementsByTagName('body')[0]
let docDom = document.compatMode === 'BackCompat' ? privateBody : document.documentElement


function docScrollTop () {
	return docDom.scrollTop || privateBody.scrollTop
}
/**
 * 检测是否为数字
 * 兼容字符类数字 '23'
 **/
function isNum (ipt) {
	return (ipt !== '') && (ipt === +ipt)
}

/**
 * 遍历数组或对象
 *
**/
function each (arr, fn) {
	// 检测输入的值
	if (typeof(arr) !== 'object' || typeof(fn) !== 'function') {
		return
	}
	var Length = arr.length
	if (isNum(Length)) {
		for (var i = 0; i < Length; i++) {
			if (fn.call(this, i, arr[i]) === false) {
				break
			}
		}
	} else {
		for (var key in arr) {
			if (!arr.hasOwnProperty(key)) {
				continue
			}
			if (fn.call(this, key, arr[key]) === false) {
				break
			}
		}
	}
}
/**
* dom设置样式
*/
function setStyle (elem, prop, value) {
	prop = prop.toString()
	if (prop === 'opacity') {
		elem.style.filter = 'alpha(opacity=' + (value * 100) + ')'
	} else if (isNum(value) && prop !== 'zIndex') {
		value = value + 'px'
	}
	elem.style[prop] = value
}
// 设置css
function setCss (doms, cssObj) {
	doms = [].concat(doms)
	each(doms, function (i, dom) {
		each(cssObj, function (key, value) {
			setStyle(dom, key, value)
		})
	})
}
/**
 * 事件绑定
 * elem:节点
 * type:事件类型
 * handler:回调
 **/
var bindHandler = window.addEventListener ? function (elem, type, handler) {
	elem.addEventListener(type, handler, false)
} : function (elem, type, handler) {
	elem.attachEvent('on' + type, handler)
}
/**
* 事件解除
* elem:节点
* type:事件类型
* handler:回调
*/
var removeHandler = window.removeEventListener ? function (elem, type, handler) {
	elem.removeEventListener(type, handler, false)
} : function (elem, type, handler) {
	elem.detachEvent('on' + type, handler)
}
function getClient (elem) {
	var box = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		screenTop: 0,
		screenLeft: 0
	}
	var size = elem.getBoundingClientRect()

	box.width = size.width || (size.right - size.left)
	box.height = size.height || (size.bottom - size.top)
	box.screenTop = size.top
	box.v = size.left

	box.top = size.top + (document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop)
	box.left = size.left + document.body.scrollLeft

	return box
}

// 获取样式
function getStyle (elem, prop) {
	var value
	if (elem.style[prop]) {
		value = elem.style[prop]
	} else if (document.defaultView) {
		var style = document.defaultView.getComputedStyle(elem, null)
		value = prop in style ? style[prop] : style.getPropertyValue(prop)
	} else if (elem.currentStyle) {
		value = elem.currentStyle[prop]
	}

	if (/\px$/.test(value)) {
		value = parseInt(value)
	} else if (isNum(value)) {
		value = Number(value)
	} else if (value === 'auto') {
		if (prop === 'height') {
			value = elem.clientHeight
		} else if (prop === 'width') {
			value = elem.clientWidth
		}
	}
	return value
}

function resetPosition () {
	var me = this
	var scopeClient = getClient(me.scopeDom)
	var scrollTop = docScrollTop()
	var stateBefore = me.state
	var top
	var position

	me.minScrollTop = getClient(me.ghostDom).top - me.fix_top
	me.maxScrollTop = scopeClient.top + scopeClient.height - getClient(me.dom).height - me.fix_top

	if (scrollTop <= me.minScrollTop) {
		me.state = 'min'
		top = 0
		position = 'relative'
	} else if (scrollTop >= me.maxScrollTop) {
		me.state = 'max'
		top = scopeClient.top + scopeClient.height - getClient(me.ghostDom).top - getClient(me.dom).height
		position = 'relative'
	} else {
		me.state = 'mid'
		top = me.fix_top
		position = 'fixed'
	}

	setCss(me.dom, {
		top: top,
		position: position
	})

	if (stateBefore !== me.state) {
		me.onPositionChange && me.onPositionChange(me)
		me.updateGhostDom()
	}
}
function Tie (param) {
	if (!(this instanceof Tie)) {
		return new Tie(param)
	}
	var me = this

	param = param || {}
	// 悬浮时，距顶部的距离
	me.fix_top = param.fixed_top || 0
	me.minScrollTop = null
	me.maxScrollTop = null

	// 悬浮dom
	me.dom = param.dom
	me.scrollDom = param.scrollDom || window
	// 从属dom
	me.scopeDom = param.scopeDom
	// 占位dom
	me.ghostDom = document.createElement('div')

	// 将占位dom放置在悬浮dom前
	me.dom.parentNode.insertBefore(me.ghostDom, me.dom)
	// 再将悬浮dom移入占位dom内
	me.ghostDom.appendChild(me.dom)

	// 当定位方式发生变化时
	me.onPositionChange = param.onPositionChange || null

	me.state = 'min'
	me._scroll_resize_listener = resetPosition.bind(this)

	me.refresh()

	if (getStyle(me.scopeDom, 'position') === 'static') {
		me.scopeDom.style.position = 'relative'
	}
	bindHandler(me.scrollDom, 'scroll', me._scroll_resize_listener)
	bindHandler(window, 'resize', me._scroll_resize_listener)
}
Tie.prototype = {
	refresh: resetPosition,
	updateGhostDom: function () {
		this.ghostDom.style.height = getClient(this.dom).height + 'px'
	},
	destroy: function () {
		removeHandler(this.scrollDom, 'scroll', this._scroll_resize_listener)
		removeHandler(window, 'resize', this._scroll_resize_listener)
		setCss(this.dom, {
			position: 'relative',
			top: getClient(this.dom).top - getClient(this.ghostDom).top
		})
	}
}
export default Tie
