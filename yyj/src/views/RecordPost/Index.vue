<template>
	<van-nav-bar
		title="添加宝宝记"
		left-text="返回"
		right-text="提交"
		left-arrow
		@click-left="onClickLeft"
		@click-right="saveRecord"
	/>
	<div class="record-box">
		<van-field
			v-model="form.content"
			rows="2"
			autosize
			label="宝宝记"
			type="textarea"
			maxlength="100"
			placeholder="请输入宝宝的伟大的小进步"
			show-word-limit
		/>
		<van-field name="uploader" label="文件上传">
			<template #input>
				<van-uploader v-model="showImgs" :after-read="afterRead" />
			</template>
		</van-field>
		<!-- <div style="margin: 26px;">
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
  </div> -->
	</div>
</template>
<script>
	import { reactive, toRefs, defineComponent } from 'vue'
	import { useRouter } from 'vue-router'
	import { Toast } from 'vant'
	import { growuprecordSave, imgUpload } from '@/api/common.api'
	import { getLocalStorage } from '@/tool/tool'
	export default defineComponent({
		setup() {
			let state = reactive({
				form: {
					content: '',
					imgs: '',
					role: getLocalStorage('role'),
					userId: getLocalStorage('userId'),
					nickName: getLocalStorage('nickName'),
				},
				imgs: [],
				showImgs: [],
			})

			let router = useRouter()
			const afterRead = file => {
				// 此时可以自行将文件上传至服务器
				console.log(file)
				let formData = new FormData()
				// formData.append('file', file)
				formData.append('file', file.file)

				imgUpload(formData).then(res => {
					if (res.code === 200) {
						state.imgs.push(res.data)
						Toast.success('图片上传成功')
					}
				})
			}
			const onClickLeft = () => {
				router.push('/home')
			}
			const saveRecord = () => {
				if (!state.form.content) {
					Toast.fail('宝宝记不能为空')
					return
				}
				let params = { ...state.form }
				params.imgs = JSON.stringify(state.imgs)
				growuprecordSave(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						Toast.success('添加成功')
					}
				})
				console.log('sss')
			}

			return {
				...toRefs(state),
				afterRead,
				onClickLeft,
				saveRecord,
			}
		},
	})
</script>
<style lang="scss" scoped>
	.record {
		&-box {
			margin-top: 40px;
		}
	}
</style>
