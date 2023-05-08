<template>
	<div style="padding: 10px;">
		<n-modal v-model:show="modalShow" :on-after-leave="onAfterLeave" title="编辑" :segmented="segmented" preset="dialog" :mask-closable='false'
			style="width: 60vw;top: -10vh;">
			<div style="width: 100%;border-radius: 15px;padding: 20px;">
				 <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :size="size" >
					<n-grid x-gap="12" :cols="2">
						<n-gi v-for="fItem in formData" :key='fItem.prop'>
							<n-form-item :label="fItem.label" :path="fItem.prop" v-if="!fItem.type || fItem.type == 'text'">
								<n-input v-model:value="formValue[fItem.prop]" :placeholder="`请输入${fItem.label}`" clearable />
							</n-form-item>
							<n-form-item :label="fItem.label" :path="fItem.prop" v-if="fItem.type == 'select'">
								<n-select v-model:value="formValue[fItem.prop]" :placeholder="`请选择${fItem.label}`" :options="fItem.dic" clearable />
							</n-form-item>
							<n-form-item :label="fItem.label" :path="fItem.prop" v-if="fItem.type == 'datetime'">
								<n-date-picker v-model:value="formValue[fItem.prop]" :type="fItem.timeMode || 'datetime'" :value-format="fItem.valueFormat"
									:placeholder="`请选择${fItem.label}`" clearable
									style="width: 100%;" />
							</n-form-item>
					    </n-gi>
					</n-grid>
				</n-form>
			</div>
			<template #action>
				<n-button type="warning" @click="cancelCallback">
					取消
				</n-button>
				<n-button type="primary" @click="submitCallback">
					保存
				</n-button>
			</template>
		</n-modal>
	</div>
</template>

<script lang="ts">
	import {defineComponent, ref, toRef, watch} from 'vue'
	import { FormInst } from 'naive-ui'
	export default defineComponent({
		props: {
			show: Boolean, config: Object, rules: Object, operState: Number,
		},
		setup(props, {emit}) {
			const formRef = ref<FormInst | null>()
			const formConfig: any = ref(props.config).value;
			const formData:any = ref([]);
			const formValue: any = ref({});
			let modalShow = ref(false);
			// 监听表单弹框显隐
			watch(() => props.show, () => { 
				modalShow.value = props.show
				// 新增模式清除记录
				if(!props.operState && modalShow.value){
					formData.value.map((item: any) => {
						formValue.value[item.prop] = null;
						item.value = null;
					});
				}
			}); 
			// 监听表单配置项
			watch(() => formConfig.options, () => {
				formData.value = [];
				formConfig.options.map( (item: any) => {
					if(item.formShow){
						formValue.value[item.key] = item.value || null;
						formData.value.push({
							label: item.title,
							prop: item.key,
							type: item.formType || 'text',
							// value: item.value || null,
							dic: item.dic || [],
							timeMode: item.timeMode || 'datetime',
							valueFormat: item.valueFormat || 'yyyy.MM.dd HH:mm:ss'
						}) ;
					}
				})
				console.log('数据监听成功formValue：', formValue);
			}, { deep: true });

			// 提交表单
			const submitCallback= ()=>{
				formRef.value?.validate((errors) => {
					if (!errors) {
						console.log('formValue:', formValue);
						emit('confirm', formValue);
						modalShow.value = false;
					} else {
						console.log('errors', errors)
					}
				})
			};

			// 取消编辑
			const cancelCallback= ()=>{
				console.log('cancel');
				modalShow.value = false;
			};

			// 弹框关闭回调， 同步父组件show数据
			const onAfterLeave= ()=>{
				console.log('关闭');
				emit('update:show', false);
			}

			return {
				modalShow,
				size: ref('medium'),
				formData,
				formValue,
				rules: props.rules,
				segmented: {
					content: 'soft',
					footer: 'soft'
				} as const,
				formRef,
				formConfig,
				onAfterLeave,
				submitCallback,
				cancelCallback,
			}
		}
	})
</script>

<style>
</style>
