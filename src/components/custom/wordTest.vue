<template>
	<div style="display: inline-block; margin-left: 5px;">
		<NButton :color="color">自定义按钮</NButton>
	</div>
</template>

<script>
	import {defineComponent, ref} from 'vue'
	import {NButton} from 'naive-ui'
	export default defineComponent({
		props: {
			color: String
		},
		setup(props) {
			const color = ref(props.color).value;
			return {
				color
			}
		}
	})
</script>

<style>
</style>