<template>
	<van-nav-bar
		title="注册"
		left-text="返回"
		left-arrow
		@click-left="onClickLeft"
	/>
	<van-form @submit="onSubmit">
		<van-cell-group inset>
			<van-field
				v-model="form.username"
				name="username"
				label="用户名"
				placeholder="用户名"
				:rules="[{ required: true, message: '请填写用户名' }]"
			/>
			<van-field
				v-model="form.password"
				type="password"
				name="password"
				label="密码"
				placeholder="密码"
				:rules="[{ required: true, message: '请填写密码' }]"
			/>
		</van-cell-group>
		<van-field
			v-model="form.role"
			readonly
			clickable
			name="role"
			label="选择器"
			placeholder="点击选择您的角色"
			@click="showPicker = true"
		/>
		<van-popup v-model:show="showPicker" position="bottom">
			<van-picker
				:columns="columns"
				@confirm="onConfirm"
				@cancel="showPicker = false"
			/>
		</van-popup>
		<van-field
			v-model="form.nickName"
			name="nickName"
			label="昵称"
			placeholder="昵称"
			:rules="[{ required: true, message: '请填写昵称' }]"
		/>
		<div style="margin: 36px 16px;">
			<van-button round block type="primary" native-type="submit">
				提交
			</van-button>
		</div>
	</van-form>
</template>
<script lang="ts">
	import { register } from '@/api/common.api'
	import { registerInfo } from '@/types/common'
	import { defineComponent, reactive, toRefs } from 'vue'
	import { useRouter } from 'vue-router'
	import { Toast } from 'vant'
	import md5 from 'md5'
	export default defineComponent({
		setup() {
			// type userInfo={
			//   username:string,
			//   password:string,
			//   role:string,
			//   nickName:string
			// }
			const router = useRouter()
			interface stateModel {
				showPicker: boolean
				form: registerInfo
			}
			const state = reactive<stateModel>({
				form: {
					username: '',
					password: '',
					role: '',
					nickName: '',
				},
				showPicker: false,
			})
			const onSubmit = (values: registerInfo) => {
				
				const params={...values}
				params.password=md5(params.password)
				console.log('submit', params)
				register(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						Toast.success('注册成功，请使用用户名密码登录')
						setTimeout(() => {
							router.push('/login')
						}, 2000)
					} else if (res.code === 201) {
						Toast.fail(res.msg as string)
					}
				})
			}

			const columns = [
				'妈妈',
				'爸爸',
				'姨妈',
				'舅舅',
				'姑姑',
				'爷爷',
				'奶奶',
				'外公',
				'外婆',
				'姐姐',
				'哥哥',
				'其他',
			]

			const onConfirm = (value: string) => {
				state.form.role = value
				state.showPicker = false
			}
			const onClickLeft = () => {
				router.push('/login')
			}
			return {
				...toRefs(state),
				onSubmit,
				columns,
				onConfirm,
				onClickLeft,
			}
		},
	})
</script>
