<template>
	<div style="padding: 10px;">
		<n-modal v-model:show="modalShow" :on-after-leave="onAfterLeave" title="编辑" :segmented="segmented" preset="dialog" :mask-closable='false'
			style="width: 60vw;top: -10vh;">
			<div style="background-color: white;width: 100%;border-radius: 15px;padding: 20px;">
				 <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :size="size" >
					<n-grid x-gap="12" :cols="2">
						<n-gi>
							<n-form-item :label="fItem.label" :path="fItem.prop" 
								v-for="fItem in formData" :key='fItem.prop'>
								<n-input v-model:value="fItem.prop" placeholder="Input" />
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
			show: Boolean, config: Object
		},
		setup(props, {emit}) {
			const formRef = ref<FormInst | null>()
			const formConfig: any = ref(props.config).value;
			console.log(formConfig);
			const formData:any = ref([]);
			let modalShow = ref(false);
			// 提交表单
			const submitCallback= ()=>{
				console.log('confirm');
				formRef.value?.validate((errors) => {
					if (!errors) {
						console.log('ok')
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

			// 监听表单弹框显隐
			watch(() => props.show, () => { 
				modalShow.value = props.show
			}); 

			// 监听表单配置项
			watch(() => formConfig, () => {

				console.log('数据监听成功', formConfig.options);
				formConfig.options.map( (item: any) => {
					if(item.formShow){
						formData.value.push({
							label: item.title,
							prop: item.key,
							type: item.formType || 'text',
						}) 
					}
					console.log(formData);
				})
			}, { immediate: true });

			// 弹框关闭回调， 同步父组件show数据
			const onAfterLeave= ()=>{
				console.log('关闭');
				emit('update:show', false);
			}

			return {
				modalShow,
				size: ref('medium'),
				formData,
				model: formData,
				rules: {
					inputValue: {
						required: true,
						trigger: ['blur', 'input'],
						message: '请输入 inputValue'
					},
					textareaValue: {
						required: true,
						trigger: ['blur', 'input'],
						message: '请输入 textareaValue'
					},
					selectValue: {
						required: true,
						trigger: ['blur', 'input'],
						message: '请选择 textareaValue'
					},
				},
				segmented: {
					content: 'soft',
					footer: 'soft'
				} as const,
				generalOptions: ['groode', 'veli good', 'emazing', 'lidiculous'].map((v) => ({
						label: v,
						value: v
					})
				),
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
