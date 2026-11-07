<template>
	<section class="ui-pagination" v-show="total > size">
		<span @click="clickCurrent(1)" :class="{
			disabled: current == 1,
			'page-first': true
		}">&lt;&lt;</span>
		<span @click="clickCurrent(current - 1)" :class="{
			disabled: current == 1,
			'page-prev': true
		}">&lt;</span>
		<span
			v-for="p in setList"
			:key="p.val"
			:class="{
				active: current == p.val,
				'page-num': true
			}"
			@click="clickCurrent(p.val)"
		>{{ p.text }}</span>
		<span @click="clickCurrent(current + 1)" :class="{
			disabled: current == page,
			'page-next': true
		}">&gt;</span>
		<span @click="clickCurrent(page)" :class="{
			disabled: current == page,
			'page-end': true
		}">&gt;&gt;</span>
	</section>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	pagegroup?: number
	total: number
	size: number
	current?: number
	pageInfo?: any
}>(), {
	pagegroup: 5,
	current: 1
})

const emit = defineEmits<{ (e: 'update:current', value: number): void }>()

const page = computed(() => Math.ceil(props.total / props.size))

const setList = computed(() => {
	let len = page.value
	let temp: number[] = []
	let list: { text: string | number; val: number }[] = []
	const count = Math.floor(props.pagegroup / 2)
	let center = props.current
	if (len <= props.pagegroup) {
		while (len--) {
			temp.push(page.value - len)
		}
		return temp.map((t) => ({ text: t, val: t }))
	}
	while (len--) {
		temp.push(page.value - len)
	}
	const idx = temp.indexOf(center)
	idx < count && (center = center + count - idx)
	props.current > page.value - count && (center = page.value - count)
	temp = temp.splice(center - count - 1, props.pagegroup)
	do {
		const t = temp.shift() as number
		list.push({ text: t, val: t })
	} while (temp.length)
	if (page.value > props.pagegroup) {
		if (props.current > count + 1) {
			list.unshift({ text: '...', val: list[0].val - 1 })
		}
		if (props.current < page.value - count) {
			list.push({ text: '...', val: list[list.length - 1].val + 1 })
		}
	}
	return list
})

function clickCurrent (idx: number) {
	if (props.current !== idx && idx > 0 && idx < page.value + 1) {
		emit('update:current', idx)
	}
}
</script>
<style lang="scss" scoped>
.ui-pagination {
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}
.ui-pagination span {
  display: inline-block;
  padding: 6px 15px;
  line-height: 1.5;
  background: #fff;
  color: #526a7a;
  text-decoration: none;
  cursor: pointer;
  transition: 0.15s ease-in-out;
}
.ui-pagination span:hover {
  background-color: #f1f3f4;
}
.ui-pagination span.active {
  background: #428bca;
  color: #fff;
  font-size: 22px;
  cursor: default;
}
.ui-pagination span.active:hover {
  cursor: default;
}
.ui-pagination span.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ui-pagination span.disabled:hover {
  cursor: default;
}
@media screen and (max-width: 600px) {
  .ui-pagination .page-num:not(.active) {
    display: none;
  }
}
</style>
