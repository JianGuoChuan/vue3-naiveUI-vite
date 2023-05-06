<template>
	<div id="table_box" ref="table_box" style="height: calc( 100vh - 180px );">
		<!-- 筛选组 -->
		<n-config-provider :theme-overrides="themeOverThemes">
			<n-card :bordered="false" :content-style="{ padding: 0 }" style="margin-bottom: 5px;">
				<div class="search_content">
					<div style="width: 250px;display: flex;">
						<label style="line-height: 36px;margin-right: 10px;width: 100px;text-align: center;">编号</label>
						<n-input v-model:value="searchData.key" size="small" type="text" placeholder="请输入编号" clearable style="height: 35px;" />
					</div>
					<div style="width: 270px;display: flex;">
						<label style="line-height: 36px;margin-right: 10px;width: 130px;text-align: center;">岗位名称</label>
						<n-input v-model:value="searchData.key" size="small" type="text" placeholder="请输入岗位名称" clearable style="height: 35px;" />
					</div>

					<div class="search_btns_content">
						<div class="search_btn">
							<n-button type="primary" @click="search">
								<template #icon><n-icon :component="nSearch"></n-icon></template>
								<span style="margin-top: 2px;">查询</span>
							</n-button>
						</div>
						<div class="search_btn">
							<n-button type="warning" @click="reset">
								<template #icon><n-icon :component="nRefresh"></n-icon></template>
								<span style="margin-top: 3px;">重置</span>
							</n-button>
						</div>
						<div class="search_btn">
							<n-button type="info" tertiary><span style="margin-top: 3px;">折叠</span></n-button>
						</div>
					</div>
				</div>
			</n-card>
		</n-config-provider>

		<!-- 表格组 -->
		<n-config-provider :theme-overrides="themeOverThemes">
			<n-card :bordered="false" :content-style="{ padding: 0 }" style="border-radius: 0px;padding: 10px;"
				class="vaw-tab-split-side-bar-wrapper" :class="[
					!appConfig.isCollapse ? 'open-status' : 'close-status',
					appConfig.sideTheme === 'image' ? 'sidebar-bg-img' : '',
				]">

				<div style="display: flex;justify-content: space-between;">
					<div>
						<n-button type="primary" style="margin-right: 8px;" @click="add">
							<template #icon><n-icon :component="nAddCircle"></n-icon></template>
							<span style="margin-top: 3px;">新增</span>
						</n-button>
						<n-button type="error" :disabled="deleteBtnState" style="margin-right: 8px;" @click="deletes">
							<template #icon><n-icon :component="nClipboardSharp"></n-icon></template>
							<span style="margin-top: 3px;">删除</span>
						</n-button>
						<n-button type="success" style="margin-right: 8px;" @click="exportTable">
							<template #icon><n-icon :component="nArrowRedo"></n-icon></template>
							<span style="margin-top: 3px;">导出</span>
						</n-button>
					</div>
					<div>
						<n-button strong secondary circle style="margin-right: 8px;" title="刷新" @click="refresh">
							<template #icon>
								<n-icon :component="nRefresh"></n-icon>
							</template>
						</n-button>
						<n-button strong secondary circle title="打印" style="margin-right: 8px;">
							<template #icon>
								<n-icon :component="nPrintOutline"></n-icon>
							</template>
						</n-button>
						<n-button strong secondary circle title="列设置" @click="activate('right')">
							<template #icon>
								<n-icon :component="nOptionsSharp"></n-icon>
							</template>
						</n-button>
					</div>
				</div>
				<div class="table_content">
					<n-data-table :columns="columns" :data="tableData" :single-line="true" :loading="loading"
					max-height="calc( 100vh - 365px )" scroll-x="1500" :sticky-expanded-rows="true" style="width: 100%;"
					:rowKey='rowKey' :on-update:checked-row-keys="tabelSelected" :bordered="true" />
				</div>
				<div class="page_content">
					<n-pagination v-model:page="pagesConfig.page_no" v-model:page-size="pagesConfig.page_size" 
						:item-count="tabelTotal" show-size-picker :page-sizes="pagesConfig.page_sizes" 
						:on-update:page="pageChange" :on-update:page-size="sizeChange" />
				</div>
			</n-card>
		</n-config-provider>
		
		<n-drawer v-model:show="tableContralActive" :width="502" :placement="placement">
   			<n-drawer-content title="列设置" closable>
     			
   			</n-drawer-content>
		</n-drawer>

	</div>
</template>
	
<script lang="ts">
import { defineComponent, reactive, ref, computed, watch, toRef } from 'vue'
import type { DrawerPlacement } from 'naive-ui'
// 图标引入
import { Search as nSearch, Refresh as nRefresh, AddCircle as nAddCircle, ClipboardSharp as nClipboardSharp, ArrowRedo as nArrowRedo, 
	PrintOutline as nPrintOutline, OptionsSharp as nOptionsSharp } from '@vicons/ionicons5'
