<template>
	<div style="padding: 10px;">
		<div class="searchBar" style="display: flex;flex-wrap: wrap;">
			<div style="margin-right: 10px;margin-bottom: 8px;" 
				v-for="(sItem, sIndex) in columns" :key='sItem.key'>
				<div style="width: 220px;display: flex;" v-if="sItem.key && sItem.search && (!sItem.searchType || sItem.searchType == 'text')">
					<label style="line-height: 32px;margin-right: 10px;">{{ sItem.title }}</label>
					<n-input v-model:value="searchData[sItem.key]" :type="sItem.searchType" :placeholder="sItem.title" clearable />
				</div>
				<div style="width: 220px;display: flex;" v-if="sItem.key && sItem.search && sItem.searchType == 'select'">
					<label style="line-height: 32px;margin-right: 10px;">{{ sItem.title }}</label>
					 <n-select v-model:value="searchData[sItem.key]" :options="sItem.options" clearable />
				</div>
				<div style="width: 220px;display: flex;" v-if="sItem.key && sItem.search && sItem.searchType == 'date'">
					<label style="line-height: 32px;margin-right: 10px;">{{ sItem.title }}</label>
					<n-date-picker v-model:value="searchData[sItem.key]" type="date" clearable />
				</div>
			</div>
			
			<div style="display: flex;margin-right: 10px;margin-bottom: 10px;">
				<n-button type="primary" :render-icon="renderIcon"> 查询 </n-button>
			</div>
			<div style="display: flex;margin-right: 10px;margin-bottom: 10px;">
				<n-button type="warning" :render-icon="renderIcon"> 重置 </n-button>
			</div>
			<div style="display: flex;margin-right: 10px;margin-bottom: 10px;">
				<n-button type="primary" tertiary > 折叠 </n-button>
			</div>
			
		</div>
		<n-data-table :columns="columns" :data="tableData" :pagination="pagination" :rowKey='rowKey' :bordered="true" />
	</div>
</template>
	
<script lang="ts">
	import { h, defineComponent, reactive, ref } from 'vue'
	import { CashOutline as CashIcon } from '@vicons/ionicons5'
	const model = ref({
		inputValue: null,
	});
	export default defineComponent({
		components: { CashIcon },
		props: {
			config: Object, data: Array, rowKeyValue: String, itemTypes: Object
		},
		setup(props) {
			// 在变量后添加非空断言运算符，也就是感叹号！，有时typescript编译器无法确定它在某一点上可能具有什么类型的值，通过在变量后添加！，可以让编译器知道此变量不会未定义或成为null
			const searchData = reactive({});
			const options = ref(props.config!.options).value;
			const tableData = ref(props.data).value;
			const paginationReactive = reactive({
				page: 1,
				pageSize: 5,
				showSizePicker: true,
				pageSizes: [3, 5, 7],
				onChange: (page: number) => {
					paginationReactive.page = page
				},
				onUpdatePageSize: (pageSize: number) => {
					paginationReactive.pageSize = pageSize
					paginationReactive.page = 1
				}
			})
			return {
				searchData,
				renderIcon () {
					return h(CashIcon)
				},
				columns: options,
				tableData, 
				pagination: paginationReactive,
				rowKey: (row: any) => row[props.rowKeyValue!],
				timestamp: ref(1183135260000),
				model
			}
		}
	})
</script>

<style>
</style>