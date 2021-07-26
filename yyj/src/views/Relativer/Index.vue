<template>
	<div class="qyt-box">
		<router-link
			:to="
				`/chatsingle?toUserId=${item.userId}&name=${
					item.nickName
				}&avatar=${item.avatar || ''}`
			"
			class="qyt-item"
			v-for="item in list"
			:key="item.userId"
		>
			<img class="qyt-userImg" v-if="item.avatar" :src="item.avatar" />
			<img class="qyt-userImg" v-else src="~@/assets/images/person.png" />
			<div class="qyt-name">{{ item.nickName }}</div>
		</router-link>
	</div>
	<van-tabbar v-model="active" :route="true">
		<van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
		<!-- <van-tabbar-item icon="search">标签</van-tabbar-item> -->
		<van-tabbar-item to="/relativer" icon="friends-o">亲友团</van-tabbar-item>
		<van-tabbar-item to="/mine" icon="setting-o">我的</van-tabbar-item>
	</van-tabbar>
</template>
<script lang="ts">
	import { defineComponent, reactive, ref, toRefs } from 'vue'
	import { relativerInfo } from '@/types/common'
	import { userList } from '@/api/common.api'
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	export default defineComponent({
		name: 'Home',
		setup() {
			type stateModel = {
				list: relativerInfo
				loading: boolean
			}
			const state = reactive<stateModel>({
				list: [],
				loading: false,
			})
			userList().then(res => {
				if (res.code === 200) {
					state.list = res.data
				}
			})
			const active = ref(1)
			return {
				...toRefs(state),
				active,
			}
		},
	})
</script>
<style lang="scss" scoped>
	.qyt {
		&-userImg {
			width: 100px;
			height: 100px;
			border-radius: 8px;
			margin-right: 20px;
		}
		&-item {
			display: flex;
			margin-left: 30px;
			align-items: center;
			padding: 20px 0;
			color: #333;
		}
		&-name {
			flex: 1;
			height: 100px;
			line-height: 100px;
			border-bottom: 1px solid #eee;
			font-size: 30px;
		}
		&-box {
			margin-top: 30px;
		}
	}
</style>
