<template>
	<div>
		<!-- 一个vue3的基础页面组成 -->
		{{ num }}
	</div>
</template>

<script lang="ts">
	// 引入【defineComponent】：在TypeScript下，给予组件正确的参数类型推断；
	import { defineComponent, ref } from 'vue';
	export default defineComponent({
		setup() {
			const res = ref('我是测试数据');
			return {
				num: res
			}
		}
	});
	
	// 常规写法
	// import { ref } from 'vue'
	// export default {
	// 	setup() {
	// 		const res = ref('111');
	// 		return {
	// 			num: res
	// 		}
	// 	}
	// };
</script>

<style>
</style>