// 主题相关参数配置引入
import useAppConfigStore from '@/store/modules/app-config'
import { SideTheme, ThemeMode } from '@/store/types'
export default defineComponent({
	props: {
		config: Object, 
		data: Array, 
		pages: Object,
		total: Number,
		rowKeyValue: String, 
		loading: Boolean,
	},
	components: {
    	nSearch,
		nRefresh,
		nAddCircle,
		nClipboardSharp,
		nArrowRedo,
		nPrintOutline,
		nOptionsSharp
	},

	setup(props, context) {
		// 在变量后添加非空断言运算符，也就是感叹号！，有时typescript编译器无法确定它在某一点上可能具有什么类型的值，通过在变量后添加！，可以让编译器知道此变量不会未定义或成为null
		const searchData: any = reactive({});
		// 表格配置项
		const options = ref(props.config!.options).value;
		// 表格数据 toRef: 添加响应式 
		const tableData: Object = toRef(props, 'data');
		const pagesConfig: any =  toRef(props, 'pages');
		const tabelTotal: any = toRef(props, 'total');
		// 多选项容器
		const deleteBtnState = ref(true);
		// 批量删除按钮状态控制
		const selectedData:any = ref([{}]);
		// 抽屉开关
		const tableContralActive = ref(false);
		const placement = ref<DrawerPlacement>('right')
		const activate = (place: DrawerPlacement) => {
			tableContralActive.value = true
      		placement.value = place
		}
		// 监听多选项
		watch(() => props.data, () => { 
			// console.log('监听数据变化成功:', props);
		}); 
		// 监听多选项
		watch(() => selectedData.value, () => { 
			// 选中项是批量删除按钮解除禁用
			if(ref(selectedData).value.length > 0){
				deleteBtnState.value = false;
			}else{
				deleteBtnState.value = true;
			}
		}); 
		// 搜索回调
		const search = () => {
			// 子组件参数传值给父组件， 利用setup第二个参数
			context.emit('search', searchData);
		}
		// 搜索重置回调
		const reset = () => {
			context.emit('reset', {});
		}
		// 新增表格项回调
		const add = () => {
			context.emit('add', {});
		}
		// 表格批量删除回调
		const deletes = () => {
			context.emit('deletes', []);
		}
		// 表格导出回调
		const exportTable = () => {
			context.emit('export', {});
		}
		// 表格多选回调
		const tabelSelected = (keys:any, rows: Object)=> {
			selectedData.value = rows;
		}
		// 刷新回调
		const refresh = ()=>{
			context.emit('refresh', {});
		};
		// 页码切换
		const pageChange = (number:number) => {
			context.emit('pageChange', number);
		};
		// 页大小切换
		const sizeChange = (number:number) => {
			context.emit('sizeChange', number);
		};
		// 主题控制
		const appConfig = useAppConfigStore()
		const themeOverThemes = computed(() => {
			if (appConfig.theme === ThemeMode.DARK) {
				return {}
			}
			if (appConfig.sideTheme === SideTheme.DARK)
				return {
					common: {
						cardColor: '#001428',
						textColor1: '#bbbbbb',
						textColor2: '#bbbbbb',
					},
					Menu: {
						itemColorActive: 'rgba(24, 160, 88, 0.4)',
					},
				}
			if (appConfig.sideTheme === SideTheme.WHITE)
				return {
					common: {
						cardColor: '#ffffff',
					},
				}
			if (appConfig.sideTheme === SideTheme.IMAGE)
				return {
					common: {
						textColor1: '#bbbbbb',
						textColor2: '#bbbbbb',
						primaryColor: '#fff',
					},
					Menu: {
						itemColorActive: 'rgba(24, 160, 88, 0.8)',
						itemTextColorHover: '#f5f5f5',
						itemIconColorHover: '#f5f5f5',
					},
				}
			return {}
		})
		return {
			searchData,
			columns: options,
			tableData,
			pagesConfig,
			tabelTotal,
			deleteBtnState,
			tableContralActive,
			placement,
			selectedData,
			appConfig,
			themeOverThemes,
			rowKey: (row: any) => row[props.rowKeyValue!],
			search,
			reset,
			add,
			deletes,
			exportTable,
			tabelSelected,
			activate,
			refresh,
			pageChange,
			sizeChange,
			nSearch,
			nRefresh,
			nAddCircle,
			nClipboardSharp,
			nArrowRedo,
			nPrintOutline,
			nOptionsSharp
		}
	}
})
</script>

<style scoped lang="scss">
	.search_content{
		padding: 10px 10px 0;
		display: flex;
		flex-wrap: wrap;
	}
	.search_btns_content{
		display: flex;
		flex-wrap: wrap;
		padding-left: 10px;
	}	
	.search_btn{
		display: flex;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.table_content{
		padding: 10px 0 0 0;
		height: 100%;
		box-sizing: border-box;
	}
	.page_content{
		display: flex;
		justify-content: center;
		margin-top: 8px;
	}
	:deep(.n-data-table .n-data-table__pagination){
		padding-bottom: 10px!important;
	}

</style>