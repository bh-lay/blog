<style lang="scss" scoped>
.vue-stick-outer {
  position: relative;
}
.vue-stick-outer .stick-fade-in {
  transition: 0s;
  animation: stickFadeIn 0.5s ease both;
}
@keyframes stickFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
<template>
	<div class="vue-stick-outer" ref="outer" :style="{ height: outerHeight + 'px' }">
		<div
			v-for="item in localList"
			:key="item.id"
			class="vue-stick-item"
			:ref="(el) => setItemRef(el, item)"
			:style="{
				position: item.style.position,
				visibility: item.style.visibility,
				width: Math.round(item.style.width) + 'px',
				top: item.style.top + 'px',
				left: item.style.left + 'px'
			}"
		>
			<slot :data="item.data" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface StickItemStyle {
	position: 'absolute' | 'relative'
	top: number
	left: number
	width: number
	visibility: 'hidden' | 'visible'
}

interface StickItem {
	id: number
	prepared: boolean
	data: any
	style: StickItemStyle
}

const props = withDefaults(defineProps<{
	list?: any[]
	columnWidth?: number
	columnSpacing?: number
	animationClass?: string
	loadTriggerDistance?: number
	imgKey?: string
}>(), {
	list: () => [],
	columnWidth: 280,
	columnSpacing: 10,
	animationClass: 'stick-fade-in',
	loadTriggerDistance: 1000,
	imgKey: ''
})

const emit = defineEmits<{ (e: 'onScrollEnd'): void }>()

const outer = ref<HTMLElement | null>(null)
const localList = ref<StickItem[]>([])
const outerHeight = ref(200)
const outerWidth = ref(-1)
const columnWidthInUse = ref(0)
const columnCount = ref(0)

const itemRefs = new Map<number, HTMLElement>()
let lastRowBottomPosition: number[] = []
let widgetIDMax = 0
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let lastTriggerScrollTime = 0

const setItemRef = (el: any, item: StickItem) => {
	if (el) {
		itemRefs.set(item.id, el as HTMLElement)
	} else {
		itemRefs.delete(item.id)
	}
}

function buildLayout (): boolean {
	const width = outer.value ? outer.value.clientWidth : 0
	if (width !== outerWidth.value) {
		outerWidth.value = width
		lastRowBottomPosition = []
		columnCount.value = Math.max(Math.floor((width + props.columnSpacing) / (props.columnWidth + props.columnSpacing)), 1)
		if (columnCount.value === 1) {
			columnWidthInUse.value = width
		} else {
			columnWidthInUse.value = (width + props.columnSpacing) / columnCount.value - props.columnSpacing
		}
		return true
	}
	return false
}

function refresh (force?: boolean) {
	if (buildLayout() || force) {
		localList.value.forEach((item) => {
			item.style.visibility = 'hidden'
			item.style.width = columnWidthInUse.value
		})
		nextTick(() => {
			lastRowBottomPosition = []
			localList.value.forEach((item) => {
				const el = itemRefs.get(item.id)
				if (item.prepared && el) {
					fixItemPosition(el, item)
				}
			})
		})
	}
}

function fixItemPosition (el: HTMLElement, item: StickItem) {
	if (!el || !item) return
	const clientHeight = el.clientHeight
	let top = 0
	let col: number
	if (lastRowBottomPosition.length < columnCount.value) {
		col = lastRowBottomPosition.length
		lastRowBottomPosition.push(clientHeight)
	} else {
		const minBottom = Math.min.apply(null, lastRowBottomPosition)
		col = lastRowBottomPosition.indexOf(minBottom)
		top = minBottom + props.columnSpacing
	}
	item.style.position = 'absolute'
	item.style.visibility = 'visible'
	item.style.top = top
	item.style.left = col * (columnWidthInUse.value + props.columnSpacing)
	lastRowBottomPosition[col] = top + clientHeight
	outerHeight.value = Math.max.apply(null, lastRowBottomPosition) + props.columnSpacing
}

function waitImgLoaded (src: string, callback?: () => void) {
	if (src) {
		const img = new Image()
		let cb: (() => void) | null = callback || null
		let timer: ReturnType<typeof setInterval>
		const finish = () => {
			clearInterval(timer)
			cb && cb()
			cb = null
		}
		img.onerror = img.onload = finish
		timer = setInterval(() => {
			if (img.width > 1) finish()
		}, 2)
		img.src = src
	} else {
		setTimeout(() => callback && callback(), 0)
	}
}

function addItem (data: any) {
	const item: StickItem = {
		id: widgetIDMax++,
		prepared: false,
		data,
		style: {
			position: 'relative',
			top: 0,
			left: 0,
			width: columnWidthInUse.value,
			visibility: 'hidden'
		}
	}
	localList.value.push(item)
	nextTick(() => {
		const el = itemRefs.get(item.id)
		if (!el) return
		const img = el.querySelector('img')
		waitImgLoaded(img ? img.getAttribute('src') || '' : '', () => {
			item.prepared = true
			el.classList.add(props.animationClass)
			setTimeout(() => el.classList.remove(props.animationClass), 1000)
			fixItemPosition(el, item)
		})
	})
}

function syncList () {
	const list = props.list || []
	const localData = localList.value.map((item) => item.data)
	list.forEach((data) => {
		if (localData.indexOf(data) === -1) addItem(data)
	})
	let changed = false
	for (let i = localData.length - 1; i >= 0; i--) {
		if (list.indexOf(localData[i]) === -1) {
			localList.value.splice(i, 1)
			changed = true
		}
	}
	if (changed) refresh(true)
}

function scrollListener () {
	const now = new Date().getTime()
	if (
		now - lastTriggerScrollTime > 500 &&
		Math.max(document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight + props.loadTriggerDistance >= document.body.scrollHeight
	) {
		emit('onScrollEnd')
		lastTriggerScrollTime = now
	}
}

function resizeListener () {
	if (resizeTimer) clearTimeout(resizeTimer)
	resizeTimer = setTimeout(() => refresh(), 500)
}

onMounted(() => {
	lastRowBottomPosition = []
	document.addEventListener('scroll', scrollListener)
	window.addEventListener('resize', resizeListener)
	buildLayout()
	syncList()
})

onBeforeUnmount(() => {
	document.removeEventListener('scroll', scrollListener)
	window.removeEventListener('resize', resizeListener)
	if (resizeTimer) clearTimeout(resizeTimer)
})

watch(() => props.list, () => syncList())
</script>
