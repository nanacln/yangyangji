<template>
  <div class="mine-box">
		<div class="off-box">
			<van-icon class="off" @click="offClick" name="upgrade" />
		</div>
		
    <img v-if="avatar" :src="imagePrefix+avatar" alt="" class="mine-img">
    <img v-else src="~@/assets/images/person.png" alt="" class="mine-img">
		<van-uploader :after-read="afterRead" class="mine-upload" />
    <van-cell-group inset>
  <van-field
    v-model="form.nickName"
    label="昵称"
		right-icon="edit"
  />
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
  <!-- <van-field
    v-model="form.signature"
    label="个性签名"
    placeholder="请输入您的个性签名"
  /> -->
</van-cell-group>

<vue-mocropper 
  v-model="visible" 
  :src="imgSrc" 
  @crop-done="handleCropDone"
  :crop-width="200"
  :crop-height="200"
></vue-mocropper>

<div class="btn-box">
	<van-button class="save-btn" :round="true" @click="update" type="primary" size="large">保存</van-button>
</div>
  </div>
	<van-tabbar v-model="active" :route="true">
		<van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
		<!-- <van-tabbar-item icon="search">标签</van-tabbar-item> -->
		<van-tabbar-item to="/relativer" icon="friends-o">亲友团</van-tabbar-item>
		<van-tabbar-item to="/mine" icon="setting-o">我的</van-tabbar-item>
	</van-tabbar>
</template>
<script lang="ts">
import { defineComponent,reactive, toRefs,ref } from 'vue'
import {getLocalStorage,setLocalStorage} from '@/tool/tool'
import {updateUser,updateUserAvatar,userList}from '@/api/common.api'
import { Toast , Dialog} from 'vant'
import { useRouter } from 'vue-router'
import {updateUserInfo,ImageFile
} from '@/types/common'
export default defineComponent({
  setup() {
    interface stateModel {
				showPicker: boolean
				form: updateUserInfo,
				avatar:string
			}
			
			const state = reactive<stateModel>({
				form: {
					role: getLocalStorage('role'),
					nickName: getLocalStorage('nickName'),
					userId:getLocalStorage('userId'),
					
				},
				avatar:getLocalStorage('avatar')||'',
				showPicker: false,
			})
			let visible=ref(false)
			let imgSrc=ref('')
			const router = useRouter()
			const offClick=()=>{
				Dialog.confirm({
					title: '',
					message: '是否退出登录',
				})
					.then(() => {
						localStorage.removeItem("userId")
						router.push('/login')
						// on confirm
					})
			}
			userList(getLocalStorage('userId')).then(res=>{
				if(res.code===200){
					const {role,nickName,avatar}=res.data[0]
					state.form.role=role
					setLocalStorage('role',role)
					state.form.nickName=nickName
					setLocalStorage('nickName',nickName)
					if(avatar){
						state.avatar=avatar as string
						setLocalStorage('avatar',avatar as string)
					}
					
				}
				
			})
			const handleCropDone=(data:string)=>{
				updateUserAvatar({file:data,userId:getLocalStorage('userId')})
				.then(res=>{
					if(res.code===200){
						Toast.success('头像修改成功')
						visible.value=false
						state.avatar=res.data
						setLocalStorage('avatar',res.data)
					}
					
				})
				
			}
			const afterRead=(file:ImageFile)=>{
				visible.value=true
				
				imgSrc.value=file.content

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
			const active = ref(2)
			
			const update=()=>{
				const formParam:updateUserInfo={
				role:'',
				nickName:'',
				userId:getLocalStorage('userId')
			}
			if(state.form.role===getLocalStorage('role')&&state.form.nickName===getLocalStorage('nickName')){
				Toast('您没有修改用户信息')
				return
			}else{
				formParam.role=state.form.role===getLocalStorage('role')?'':state.form.role
				formParam.nickName=state.form.nickName===getLocalStorage('nickName')?'':state.form.nickName
			}
				updateUser(formParam)
				.then(res=>{
					if(res.code===200){
						setLocalStorage('role',state.form.role)
						setLocalStorage('nickName',state.form.nickName)
						Toast.success('更新成功')
					}
					
				})
			}
      return{
        ...toRefs(state),
        columns,
				offClick,
				onConfirm,
				active,
				update,
				handleCropDone,
				visible,
				afterRead,
				imgSrc
      }
  },
})
</script>
<style lang="scss" scoped>
.btn-box{
	margin:40px 60px 0;
}
.off{
	&-box{
		margin:40px 36px;
		display: flex;
		justify-content: flex-end;
	}
	transform: rotate(90deg);
	font-size: 60px;
	&:active{
		color:#00a4ff;
	}
}
.mine-img{
	width:160px;
	height: 160px;
	margin:160px auto 100px;
	display: block;
	border-radius: 100%;
}
.mine{
	&-upload{
		position: absolute;
		top:260px;
		width:160px;
		height: 160px;
		left:0;
		right: 0;
		margin:0 auto;
		opacity: 0;
	}
}
</style>
