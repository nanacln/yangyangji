<template>
	<div class="qyt-box">
		<router-link to="/chatgroup" class="qyt-item">
			<van-badge :content="unreadObj.groups || ''">
				<img class="qyt-userImg" src="~@/assets/images/group.png" />
			</van-badge>
			<div class="qyt-name">
				广播室
			</div>
		</router-link>
		<div v-for="item in list" :key="item.userId">
			<router-link
				v-if="item.userId != userId"
				:to="
					`/chatsingle?toUserId=${item.userId}&name=${
						item.nickName
					}&avatar=${item.avatar || ''}`
				"
				class="qyt-item"
			>
				<van-badge :content="unreadObj[item.userId] || ''">
					<img class="qyt-userImg" v-if="item.avatar" :src="item.avatar" />
					<img class="qyt-userImg" v-else src="~@/assets/images/person.png" />
				</van-badge>
				<div class="qyt-name">
					{{ item.nickName }}
				</div>
			</router-link>
			<div
				v-if="item.userId == userId"
				:to="
					`/chatsingle?toUserId=${item.userId}&name=${
						item.nickName
					}&avatar=${item.avatar || ''}`
				"
				class="qyt-item isSelf"
			>
				<img class="qyt-userImg" v-if="item.avatar" :src="item.avatar" />
				<img class="qyt-userImg" v-else src="~@/assets/images/person.png" />
				<div class="qyt-name">{{ item.nickName }}</div>
			</div>
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
	import { defineComponent, reactive, ref, toRefs } from 'vue'
	import { relativerInfo } from '@/types/common'
	import { userList } from '@/api/common.api'
	import {
		getLocalStorage,
		setLocalStorage,
		saveUnreadChatData,
	} from '@/tool/tool'
	import getSocket from '@/tool/socket'
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	export default defineComponent({
		name: 'Home',
		setup() {
			type msgtype = {
				type: string
				content: any
				userId?: string
				toUserId?: string
			}
			type stateModel = {
				list: relativerInfo
				loading: boolean
				userId: string
				unreadObj: any
			}
			const state = reactive<stateModel>({
				list: [],
				loading: false,
				userId: getLocalStorage('userId'),
				unreadObj: {},
			})
			userList().then(res => {
				if (res.code === 200) {
					state.list = res.data
				}
			})
			const active = ref(1)
			// const soketObj = getSocket()
			// const websocket = soketObj()
			const websocket = getSocket()
			setTimeout(() => {
				var msg: msgtype = {
					type: '1',
					content: '上线啦',
					userId: getLocalStorage('userId'),
				}

				websocket.send(JSON.stringify(msg))
			}, 100)
			// websocket.addEventListener('open', () => {
			// 	console.log('建立连接')
			// 	// type  1上线  2私聊  3 群聊  0服务器存储消息失败 4刚进入私聊（去获取未在线时，别人发的消息）

			// 	var msg: msgtype = {
			// 		type: '1',
			// 		content: '上线啦',
			// 		userId: getLocalStorage('userId'),
			// 	}

			// 	websocket.send(JSON.stringify(msg))
			// })
			if (getLocalStorage('unreadObj')) {
				const obj = JSON.parse(getLocalStorage('unreadObj')) || {}
				state.unreadObj = obj
			}
			websocket.addEventListener('message', data => {
				const info = JSON.parse(data.data)
				if (info.type === '9') {
					if (getLocalStorage('unreadObj')) {
						const obj = JSON.parse(getLocalStorage('unreadObj'))
						state.unreadObj = Object.assign(obj, info.unreadMsg)
					} else {
						state.unreadObj = info.unreadMsg
					}
					setLocalStorage('unreadObj', JSON.stringify(state.unreadObj))
					return
				} else if (info.type === '2') {
					saveUnreadChatData(info.userId as string, info)
					state.unreadObj = JSON.parse(getLocalStorage('unreadObj'))
				} else if (info.type === '3') {
					saveUnreadChatData('groups', info)
					state.unreadObj = JSON.parse(getLocalStorage('unreadObj'))
				}
			})
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
			&.isSelf {
				position: relative;
				&:before {
					content: '本人';
					// background: #ff976a;
					border: 1px solid #ff976a;
					color: #ff976a;
					width: 60px;
					height: 30px;
					border-radius: 20px;
					display: inline-block;
					font-size: 22px;
					line-height: 32px;
					text-align: center;
					position: absolute;
					top: 10px;
					left: 80px;
				}
			}
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
