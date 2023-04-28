<template>
	<div>
		<Tablebar :config="config" :data="data" rowKeyValue='no'></Tablebar>
		<FormBar v-model:show="modalShow" :config="formConfig"></FormBar>
		<!-- v-model ：双向绑定 -->
	</div>
</template>

<script lang="ts">
	import { h, defineComponent, reactive, ref } from 'vue'
	import { NButton, NSwitch, NTag } from 'naive-ui'
	const getTableData = ()=>{
		return [
			{no: 92401,name: 'Wonderwall',age: '>18', birthday: '1998-05-06', isrealname: false, state: true, hobby: '打篮球'},
			{no: 92402,name: "Don't Look Back in Anger",age: '<=18',birthday: '1999-07-31', isrealname: true, state: false, hobby: '唱歌'},
			{no: 92403,name: 'Champagne Supernova',age: '>30',birthday: '2000-09-10', isrealname: false, state: false, hobby: '跳rap'},
			{no: 92404,name: 'tone stark',age: '>30',birthday: '2000-09-10', isrealname: true, state: true, hobby: '看电影'},
			{no: 92405,name: 'hulk',age: '>30',birthday: '2000-09-10', isrealname: true, state: false, hobby: '剧本sha'},
			{no: 92406,name: 'thor',age: '>30',birthday: '2000-09-10', isrealname: false, state: true, hobby: '王**耀'},
		]
	}
	
	export default defineComponent({
		setup() {
			const modalShow = ref(false);
			// 行编辑
			const play = (row: any)=>{
				console.log(row);
				modalShow.value = true;
				// formConfig.value= row;
				// formConfig.map(( item, index ) => {
				// 	console.log(item);
				// });
			}
			// 行删除
			const remove = (row: any)=>{
				console.log(row);
				// formConfig.value= row;
			}
			return {
				config: reactive({
					options: [
						{type: 'selection'},
						{title: 'No.',key: 'no'},
						{title: 'Name',key: 'name', search: true, searchType: 'text'},
						{title: 'Age',key: 'age', search: false, searchType: 'checkbox'},
						{title: 'Birthday',key: 'birthday', search: true, searchType: 'date'},
						{title: 'IsRealName',key: 'isrealname', render(row: any) { return h( NSwitch, { value: row.isrealname } ) } },
						{title: 'State',key: 'state', render(row: any) { return h( NTag, { type: row.state ? 'success' : 'error', } , { default: () => row.state ? '启用' : '禁用' } ) } },
						{title: 'Hobby',key: 'hobby', search: true, searchType: 'select', options: [ {label: "打篮球",value: 'playBall',disabled: true},{label: '唱歌',value: 'song'}] },
						{title: 'Action',key: 'actions', render(row: any) {return [
							h(NButton, {type: 'primary', strong: true,tertiary: false,size: 'small',onClick: () => play(row)}, {default: () => 'Play'}),
							h(NButton, {type: 'error', strong: true,tertiary: false,size: 'small',onClick: () => remove(row)}, {default: () => 'Delete'})
						]}}
					]
				}),
				data: getTableData(),
				formConfig: ref([]),
				play,
				remove,
				modalShow,
			}
		}
	})
</script>

<style>
</style>
