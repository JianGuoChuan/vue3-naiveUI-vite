<template>
	<div>
		<!-- 表格组件 -->
		<Tablebar :config="config" :data="getTableData" rowKeyValue='job_no' :pages="pages" :total="total" :loading="loading"
            @refresh="refreshTable" @pageChange="pageChange" @sizeChange="sizeChange" @add="addItem" @deletes="deletes" @export="exportTable" 
			@search="searchData" @reset="resetData"></Tablebar>
		<!-- 表单组件 -->
		<!-- v-model ：双向绑定 -->
		<FormBar v-model:show="modalShow" :config="config" :rules="rules" :operState="operState" @confirm="submit"></FormBar>
	</div>
</template>


<script lang="ts">
	import { h, defineComponent, reactive, ref, onMounted } from 'vue'
	// 组件引入
	import { NButton, NSwitch, NTag, NImage, useMessage, useDialog, NGradientText  } from 'naive-ui'
	// 请求方法引入
	import { get, Response } from '@/api/http'
	// 请求api引入
    import { getTextList } from '@/api/url'

	// 请求地址  https://twxaapi-3.din-job.com/api/job/page?city=长沙市&lat=&lng=112.9889&page_no=1&page_size=20&token=
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
			// message 对话框初始化 用于消息确认
			const message = useMessage();
			// dialog 对话框初始化 用于消息确认
			const dialog = useDialog();
			// 表格的异步加载状态控制，响应式数据请使用ref
			const loading = ref(false);
			// 表单的显隐控制，响应式数据请使用ref
			const modalShow = ref(false);
			// 表单操作状态，主要用于区分表单是创建还是编辑状态 0：新增，1：编辑
			let operState = ref(0);
			// 表格配置化
			const config = ref({
				height: 'calc( 100vh - 365px )',
				options: [
					{ type: 'selection' }, // 多选框预留项
					{ title: '编号', key: 'job_no', width: 120, },
					{ title: '岗位名称', key: 'job_name', width: 150, ellipsis: { tooltip: true }, formShow: true, formType: 'text', search: true, searchKey: 'keyword',
						render (row: any) { return h( NGradientText, 
								{ value: row.isrealname, title: '查看岗位详情', style: {fontWeight: '700', cursor: 'pointer'}, onClick: ()=>{  } }, 
								{ default: () => row.job_name }
							)
						} 
					},
					{ title: '岗位薪资', key: 'settle_salary', width: 100, formShow: true, search: true, searchKey: 'settle_salary'},
					{ title: '工作类型', key: 'settle_type', width: 100, formShow: true, formType: 'select', search: true, searchKey: 'settle_type', searchType: 'select', dic: [
						{label: '月结', value: '月结'},{ label: '日结', value: '日结' }, { label: '计件', value: '计件' }
					]},
					{ title: '岗位标签',key: 'tags', width: 180, search: true, searchKey: 'tags',
						render (row: any) {    
							const tags = row.tags && row.tags.length > 0 
								? row.tags.map((tagKey: any) => { return h( NTag, {style: {marginRight: '6px',marginBottom: '3px'},type: 'primary',bordered: false},{default: () => tagKey})}) 
								: []; 
							return tags 
						}  
					},
					{ title: '供应商', key: 'supplier_name', width: 180, ellipsis: { tooltip: true }, search: true, searchKey: 'supplier_name'},
					{ title: '供应商LOGO', key: 'supplier_logo_thumb_url', width: 100,
						render(row: any) { return h( NImage, {style: { borderRadius: '50%' }, src: row.cmp_logo_thumb_url!, width: '50', height: '50' } ) } },
					{ title: '审核是否通过', key: 'cmp_supplier_the_same_flg', width: 100, 
						render(row: any) { return h( NSwitch, { value: row.cmp_supplier_the_same_flg, onClick: ()=>{ changeState(row) } } ) } },
					{ title: '岗位状态',key: 'cmp_supplier_the_same_flg', width: 100, search: true, searchKey: 'cmp_supplier_the_same_flg',searchType: 'select', dic: [
							{label: '启用', value: 1},{ label: '禁用', value: 2 },
						],
						render(row: any) { return h( NTag, 
								{ type: row.cmp_supplier_the_same_flg ? 'success' : 'error', } , 
								{ default: () => row.cmp_supplier_the_same_flg ? '启用' : '禁用' } 
							) 
						} 
					},
					{ title: '可服务时间', key: 'job_service_date_to_disp', width: 180, ellipsis: { tooltip: true }, search: true, searchKey: 'job_service_date_to_disp', searchType: 'datetime',
						formShow: true, formType: 'datetime', timeMode: 'daterange', valueFormat: "yyyy.MM.dd", },
					{ title: '操作',key: 'actions', width: 180, fixed: 'right', align: 'center', render(row: any) {return [
						h(NButton, {type: 'primary', strong: true,tertiary: false,size: 'small',onClick: () => edit(row)}, {default: () => '编辑'}),
						h(NButton, {type: 'error', strong: true,tertiary: false,size: 'small',onClick: () => remove(row)}, {default: () => '删除'}),
					]}}
				]
			})
			// 表单校验规则
			const rules = reactive({
				job_name: {
					required: true,
					trigger: ['blur', 'input'],
					message: '请输入岗位名称'
				},
				settle_salary: {
					required: true,
					trigger: ['blur', 'input'],
					message: '请输入岗位薪资'
				},
				settle_type: {
					required: true,
					trigger: ['blur', 'change'],
					message: '请选择岗位类型'
				},
			});
			// 表格数据分页配置
            const pages = ref({
                page_no: 1,
                page_size: 10,
                page_sizes: [10, 20, 30, 50, 100]
            });
			// 表格项总数
            let total = ref(0);
			// 表格数据容器
			let getTableData = ref([]);
			// 生命周期 挂载完成
			onMounted(()=>{
				getJobDataList(0, {});
			});
			// 方法：获取表格数据
			const getJobDataList = (state:number, param: any)=>{
				loading.value = true;
				get({
					url: getTextList,
					data: {
						city: '长沙市',
						lat: '28.07456',
						lng: '112.9889',
						page_no: pages.value.page_no,
						page_size:  pages.value.page_size,
						token: '63bf84481ee8e59c469b3f6e',
						...param
					},
				}).then(({
					data
				}: Response) => {
					loading.value = false;
					getTableData.value = data.list;
                    total.value = data.totalRow;
                    if(state){
                        message.success("刷新成功")
                    }
				}).catch((error) => {
					loading.value = false;
					console.log('error:', error);
				})
			};
            // 方法：行编辑
			const edit = (row: any)=>{
				operState.value = 1;
				// key值匹配设置编辑默认值
				for(const key in row){
					config.value.options.map( (item: any) => {
						if(item.formShow && item.key == key){
							item.value = row[key];
						}
					})
				}
				modalShow.value = true;
			}
			// 方法：行删除
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
			// 方法：表单提交
			const submit = (submitData: any) => {
				console.log('submitData', submitData);
				message.success('编辑成功')
			};
			// 方法：新增表格项
			const addItem = () => {
				operState.value = 0;
				config.value.options.map( (item: any) => {
					if(item.formShow){
						item.value = null;
					}
				});
				modalShow.value = true;
			}
			// 方法：表格批量删除
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
			// 方法：导出表格
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
            // 方法：状态切换
			const changeState = (row: any) => {
				console.log(row);
				dialog.warning({
					title: '提示',
					content: `是否切换【${row.job_name}】审核状态?`,
					positiveText: '确定',
					negativeText: '暂不',
					onPositiveClick: () => {
						row.cmp_supplier_the_same_flg = !row.cmp_supplier_the_same_flg
					},
					onNegativeClick: () => {
						message.error('取消切换')
					}
				})
			}
			// 方法：表格项搜索
			const searchData = (search: any) => {
				pages.value.page_no = 1;
                getJobDataList(0, search);
			};
			// 方法：表格项搜索重置
			const resetData = (search: any) => {
				pages.value.page_no = 1;
                getJobDataList(0, search);
			};
            // 方法：刷新表格
			const refreshTable = () => {
				getJobDataList(1, {});
			}
            // 方法：表格页码切换
            const pageChange = (page: number) => {
                pages.value.page_no = page;
                getJobDataList(0, {});
            };
            // 方法：表格页大小切换
            const sizeChange = (size: number) => {
                pages.value.page_size = size;
                getJobDataList(0);
            };
			// 内容导出
			return {
				config,
				rules,
				getTableData,
				modalShow,
				loading,
				operState,
                pages,
                total,
				getJobDataList,
                edit,
                remove,
				submit,
                changeState,
				addItem,
				deletes,
				exportTable,
                refreshTable,
				searchData,
				resetData,
                pageChange,
                sizeChange,
			}
		}
	})
</script>

<style>
</style>
