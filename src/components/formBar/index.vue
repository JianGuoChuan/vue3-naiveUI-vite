<template>
	<div style="padding: 10px;">
		<n-modal v-model:show="modalShow" :on-after-leave="onAfterLeave" title="编辑" :segmented="segmented" preset="dialog" :mask-closable='false'
			style="width: 70vw;top: -20vh;">
			<div style="background-color: white;width: 100%;border-radius: 15px;padding: 20px;">
				 <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :size="size" >
					<n-grid x-gap="12" :cols="2">
						<n-gi>
							<n-form-item :label="fItem.lebel" :path="model[fItem.prop]" v-for="fItem in config" :key='fItem.prop'>
								<n-input v-model:value="model[fItem.prop]" placeholder="Input" />
							</n-form-item>
					    </n-gi>
					</n-grid>
				   <!-- <n-form-item label="Input" path="inputValue">
						<n-input v-model:value="model.inputValue" placeholder="Input" />
				    </n-form-item>
				    <n-form-item label="Textarea" path="textareaValue">
						<n-input v-model:value="model.textareaValue" placeholder="Textarea" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
				    </n-form-item>
				    <n-form-item label="Select" path="selectValue">
						<n-select v-model:value="model.selectValue" placeholder="Select" :options="generalOptions" />
				    </n-form-item> -->
				</n-form>
			</div>
			<template #action>
				<n-button type="success" @click="cancelCallback">
					取消
				</n-button>
				<n-button type="info" @click="submitCallback">
					保存
				</n-button>
			</template>
		</n-modal>
	</div>
</template>

<script lang="ts">
	import {defineComponent, ref, watch} from 'vue'
	import { FormInst } from 'naive-ui'
	export default defineComponent({
		props: {
			show: Boolean, config: Object
		},
		setup(props, {emit}) {
			const formRef = ref<FormInst | null>()
			let modalShow = ref(false);
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
			const cancelCallback= ()=>{
				console.log('cancel');
				modalShow.value = false;
			};
			watch(() => props.show, () => { 
				console.log('监听成功');
				modalShow.value = props.show
			}); 
			watch(() => props.config, () => {
				console.log('数据监听成功', props.config);
			});
			const onAfterLeave= ()=>{
				console.log('关闭');
				emit('update:show', false);
			}
			return {
				modalShow,
				size: ref('medium'),
				model: ref({
					inputValue: null,
					textareaValue: null,
					selectValue: null,
				}),
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
				onAfterLeave,
				submitCallback,
				cancelCallback,
			}
		}
	})
</script>

<style>
</style>
