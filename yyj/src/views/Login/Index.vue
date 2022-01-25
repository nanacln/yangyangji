<template>
	<van-nav-bar title="登录" />
	<van-form @submit="onSubmit" style="margin-top:30px;">
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

		<div style="margin: 16px;">
			<van-button round block type="primary" native-type="submit">
				提交
			</van-button>
		</div>
		<div class="form-other">
			<router-link class="goRegister" to="/register"
				>没有账号？立即注册</router-link
			>
		</div>
	</van-form>
</template>
<script lang="ts">
	import { login } from '@/api/common.api'
	import { registerInfo } from '@/types/common'
	import { defineComponent, reactive } from 'vue'
	import { setLocalStorage, getLocalStorage } from '@/tool/tool'
	import { useRouter } from 'vue-router'
	import { Toast } from 'vant'
	import md5 from 'md5'
	export default defineComponent({
		setup() {
			const form = reactive({
				username: '',
				password: '',
			})
			const router = useRouter()
			const onSubmit = (values: registerInfo) => {
				console.log('submit', values)
				const params={...values}
				params.password=md5(params.password)
				login(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						const { userId, nickName, role,avatar } = res.data
						setLocalStorage('userId', userId)
						setLocalStorage('nickName', nickName)
						setLocalStorage('role', role)
						if(avatar){
							setLocalStorage('avatar', avatar)
						}else if(getLocalStorage('avatar')){
							setLocalStorage('avatar', '')
						}
						
						const url = (getLocalStorage('ucm_curUrl') as string) || '/'
						router.push(url)
					} else {
						Toast.fail(res.msg as string)
					}
				})
			}
			return {
				form,
				onSubmit,
			}
		},
	})
</script>
<style lang="scss" scoped>
	.form-other {
		text-align: right;
	}
	.goRegister {
		color: #00a4ff;
		margin-right: 30px;
	}
</style>
