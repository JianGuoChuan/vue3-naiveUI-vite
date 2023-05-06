<template>
	<div>
		<Tablebar :config="config" :data="getTableData" rowKeyValue='no' :loading="loading"
			@search="searchTable" @reset="resetSearchTable" @add="addItem" @deletes="deletes" @export="exportTable" @refresh="refreshTable"></Tablebar>
		<!-- v-model ：双向绑定 -->
		<FormBar v-model:show="modalShow" :config="config"></FormBar>
	</div>
</template>

<script lang="ts">
	import { h, defineComponent, reactive, ref, onMounted } from 'vue'
	import { NButton, NSwitch, NTag, NImage, useMessage, useDialog  } from 'naive-ui'
	import {get,Response} from '@/api/http'
	import {getTextList} from '@/api/url'

	// 请求地址  https://twxaapi-3.din-job.com/api/job/page?city=%E9%95%BF%E6%B2%99%E5%B8%82&lat=&lng=112.9889&page_no=1&page_size=20&token=
	
	// 期望表格数据 可替换为接口请求数据
	// const getTableData = ()=>{
	// 	return [
	// 		{no: 92401,name: 'Wonderwall', avotar: 'https://din-fss-pro-prod-1257088705.cos.ap-guangzhou.myqcloud.com/psnl/avatar/6449d8f71ee8ed4e302aea66.gif', age: '19', birthday: '1998-05-06', isrealname: false, state: true, hobby: '打篮球'},
	// 		{no: 92402,name: "Don't Look Back in Anger",age: '18',birthday: '1999-07-31',tags: ['竞技达人', '自闭狂'], isrealname: true, state: false, hobby: '唱歌'},
	// 		{no: 92403,name: 'Champagne Supernova',age: '30',birthday: '2000-09-10', isrealname: false, state: false, hobby: '跳rap'},
	// 		{no: 92404,name: 'tone stark', avotar: 'https://din-fss-pro-prod-1257088705.cos.ap-guangzhou.myqcloud.com/psnl/avatar/6449d8f71ee8ed4e302aea66.gif',age: '22',birthday: '2000-09-10', isrealname: true, state: true, hobby: '看电影'},
	// 		{no: 92405,name: 'hulk',age: '24',birthday: '2000-09-10',tags: ['情绪控制大师', '绿色人种'], address: '纽约客大道豪克杰社区5栋3单元5312', isrealname: true, state: false, hobby: '剧本sha'},
	// 		{no: 92406,name: 'thor',age: '31',birthday: '2000-09-10',tags: ['锤哥', '来个巴西的niu'], address: '阿斯加德主城区001号', isrealname: false, state: true, hobby: '王**耀'},
	// 	]
	// }

	export default defineComponent({
		setup() {
			// 弹框控制
			const modalShow = ref(false);
			// 提示组件
			const message = useMessage();
			const dialog = useDialog();
			// 异步加载表格状态控制
			const loading = ref(false);
			// 响应式数据请使用ref
			let getTableData = ref([]);
			// 生命周期-挂载完成
			onMounted(()=>{
				console.log('mounted');
				getTestDataList();
			});
			// 请求数据
			const getTestDataList = ()=>{
				loading.value = true;
				get({
					url: getTextList,
					data: {
						city: '长沙市',
						lat: '28.07456',
						lng: '112.9889',
						page_no: 1,
						page_size: 10,
						token: '63bf84481ee8e59c469b3f6e'
					},
				}).then(({
					data
				}: Response) => {
					loading.value = false;
					getTableData.value = data.list;
					message.success(
						"loading success!"
					)
					console.log('请求数据data:', getTableData.value);
				}).catch((error) => {
					loading.value = false;
					console.log('error:', error);
				})
			};
			// 行编辑
			const play = (row: Object)=>{
				console.log(row);
				modalShow.value = true;
			}
			// 行删除
			const remove = (row: Object) => {
				console.log(row);
				dialog.warning({
					title: '警告',
					content: '确定删除此项数据吗？',
					positiveText: '确定',
					negativeText: '点错了',
					onPositiveClick: () => {
						message.success('成功删除')
					},
					onNegativeClick: () => {
						message.error('取消删除')
					}
				})
			}
			// 状态切换
			const changeState = (row: Object) => {
				console.log(row);
				dialog.warning({
					title: '提示',
					content: `是否切换【${row.name}】用户状态?`,
					positiveText: '确定',
					negativeText: '暂不',
					onPositiveClick: () => {
						row.isrealname = !row.isrealname
					},
					onNegativeClick: () => {
						message.error('取消切换')
					}
				})
			}
			// 搜索
			const searchTable = (searchData: Object) => {
				console.log('搜索参数:',searchData);
			}
			// 搜索重置
			const resetSearchTable = (searchData: Object) => {
				console.log('搜索重置:', searchData);
			}
			// 新增表格项
			const addItem = () => {
				console.log('新增表格项:');
				modalShow.value = true;
			}
			// 表格批量删除
			const deletes = (deleteItems: Object) => {
				console.log('表格批量删除:', deleteItems);
				dialog.warning({
					title: '警告',
					content: '确定删除所有选中数据吗？',
					positiveText: '确定',
					negativeText: '点错了',
					onPositiveClick: () => {
						message.success('成功删除')
					},
					onNegativeClick: () => {
						message.error('取消删除')
					}
				})
			}
			// 导出表格
			const exportTable = (exportConfig: Object) => {
				console.log('导出表格:',exportConfig);
				dialog.success({
					title: '警告',
					content: '确定要导出符合条件的内容吗？',
					positiveText: '确定',
					negativeText: '再看看',
					onPositiveClick: () => {
						message.success('成功导出')
					},
					onNegativeClick: () => {
						message.error('取消导出')
					}
				})
			}
			// 刷新表格
			const refreshTable = () => {
				getTestDataList();
			}
			return {
				// 表格配置项
				config: reactive({
					options: [
						{type: 'selection'}, // 多选框预留项
						{title: '编号',key: 'job_no', hide: true, width: 120 },
						{title: '岗位名称',key: 'job_name', width: 210, ellipsis: { tooltip: true }, search: true,hide: false, searchType: 'text', formShow: true},
						{title: '岗位海报',key: 'cmp_logo_thumb_url', width: 100, search: false,hide: false, searchType: 'image',  formShow: true,
							render(row: any){ return h(NImage, {style: {borderRadius: '50%'}, src: row.cmp_logo_thumb_url!, width: '50', height: '50' } ) } },
						{title: '薪资',key: 'settle_salary', width: 150, search: false,hide: true, searchType: 'checkbox', formShow: true, formType: 'number',  
							sorter: (row1: any, row2: any) => row1.age - row2.age},
						{title: '工作类型',key: 'settle_type', width: 150, search: false,hide: true, searchType: 'checkbox', formShow: true, 
							sorter: (row1: any, row2: any) => row1.age - row2.age},
						{title: '发布时间',key: 'job_end_date', search: true, searchType: 'date', width: 120},
						{title: '供应商名称',key: 'supplier_name', search: true, searchType: 'text', width: 150, ellipsis: { tooltip: true } },
						{title: '岗位标签',key: 'tags', render (row: any) { const tags = row.tags && row.tags.length > 0 
							? row.tags.map((tagKey: any) => {return h(NTag,{style: {marginRight: '6px'},type: 'info',bordered: false},{default: () => tagKey})}) 
							: []; 
							return tags }  
						},
						{title: '是否实名',key: 'cmp_supplier_the_same_flg', width: 100, render(row: any) { return h( NSwitch, { value: row.isrealname, onClick: ()=>{ changeState(row) } } ) } },
						{title: '状态',key: 'health_flg', width: 100, render(row: any) { return h( NTag, { type: row.state ? 'success' : 'error', } , { default: () => row.state ? '启用' : '禁用' } ) } },
						{title: '操作',key: 'actions', width: 180, render(row: any) {return [
							h(NButton, {type: 'primary', strong: true,tertiary: false,size: 'small',onClick: () => play(row)}, {default: () => '编辑'}),
							h(NButton, {type: 'error', strong: true,tertiary: false,size: 'small',onClick: () => remove(row)}, {default: () => '删除'}),
						]}}
					]
				}),
				getTableData,
				formConfig: ref([]),
				getTestDataList,
				play,
				remove,
				changeState,
				searchTable,
				resetSearchTable,
				addItem,
				deletes,
				exportTable,
				refreshTable,
				modalShow,
				loading,
			}
		}
	})
</script>

<style>
</style>
