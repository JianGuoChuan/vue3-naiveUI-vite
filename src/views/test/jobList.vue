<template>
	<div>
		<Tablebar :config="config" :data="getTableData" rowKeyValue='job_no' :pages="pages" :total="total" :loading="loading" height="100vh - 250px"
            @refresh="refreshTable" @pageChange="pageChange" @sizeChange="sizeChange"></Tablebar>
	</div>
</template>

<script lang="ts">
	import { h, defineComponent, reactive, ref, onMounted } from 'vue'
	import { NButton, NSwitch, NTag, NImage, useMessage, useDialog, NGradientText  } from 'naive-ui'
	import { get, Response } from '@/api/http'
    import { getTextList } from '@/api/url'
	export default defineComponent({
		setup() {
			const message = useMessage();
			const dialog = useDialog();
			const loading = ref(false);
            const pages = ref({
                page_no: 1,
                page_size: 10,
                page_sizes: [10, 20, 30, 50, 100]
            });
            let total = ref(0);
			let getTableData = ref([]);
			onMounted(()=>{
				getJobDataList(0);
			});
			const getJobDataList = (state:number)=>{
				loading.value = true;
				get({
					url: getTextList,
					data: {
						city: '长沙市',
						lat: '28.07456',
						lng: '112.9889',
						page_no: pages.value.page_no,
						page_size:  pages.value.page_size,
						token: '63bf84481ee8e59c469b3f6e'
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
            // 行编辑
			const edit = (row: Object)=>{
				console.log(row);
				// modalShow.value = true;
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
            // 刷新表格
			const refreshTable = () => {
				getJobDataList(1);
			}
            // 页码切换
            const pageChange = (page: number) => {
                pages.value.page_no = page;
                getJobDataList(0);
            };
            // 页大小切换
            const sizeChange = (size: number) => {
                pages.value.page_size = size;
                getJobDataList(0);
            };
			return {
				config: reactive({
					options: [
						{ type: 'selection' },
						{ title: '编号', key: 'job_no', width: 120, },
						{ title: '岗位名称', key: 'job_name', width: 150, ellipsis: { tooltip: true },
                             render (row: any) {    
                                return h( NGradientText, 
                                     { value: row.isrealname, title: '查看岗位详情', style: {fontWeight: '700', cursor: 'pointer'}, onClick: ()=>{  } }, 
                                    {default: () => row.job_name }
                                )
                            } 
                        },
						{ title: '岗位薪资', key: 'settle_salary', width: 100,},
						{ title: '工作类型', key: 'settle_type', width: 100,},
                        { title: '岗位标签',key: 'tags', width: 180,
                            render (row: any) {    
                                const tags = row.tags && row.tags.length > 0 
                                    ? row.tags.map((tagKey: any) => { return h( NTag, {style: {marginRight: '6px',marginBottom: '3px'},type: 'primary',bordered: false},{default: () => tagKey})}) 
                                    : []; 
                                return tags 
                            }  
						},
						{ title: '供应商', key: 'supplier_name', width: 180, ellipsis: { tooltip: true },},
						{ title: '供应商LOGO', key: 'supplier_logo_thumb_url', width: 100, 
                            render(row: any) { return h( NImage, {style: { borderRadius: '50%' }, src: row.cmp_logo_thumb_url!, width: '50', height: '50' } ) } },
						{title: '审核是否通过', key: 'cmp_supplier_the_same_flg', width: 100, 
                            render(row: any) { return h( NSwitch, { value: row.cmp_supplier_the_same_flg, onClick: ()=>{ changeState(row) } } ) } },
						{title: '状态',key: 'cmp_supplier_the_same_flg', width: 100, 
                            render(row: any) { return h( NTag, 
                                    { type: row.cmp_supplier_the_same_flg ? 'success' : 'error', } , 
                                    { default: () => row.cmp_supplier_the_same_flg ? '启用' : '禁用' } 
                                ) 
                            } 
                        },
						{title: '操作',key: 'actions', width: 180, fixed: 'right', align: 'center', render(row: any) {return [
							h(NButton, {type: 'primary', strong: true,tertiary: false,size: 'small',onClick: () => edit(row)}, {default: () => '编辑'}),
							h(NButton, {type: 'error', strong: true,tertiary: false,size: 'small',onClick: () => remove(row)}, {default: () => '删除'}),
						]}}
					]
				}),
				getTableData,
				loading,
                pages,
                total,
				getJobDataList,
                edit,
                remove,
                changeState,
                refreshTable,
                pageChange,
                sizeChange,
			}
		}
	})
</script>

<style>
</style>
