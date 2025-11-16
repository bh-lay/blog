<style lang="scss" scoped>
  .line-icon-trigger {
	position: relative;
    display: block;
    width: 44px;
    height: 44px;
	border-color: transparent !important;
    background: transparent !important;
	i {
		display: block;
		position: absolute;
		width: 26px;
		height: 4px;
		right: 8px;
		border-radius: 4px;
		background: #444;
		transition: 0.2s ease-in-out;
		&:nth-child(1) {
			top: 10px;
		}
		&:nth-child(2) {
			top: 19px;
		}
		&:nth-child(3) {
			top: 28px;
		}
	}
	&.active i {
		&:nth-child(1) {
			transform: translateY(9px) rotate(-45deg);
		}
		&:nth-child(2) {
			opacity: 0;
			right: 16px;
		}
		&:nth-child(3) {
			transform: translateY(-9px) rotate(45deg);
		}
	}
  }
</style>
<template>
	<Button class="line-icon-trigger" :class="active ? 'active' : ''" @click="$emit('toggle-display')"><i></i><i></i><i></i></Button>
</template>
<script>

export default {
	props: {
		active: {
			type: Boolean,
			default: false,
		}
	}
}
</script>
