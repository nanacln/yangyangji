<template>
	<div class="chat-box">
		<van-nav-bar
			:title="name"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
		/>
		<ul class="chat-wrapper">
			<li
				class="chat-item"
				:class="{ mine: item.userId == userId }"
				v-for="(item, index) in chatArr"
				:key="index"
			>
				<img class="chat-img" src="~@/assets/images/person.png" />
				<div class="chat-content">{{ item.content }}</div>
			</li>
		</ul>
		<div class="chat-input">
			<van-field v-model="msg" center clearable placeholder="请输入">
				<template #button>
					<van-button size="small" @click="sendMsg" type="primary"
						>发送</van-button
					>
				</template>
			</van-field>
		</div>
	</div>
</template>
<script lang="ts">
	import { defineComponent, reactive, toRefs } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { msgtype } from '@/tool/type'
	import {
		getLocalStorage,
		setLocalStorage,
		deleteUnreadItem,
		saveUnreadChatData,
	} from '@/tool/tool'
	import getSocket from '@/tool/socket'
	export default defineComponent({
		setup() {
			const router = useRouter()
			const route = useRoute()
			console.log(route.query)
			type stateModel = {
				msg: string
				name: string
				userId: string
				chatArr: msgtype[]
				unreadObj: any
			}
			const state = reactive<stateModel>({
				msg: '',
				name: route.query.name as string,
				userId: getLocalStorage('userId') as string,
				chatArr: [],
				unreadObj: {},
			})
			if (getLocalStorage('chatgroups')) {
				state.chatArr = JSON.parse(getLocalStorage('chatgroups'))
			}
			const onClickLeft = () => {
				router.push('/relativer')
			}

			const soketObj = getSocket()
			const websocket = soketObj()
			websocket.addEventListener('open', () => {
				console.log('建立连接')
				// type  1上线  2私聊  3 群聊  0服务器存储消息失败 4刚进入私聊（去获取未在线时，别人发的消息）
				// 5 刚进入群聊（去获取未在线时，别人发的消息）
				var msg: msgtype = {
					type: '5',
					content: '群聊上线啦',
					userId: getLocalStorage('userId'),
				}

				websocket.send(JSON.stringify(msg))
			})
			websocket.addEventListener('message', data => {
				const info: msgtype = JSON.parse(data.data)
				if (info.type === '2') {
					saveUnreadChatData(info.userId as string, info)
					// if (getLocalStorage('unreadObj')) {
					// 	let obj = JSON.parse(getLocalStorage('unreadObj'))
					// 	if ((info.userId as string) in obj) {
					// 		obj[info.userId as string] += 1
					// 	} else {
					// 		obj[info.userId as string] = 1
					// 	}
					// 	setLocalStorage('unreadObj', JSON.stringify(obj))
					// }
					// if (getLocalStorage('chat' + info.userId)) {
					// 	const arr = JSON.parse(getLocalStorage('chat' + info.userId))
					// 	arr.push(info)
					// 	setLocalStorage('chat' + info.userId, JSON.stringify(arr))
					// } else {
					// 	setLocalStorage('chat' + info.userId, JSON.stringify([info]))
					// }
				} else if (info.type === '5') {
					if (info instanceof Array) {
						state.chatArr = state.chatArr.concat(info)
					} else {
						state.chatArr.push(info.content)
					}
					setLocalStorage('chatgroups', JSON.stringify(state.chatArr))
				}
			})
			deleteUnreadItem('groupsNum')
			const sendMsg = () => {
				let obj = {
					type: '3',
					content: state.msg,
					userId: getLocalStorage('userId') as string,
				}
				websocket.send(JSON.stringify(obj))
				state.msg = ''
				state.chatArr.push(obj)
				setLocalStorage('chatgroups', JSON.stringify(state.chatArr))
			}
			return {
				onClickLeft,
				...toRefs(state),
				sendMsg,
			}
		},
	})
</script>
<style lang="scss" scoped>
	.chat {
		&-box {
			display: flex;
			flex-direction: column;
			height: 100vh;
			overflow: hidden;
		}
		&-wrapper {
			flex: 1;
			overflow-y: auto;
			background-color: #f5f5f5;
		}
		&-input {
			width: 100%;
			height: 100px;
		}
		&-item {
			display: flex;
			margin: 20px 0;
			&.mine {
				flex-direction: row-reverse;
			}
		}
		&-img {
			width: 80px;
			height: 80px;
			border-radius: 10px;
			margin: 0 20px;
		}
		&-content {
			background: #b4f66e;
			color: #000;
			font-size: 28px;
			line-height: 42px;
			border-radius: 6px;
			padding: 20px;
			max-width: 500px;
		}
	}
</style>
