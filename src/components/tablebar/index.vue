<template>
	<div style="padding: 10px;">
		<!-- 筛选组 -->
		<div class="searchBar" style="display: flex;flex-wrap: wrap;">
			<div style="margin-right: 10px;margin-bottom: 8px;" v-for="(sItem, sIndex) in columns" :key='sItem.key'>
				<div style="width: 220px;display: flex;"
					v-if="sItem.key && sItem.search && (!sItem.searchType || sItem.searchType == 'text')">
					<label style="line-height: 36px;margin-right: 10px;width: 120px;">{{ sItem.title }}</label>
					<n-input v-model:value="searchData[sItem.key]" :type="sItem.searchType" :placeholder="sItem.title"
						clearable />
				</div>
				<div style="width: 220px;display: flex;" v-if="sItem.key && sItem.search && sItem.searchType == 'select'">
					<label style="line-height: 36px;margin-right: 10px;width: 100px;">{{ sItem.title }}</label>
					<n-select v-model:value="searchData[sItem.key]" :options="sItem.options" clearable />
				</div>
				<div style="width: 220px;display: flex;" v-if="sItem.key && sItem.search && sItem.searchType == 'date'">
					<label style="line-height: 36px;margin-right: 10px;width: 100px;">{{ sItem.title }}</label>
					<n-date-picker v-model:value="searchData[sItem.key]" type="date" clearable />
				</div>
			</div>

			<div style="display: flex;margin-right: 10px;margin-bottom: 10px;">
				<n-button type="primary" @click="search">
					<template #icon><n-icon :component="nSearch"></n-icon></template>
					<span style="margin-top: 2px;">查询</span>
				</n-button>
			</div>
			<div style="display: flex;margin-right: 10px;margin-bottom: 10px;">
				<n-button type="warning" @click="reset">
					<template #icon><n-icon :component="nRefresh"></n-icon></template>
					<span style="margin-top: 3px;">重置</span>
				</n-button>
			</div>
			<div style="display: flex;margin-right: 10px;margin-bottom: 10px;">
				<n-button type="info" tertiary><span style="margin-top: 3px;">折叠</span></n-button>
			</div>

		</div>
		<!-- 表格组 -->
		<n-config-provider :theme-overrides="themeOverThemes">
			<n-card :bordered="false" :content-style="{ padding: 0 }" style="border-radius: 0px;padding: 10px;"
				class="vaw-tab-split-side-bar-wrapper" :class="[
					!appConfig.isCollapse ? 'open-status' : 'close-status',
					appConfig.sideTheme === 'image' ? 'sidebar-bg-img' : '',
				]">
				<div style="margin-bottom: 10px;display: flex;justify-content: space-between;">
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
						<n-button strong secondary circle style="margin-right: 8px;" @click="refresh">
							<template #icon>
								<n-icon :component="nRefresh"></n-icon>
							</template>
						</n-button>
						<n-button strong secondary circle style="margin-right: 8px;">
							<template #icon>
								<n-icon :component="nPrintOutline"></n-icon>
							</template>
						</n-button>
						<n-button strong secondary circle @click="activate('right')">
							<template #icon>
								<n-icon :component="nOptionsSharp"></n-icon>
							</template>
						</n-button>
					</div>
				</div>
				<n-data-table :columns="columns" :data="tableData" :pagination="pagination" :rowKey='rowKey' :on-update:checked-row-keys="tabelSelected" :bordered="true" />
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
import { Search as nSearch, Refresh as nRefresh, AddCircle as nAddCircle, ClipboardSharp as nClipboardSharp, ArrowRedo as nArrowRedo, PrintOutline as nPrintOutline, OptionsSharp as nOptionsSharp } from '@vicons/ionicons5'
// 主题相关参数配置引入
import useAppConfigStore from '@/store/modules/app-config'
import { SideTheme, ThemeMode } from '@/store/types'
// const propss = defineProps({data: Array});
export default defineComponent({
	props: {
		config: Object, data: Array, rowKeyValue: String
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
		const searchData: Object = reactive({});
		// 表格配置项
		const options = ref(props.config!.options).value;
		// 表格数据 toRef: 添加响应式 
		const tableData: Object = toRef(props, 'data');
		// 分页配置
		const paginationReactive = reactive({
			page: 1,
			pageSize: 10,
			showSizePicker: true,
			pageSizes: [10, 20, 50],
			onChange: (page: number) => {
				paginationReactive.page = page
			},
			onUpdatePageSize: (pageSize: number) => {
				paginationReactive.pageSize = pageSize
				paginationReactive.page = 1
			}
		});
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
			console.log('监听数据变化成功:', props);
		}); 
		// 监听多选项
		watch(() => selectedData.value, () => { 
			console.log('多选监听成功:', ref(selectedData).value);
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
			console.log(keys);
			console.log(rows);
			selectedData.value = rows;
		}
		const refresh = ()=>{
			context.emit('refresh', {});
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
			pagination: paginationReactive,
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

<style></style>