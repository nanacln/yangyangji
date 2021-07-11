<template>
  <div class="mine-box">
    <img src="~@/assets/images/person.png" alt="" class="mine-img">
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
<van-button style="margin-top:20px;" @click="update" type="primary" size="large">保存</van-button>
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
import {updateUser}from '@/api/common.api'
import { Toast } from 'vant'
import {updateUserInfo
} from '@/types/common'
export default defineComponent({
  setup() {
    interface stateModel {
				showPicker: boolean
				form: updateUserInfo
			}
			const state = reactive<stateModel>({
				form: {
					role: getLocalStorage('role'),
					nickName: getLocalStorage('nickName'),
					userId:getLocalStorage('userId')
				},
				showPicker: false,
			})
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
				updateUser(state.form)
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
				onConfirm,
				active,
				update
      }
  },
})
</script>
<style lang="scss" scoped>
.mine-img{
	width:160px;
	height: 160px;
	margin:160px auto 100px;
	display: block;
}
</style>
