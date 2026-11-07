<template>
	<a
		v-if="href"
		:class="[`ui-button-${type}`, type !== 'text' ? `ui-button-${size}` : '']"
		:href="href"
		:target="target"
		@click="$emit('click', $event)"
	>
		<slot />
	</a>
	<button
		v-else
		:class="[`ui-button-${type}`, type !== 'text' ? `ui-button-${size}` : '']"
		@click="$emit('click', $event)"
	>
		<slot />
	</button>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
	type?: string
	href?: string
	target?: string
	size?: string
}>(), {
	type: 'default',
	href: '',
	target: '_blank',
	size: 'middle'
})

defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>
<style lang="scss" scoped>
button,
a {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: bottom;
  margin: 0;
  padding: 0;
  outline: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  transition: 0.1s;
  font-weight: 500;
}
button:disabled,
a:disabled {
  pointer-events: none;
}
.ui-button-small {
  min-height: 30px;
  padding: 8px 10px;
  font-size: 12px;
}
.ui-button-middle {
  padding: 12px 20px;
  font-size: 14px;
}
.ui-button-large {
  padding: 18px 30px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
}
.ui-button-text {
  border: none;
  background: transparent;
  font-size: 14px;
}
.ui-button-text:hover {
  text-decoration: underline;
}
.ui-button-text:disabled {
  color: #333;
}
.ui-button-ghost {
  border-color: transparent;
  background: transparent;
  color: #606266;
}
.ui-button-ghost:hover {
  border-color: #7a9fb8;
}
.ui-button-ghost:disabled {
  color: #333;
}
.ui-button-default {
  border-color: #dcdfe6;
  background: #fff;
  color: #606266;
}
.ui-button-default:hover {
  border-color: #7a9fb8;
  color: #09f;
}
.ui-button-default:disabled {
  border-color: #888;
  color: #888;
}
.ui-button-primary {
  border-color: transparent;
  background: #09f;
  color: #fff;
}
.ui-button-primary:hover {
  background: #09f;
}
.ui-button-primary:disabled {
  background: #aaa;
}
</style>
